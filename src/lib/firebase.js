// firebase.js

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA0NU9dUIijHMPzkhyr9Tw9RpDoPN8PlOE",
  authDomain: "technicle-ad223.firebaseapp.com",
  projectId: "technicle-ad223",
  storageBucket: "technicle-ad223.appspot.com",
  messagingSenderId: "977050688200",
  appId: "1:977050688200:web:8376bbc9eb78db76bb63fd",
  measurementId: "G-ZX4ZRRQTV5"
};

// Ensure single app instance
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Optional: Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});