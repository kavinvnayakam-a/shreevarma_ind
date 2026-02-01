'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from '@/firebase/config';

export function initializeFirebase() {
  let firebaseApp: FirebaseApp;

  // 1. Debugging: This will show up in your Live URL Browser Console
  if (typeof window !== 'undefined') {
    console.log("Firebase Initialization Check:", {
      hasApiKey: !!firebaseConfig.apiKey,
      projectId: firebaseConfig.projectId,
      env: process.env.NODE_ENV
    });
  }

  // 2. Check if the critical API Key exists
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "__FIREBASE_API_KEY__") {
    try {
      if (getApps().length === 0) {
        firebaseApp = initializeApp(firebaseConfig);
        console.log("Firebase initialized successfully.");
      } else {
        firebaseApp = getApp();
      }
      return getSdks(firebaseApp);
    } catch (error) {
      console.error("Firebase initialization failed during startup:", error);
    }
  }

  // 3. Fallback: If we reach here, the config is definitely missing or invalid
  if (typeof window !== 'undefined') {
    console.error(
      "Firebase config is missing or contains placeholders. " +
      "Check your apphosting.yaml and Secret Manager bindings."
    );
  }

  return { 
    firebaseApp: null, 
    auth: null, 
    firestore: null, 
    storage: null 
  };
}

export function getSdks(firebaseApp: FirebaseApp) {
  // We initialize the services using the app instance
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  return {
    firebaseApp,
    auth,
    firestore,
    storage,
  };
}

// Exporting types and other utilities
export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './auth/use-user';
export * from './errors';
export * from './error-emitter';