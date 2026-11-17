"""Exercise the actual paginated reader without network or email delivery."""
import unittest
from unittest.mock import patch
import contact_notifications as worker

class ContactPaginationTest(unittest.TestCase):
    def test_notified_pages_cannot_hide_later_messages(self):
        docs = [{"name": f"projects/test/databases/(default)/documents/messages/{i:04}",
                 "fields": {"createdAt": {"timestampValue": f"2026-11-17T00:00:{i % 60:02}Z"},
                            **({"emailNotifiedAt": {"timestampValue": "2026-11-17T00:00:00Z"}} if i < 400 else {})}}
                for i in range(405)]
        calls = []
        def api(_token, _method, _url, body):
            q = body["structuredQuery"]
            calls.append(q)
            start = int(q["startAt"]["values"][1]["referenceValue"].split("/")[-1])+1 if "startAt" in q else 0
            return [{"document": d} for d in docs[start:start+q["limit"]]]
        with patch.object(worker, "api", api):
            result = worker.fetch_unnotified("local-only")
        self.assertEqual(len(result), 5)
        self.assertEqual(len(calls), 3)
        self.assertFalse(calls[1]["startAt"]["before"])
        self.assertTrue(result[0]["_name"].endswith("/0400"))

    def test_one_run_retains_bounded_delivery_batch(self):
        docs = [{"document": {"name": str(i), "fields": {"createdAt": {"timestampValue": "2026-11-17T00:00:00Z"}}}} for i in range(200)]
        with patch.object(worker, "api", return_value=docs):
            self.assertEqual(len(worker.fetch_unnotified("local-only")), 200)

if __name__ == "__main__":
    unittest.main()
