// src/firebase/config.ts

// 1. Try to parse the automatic system config from App Hosting
const systemConfig = process.env.FIREBASE_WEBAPP_CONFIG 
  ? JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG) 
  : null;

export const firebaseConfig = {
  // 2. Use the system value if it exists, otherwise fall back to individual env variables (for local dev)
  apiKey: systemConfig?.apiKey || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: systemConfig?.authDomain || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: systemConfig?.projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: systemConfig?.storageBucket || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: systemConfig?.messagingSenderId || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: systemConfig?.appId || process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};