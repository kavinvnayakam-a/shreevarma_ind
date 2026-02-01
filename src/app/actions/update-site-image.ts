
'use server';

import { revalidatePath } from 'next/cache';
import * as admin from 'firebase-admin';

// Correct initialization for App Hosting environment
if (!admin.apps.length) {
  try {
    // The Admin SDK will automatically use Application Default Credentials
    // on App Hosting. We just need to tell it which bucket to use.
    admin.initializeApp({
      storageBucket: 'shreevarma-india-location.appspot.com',
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
    // Get the default bucket specified during initialization.
    const bucket = admin.storage().bucket();
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
    if (error.code === 404) {
      message = 'Bucket not found. Ensure bucket name is correct in the server action.';
    } else if (error.code === 'storage/unauthorized') {
        message = 'Server is not authorized to upload. Check IAM permissions for the App Hosting service account.'
    }
    
    return { success: false, error: `${message} (${error.message})` };
  }
}
