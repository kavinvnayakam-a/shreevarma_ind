'use server';

import { revalidatePath } from 'next/cache';
import * as admin from 'firebase-admin';

// Initialize Admin SDK safely
if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (error: any) {
    console.error('Firebase Admin initialization error:', error.message);
  }
}

// FIX: Use the modern .firebasestorage.app domain or an environment variable
const BUCKET_NAME = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "shreevarma-india-location.firebasestorage.app";

export async function updateSiteImage(formData: FormData) {
  const file = formData.get('file') as File;
  const storagePath = formData.get('storagePath') as string;

  if (!file || !storagePath) {
    return { success: false, error: 'Missing file or storage path.' };
  }

  try {
    const bucket = admin.storage().bucket(BUCKET_NAME);
    const blob = bucket.file(storagePath);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await blob.save(buffer, {
      metadata: {
        contentType: file.type,
        // Ensure the browser caches the new image correctly
        cacheControl: 'public, max-age=31536000',
      },
      resumable: false,
    });

    // Optional: If you want the image to be publicly accessible via storage.googleapis.com
    try {
        await blob.makePublic();
    } catch (e) {
        console.warn("Could not make blob public, check fine-grained access settings.");
    }

    revalidatePath('/', 'layout');

    return {
      success: true,
      message: 'Image updated successfully.',
      url: `https://storage.googleapis.com/${bucket.name}/${storagePath}`
    };

  } catch (error: any) {
    console.error('Detailed Storage Error:', error);
    
    let message = 'Server upload failed.';
    if (error.code === 404 || error.message.includes("does not exist")) {
      message = `Bucket '${BUCKET_NAME}' not found. Verify the bucket name in Firebase Console > Storage.`;
    } else if (error.code === 403) {
        message = 'Permission Denied. Ensure the App Hosting service account has "Storage Admin" role.';
    }
    
    return { success: false, error: `${message} (${error.message})` };
  }
}