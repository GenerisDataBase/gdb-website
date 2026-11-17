#!/usr/bin/env python3
"""Email new Firestore contact messages without exposing credentials to the site."""

from __future__ import annotations

import json
import os
import smtplib
import sys
import time
from email.message import EmailMessage

from weekly_export import FIRESTORE, access_token, api, decode

COLLECTION = "messages"


def fetch_unnotified(token: str) -> list[dict]:
    messages = []
    cursor = None
    while len(messages) < 200:
        structured = {
            "from": [{"collectionId": COLLECTION}],
            "orderBy": [
                {"field": {"fieldPath": "createdAt"}, "direction": "ASCENDING"},
                {"field": {"fieldPath": "__name__"}, "direction": "ASCENDING"},
            ],
            "limit": 200,
        }
        if cursor is not None:
            structured["startAt"] = {"values": cursor, "before": False}
        rows = api(token, "POST", f"{FIRESTORE}:runQuery", {"structuredQuery": structured})
        documents = [row["document"] for row in rows if row.get("document")]
        for document in documents:
            item = {key: decode(value) for key, value in document.get("fields", {}).items()}
            if item.get("emailNotifiedAt"):
                continue
            item["_name"] = document["name"]
            messages.append(item)
            if len(messages) >= 200:
                break
        if len(documents) < 200:
            break
        last = documents[-1]
        cursor = [last["fields"]["createdAt"], {"referenceValue": last["name"]}]
    return messages


def notification(message: dict, sender: str, recipient: str) -> EmailMessage:
    name = str(message.get("name") or "Website visitor").strip()
    reply_to = str(message.get("email") or "").strip()
    subject = str(message.get("subject") or "General").strip()
    body = str(message.get("body") or "").strip()

    mail = EmailMessage()
    mail["Subject"] = f"Website contact · {subject} · {name}"
    mail["From"] = sender
    mail["To"] = recipient
    if reply_to:
        mail["Reply-To"] = reply_to
    mail.set_content(
        f"New message from the Generis Data Base website\n\n"
        f"Name: {name}\n"
        f"Email: {reply_to}\n"
        f"Subject: {subject}\n\n"
        f"Message:\n{body}\n\n"
        f"The message is also available in https://generisdatabase.com/admin"
    )
    return mail


def mark_notified(token: str, message: dict) -> None:
    stamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    url = f"https://firestore.googleapis.com/v1/{message['_name']}?updateMask.fieldPaths=emailNotifiedAt"
    api(token, "PATCH", url, {"fields": {"emailNotifiedAt": {"timestampValue": stamp}}})


def main() -> int:
    required = ["FIREBASE_SERVICE_ACCOUNT", "GMAIL_USER", "GMAIL_APP_PASSWORD"]
    missing = [name for name in required if not os.environ.get(name)]
    if missing:
        print(f"Missing required secret(s): {', '.join(missing)}", file=sys.stderr)
        return 1

    service_account = json.loads(os.environ["FIREBASE_SERVICE_ACCOUNT"])
    sender = os.environ["GMAIL_USER"]
    recipient = os.environ.get("MAIL_TO", sender)
    token = access_token(service_account)
    messages = fetch_unnotified(token)
    print(f"Found {len(messages)} contact notification(s) to send.")
    if not messages:
        return 0

    password = os.environ["GMAIL_APP_PASSWORD"]
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=60) as smtp:
        smtp.login(sender, password)
        for message in messages:
            smtp.send_message(notification(message, sender, recipient))
            mark_notified(token, message)
    print(f"Sent and marked {len(messages)} contact notification(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
