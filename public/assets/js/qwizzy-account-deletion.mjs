import {
  deletionRpc,
  isDeletionRequestId,
  normalizeFriendCode,
  normalizeVerificationCode,
  parseDeletionRequest,
} from "./qwizzy-account-deletion-api.mjs";

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
  try { sessionStorage.setItem("qwizzyDeletionRequest", JSON.stringify(request)); } catch (_) {}
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
  try { sessionStorage.removeItem("qwizzyDeletionRequest"); } catch (_) {}
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
  friendCodeInput.value = normalizeFriendCode(friendCodeInput.value);
});
verificationInput.addEventListener("input", () => {
  verificationInput.value = normalizeVerificationCode(verificationInput.value);
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
    const result = await deletionRpc("start_qwizzy_account_deletion", {
      submitted_friend_code: friendCode,
    });
    showVerification(parseDeletionRequest(result));
  } catch (error) {
    setStatus(
      error.code === "too_many_requests" || error.status === 429
        ? "Too many requests. Please wait before trying again."
        : error.code === "timeout"
          ? "The request timed out. Check your connection and try again."
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
    const deleted = await deletionRpc("confirm_qwizzy_account_deletion", {
      submitted_request_id: pendingRequest.id,
      submitted_verification_code: code,
    });
    if (deleted !== true) {
      setStatus("The code is incorrect, expired or has already been used.", "error");
      verificationInput.select();
      return;
    }
    clearInterval(timerId);
    try { sessionStorage.removeItem("qwizzyDeletionRequest"); } catch (_) {}
    verifyStep.hidden = true;
    successStep.hidden = false;
    successStep.classList.add("is-active");
    setStatus("");
    successStep.focus();
  } catch (error) {
    setStatus(error.code === "timeout"
      ? "The request timed out. Your account was not confirmed as deleted. Please check the app before trying again."
      : "The account could not be deleted. Please try again later.", "error");
  } finally {
    setBusy(verifyForm, false);
    if (pendingRequest?.expiresAt <= Date.now()) {
      verifyForm.querySelector('button[type="submit"]').disabled = true;
    }
  }
});

restartButton.addEventListener("click", resetRequest);

try {
  const restored = JSON.parse(sessionStorage.getItem("qwizzyDeletionRequest"));
  if (isDeletionRequestId(restored?.id) && Number.isFinite(restored?.expiresAt) && restored.expiresAt > Date.now()) showVerification(restored);
  else sessionStorage.removeItem("qwizzyDeletionRequest");
} catch (_) {
  try { sessionStorage.removeItem("qwizzyDeletionRequest"); } catch (_) {}
}

addEventListener("pagehide", () => clearInterval(timerId), { once: true });
