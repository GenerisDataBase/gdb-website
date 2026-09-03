export const SUPABASE_URL = "https://hvufojydbbytyastykom.supabase.co";
export const SUPABASE_KEY = "sb_publishable_mTENufIAAy8dXqiUqpdLlA_MOOqGvrr";
export const REQUEST_TIMEOUT_MS = 15000;

export class DeletionApiError extends Error {
  constructor(message, { status = 0, code = "request_failed" } = {}) {
    super(message);
    this.name = "DeletionApiError";
    this.status = status;
    this.code = code;
  }
}

export function normalizeFriendCode(value) {
  return String(value || "").replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 8);
}

export function normalizeVerificationCode(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 6);
}

export function isDeletionRequestId(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value || "");
}

function parseError(body) {
  let details = body;
  if (typeof body?.message === "string") {
    try { details = JSON.parse(body.message); } catch { details = body; }
  }
  return {
    code: details?.code || body?.code || "request_failed",
    message: details?.message || body?.message || "Request failed",
  };
}

export async function deletionRpc(name, payload, {
  fetchImpl = fetch,
  timeoutMs = REQUEST_TIMEOUT_MS,
} = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      const error = parseError(body);
      throw new DeletionApiError(error.message, { status: response.status, code: error.code });
    }
    return body;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new DeletionApiError("Request timed out", { code: "timeout" });
    }
    if (error instanceof DeletionApiError) throw error;
    throw new DeletionApiError("Network request failed", { code: "network_error" });
  } finally {
    clearTimeout(timeout);
  }
}

export function parseDeletionRequest(result) {
  const row = Array.isArray(result) ? result[0] : result;
  const expiresAt = Date.parse(row?.expires_at || "");
  if (!isDeletionRequestId(row?.request_id) || !Number.isFinite(expiresAt)) {
    throw new DeletionApiError("Invalid response", { code: "invalid_response" });
  }
  return { id: row.request_id, expiresAt };
}
