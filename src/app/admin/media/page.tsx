'use client';

import { useState, useEffect } from 'react';
import { useStorage, errorEmitter, FirestorePermissionError } from '@/firebase';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

export default function MediaDashboardPage() {
  const storage = useStorage();
  const { toast } = useToast();

  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const fetchImages = async () => {
    if (!storage) return;
    setIsFetching(true);
    try {
      const mediaFolderRef = ref(storage, 'media/');
      const res = await listAll(mediaFolderRef);
      const urls = await Promise.all(
        res.items.map((itemRef) => getDownloadURL(itemRef))
      );
      setImageUrls(urls);
    } catch (error: any) {
        if (error.code === 'storage/unauthorized') {
             const contextualError = new FirestorePermissionError({
                path: 'media/',
                operation: 'list',
            });
            errorEmitter.emit('permission-error', contextualError);
        } else {
             toast({
                variant: 'destructive',
                title: 'Failed to fetch images',
                description: error.message || 'Could not load images from storage.',
            });
        }
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (storage) {
      fetchImages();
    }
  }, [storage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFilesToUpload(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (!storage || filesToUpload.length === 0) return;

    setIsUploading(true);
    try {
      await Promise.all(
        filesToUpload.map(async (file) => {
          const storageRef = ref(storage, `media/${uuidv4()}-${file.name}`);
          await uploadBytes(storageRef, file);
        })
      );
      
      setFilesToUpload([]);
      await fetchImages(); // Refresh the gallery

    } catch (error: any) {
      if (error.code === 'storage/unauthorized') {
          const contextualError = new FirestorePermissionError({
              path: 'media/', // The path being written to
              operation: 'write',
              requestResourceData: { note: `Attempted to upload ${filesToUpload.length} files.` }
          });
          errorEmitter.emit('permission-error', contextualError);
      } else {
          toast({
              variant: 'destructive',
              title: 'Upload Failed',
              description: error.message || 'An unknown error occurred during upload.',
          });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline">Media Dashboard</h1>
        <p className="text-muted-foreground">Upload and view images in your Firebase Storage.</p>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle>Image Upload</CardTitle>
          <CardDescription>Select images to upload to the 'media' folder in your storage bucket.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input id="image-upload" type="file" multiple accept="image/*" onChange={handleFileChange} />
            <Button onClick={handleUpload} disabled={isUploading || filesToUpload.length === 0}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Upload
            </Button>
          </div>
          {filesToUpload.length > 0 && (
            <p className="text-sm text-muted-foreground">{filesToUpload.length} file(s) selected.</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Storage Gallery</CardTitle>
          <CardDescription>Images currently in your 'media' folder.</CardDescription>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : imageUrls.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {imageUrls.map((url) => (
                <div key={url} className="relative aspect-square w-full bg-muted rounded-md overflow-hidden border">
                  <Image src={url} alt="Uploaded media" fill className="object-cover" />
                </div>
              ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                <ImageIcon className="w-12 h-12 mb-4" />
                <p className="font-semibold">No images found</p>
                <p className="text-sm">Upload an image to see it appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
