// src/firebase/config.ts

// 1. First, try to parse the automatic config from Firebase App Hosting
const firebaseWebAppConfig = process.env.FIREBASE_WEBAPP_CONFIG 
  ? JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG) 
  : {};

export const firebaseConfig = {
  // 2. Use the automatic config if available, otherwise fall back to individual env variables (for local dev)
  apiKey: firebaseWebAppConfig.apiKey || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: firebaseWebAppConfig.authDomain || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: firebaseWebAppConfig.projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: firebaseWebAppConfig.storageBucket || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: firebaseWebAppConfig.messagingSenderId || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: firebaseWebAppConfig.appId || process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};