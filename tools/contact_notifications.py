#!/usr/bin/env python3
"""Email new Firestore contact messages without exposing credentials to the site."""

from __future__ import annotations

import json
import os
import smtplib
import sys
import time
import urllib.error
from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode
from email.message import EmailMessage

from weekly_export import FIRESTORE, access_token, api, decode

COLLECTION = "messages"


def fetch_unnotified(token: str) -> list[dict]:
    messages = []
    cursor = None
    settle_before = datetime.now(timezone.utc) - timedelta(minutes=10)
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
            delivery = item.get("emailDeliveryState")
            if delivery is None:
                # Legacy Edge versions had no state. Allow the normal direct
                # attempt time to pass before considering older queued mail.
                created = item.get("createdAt")
                if not created or datetime.fromisoformat(created.replace("Z", "+00:00")) > settle_before:
                    continue
            elif delivery != "smtp_ready":
                continue
            item["_name"] = document["name"]
            item["_update_time"] = document.get("updateTime")
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


def change_delivery_state(token: str, message: dict, state: str, *, claim=False) -> bool:
    fields = {"emailDeliveryState": {"stringValue": state}}
    if state == "sent":
        stamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        fields["emailNotifiedAt"] = {"timestampValue": stamp}
    params = [("updateMask.fieldPaths", field) for field in fields]
    if claim:
        if not message.get("_update_time"):
            return False
        params.append(("currentDocument.updateTime", message["_update_time"]))
    else:
        params.append(("currentDocument.exists", "true"))
    url = f"https://firestore.googleapis.com/v1/{message['_name']}?{urlencode(params)}"
    try:
        api(token, "PATCH", url, {"fields": fields})
    except SystemExit as error:
        cause = error.__cause__
        if claim and isinstance(cause, urllib.error.HTTPError) and cause.code in {400, 404, 409, 412}:
            # The message vanished or changed after the query. Another worker
            # or admin owns its new revision.
            return False
        raise SystemExit("Contact email state could not be saved") from None
    return True


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
        sent = 0
        for message in messages:
            if not change_delivery_state(token, message, "smtp_inflight", claim=True):
                continue
            try:
                smtp.send_message(notification(message, sender, recipient))
            except (OSError, smtplib.SMTPException):
                # Do not re-send an ambiguous SMTP attempt. The message and
                # its in-progress status are visible in the admin inbox.
                raise SystemExit("Contact email outcome needs review") from None
            change_delivery_state(token, message, "sent")
            sent += 1
    print(f"Sent and marked {sent} contact notification(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
