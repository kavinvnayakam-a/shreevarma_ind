'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { updateSiteImage } from '@/app/actions/update-site-image';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, FolderTree, ImageIcon, Globe, UploadCloud, RefreshCcw } from 'lucide-react';

function ImageEditCard({ label, path }: { label: string, path: string }) {
  const { register, handleSubmit, watch, formState: { isSubmitting }, reset } = useForm<{file: FileList}>();
  const { toast } = useToast();
  const initialUrl = `https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/${encodeURIComponent(path)}?alt=media`;
  const [liveUrl, setLiveUrl] = useState(initialUrl);
  const file = watch('file');
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (file?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file[0]);
    } else { setPreview(null); }
  }, [file]);

  const onSubmit: SubmitHandler<{file: FileList}> = async (data) => {
    const formData = new FormData();
    formData.append('file', data.file[0]);
    formData.append('storagePath', path);
    const result = await updateSiteImage(formData);
    if (result.success) {
      toast({ title: 'Success', description: `Updated ${label}` });
      setLiveUrl(`${initialUrl}&t=${Date.now()}`);
      reset();
    } else {
      toast({ variant: 'destructive', title: 'Upload Failed', description: result.error });
    }
  };

  return (
    <Card className="overflow-hidden border bg-white shadow-sm hover:border-primary/40 transition-all">
      <CardHeader className="p-2 bg-muted/20 border-b">
        <CardTitle className="text-[10px] font-black uppercase truncate">{label}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="relative aspect-video rounded bg-secondary/10 border border-dashed overflow-hidden">
          <Image src={preview || liveUrl} alt={label} fill className="object-contain" unoptimized />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <Input type="file" className="text-[9px] h-8" {...register('file', { required: true })} />
          <Button type="submit" disabled={isSubmitting} size="sm" className="w-full h-8 text-[11px] font-bold">
            {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <UploadCloud className="h-3 w-3 mr-2" />}
            {isSubmitting ? 'Syncing...' : 'Sync Asset'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

const themeImages = {
  main_heros: [
    { label: 'Home Page', path: 'site_assets/homepage/hero_desktop_1.webp' },
    { label: 'Consultation', path: 'site_assets/consultation/hero_desktop.png' },
    { label: 'Clinics', path: 'site_assets/clinics/hero.png' },
    { label: 'Organisation', path: 'site_assets/organisation/hero.png' },
    { label: 'About Us', path: 'site_assets/about/hero.png' },
  ],
  wellness_care: [
    { label: 'Mens Intimacy', path: 'site_assets/wellness/mens-intimacy.webp' },
    { label: 'Womens Wellness', path: 'site_assets/wellness/womens-wellness.webp' },
    { label: 'Kids Care', path: 'site_assets/wellness/kids-care.webp' },
    { label: 'Hair Care', path: 'site_assets/wellness/hair-care.webp' },
    { label: 'Skin Care', path: 'site_assets/wellness/skin-care.webp' },
    { label: 'General Health', path: 'site_assets/wellness/health-page.webp' },
  ],
  clinical: [
    { label: 'Therapy Main', path: 'site_assets/therapy/hero.png' },
    { label: 'Diseases Main', path: 'site_assets/diseases/hero.png' },
    { label: 'Products Page', path: 'site_assets/products/banner.webp' },
  ]
};

export default function ThemeEditorPage() {
  return (
    <div className="max-w-[1500px] mx-auto py-10 px-6 space-y-12 bg-[#F9F8F6] min-h-screen">
      <header className="flex items-center justify-between border-b pb-8">
        <div className="flex items-center gap-4">
          <FolderTree className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-primary">Master Site Cloud</h1>
            <p className="text-xs font-bold text-muted-foreground"><Globe className="h-3 w-3 inline mr-1" /> ALL 14+ PAGES CONNECTED</p>
          </div>
        </div>
        <Button variant="ghost" onClick={() => window.location.reload()}><RefreshCcw className="h-4 w-4" /></Button>
      </header>
      {Object.entries(themeImages).map(([section, images]) => (
        <section key={section} className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary/40 border-l-4 border-primary pl-4">{section.replace('_', ' ')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {images.map(img => <ImageEditCard key={img.path} label={img.label} path={img.path} />)}
          </div>
        </section>
      ))}
    </div>
  );
}