'use server';

import { revalidatePath } from 'next/cache';
import * as admin from 'firebase-admin';

// Updated initialization for .firebasestorage.app buckets
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      // Use the exact name you verified
      storageBucket: 'shreevarma-india-location.firebasestorage.app',
      // Explicitly providing projectId here is safer for newer buckets
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  } catch (error: any) {
    console.error('Firebase Admin initialization error:', error.message);
  }
}

export async function updateSiteImage(formData: FormData) {
  const file = formData.get('file') as File;
  const storagePath = formData.get('storagePath') as string;

  if (!file || !storagePath) {
    return { success: false, error: 'Missing file or storage path.' };
  }

  try {
    // PASS THE BUCKET NAME DIRECTLY HERE - This is the most reliable fix for 404s
    const bucket = admin.storage().bucket('shreevarma-india-location.firebasestorage.app');
    const blob = bucket.file(storagePath);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await blob.save(buffer, {
      metadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000',
      },
      resumable: false, 
    });

    // Note: If this fails, your bucket might be in "Uniform" access mode.
    // You can skip this line if you use signed URLs or Firebase Storage Rules.
    await blob.makePublic();

    revalidatePath('/', 'layout');

    return { 
      success: true, 
      message: 'Image updated successfully.',
      // Updated URL format for newer buckets
      url: `https://storage.googleapis.com/shreevarma-india-location.firebasestorage.app/${storagePath}`
    };

  } catch (error: any) {
    console.error('Detailed Storage Error:', error);
    
    let message = 'Server upload failed.';
    if (error.code === 404) {
      message = 'Bucket not found. Ensure you are on the Blaze Plan and the bucket name is correct.';
    }
    
    return { success: false, error: `${message} (${error.message})` };
  }
}