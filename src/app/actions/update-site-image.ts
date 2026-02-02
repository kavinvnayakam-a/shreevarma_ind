
'use server';

import { revalidatePath } from 'next/cache';
import * as admin from 'firebase-admin';

// 1. Correct bucket name for Admin SDK. It should be project-id.appspot.com
const BUCKET_NAME = "shreevarma-india-location.appspot.com";

// 2. Standard initialization for App Hosting environment
if (!admin.apps.length) {
  try {
    // This uses Application Default Credentials automatically
    admin.initializeApp();
  } catch (error: any) {
    console.error('Firebase Admin init error:', error.message);
  }
}

export async function updateSiteImage(formData: FormData) {
  const file = formData.get('file') as File;
  const storagePath = formData.get('storagePath') as string;

  if (!file || !storagePath) return { success: false, error: 'Missing data' };

  try {
    const bucket = admin.storage().bucket(BUCKET_NAME);
    const blob = bucket.file(storagePath);
    
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // CRITICAL FIX: resumable: false prevents the "Could not refresh access token" 500 error.
    // validation: false reduces the metadata overhead.
    await blob.save(buffer, {
      metadata: { 
        contentType: file.type,
        cacheControl: 'no-cache, no-store, must-revalidate'
      },
      resumable: false, 
      validation: false,
    });

    // Attempt to make public. If this fails, the upload is still successful.
    try {
        await blob.makePublic();
    } catch (e) {
        console.warn("Public access could not be set automatically.");
    }

    // Force revalidation of all pages to show the new image
    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error: any) {
    console.error('Upload fail:', error);
    return { 
      success: false, 
      error: error.message || 'Server Error' 
    };
  }
}
