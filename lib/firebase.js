// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0NU9dUIijHMPzkhyr9Tw9RpDoPN8PlOE",
  authDomain: "technicle-ad223.firebaseapp.com",
  projectId: "technicle-ad223",
  storageBucket: "technicle-ad223.firebasestorage.app",
  messagingSenderId: "977050688200",
  appId: "1:977050688200:web:8376bbc9eb78db76bb63fd",
  measurementId: "G-ZX4ZRRQTV5"
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);


const db = getFirestore(app);

export { db, auth };