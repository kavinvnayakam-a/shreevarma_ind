'use server';

import { revalidatePath } from 'next/cache';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin with explicit credentials to avoid 404/Permission errors
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The replace handles newline characters in deployment environments
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: 'shreevarma-india-location.appspot.com',
    });
  } catch (error: any) {
    console.error('Firebase Admin initialization error:', error.message);
  }
}

export async function updateSiteImage(formData: FormData) {
  const file = formData.get('file') as File;
  const storagePath = formData.get('storagePath') as string;

  // 1. Validation
  if (!file || !storagePath) {
    return { success: false, error: 'Missing file or storage path.' };
  }

  try {
    // 2. Explicitly reference the bucket name to bypass auto-discovery issues
    const bucket = admin.storage().bucket('shreevarma-india-location.appspot.com');
    const blob = bucket.file(storagePath);

    // 3. Convert File to Buffer for Node.js environment
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Upload and Overwrite
    // We use .save() which is the standard way to write buffers in Admin SDK
    await blob.save(buffer, {
      metadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000', // One year cache
      },
      resumable: false, // Better for small files/Server Actions
    });

    // 5. Set Permissions
    // Note: Ensure "Fine-grained" access is enabled in Firebase Storage settings
    await blob.makePublic();

    // 6. Refresh the Next.js Cache
    revalidatePath('/', 'layout');

    return { 
      success: true, 
      message: 'Image updated successfully.',
      url: `https://storage.googleapis.com/${bucket.name}/${storagePath}`
    };

  } catch (error: any) {
    console.error('Firebase Storage Error:', error);

    // Refined Error Handling
    let message = 'An unexpected error occurred.';
    if (error.code === 404) message = 'Bucket not found. Check your bucket name.';
    if (error.code === 403) message = 'Permission denied. Check Service Account roles.';
    
    return { 
      success: false, 
      error: `${message} (${error.message})` 
    };
  }
}