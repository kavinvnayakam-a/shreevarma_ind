
'use server';

import { revalidatePath } from 'next/cache';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  try {
    // Explicitly provide the storage bucket for the Admin SDK.
    // This helps both local development and deployed environments find the bucket.
    admin.initializeApp({
        storageBucket: 'shreevarma-india-location.appspot.com'
    });
  } catch (error: any) {
    console.error("Firebase Admin initialization error:", error.message);
  }
}

export async function updateSiteImage(formData: FormData) {
  const file = formData.get('file') as File;
  const storagePath = formData.get('storagePath') as string;

  if (!file || !storagePath) {
    return { success: false, error: 'Missing file or storage path.' };
  }

  try {
    // Now that the app is initialized with a default bucket, 
    // we can get the default bucket directly.
    const bucket = admin.storage().bucket(); 
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    const blob = bucket.file(storagePath);

    // Upload the new file, overwriting the old one
    await blob.save(fileBuffer, {
        metadata: {
            contentType: file.type,
            cacheControl: 'public, max-age=31536000',
        },
    });
    
    // Make the file publicly readable
    await blob.makePublic();

    // Revalidate the entire site to ensure the new image is shown everywhere
    revalidatePath('/', 'layout');

    return { success: true, message: 'Image updated successfully.' };
  } catch (error: any) {
    console.error('Image upload failed:', error);
    // Provide a more specific error message if available
    let errorMessage = `An unexpected server error occurred.`;
    if (error.code === 404 || (error.message && error.message.includes('not exist'))) {
        errorMessage = `The storage bucket was not found. Please ensure the bucket name is correct in the server action.`;
    } else if (error.code === 403 || (error.errors && error.errors[0].reason === 'forbidden')) {
        errorMessage = 'Permission denied. The server does not have the required permissions to upload files. Please check server IAM roles.';
    } else if (error.message) {
        errorMessage += ` (${error.message})`;
    }
    return { success: false, error: errorMessage };
  }
}
