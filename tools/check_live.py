#!/usr/bin/env python3
import json
import urllib.error
import urllib.request

BASE = "https://generisdatabase.com"
PAGES = ("/", "/products", "/qwizzy", "/qwizzy-badges", "/qwizzy-account-deletion", "/contact", "/imprint", "/privacy")

for path in PAGES:
    with urllib.request.urlopen(f"{BASE}{path}", timeout=20) as response:
        body = response.read()
        if response.status != 200 or len(body) < 500:
            raise SystemExit(f"Unhealthy page: {path} ({response.status}, {len(body)} bytes)")

request = urllib.request.Request(
    "https://hvufojydbbytyastykom.supabase.co/rest/v1/rpc/start_qwizzy_account_deletion",
    data=json.dumps({"submitted_friend_code": "!"}).encode(),
    method="POST",
    headers={
        "apikey": "sb_publishable_mTENufIAAy8dXqiUqpdLlA_MOOqGvrr",
        "Authorization": "Bearer sb_publishable_mTENufIAAy8dXqiUqpdLlA_MOOqGvrr",
        "Content-Type": "application/json",
    },
)
try:
    urllib.request.urlopen(request, timeout=20)
    raise SystemExit("Deletion endpoint unexpectedly accepted invalid input")
except urllib.error.HTTPError as error:
    response = json.loads(error.read())
    if error.code != 400 or not response.get("message"):
        raise SystemExit(f"Deletion endpoint returned an unexpected response: {error.code}")

print(f"Live health check passed: {len(PAGES)} pages and the safe deletion-endpoint probe respond correctly.")
