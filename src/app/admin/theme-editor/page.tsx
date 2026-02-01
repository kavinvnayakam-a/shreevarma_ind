'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { updateSiteImage } from '@/app/actions/update-site-image';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, UploadCloud, RefreshCcw, ImageIcon, LayoutDashboard, Globe } from 'lucide-react';

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
      <CardHeader className="p-4 bg-muted/30 text-primary">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <ImageIcon className="h-4 w-4" /> {label}
        </CardTitle>
        <CardDescription className="text-[10px] truncate font-mono text-muted-foreground">{storagePath}</CardDescription>
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
              {isSubmitting ? 'Uploading...' : 'Update Asset'}
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

const themeImages = {
    brand_identity: [
        { label: 'Main Logo', description: 'Appears in Header/Footer', storagePath: 'site_assets/brand/LOGO.png' },
        { label: 'Favicon', description: 'Browser Tab Icon', storagePath: 'site_assets/brand/favicon.png' },
    ],
    homepage_hero: [
        { label: 'Hero 1 (Desktop)', description: 'Banner 1 - 1400x368', storagePath: 'site_assets/homepage/hero_desktop_1.webp' },
        { label: 'Hero 1 (Mobile)', description: 'Banner 1 - 1080x1080', storagePath: 'site_assets/homepage/hero_mobile_1.webp' },
        { label: 'Hero 2 (Desktop)', description: 'Banner 2 - 1400x368', storagePath: 'site_assets/homepage/hero_desktop_2.webp' },
        { label: 'Hero 2 (Mobile)', description: 'Banner 2 - 1080x1080', storagePath: 'site_assets/homepage/hero_mobile_2.webp' },
        { label: 'Hero 3 (Desktop)', description: 'Banner 3 - 1400x368', storagePath: 'site_assets/homepage/hero_desktop_3.webp' },
        { label: 'Hero 3 (Mobile)', description: 'Banner 3 - 1080x1080', storagePath: 'site_assets/homepage/hero_mobile_3.webp' },
    ],
    homepage_categories: [
        { label: 'Health Care', description: 'Category Circle/Card', storagePath: 'site_assets/homepage/category_health.webp' },
        { label: 'Men\'s Wellness', description: 'Category Circle/Card', storagePath: 'site_assets/homepage/category_mens.webp' },
        { label: 'Women\'s Wellness', description: 'Category Circle/Card', storagePath: 'site_assets/homepage/category_womens.webp' },
        { label: 'Hair Care', description: 'Category Circle/Card', storagePath: 'site_assets/homepage/category_hair.webp' },
        { label: 'Skin Care', description: 'Category Circle/Card', storagePath: 'site_assets/homepage/category_skin.webp' },
        { label: 'Kids Care', description: 'Category Circle/Card', storagePath: 'site_assets/homepage/category_kids.webp' },
    ],
    homepage_marketing: [
        { label: 'Maharaja Combo', description: 'Offer Section Banner', storagePath: 'site_assets/homepage/maharaja-combo.webp' },
        { label: 'Vajee Care Combo', description: 'Offer Section Banner', storagePath: 'site_assets/homepage/vajee-care-combo.webp' },
        { label: 'Shree Care Combo', description: 'Offer Section Banner', storagePath: 'site_assets/homepage/shreecare-combo.webp' },
        { label: 'Orthocure Combo', description: 'Offer Section Banner', storagePath: 'site_assets/homepage/orthocure-combo.webp' },
        { label: 'Hair Care Combo', description: 'Offer Section Banner', storagePath: 'site_assets/homepage/hair-care-combo.webp' },
        { label: 'Award Banner', description: 'Trendsetters Award Image', storagePath: 'site_assets/homepage/trendsetters_award.webp' },
    ],
    internal_pages_hero: [
        { label: 'About Us Hero', description: 'Main Banner', storagePath: 'site_assets/about/hero.png' },
        { label: 'Organisation Hero (Desktop)', description: 'Main Banner', storagePath: 'site_assets/organisation/hero_desktop.png' },
        { label: 'Organisation Hero (Mobile)', description: 'Main Banner', storagePath: 'site_assets/organisation/hero_mobile.png' },
        { label: 'Consultation Hero', description: 'Main Banner', storagePath: 'site_assets/consultation/hero_desktop.png' },
        { label: 'Therapy Hero', description: 'Main Banner', storagePath: 'site_assets/therapy/hero.png' },
        { label: 'Diseases Hero', description: 'Main Banner', storagePath: 'site_assets/diseases/hero.png' },
        { label: 'Contact Hero', description: 'Main Banner', storagePath: 'site_assets/contact/main.png' },
    ],
    internal_content: [
        { label: 'Dr. Shreevarma Profile', description: 'About Page Bio Image', storagePath: 'site_assets/about/dr_shreevarma.png' },
        { label: 'Discovery Image', description: 'Organisation Page Discovery', storagePath: 'site_assets/organisation/discovery.png' },
        { label: 'Why Choose Docs', description: 'Consultation Page Content', storagePath: 'site_assets/consultation/why_choose_docs.png' },
        { label: 'Certification Banner', description: 'Global Trust Banner', storagePath: 'site_assets/homepage/cert_gmp.png' },
    ],
    spotlight_media: [
        { label: 'Spotlight 1', description: 'Carousel Item', storagePath: 'site_assets/homepage/spotlight_1.webp' },
        { label: 'Spotlight 2', description: 'Carousel Item', storagePath: 'site_assets/homepage/spotlight_2.webp' },
        { label: 'Spotlight 3', description: 'Carousel Item', storagePath: 'site_assets/homepage/spotlight_3.webp' },
        { label: 'Spotlight 4', description: 'Carousel Item', storagePath: 'site_assets/homepage/spotlight_4.webp' },
        { label: 'Spotlight 5', description: 'Carousel Item', storagePath: 'site_assets/homepage/spotlight_5.webp' },
    ]
};

export default function ThemeEditorPage() {
    return (
        <div className="max-w-[1600px] mx-auto py-10 px-6 space-y-12 bg-background min-h-screen">
            <header className="flex justify-between items-center border-b pb-8 bg-card p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                        <LayoutDashboard className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-primary font-headline uppercase tracking-tighter">Theme Portal</h1>
                        <p className="text-muted-foreground font-medium flex items-center gap-2">
                           <Globe className="h-4 w-4" /> Global Website Asset Manager
                        </p>
                    </div>
                </div>
                <Button variant="outline" size="lg" className="font-bold" onClick={() => window.location.reload()}>
                    <RefreshCcw className="mr-2 h-4 w-4" /> Sync All
                </Button>
            </header>
            
            {Object.entries(themeImages).map(([section, images]) => (
                <section key={section} className="space-y-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold uppercase tracking-widest text-primary/80 border-l-4 border-primary pl-4">
                            {section.replace('_', ' ')}
                        </h2>
                        <div className="flex-1 h-[1px] bg-border" />
                    </div>
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

            <footer className="text-center py-12 border-t text-muted-foreground text-sm uppercase tracking-[0.2em] font-medium opacity-50">
                Shreevarma Internal Content Management
            </footer>
        </div>
    );
}