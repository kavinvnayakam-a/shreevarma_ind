'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Gift, Newspaper, ScrollText, Star, Loader2 } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { ProductCard } from '@/components/products/product-card';
import Autoplay from "embla-carousel-autoplay";
import React, { useMemo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useCollection, useFirebase } from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import type { Product } from '@/lib/placeholder-data';
import { categories as staticCategories } from '@/components/products/category-data';

// --- DYNAMIC IMAGE HELPER ---
const BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'shreevarma-india-location.firebasestorage.app';
const getImageUrl = (path: string) => `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(path)}?alt=media`;

// --- MAPPED HERO SLIDES (Matching Theme Editor Paths) ---
const heroSlides = [
    {
        imageUrl: getImageUrl('site_assets/homepage/hero_desktop_1.webp'),
        mobileImageUrl: getImageUrl('site_assets/homepage/hero_mobile_1.webp'),
        title: 'Shreevarma Product Banner 1',
        imageHint: 'ayurvedic products banner'
    },
    {
        imageUrl: getImageUrl('site_assets/homepage/hero_desktop_2.webp'),
        mobileImageUrl: getImageUrl('site_assets/homepage/hero_mobile_2.webp'),
        title: 'Shreevarma Product Banner 2',
        imageHint: 'ayurvedic products offer'
    },
    {
        imageUrl: getImageUrl('site_assets/homepage/hero_desktop_3.webp'),
        mobileImageUrl: getImageUrl('site_assets/homepage/hero_mobile_3.webp'),
        title: 'Shreevarma Family Banner',
        imageHint: 'ayurvedic products family'
    }
];

// --- MAPPED SPOTLIGHT IMAGES ---
const magazineImages = [
    { title: 'Spotlight 1', imageUrl: getImageUrl('site_assets/homepage/spotlight_1.webp'), imageHint: 'spotlight feature' },
    { title: 'Spotlight 2', imageUrl: getImageUrl('site_assets/homepage/spotlight_2.webp'), imageHint: 'spotlight feature' },
    { title: 'Spotlight 3', imageUrl: getImageUrl('site_assets/homepage/spotlight_3.webp'), imageHint: 'spotlight feature' },
    { title: 'Spotlight 4', imageUrl: getImageUrl('site_assets/homepage/spotlight_4.webp'), imageHint: 'spotlight feature' },
    { title: 'Spotlight 5', imageUrl: getImageUrl('site_assets/homepage/spotlight_5.webp'), imageHint: 'spotlight feature' },
];

const staticMagazineImage = {
  imageUrl: getImageUrl('site_assets/homepage/trendsetters_award.webp'),
  title: 'Trendsetters Award 2024',
  imageHint: 'award ceremony'
};

// --- CATEGORIES MAPPING ---
// This overrides the static category images with the ones from Theme Editor
const categories = staticCategories.map(cat => ({
    ...cat,
    imageUrl: getImageUrl(`site_assets/homepage/category_${cat.slug}.webp`)
}));

// ... [Keep shuffleArray, testimonials, and comboOfferData as they were or update similarly]

export default function HomePage() {
  // ... [Keep all logic/hooks the same]

  return (
    <div className="flex flex-col bg-[#FCFBF9]">
      {/* Hero Section */}
      <section className="w-full bg-transparent mt-0">
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          className="w-full relative"
          opts={{ align: "start", loop: true }}
        >
          <CarouselContent className="-ml-0">
            {heroSlides.map((slide, index) => (
              <CarouselItem key={index} className="pl-0">
                 <div className="w-full relative aspect-square md:aspect-[1400/368] rounded-b-2xl overflow-hidden">
                    <Image
                        src={slide.mobileImageUrl}
                        alt={slide.title}
                        fill
                        className="object-cover md:hidden"
                        unoptimized // Bypasses cache when you update in Admin
                    />
                    <Image
                        src={slide.imageUrl}
                        alt={slide.title}
                        fill
                        className="object-cover hidden md:block"
                        unoptimized // Bypasses cache when you update in Admin
                    />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* ... [Dots/Navigation] */}
        </Carousel>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold font-headline text-center text-primary mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div key={category.name} className="p-1">
                <Link href={`/${category.slug}`} className="block group text-center">
                  <div className="relative overflow-hidden rounded-lg aspect-[694/869]">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-contain"
                      unoptimized // Dynamic update
                    />
                  </div>
                  <h3 className="font-semibold font-headline bg-primary text-primary-foreground mt-4 p-2 rounded-md">{category.name}</h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ... [Rest of the sections] */}

      {/* Certification Section (Updated to Theme Editor paths) */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold font-headline text-primary mb-8">Committed to Quality &amp; Trust</h2>
          <div className="flex justify-center items-center gap-4">
             {/* Instead of one big banner, we use the 4 separate logos from Theme Editor */}
             {['gmp', 'iso', '25_years', 'clinically_proven'].map((cert) => (
                 <div key={cert} className="relative w-24 h-24">
                     <Image 
                        src={getImageUrl(`site_assets/homepage/cert_${cert}.png`)}
                        alt={cert}
                        fill
                        className="object-contain"
                        unoptimized
                     />
                 </div>
             ))}
          </div>
        </div>
      </section>
      
      {/* News & Media Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold font-headline text-center text-primary mb-2">In The Spotlight</h2>
          <p className="text-lg text-muted-foreground text-center mb-8">See what the world is saying about Shreevarma.</p>
          <Carousel
            opts={{ loop: true, align: "start" }}
            plugins={[Autoplay({ delay: 8000, stopOnInteraction: true })]}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {magazineImages.map((media, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-[3/4] relative">
                          <Image
                            src={media.imageUrl}
                            alt={media.title}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            loading="lazy"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="mt-8 flex justify-center">
            <Image 
              src={staticMagazineImage.imageUrl}
              alt={staticMagazineImage.title}
              width={800}
              height={400}
              className="object-contain rounded-lg"
              data-ai-hint={staticMagazineImage.imageHint}
              loading="lazy"
            />
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold font-headline text-center text-primary mb-8">Words of Wellness</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                  <p className="font-semibold text-primary">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
