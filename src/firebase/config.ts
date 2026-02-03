// src/firebase/config.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFunctions } from "firebase/functions";

// 1. Try to parse the automatic system config from App Hosting
const systemConfig = process.env.FIREBASE_WEBAPP_CONFIG 
  ? JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG) 
  : null;

export const firebaseConfig = {
  // 2. Use the system value if it exists, otherwise fall back to individual env variables
  apiKey: systemConfig?.apiKey || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: systemConfig?.authDomain || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: systemConfig?.projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: systemConfig?.storageBucket || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: systemConfig?.messagingSenderId || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: systemConfig?.appId || process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 3. Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * 4. Initialize Functions with the Mumbai Region
 * Adding "asia-south1" ensures the frontend calls your new Indian server
 * instead of defaulting to the US.
 */
export const functions = getFunctions(app, "asia-south1");