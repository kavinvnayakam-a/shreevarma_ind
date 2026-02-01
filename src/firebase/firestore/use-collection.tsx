
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export type WithId<T> = T & { __docId: string };

export interface UseCollectionResult<T> {
  data: WithId<T>[] | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
}

export function useCollection<T = DocumentData>(
  queryOrRef: Query | CollectionReference | null | undefined
): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  // Memoize the query to prevent re-renders from creating new query objects.
  // This is a crucial performance optimization.
  const memoizedQuery = useMemo(() => queryOrRef, [queryOrRef]);

  useEffect(() => {
    // If the query isn't ready, don't do anything.
    // The loading state is already true by default.
    if (!memoizedQuery) {
      setIsLoading(true);
      return;
    }

    // Set loading to true whenever a new query is provided.
    setIsLoading(true);

    const unsubscribe = onSnapshot(
      memoizedQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        // Map the documents to include their ID and cast to the generic type.
        const results = snapshot.docs.map(
          (doc) => ({ __docId: doc.id, ...doc.data() } as WithId<T>)
        );
        setData(results);
        setError(null); // Clear any previous errors on success.
        setIsLoading(false); // Data has been fetched, stop loading.
      },
      (err: FirestoreError) => {
        // Handle any errors from the snapshot listener, including permissions.
        console.error("useCollection error:", err);
        const path = memoizedQuery.type === 'collection' 
            ? (memoizedQuery as CollectionReference).path 
            : 'complex query'; // Simplified for queries
            
        const contextualError = new FirestorePermissionError({
          operation: 'list',
          path: path,
        });

        setError(contextualError);
        setData(null); // Clear data on error.
        setIsLoading(false); // Stop loading on error.
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    // Return the cleanup function to unsubscribe from the listener on unmount.
    return () => unsubscribe();
  }, [memoizedQuery]); // The effect re-runs only when the memoized query changes.

  return { data, isLoading, error };
}

