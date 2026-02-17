"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyDen2HziMsyDeIRl-esNdGqOa-EknfhXJM",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "leadhandler-web.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "leadhandler-web",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "leadhandler-web.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "480886379534",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:480886379534:web:1a0dfb18cb3afa91abd85f",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-49HPYJ8BF3",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Optional analytics (client only); use isSupported() before getAnalytics
export const analytics: Analytics | null =
  typeof window !== "undefined" && (await isSupported()) ? getAnalytics(app) : null;
