/* ==========================================================================
   Generis Data Base — Firestore data layer
   Wraps every read/write the website performs, so the pages stay readable.
   ========================================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth, signInAnonymously, onAuthStateChanged,
  GoogleAuthProvider, signInWithPopup, signOut,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore, collection, doc, addDoc, getDoc, getDocs, getDocsFromServer, setDoc,
  updateDoc, deleteDoc, query, where, orderBy, limit as fbLimit,
  serverTimestamp, increment, writeBatch, Timestamp,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

import { firebaseConfig, ADMIN_EMAIL } from "./config.js";

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const QUESTIONS = "questions";
const VOTES = "votes";
const MESSAGES = "messages";

/* --------------------------------------------------------------------------
   Auth
   Visitors are signed in anonymously — that is what gives every browser a
   stable id, so "one vote per person" can be enforced by the security rules.
   -------------------------------------------------------------------------- */
let anonPromise = null;

export function ensureAnon() {
  if (anonPromise) return anonPromise;
  anonPromise = new Promise((resolve, reject) => {
    let triggered = false;
    const stop = onAuthStateChanged(auth, (user) => {
      // Any existing session counts — never sign the owner out of their Google
      // session just because they opened a public page.
      if (user) { stop(); resolve(user); return; }
      if (triggered) return;
      triggered = true;
      signInAnonymously(auth).catch((err) => {
        stop();
        anonPromise = null;
        reject(err);
      });
    });
  });
  return anonPromise;
}

export function currentUid() {
  return auth.currentUser ? auth.currentUser.uid : null;
}

export function onUser(cb) {
  return onAuthStateChanged(auth, cb);
}

export async function signInAdmin() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const { user } = await signInWithPopup(auth, provider);
  if (user.email !== ADMIN_EMAIL) {
    await signOut(auth);
    throw new Error("This Google account is not the site owner.");
  }
  return user;
}

export const signOutAdmin = () => signOut(auth);
export const isAdmin = (user) => !!user && user.email === ADMIN_EMAIL;

/* --------------------------------------------------------------------------
   Questions
   -------------------------------------------------------------------------- */

/** Shape a raw editor payload into the exact document the rules expect. */
export async function submitQuestion(input) {
  const user = await ensureAnon();
  const payload = {
    q: input.q.trim(),
    a: input.a.map((s) => s.trim()),
    c: Number(input.c),
    cat: input.cat,
    dif: Number(input.dif),
    author: (input.author || "").trim().slice(0, 40),
    uid: user.uid,
    up: 0,
    down: 0,
    score: 0,
    status: "pending",
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, QUESTIONS), payload);
  return ref.id;
}

/**
 * Only `status` and the sort order are pushed to Firestore — category and
 * difficulty are filtered in the browser. That keeps the required composite
 * indexes down to two and makes the filter bar feel instant.
 *
 * @param {object} opts
 * @param {"score"|"new"} [opts.sort]
 * @param {string} [opts.status]  "pending" | "approved" | "" (all)
 * @param {number} [opts.max]
 */
export async function listQuestions(opts = {}) {
  const { sort = "score", status = "", max = 300 } = opts;
  const clauses = [];
  if (status) clauses.push(where("status", "==", status));
  clauses.push(sort === "new" ? orderBy("createdAt", "desc") : orderBy("score", "desc"));
  clauses.push(fbLimit(max));

  const snap = await getDocs(query(collection(db, QUESTIONS), ...clauses));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Diagnostics only: force a read that must come from the server.
 * A plain getDocs() happily answers from the local cache, which makes a missing
 * or unreachable database look like an empty but healthy one.
 */
export async function pingFirestore() {
  const snap = await getDocsFromServer(query(collection(db, QUESTIONS), fbLimit(1)));
  return { fromCache: snap.metadata.fromCache, size: snap.size };
}

/** Which questions has this browser already voted on? */
export async function myVotes() {
  const user = await ensureAnon();
  const snap = await getDocs(query(collection(db, VOTES), where("uid", "==", user.uid), fbLimit(500)));
  const map = {};
  snap.docs.forEach((d) => { map[d.data().qid] = d.data().v; });
  return map;
}

/** One vote per browser, enforced by the rules through the vote document id. */
export async function castVote(qid, direction) {
  const user = await ensureAnon();
  const v = direction === "up" ? 1 : -1;
  const voteRef = doc(db, VOTES, `${qid}_${user.uid}`);

  const existing = await getDoc(voteRef);
  if (existing.exists()) {
    const err = new Error("already-voted");
    err.code = "gdb/already-voted";
    throw err;
  }

  const qRef = doc(db, QUESTIONS, qid);
  const batch = writeBatch(db);
  batch.set(voteRef, { qid, uid: user.uid, v, at: serverTimestamp() });
  batch.update(qRef, {
    up: increment(v === 1 ? 1 : 0),
    down: increment(v === -1 ? 1 : 0),
    score: increment(v),
  });
  await batch.commit();
  return v;
}

/* --------------------------------------------------------------------------
   Admin actions
   -------------------------------------------------------------------------- */
export const setStatus = (id, status) => updateDoc(doc(db, QUESTIONS, id), { status });
export const removeQuestion = (id) => deleteDoc(doc(db, QUESTIONS, id));

/* --------------------------------------------------------------------------
   Contact messages
   Anyone may create one, only the owner may read them.
   -------------------------------------------------------------------------- */
export async function sendMessage(input) {
  const payload = {
    name: input.name.trim().slice(0, 80),
    email: input.email.trim().slice(0, 120),
    subject: (input.subject || "General").slice(0, 60),
    body: input.body.trim().slice(0, 4000),
    createdAt: serverTimestamp(),
    handled: false,
  };
  await addDoc(collection(db, MESSAGES), payload);
}

export async function listMessages() {
  const snap = await getDocs(query(collection(db, MESSAGES), orderBy("createdAt", "desc"), fbLimit(200)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export const markHandled = (id, handled) => updateDoc(doc(db, MESSAGES, id), { handled });
export const removeMessage = (id) => deleteDoc(doc(db, MESSAGES, id));

/* --------------------------------------------------------------------------
   Helpers shared by several pages
   -------------------------------------------------------------------------- */
export function friendlyError(err) {
  const code = (err && (err.code || err.message)) || "";
  if (code.includes("permission-denied")) {
    return "Firestore refused the request. Check that the security rules are deployed (see /setup.html).";
  }
  if (
    code.includes("admin-restricted-operation") ||
    code.includes("operation-not-allowed") ||
    code.includes("configuration-not-found")
  ) {
    return "Anonymous sign-in is not switched on yet in Firebase Authentication — see /setup for the two clicks that fix it.";
  }
  if (code.includes("does not exist") || code.includes("NOT_FOUND") || code.includes("not-found")) {
    return "The Firestore database has not been created yet — do that once in the Firebase console (see /setup).";
  }
  if (code.includes("unavailable") || code.includes("network")) {
    return "No connection to Firestore. Please check your internet connection.";
  }
  if (code.includes("failed-precondition")) {
    return "Firestore needs a composite index for this filter combination — open the browser console and follow the link Firebase prints there.";
  }
  if (code.includes("popup-blocked")) return "Your browser blocked the sign-in popup.";
  if (code.includes("popup-closed-by-user")) return "Sign-in window was closed.";
  if (code.includes("unauthorized-domain")) {
    return "This domain is not in the Firebase list of authorised domains (see /setup.html).";
  }
  return (err && err.message) || "Something went wrong.";
}

export function whenText(ts) {
  if (!ts) return "just now";
  const d = ts instanceof Timestamp ? ts.toDate() : new Date(ts);
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days} d ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export { doc, getDoc, setDoc, collection, getDocs, query, where, orderBy, fbLimit, serverTimestamp };
