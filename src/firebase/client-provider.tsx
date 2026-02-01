
'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

interface FirebaseServices {
    firebaseApp: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
    storage: FirebaseStorage;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [firebaseServices, setFirebaseServices] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    // This ensures Firebase is only initialized on the client side.
    const services = initializeFirebase();
    if(services.firebaseApp) {
        setFirebaseServices(services as FirebaseServices);
    }
  }, []); 

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices?.firebaseApp ?? null}
      auth={firebaseServices?.auth ?? null}
      firestore={firebaseServices?.firestore ?? null}
      storage={firebaseServices?.storage ?? null}
    >
      {children}
    </FirebaseProvider>
  );
}
