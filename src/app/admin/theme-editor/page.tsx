'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { updateSiteImage } from '@/app/actions/update-site-image';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, UploadCloud, RefreshCcw, ImageIcon, LayoutDashboard } from 'lucide-react';

// Sub-component for individual image cards
function ImageEditCard({ label, description, currentImageUrl, storagePath }: { label: string, description: string, currentImageUrl: string, storagePath: string }) {
  const { register, handleSubmit, watch, formState: { isSubmitting, errors }, reset } = useForm<{file: FileList}>();
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const [liveUrl, setLiveUrl] = useState(currentImageUrl);
  const file = watch('file');

  useEffect(() => {
    if (file && file.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file[0]);
    } else {
      setPreview(null);
    }
  }, [file]);

  const onSubmit: SubmitHandler<{file: FileList}> = async (data) => {
    const formData = new FormData();
    formData.append('file', data.file[0]);
    formData.append('storagePath', storagePath);

    const result = await updateSiteImage(formData);

    if (result.success) {
      toast({ title: 'Success!', description: `${label} has been updated.` });
      setLiveUrl(`${currentImageUrl}&t=${new Date().getTime()}`);
      setPreview(null);
      reset();
    } else {
      toast({ variant: 'destructive', title: 'Upload Failed', description: result.error });
    }
  };

  return (
    <Card className="overflow-hidden border-2 transition-all hover:shadow-md">
      <CardHeader className="p-4 bg-muted/30">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-primary" /> {label}
        </CardTitle>
        <CardDescription className="text-[10px] truncate">{storagePath}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative aspect-video w-full rounded-md border-2 border-dashed bg-secondary/50 overflow-hidden group">
            <Image 
              src={preview || liveUrl} 
              alt={label} 
              fill 
              className="object-contain transition-transform group-hover:scale-105"
              unoptimized 
            />
          </div>
          <div className="space-y-2">
            <Input type="file" className="text-xs h-9" accept="image/*" {...register('file', { required: true })} />
            <Button type="submit" disabled={isSubmitting} size="sm" className="w-full">
              {isSubmitting ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <UploadCloud className="mr-2 h-3 w-3" />}
              Update
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

const BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'shreevarma-india-location.firebasestorage.app';
const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/`;
const urlSuffix = `?alt=media`;

// --- COMPREHENSIVE ASSET MAP ---
const themeImages = {
    brand: [
        { label: 'Main Logo', description: 'Header & Footer', storagePath: 'site_assets/brand/LOGO.png' },
        { label: 'Favicon', description: 'Browser Icon', storagePath: 'site_assets/brand/favicon.png' },
    ],
    homepage: [
        { label: 'Hero 1 (Desktop)', description: '1400x368 WebP', storagePath: 'site_assets/homepage/hero_desktop_1.webp' },
        { label: 'Hero 1 (Mobile)', description: '1080x1080 WebP', storagePath: 'site_assets/homepage/hero_mobile_1.webp' },
        { label: 'Hero 2 (Desktop)', description: '1400x368 WebP', storagePath: 'site_assets/homepage/hero_desktop_2.webp' },
        { label: 'Hero 2 (Mobile)', description: '1080x1080 WebP', storagePath: 'site_assets/homepage/hero_mobile_2.webp' },
        { label: 'Award Banner', description: 'Static Trendsetters Banner', storagePath: 'site_assets/homepage/trendsetters_award.webp' },
    ],
    categories: [
        { label: 'Health Care', description: 'Homepage Card', storagePath: 'site_assets/homepage/category_health.webp' },
        { label: 'Men\'s Wellness', description: 'Homepage Card', storagePath: 'site_assets/homepage/category_mens.webp' },
        { label: 'Women\'s Wellness', description: 'Homepage Card', storagePath: 'site_assets/homepage/category_womens.webp' },
        { label: 'Hair Care', description: 'Homepage Card', storagePath: 'site_assets/homepage/category_hair.webp' },
        { label: 'Skin Care', description: 'Homepage Card', storagePath: 'site_assets/homepage/category_skin.webp' },
        { label: 'Kids Care', description: 'Homepage Card', storagePath: 'site_assets/homepage/category_kids.webp' },
    ],
    about_organization: [
        { label: 'About Us Hero', description: 'Top Banner', storagePath: 'site_assets/about/hero.png' },
        { label: 'Dr. Shreevarma', description: 'Founder Image', storagePath: 'site_assets/about/dr_shreevarma.png' },
        { label: 'Org Hero Desktop', description: 'Organisation Page', storagePath: 'site_assets/organisation/hero_desktop.png' },
        { label: 'Org Hero Mobile', description: 'Organisation Page', storagePath: 'site_assets/organisation/hero_mobile.png' },
    ],
    services: [
        { label: 'Consultation Hero', description: 'Booking Page Banner', storagePath: 'site_assets/consultation/hero_desktop.png' },
        { label: 'Therapy Hero', description: 'Therapy Page Banner', storagePath: 'site_assets/therapy/hero.png' },
        { label: 'Diseases Hero', description: 'Main Diseases Page', storagePath: 'site_assets/diseases/hero.png' },
    ],
    support: [
        { label: 'Contact Us Banner', description: 'Contact Page Hero', storagePath: 'site_assets/contact/main.png' },
    ]
};

export default function ThemeEditorPage() {
    return (
        <div className="max-w-[1600px] mx-auto py-10 px-6 space-y-12">
            <div className="flex justify-between items-center border-b pb-8">
                <div>
                    <h1 className="text-4xl font-black text-primary font-headline uppercase flex items-center gap-3">
                        <LayoutDashboard className="h-10 w-10" /> Theme Portal
                    </h1>
                    <p className="text-muted-foreground font-medium">Global Site Image Management</p>
                </div>
                <Button variant="outline" onClick={() => window.location.reload()}>
                    <RefreshCcw className="mr-2 h-4 w-4" /> Hard Reload
                </Button>
            </div>
            
            {Object.entries(themeImages).map(([section, images]) => (
                <section key={section} className="space-y-6">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-foreground/70 border-l-4 border-primary pl-4">
                        {section.replace('_', ' & ')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {images.map(img => (
                            <ImageEditCard 
                                key={img.storagePath}
                                {...img}
                                currentImageUrl={`${baseUrl}${encodeURIComponent(img.storagePath)}${urlSuffix}`}
                            />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}