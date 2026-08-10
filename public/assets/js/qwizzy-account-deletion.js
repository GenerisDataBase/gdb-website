const SUPABASE_URL = "https://hvufojydbbytyastykom.supabase.co";
const SUPABASE_KEY = "sb_publishable_mTENufIAAy8dXqiUqpdLlA_MOOqGvrr";

const requestForm = document.querySelector("#request-form");
const verifyForm = document.querySelector("#verify-form");
const requestStep = document.querySelector("#request-step");
const verifyStep = document.querySelector("#verify-step");
const successStep = document.querySelector("#success-step");
const friendCodeInput = document.querySelector("#friend-code");
const verificationInput = document.querySelector("#verification-code");
const permanentConfirm = document.querySelector("#permanent-confirm");
const restartButton = document.querySelector("#restart-request");
const status = document.querySelector("#deletion-status");
const timer = document.querySelector("#deletion-timer");

let pendingRequest = null;
let timerId = null;

async function rpc(name, payload) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(body?.message || "Request failed");
    error.status = response.status;
    throw error;
  }
  return body;
}

function setBusy(form, busy) {
  for (const control of form.elements) control.disabled = busy;
  form.setAttribute("aria-busy", String(busy));
}

function setStatus(message, kind = "") {
  status.textContent = message;
  status.dataset.kind = kind;
}

function formatRemaining(expiresAt) {
  const seconds = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function startTimer() {
  clearInterval(timerId);
  const update = () => {
    if (!pendingRequest) return;
    const remaining = pendingRequest.expiresAt - Date.now();
    timer.textContent = remaining > 0
      ? `Code expires in ${formatRemaining(pendingRequest.expiresAt)}`
      : "This code has expired. Start a new request.";
    if (remaining <= 0) {
      clearInterval(timerId);
      verifyForm.querySelector('button[type="submit"]').disabled = true;
    }
  };
  update();
  timerId = setInterval(update, 1000);
}

function showVerification(request) {
  pendingRequest = request;
  sessionStorage.setItem("qwizzyDeletionRequest", JSON.stringify(request));
  requestStep.hidden = true;
  verifyStep.hidden = false;
  verifyStep.classList.add("is-active");
  setStatus("The request was sent. Open Qwizzy to view your verification code.", "success");
  startTimer();
  verificationInput.focus();
}

function resetRequest() {
  clearInterval(timerId);
  pendingRequest = null;
  sessionStorage.removeItem("qwizzyDeletionRequest");
  verifyStep.hidden = true;
  requestStep.hidden = false;
  requestStep.classList.add("is-active");
  verificationInput.value = "";
  permanentConfirm.checked = false;
  verifyForm.querySelector('button[type="submit"]').disabled = false;
  setStatus("");
  friendCodeInput.focus();
}

friendCodeInput.addEventListener("input", () => {
  friendCodeInput.value = friendCodeInput.value.replace(/[^a-z0-9]/gi, "").toUpperCase();
});
verificationInput.addEventListener("input", () => {
  verificationInput.value = verificationInput.value.replace(/\D/g, "").slice(0, 6);
});

requestForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const friendCode = friendCodeInput.value.trim().toUpperCase();
  if (!/^[A-Z0-9]{8}$/.test(friendCode)) {
    setStatus("Enter the complete eight-character friend code.", "error");
    friendCodeInput.focus();
    return;
  }
  setBusy(requestForm, true);
  setStatus("Creating a secure request…");
  try {
    const result = await rpc("start_qwizzy_account_deletion", {
      submitted_friend_code: friendCode,
    });
    const row = Array.isArray(result) ? result[0] : result;
    if (!row?.request_id || !row?.expires_at) throw new Error("Invalid response");
    showVerification({
      id: row.request_id,
      expiresAt: new Date(row.expires_at).getTime(),
    });
  } catch (error) {
    setStatus(
      error.message.includes("too_many_requests")
        ? "Too many requests. Please wait before trying again."
        : "The request could not be created. Please try again later.",
      "error",
    );
  } finally {
    setBusy(requestForm, false);
  }
});

verifyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const code = verificationInput.value.trim();
  if (!pendingRequest || pendingRequest.expiresAt <= Date.now()) {
    setStatus("This request has expired. Start a new request.", "error");
    return;
  }
  if (!/^\d{6}$/.test(code)) {
    setStatus("Enter the complete six-digit code from Qwizzy.", "error");
    verificationInput.focus();
    return;
  }
  if (!permanentConfirm.checked) {
    setStatus("Confirm that you understand the deletion is permanent.", "error");
    permanentConfirm.focus();
    return;
  }
  setBusy(verifyForm, true);
  setStatus("Verifying and deleting the account…");
  try {
    const deleted = await rpc("confirm_qwizzy_account_deletion", {
      submitted_request_id: pendingRequest.id,
      submitted_verification_code: code,
    });
    if (deleted !== true) {
      setStatus("The code is incorrect, expired or has already been used.", "error");
      verificationInput.select();
      return;
    }
    clearInterval(timerId);
    sessionStorage.removeItem("qwizzyDeletionRequest");
    verifyStep.hidden = true;
    successStep.hidden = false;
    successStep.classList.add("is-active");
    setStatus("");
  } catch (_) {
    setStatus("The account could not be deleted. Please try again later.", "error");
  } finally {
    setBusy(verifyForm, false);
  }
});

restartButton.addEventListener("click", resetRequest);

try {
  const restored = JSON.parse(sessionStorage.getItem("qwizzyDeletionRequest"));
  if (restored?.id && restored?.expiresAt > Date.now()) showVerification(restored);
  else sessionStorage.removeItem("qwizzyDeletionRequest");
} catch (_) {
  sessionStorage.removeItem("qwizzyDeletionRequest");
}
