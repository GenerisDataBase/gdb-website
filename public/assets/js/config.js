/* ==========================================================================
   Generis Data Base — configuration
   This is the only file you normally need to touch.
   ========================================================================== */

/* Firebase web app config — created automatically for project qwizzy-c9538.
   (Safe to ship publicly: access is governed by firestore.rules, not by this key.) */
export const firebaseConfig = {
  apiKey: "AIzaSyBaRFa1vk8AjwC6FQjbLG_Upseo_CjdHJo",
  authDomain: "qwizzy-c9538.firebaseapp.com",
  projectId: "qwizzy-c9538",
  storageBucket: "qwizzy-c9538.firebasestorage.app",
  messagingSenderId: "1065147213243",
  appId: "1:1065147213243:web:eb54c940d74afaabedd09e",
};

/* The Google account that may open /admin.html.
   Must match the ADMIN_EMAIL inside firestore.rules. */
export const ADMIN_EMAIL = "generisdatabase@gmail.com";

/* Qwizzy categories — keys are identical to the ones used inside the app,
   so exported JSON files drop straight into Qwizzy. */
export const CATEGORIES = {
  general: "General knowledge",
  geography: "Geography",
  science: "Science",
  nature: "Nature",
  history: "History",
  politics: "Politics",
  economy: "Economy",
  religion: "Religion",
  sports: "Sports",
  technology: "Technology",
  internet: "Internet",
  socialmedia: "Social media",
  gaming: "Gaming",
  movies: "Movies",
  music: "Music",
  comics: "Comics",
  popculture: "Pop culture",
  food: "Food & drink",
  health: "Health",
  travel: "Travel",
  language: "Language",
  brands: "Brands",
  records: "Records",
  holidays: "Holidays",
  abbreviations: "Abbreviations",
};

export const DIFFICULTIES = {
  1: "Easy",
  2: "Fairly easy",
  3: "Medium",
  4: "Hard",
  5: "Very hard",
};
