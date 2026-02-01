
'use server';

import { revalidatePath } from 'next/cache';
import * as admin from 'firebase-admin';

// In App Hosting, the Admin SDK can often auto-initialize.
if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (error: any) {
    console.error('Firebase Admin initialization error:', error.message);
  }
}

// Explicitly define the correct bucket name for the Admin SDK.
const BUCKET_NAME = "shreevarma-india-location.appspot.com";

export async function updateSiteImage(formData: FormData) {
  const file = formData.get('file') as File;
  const storagePath = formData.get('storagePath') as string;

  if (!file || !storagePath) {
    return { success: false, error: 'Missing file or storage path.' };
  }

  try {
    // Explicitly get the bucket by name. This is the most reliable method.
    const bucket = admin.storage().bucket(BUCKET_NAME);
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

    await blob.makePublic();

    revalidatePath('/', 'layout');

    return {
      success: true,
      message: 'Image updated successfully.',
      // The public URL format
      url: `https://storage.googleapis.com/${bucket.name}/${storagePath}`
    };

  } catch (error: any) {
    console.error('Detailed Storage Error:', error);
    
    let message = 'Server upload failed.';
    // Check for specific error codes to provide better feedback.
    if (error.code === 404 || error.message.includes("does not exist")) {
      message = `Bucket '${BUCKET_NAME}' not found. Please ensure this is the correct bucket name in your server action.`;
    } else if (error.code === 403 || error.code === 'storage/unauthorized') {
        message = 'Server is not authorized to upload. Check IAM permissions for the App Hosting service account.'
    }
    
    return { success: false, error: `${message} (${error.message})` };
  }
}
