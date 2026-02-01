
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { updateSiteImage } from '@/app/actions/update-site-image';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, UploadCloud } from 'lucide-react';

interface ImageEditCardProps {
  label: string;
  description: string;
  currentImageUrl: string;
  storagePath: string;
}

interface FormData {
  file: FileList;
}

function ImageEditCard({ label, description, currentImageUrl, storagePath }: ImageEditCardProps) {
  const { register, handleSubmit, watch, formState: { isSubmitting, errors } } = useForm<FormData>();
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  
  const file = watch('file');

  React.useEffect(() => {
    if (file && file.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file[0]);
    } else {
      setPreview(null);
    }
  }, [file]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const formData = new FormData();
    formData.append('file', data.file[0]);
    formData.append('storagePath', storagePath);

    const result = await updateSiteImage(formData);

    if (result.success) {
      toast({ title: 'Success!', description: `${label} has been updated.` });
      // The page will be revalidated by the server action, so we just need to wait
      // for the new image to show up. A forced refresh could work too.
      window.location.reload();
    } else {
      toast({ variant: 'destructive', title: 'Upload Failed', description: result.error });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{label}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative aspect-video w-full rounded-md border bg-muted overflow-hidden">
            <Image src={preview || currentImageUrl} alt={`Current ${label}`} fill className="object-contain" />
          </div>
          <div className="space-y-2">
            <Input id={`file-${storagePath}`} type="file" accept="image/webp, image/jpeg, image/png" {...register('file', { required: 'Please select an image file.' })} />
            {errors.file && <p className="text-sm text-destructive">{errors.file.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
            Upload & Replace
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

const themeImages = {
    homepageHero: [
        { label: 'Hero Banner 1 (Desktop)', description: 'Recommended size: 1400x368', storagePath: 'site_assets/homepage/hero_desktop_1.webp' },
        { label: 'Hero Banner 1 (Mobile)', description: 'Recommended size: 1080x1080', storagePath: 'site_assets/homepage/hero_mobile_1.webp' },
        { label: 'Hero Banner 2 (Desktop)', description: 'Recommended size: 1400x368', storagePath: 'site_assets/homepage/hero_desktop_2.webp' },
        { label: 'Hero Banner 2 (Mobile)', description: 'Recommended size: 1080x1080', storagePath: 'site_assets/homepage/hero_mobile_2.webp' },
        { label: 'Hero Banner 3 (Desktop)', description: 'Recommended size: 1400x368', storagePath: 'site_assets/homepage/hero_desktop_3.webp' },
        { label: 'Hero Banner 3 (Mobile)', description: 'Recommended size: 1080x1080', storagePath: 'site_assets/homepage/hero_mobile_3.webp' },
    ],
    homepageCategories: [
        { label: 'Health Category', description: 'Used on homepage.', storagePath: 'site_assets/homepage/category_health.webp' },
        { label: 'Men\'s Intimacy Category', description: 'Used on homepage.', storagePath: 'site_assets/homepage/category_mens.webp' },
        { label: 'Women\'s Wellness Category', description: 'Used on homepage.', storagePath: 'site_assets/homepage/category_womens.webp' },
        { label: 'Kids Care Category', description: 'Used on homepage.', storagePath: 'site_assets/homepage/category_kids.webp' },
        { label: 'Hair Care Category', description: 'Used on homepage.', storagePath: 'site_assets/homepage/category_hair.webp' },
        { label: 'Skin Care Category', description: 'Used on homepage.', storagePath: 'site_assets/homepage/category_skin.webp' },
    ],
    homepageSpotlight: [
        { label: 'Spotlight Image 1', description: 'Used in homepage media carousel.', storagePath: 'site_assets/homepage/spotlight_1.webp' },
        { label: 'Spotlight Image 2', description: 'Used in homepage media carousel.', storagePath: 'site_assets/homepage/spotlight_2.webp' },
        { label: 'Spotlight Image 3', description: 'Used in homepage media carousel.', storagePath: 'site_assets/homepage/spotlight_3.webp' },
        { label: 'Spotlight Image 4', description: 'Used in homepage media carousel.', storagePath: 'site_assets/homepage/spotlight_4.webp' },
        { label: 'Spotlight Image 5', description: 'Used in homepage media carousel.', storagePath: 'site_assets/homepage/spotlight_5.webp' },
        { label: 'Trendsetters Award Banner', description: 'Static banner below the carousel.', storagePath: 'site_assets/homepage/trendsetters_award.webp' },
    ],
    homepageCertifications: [
        { label: '25 Years of Trust Logo', description: 'Certification logo on homepage.', storagePath: 'site_assets/homepage/cert_25_years.png' },
        { label: 'Clinically Proven Logo', description: 'Certification logo on homepage.', storagePath: 'site_assets/homepage/cert_clinically_proven.png' },
        { label: 'GMP Certified Logo', description: 'Certification logo on homepage.', storagePath: 'site_assets/homepage/cert_gmp.png' },
        { label: 'ISO Certified Logo', description: 'Certification logo on homepage.', storagePath: 'site_assets/homepage/cert_iso.png' },
    ],
    aboutPage: [
        { label: 'About Page Hero', description: 'Main image on the About Us page.', storagePath: 'site_assets/about/hero.png' },
        { label: 'About Us Section Image', description: 'Image next to the "About us" text.', storagePath: 'site_assets/about/about_section.png' },
        { label: 'Philosophy Section Image', description: 'Image for "Our Philosophy" section.', storagePath: 'site_assets/about/philosophy.png' },
        { label: 'Dr. Shreevarma Image', description: 'Image of Dr. Shreevarma.', storagePath: 'site_assets/about/dr_shreevarma.png' },
        { label: 'Why Choose Us Image', description: 'Image for the "Why Choose Us" section on About page.', storagePath: 'site_assets/about/why_choose.png' },
        { label: 'CTA Section Image', description: 'Image for the call-to-action section.', storagePath: 'site_assets/about/cta.png' },
    ],
    consultationPage: [
        { label: 'Consultation Hero (Desktop)', description: 'Desktop hero for consultation page.', storagePath: 'site_assets/consultation/hero_desktop.png' },
        { label: 'Consultation Hero (Mobile)', description: 'Mobile hero for consultation page.', storagePath: 'site_assets/consultation/hero_mobile.png' },
        { label: 'Why Choose Doctors Image', description: 'Image on the consultation page.', storagePath: 'site_assets/consultation/why_choose_docs.png' },
    ],
    contactPage: [
        { label: 'Contact Us Image', description: 'Main image on the contact page.', storagePath: 'site_assets/contact/main.png' },
    ],
    diseasesPage: [
        { label: 'Diseases Page Hero', description: 'Hero image on the main diseases page.', storagePath: 'site_assets/diseases/hero.png' },
    ],
    organisationPage: [
         { label: 'Organisation Hero (Desktop)', description: 'Desktop hero for the organisation page.', storagePath: 'site_assets/organisation/hero_desktop.png' },
         { label: 'Organisation Hero (Mobile)', description: 'Mobile hero for the organisation page.', storagePath: 'site_assets/organisation/hero_mobile.png' },
         { label: 'Discovery Section Image', description: 'Image for "Discover Healing Power" section.', storagePath: 'site_assets/organisation/discovery.png' },
    ],
    therapyPage: [
        { label: 'Therapy Page Hero', description: 'Hero image on the therapy page.', storagePath: 'site_assets/therapy/hero.png' },
    ],
};

const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'shreevarma-india-location.appspot.com'}/o/`;
const urlSuffix = `?alt=media`;

export default function ThemeEditorPage() {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold font-headline">Theme Editor</h1>
                <p className="text-muted-foreground">Manage key images for your website's theme and layout.</p>
            </header>
            
            <Card>
                <CardHeader>
                    <CardTitle>Homepage</CardTitle>
                    <CardDescription>Manage images for the main homepage.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {themeImages.homepageHero.map(img => (
                        <ImageEditCard 
                            key={img.storagePath}
                            {...img}
                            currentImageUrl={`${baseUrl}${encodeURIComponent(img.storagePath)}${urlSuffix}`}
                        />
                    ))}
                    {themeImages.homepageCategories.map(img => (
                        <ImageEditCard 
                            key={img.storagePath}
                            {...img}
                            currentImageUrl={`${baseUrl}${encodeURIComponent(img.storagePath)}${urlSuffix}`}
                        />
                    ))}
                    {themeImages.homepageSpotlight.map(img => (
                        <ImageEditCard 
                            key={img.storagePath}
                            {...img}
                            currentImageUrl={`${baseUrl}${encodeURIComponent(img.storagePath)}${urlSuffix}`}
                        />
                    ))}
                    {themeImages.homepageCertifications.map(img => (
                        <ImageEditCard 
                            key={img.storagePath}
                            {...img}
                            currentImageUrl={`${baseUrl}${encodeURIComponent(img.storagePath)}${urlSuffix}`}
                        />
                    ))}
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>About Page</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {themeImages.aboutPage.map(img => (
                        <ImageEditCard 
                            key={img.storagePath}
                            {...img}
                            currentImageUrl={`${baseUrl}${encodeURIComponent(img.storagePath)}${urlSuffix}`}
                        />
                    ))}
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Consultation Page</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {themeImages.consultationPage.map(img => (
                        <ImageEditCard 
                            key={img.storagePath}
                            {...img}
                            currentImageUrl={`${baseUrl}${encodeURIComponent(img.storagePath)}${urlSuffix}`}
                        />
                    ))}
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Other Pages</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {themeImages.contactPage.map(img => (
                        <ImageEditCard 
                            key={img.storagePath}
                            {...img}
                            currentImageUrl={`${baseUrl}${encodeURIComponent(img.storagePath)}${urlSuffix}`}
                        />
                    ))}
                    {themeImages.diseasesPage.map(img => (
                        <ImageEditCard 
                            key={img.storagePath}
                            {...img}
                            currentImageUrl={`${baseUrl}${encodeURIComponent(img.storagePath)}${urlSuffix}`}
                        />
                    ))}
                    {themeImages.organisationPage.map(img => (
                        <ImageEditCard 
                            key={img.storagePath}
                            {...img}
                            currentImageUrl={`${baseUrl}${encodeURIComponent(img.storagePath)}${urlSuffix}`}
                        />
                    ))}
                    {themeImages.therapyPage.map(img => (
                        <ImageEditCard 
                            key={img.storagePath}
                            {...img}
                            currentImageUrl={`${baseUrl}${encodeURIComponent(img.storagePath)}${urlSuffix}`}
                        />
                    ))}
                </CardContent>
            </Card>

        </div>
    );
}
