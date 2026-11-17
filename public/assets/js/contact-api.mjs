const endpoint = 'https://hvufojydbbytyastykom.supabase.co/functions/v1/send-website-contact';

// The server persists before attempting email, including its queued fallback.
// A direct Firestore write would bypass both the honeypot and server rate limit.
export async function sendContactMessage(input, {fetchImpl = fetch, timeoutMs = 20000} = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST', headers: {'Content-Type': 'application/json'}, signal: controller.signal,
      body: JSON.stringify({name: input.name.trim().slice(0,80),
        email: input.email.trim().slice(0,120), subject: (input.subject || 'General').slice(0,60),
        body: input.body.trim().slice(0,4000), website: input.website || ''}),
    });
    const result = await response.json().catch(() => null);
    // A silent honeypot rejection is also a final successful response.
    if (response.ok && result?.ok === true) return result;
    const limited = response.status === 429;
    const error = new Error(limited ? 'Too many messages. Please wait before trying again.'
      : 'The message service did not respond in time. Please check your connection and try again.');
    error.code = limited ? 'gdb/rate-limited' : 'gdb/request-timeout';
    throw error;
  } finally { clearTimeout(timer); }
}
