import assert from "node:assert/strict";
import {
  DeletionApiError,
  deletionRpc,
  isDeletionRequestId,
  normalizeFriendCode,
  normalizeVerificationCode,
  parseDeletionRequest,
} from "../public/assets/js/qwizzy-account-deletion-api.mjs";

assert.equal(normalizeFriendCode(" ab-12 cd!34 "), "AB12CD34");
assert.equal(normalizeFriendCode("123456789"), "12345678");
assert.equal(normalizeVerificationCode("12a 34-567"), "123456");
assert.equal(isDeletionRequestId("123e4567-e89b-12d3-a456-426614174000"), true);
assert.equal(isDeletionRequestId("------------------------------------"), false);

const expiresAt = new Date(Date.now() + 600_000).toISOString();
const request = parseDeletionRequest([{ request_id: "123e4567-e89b-12d3-a456-426614174000", expires_at: expiresAt }]);
assert.equal(request.id, "123e4567-e89b-12d3-a456-426614174000");
assert.ok(request.expiresAt > Date.now());
assert.throws(() => parseDeletionRequest({ request_id: "invalid", expires_at: expiresAt }), DeletionApiError);

let captured;
const success = await deletionRpc("test_rpc", { value: 1 }, {
  fetchImpl: async (url, options) => {
    captured = { url, options };
    return { ok: true, status: 200, json: async () => ({ success: true }) };
  },
});
assert.deepEqual(success, { success: true });
assert.match(captured.url, /\/rest\/v1\/rpc\/test_rpc$/);
assert.equal(captured.options.method, "POST");
assert.deepEqual(JSON.parse(captured.options.body), { value: 1 });
assert.ok(captured.options.headers.apikey);

await assert.rejects(
  deletionRpc("test_rpc", {}, {
    fetchImpl: async () => ({
      ok: false,
      status: 429,
      json: async () => ({ message: JSON.stringify({ code: "too_many_requests", message: "Wait" }) }),
    }),
  }),
  (error) => error instanceof DeletionApiError && error.status === 429 && error.code === "too_many_requests",
);

await assert.rejects(
  deletionRpc("test_rpc", {}, {
    timeoutMs: 5,
    fetchImpl: (_url, { signal }) => new Promise((_resolve, reject) => {
      signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
    }),
  }),
  (error) => error instanceof DeletionApiError && error.code === "timeout",
);

console.log("Account-deletion client verified: validation, API errors and timeout handling pass.");
