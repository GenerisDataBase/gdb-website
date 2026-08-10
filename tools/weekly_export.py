#!/usr/bin/env python3
"""
Weekly Qwizzy community export
==============================

Collects every community question that has reached the upvote threshold and is
completely and correctly filled in, packs them into a Qwizzy-format .json file
and mails it as an attachment. Exported questions are then marked as approved so
they never appear in a later mail.

Runs on GitHub Actions every Saturday — see .github/workflows/weekly-export.yml.
Can also be run by hand:

    python3 tools/weekly_export.py --dry-run     # show what would be sent
    python3 tools/weekly_export.py               # really send and mark

Only the Python standard library plus the `openssl` command line tool are used,
so there is nothing to install.

Environment variables
---------------------
    FIREBASE_SERVICE_ACCOUNT   contents of the service account .json
    GMAIL_USER                 the Gmail address that sends the mail
    GMAIL_APP_PASSWORD         16-character app password from that Google account
    MAIL_TO                    where the export should arrive
    MIN_UPVOTES                optional, default 25
    MIN_SCORE                  optional, default 0  (upvotes minus downvotes)
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import smtplib
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from email.message import EmailMessage

PROJECT_ID = "qwizzy-c9538"
COLLECTION = "questions"
SCOPE = "https://www.googleapis.com/auth/datastore"

MIN_UPVOTES = int(os.environ.get("MIN_UPVOTES", "25"))
MIN_SCORE = int(os.environ.get("MIN_SCORE", "0"))

# Must stay identical to CATEGORIES in public/assets/js/config.js — a question
# with an unknown category would break the import inside the app.
CATEGORIES = {
    "general", "geography", "science", "nature", "history", "politics", "economy",
    "religion", "sports", "technology", "internet", "socialmedia", "gaming",
    "movies", "music", "comics", "popculture", "food", "health", "travel",
    "language", "brands", "records", "holidays", "abbreviations",
}

FIRESTORE = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents"


# ---------------------------------------------------------------- auth --------
def _b64(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).decode().rstrip("=")


def _sign_rs256(message: bytes, private_key_pem: str) -> bytes:
    with tempfile.NamedTemporaryFile("w", suffix=".pem", delete=False) as handle:
        handle.write(private_key_pem)
        key_path = handle.name
    try:
        done = subprocess.run(
            ["openssl", "dgst", "-sha256", "-sign", key_path],
            input=message, capture_output=True, check=True,
        )
        return done.stdout
    finally:
        os.unlink(key_path)


def access_token(service_account: dict) -> str:
    """Exchange the service account key for a short-lived OAuth token."""
    now = int(time.time())
    header = {"alg": "RS256", "typ": "JWT", "kid": service_account["private_key_id"]}
    claims = {
        "iss": service_account["client_email"],
        "scope": SCOPE,
        "aud": service_account["token_uri"],
        "iat": now,
        "exp": now + 3600,
    }
    signing_input = f"{_b64(json.dumps(header).encode())}.{_b64(json.dumps(claims).encode())}".encode()
    assertion = signing_input.decode() + "." + _b64(_sign_rs256(signing_input, service_account["private_key"]))

    body = urllib.parse.urlencode({
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion": assertion,
    }).encode()
    request = urllib.request.Request(
        service_account["token_uri"], data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)["access_token"]


def api(token: str, method: str, url: str, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    request = urllib.request.Request(url, data=data, method=method, headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    })
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            return json.load(response)
    except urllib.error.HTTPError as error:
        detail = error.read().decode()[:800]
        raise SystemExit(f"Firestore said {error.code}: {detail}") from error


# ------------------------------------------------------------ firestore -------
def decode(value: dict):
    """Turn one Firestore REST value into a plain Python value."""
    if "stringValue" in value:
        return value["stringValue"]
    if "integerValue" in value:
        return int(value["integerValue"])
    if "doubleValue" in value:
        return float(value["doubleValue"])
    if "booleanValue" in value:
        return value["booleanValue"]
    if "timestampValue" in value:
        return value["timestampValue"]
    if "arrayValue" in value:
        return [decode(item) for item in value["arrayValue"].get("values", [])]
    if "mapValue" in value:
        return {k: decode(v) for k, v in value["mapValue"].get("fields", {}).items()}
    return None


def fetch_pending(token: str) -> list[dict]:
    """
    Every question still waiting to be shipped.

    Only an equality filter is used, so Firestore's automatic single-field index
    is enough — no composite index has to be deployed for this job.
    """
    query = {
        "structuredQuery": {
            "from": [{"collectionId": COLLECTION}],
            "where": {
                "fieldFilter": {
                    "field": {"fieldPath": "status"},
                    "op": "EQUAL",
                    "value": {"stringValue": "pending"},
                }
            },
            "limit": 2000,
        }
    }
    rows = api(token, "POST", f"{FIRESTORE}:runQuery", query)
    questions = []
    for row in rows:
        document = row.get("document")
        if not document:
            continue
        item = {key: decode(value) for key, value in document.get("fields", {}).items()}
        item["_name"] = document["name"]
        item["_id"] = document["name"].rsplit("/", 1)[-1]
        questions.append(item)
    return questions


def mark_approved(token: str, question: dict, when: str) -> None:
    url = (
        f"https://firestore.googleapis.com/v1/{question['_name']}"
        "?updateMask.fieldPaths=status&updateMask.fieldPaths=exportedAt"
    )
    api(token, "PATCH", url, {
        "fields": {
            "status": {"stringValue": "approved"},
            "exportedAt": {"stringValue": when},
        }
    })


# ------------------------------------------------------------ validation ------
def problems(item: dict) -> list[str]:
    """Everything that would make this question unusable inside Qwizzy."""
    issues = []

    question = item.get("q")
    if not isinstance(question, str) or not 8 <= len(question.strip()) <= 300:
        issues.append("question text missing or wrong length")

    answers = item.get("a")
    if not isinstance(answers, list) or len(answers) != 4:
        issues.append("does not have exactly four answers")
    else:
        cleaned = [a.strip() if isinstance(a, str) else None for a in answers]
        if any(not a for a in cleaned):
            issues.append("an answer is empty")
        elif len({a.lower() for a in cleaned}) != 4:
            issues.append("two answers are identical")
        elif any(len(a) > 160 for a in cleaned):
            issues.append("an answer is too long")

    correct = item.get("c")
    if not isinstance(correct, int) or isinstance(correct, bool) or not 0 <= correct <= 3:
        issues.append("no valid correct answer marked")

    if item.get("cat") not in CATEGORIES:
        issues.append(f"unknown category {item.get('cat')!r}")

    difficulty = item.get("dif")
    if not isinstance(difficulty, int) or isinstance(difficulty, bool) or not 1 <= difficulty <= 5:
        issues.append("difficulty is not 1–5")

    return issues


def qualifies(item: dict) -> tuple[bool, str]:
    upvotes = item.get("up") or 0
    downvotes = item.get("down") or 0
    if upvotes < MIN_UPVOTES:
        return False, f"only {upvotes} upvotes"
    if upvotes - downvotes < MIN_SCORE:
        return False, f"score {upvotes - downvotes} below {MIN_SCORE}"
    issues = problems(item)
    if issues:
        return False, "; ".join(issues)
    return True, "ok"


def to_qwizzy(item: dict) -> dict:
    """Exactly the shape the Qwizzy question editor and the app expect."""
    return {
        "id": f"web-{item['_id']}",
        "cat": item["cat"],
        "dif": int(item["dif"]),
        "q": item["q"].strip(),
        "a": [a.strip() for a in item["a"]],
        "c": int(item["c"]),
    }


# ----------------------------------------------------------------- mail -------
def build_mail(payload: bytes, filename: str, questions: list[dict],
               skipped: list[tuple[dict, str]], sender: str, recipient: str) -> EmailMessage:
    count = len(questions)
    lines = [
        f"{count} community question{'' if count == 1 else 's'} reached {MIN_UPVOTES}+ upvotes this week.",
        "",
        "They are attached as a Qwizzy .json file and have been marked as approved,",
        "so they will not turn up in next week's mail again.",
        "",
        "Included:",
    ]
    for item in questions:
        upvotes = item.get("up") or 0
        downvotes = item.get("down") or 0
        lines.append(f"  · [{upvotes}↑ {downvotes}↓] {item['q'].strip()[:90]}")

    if skipped:
        lines += ["", f"Reached {MIN_UPVOTES}+ upvotes but was NOT included:"]
        for item, reason in skipped:
            lines.append(f"  · {item.get('q', '(no text)')[:70]} — {reason}")

    message = EmailMessage()
    message["Subject"] = f"Qwizzy — {count} community question{'' if count == 1 else 's'} ({filename[-15:-5]})"
    message["From"] = sender
    message["To"] = recipient
    message.set_content("\n".join(lines))
    message.add_attachment(payload, maintype="application", subtype="json", filename=filename)
    return message


def send_mail(payload: bytes, filename: str, questions: list[dict], skipped: list[tuple[dict, str]]) -> None:
    user = os.environ["GMAIL_USER"]
    password = os.environ["GMAIL_APP_PASSWORD"]
    recipient = os.environ.get("MAIL_TO", user)

    message = build_mail(payload, filename, questions, skipped, user, recipient)
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=60) as smtp:
        smtp.login(user, password)
        smtp.send_message(message)


# ----------------------------------------------------------------- main -------
def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true",
                        help="only report what would happen; send no mail, change nothing")
    args = parser.parse_args()

    raw = os.environ.get("FIREBASE_SERVICE_ACCOUNT")
    if not raw:
        print("FIREBASE_SERVICE_ACCOUNT is not set.", file=sys.stderr)
        return 1
    service_account = json.loads(raw)

    token = access_token(service_account)
    pending = fetch_pending(token)
    print(f"{len(pending)} question(s) waiting on the board")

    ready, skipped = [], []
    for item in pending:
        ok, reason = qualifies(item)
        if ok:
            ready.append(item)
        elif (item.get("up") or 0) >= MIN_UPVOTES:
            # Popular enough, but something is wrong with it — worth reporting.
            skipped.append((item, reason))

    ready.sort(key=lambda x: (x.get("up") or 0) - (x.get("down") or 0), reverse=True)

    for item, reason in skipped:
        print(f"  skipped: {str(item.get('q'))[:60]!r} — {reason}")

    if not ready:
        print(f"Nothing reached {MIN_UPVOTES} upvotes and passed validation — no mail sent.")
        return 0

    stamp = time.strftime("%Y-%m-%d")
    filename = f"qwizzy-community-{stamp}.json"
    payload = json.dumps([to_qwizzy(item) for item in ready], ensure_ascii=False, indent=2).encode("utf-8")

    print(f"{len(ready)} question(s) qualify:")
    for item in ready:
        print(f"  · [{item.get('up') or 0}↑] {item['q'].strip()[:80]}")

    if args.dry_run:
        print(f"\n--dry-run: would send {filename} ({len(payload)} bytes) and mark {len(ready)} as approved.")
        return 0

    send_mail(payload, filename, ready, skipped)
    print(f"Mail sent with {filename}")

    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    for item in ready:
        mark_approved(token, item, now)
    print(f"{len(ready)} question(s) marked as approved")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
