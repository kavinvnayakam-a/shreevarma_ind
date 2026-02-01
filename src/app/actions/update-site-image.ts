
'use server';

import { revalidatePath } from 'next/cache';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp();
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
    // Explicitly get a reference to the correct storage bucket.
    // The bucket name is your project ID followed by ".appspot.com".
    const bucket = admin.storage().bucket('shreevarma-india-location.appspot.com');
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
    if (error.code === 403 || (error.errors && error.errors[0].reason === 'forbidden')) {
        return { success: false, error: 'Permission denied. The server does not have the required permissions to upload files. Please check server IAM roles.' };
    }
    return { success: false, error: `Upload failed: An unexpected server error occurred. (${error.message})` };
  }
}
