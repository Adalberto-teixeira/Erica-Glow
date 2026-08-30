import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const app = getApps().length ? getApp() : initializeApp({
  apiKey: "AIzaSyAVFiSCqnQpqmpJXpBY2RCT6ZN0OJCTz-I",
  authDomain: "erica-glow-2026-af.firebaseapp.com",
  projectId: "erica-glow-2026-af",
  storageBucket: "erica-glow-2026-af.firebasestorage.app",
  messagingSenderId: "492657971751",
  appId: "1:492657971751:web:7492b84391b2e678fcb402",
});

export const db = getFirestore(app);
export const auth = getAuth(app);
