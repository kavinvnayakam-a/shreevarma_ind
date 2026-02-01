'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ScrollText, Star, Loader2 } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { ProductCard } from '@/components/products/product-card';
import Autoplay from "embla-carousel-autoplay";
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useCollection, useFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Product } from '@/lib/placeholder-data';
import { categories as staticCategories } from '@/components/products/category-data';

const BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'shreevarma-india-location.firebasestorage.app';

export default function HomePage() {
  const plugin = useRef(Autoplay({ delay: 8000, stopOnInteraction: true }));
  const [mounted, setMounted] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [comboApi, setComboApi] = useState<CarouselApi>();
  const [comboCurrent, setComboCurrent] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  
  const { firestore } = useFirebase();

  useEffect(() => { setMounted(true); }, []);

  const getImageUrl = (path: string) => {
    const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(path)}?alt=media`;
    return mounted ? `${baseUrl}&t=${new Date().getHours()}` : baseUrl;
  };

  // Mapped to Theme Editor Storage Paths
  const heroSlides = useMemo(() => [
    { imageUrl: getImageUrl('site_assets/homepage/hero_desktop_1.webp'), mobileImageUrl: getImageUrl('site_assets/homepage/hero_mobile_1.webp'), title: 'Banner 1' },
    { imageUrl: getImageUrl('site_assets/homepage/hero_desktop_2.webp'), mobileImageUrl: getImageUrl('site_assets/homepage/hero_mobile_2.webp'), title: 'Banner 2' },
    { imageUrl: getImageUrl('site_assets/homepage/hero_desktop_3.webp'), mobileImageUrl: getImageUrl('site_assets/homepage/hero_mobile_3.webp'), title: 'Banner 3' }
  ], [mounted]);

  // CATEGORY SYNC: This looks for category_health.webp, category_mens.webp, etc.
  const dynamicCategories = useMemo(() => {
    return staticCategories.map(cat => {
        // We clean the slug: "Men's Intimacy" becomes "mens"
        let cleanSlug = cat.slug.toLowerCase().split('-')[0]; 
        if(cleanSlug === 'men\'s') cleanSlug = 'mens';
        if(cleanSlug === 'women\'s') cleanSlug = 'womens';

        return {
            ...cat,
            imageUrl: getImageUrl(`site_assets/homepage/category_${cleanSlug}.webp`)
        }
    });
  }, [mounted]);

  const comboOfferData = useMemo(() => [
    { imageUrl: getImageUrl('site_assets/homepage/maharaja-combo.webp'), title: "Maharaja Combo", productId: "3aYsjAtOGxqHNfqJwEJt" },
    { imageUrl: getImageUrl('site_assets/homepage/vajee-care-combo.webp'), title: "Vajee Care Combo", productId: "XxatfDb9S0K0Vflzbfuz" },
    { imageUrl: getImageUrl('site_assets/homepage/shreecare-combo.webp'), title: "Shree Care Combo", productId: "MbfO8VokStMkBF7uV6hk" },
    { imageUrl: getImageUrl('site_assets/homepage/orthocure-combo.webp'), title: "Orthocure Combo", productId: "lGlrvuhCenADiXtbrGjp" },
    { imageUrl: getImageUrl('site_assets/homepage/hair-care-combo.webp'), title: "Hair Care Combo", productId: "ASGIty0IjZV0GoQAHDgu" }
  ], [mounted]);

  const magazineImages = useMemo(() => [
    { title: 'Spotlight 1', imageUrl: getImageUrl('site_assets/homepage/spotlight_1.webp') },
    { title: 'Spotlight 2', imageUrl: getImageUrl('site_assets/homepage/spotlight_2.webp') },
    { title: 'Spotlight 3', imageUrl: getImageUrl('site_assets/homepage/spotlight_3.webp') },
    { title: 'Spotlight 4', imageUrl: getImageUrl('site_assets/homepage/spotlight_4.webp') },
    { title: 'Spotlight 5', imageUrl: getImageUrl('site_assets/homepage/spotlight_5.webp') },
  ], [mounted]);

  const productsQuery = useMemo(() => 
    (firestore ? query(collection(firestore, 'products'), where('category', '==', 'Health')) : null), [firestore]
  );
  const { data: allFeaturedProducts, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);

  const featuredProducts = useMemo(() => {
    if (!allFeaturedProducts) return [];
    return [...allFeaturedProducts].sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [allFeaturedProducts]);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  useEffect(() => {
    if (!comboApi) return;
    setComboCount(comboApi.scrollSnapList().length);
    setComboCurrent(comboApi.selectedScrollSnap());
    comboApi.on("select", () => setComboCurrent(comboApi.selectedScrollSnap()));
  }, [comboApi]);

  return (
    <div className="flex flex-col bg-[#FCFBF9]">
      <section className="w-full">
        <Carousel setApi={setApi} plugins={[plugin.current]} className="w-full relative" opts={{ align: "start", loop: true }}>
          <CarouselContent className="-ml-0">
            {heroSlides.map((slide, index) => (
              <CarouselItem key={index} className="pl-0">
                <div className="w-full relative aspect-square md:aspect-[1400/368] rounded-b-2xl overflow-hidden">
                    <Image src={slide.mobileImageUrl} alt={slide.title} fill className="object-cover md:hidden" unoptimized priority={index === 0} />
                    <Image src={slide.imageUrl} alt={slide.title} fill className="object-cover hidden md:block" unoptimized priority={index === 0} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {heroSlides.map((_, index) => (
              <button key={index} onClick={() => api?.scrollTo(index)} className={cn("h-2 w-2 rounded-full bg-primary/30", current === index ? "w-4 bg-primary" : "")} />
            ))}
          </div>
        </Carousel>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold font-headline text-center text-primary mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {dynamicCategories.map((category) => (
              <div key={category.name} className="p-1">
                <Link href={`/${category.slug}`} className="block group text-center">
                  <div className="relative overflow-hidden rounded-lg aspect-[694/869] bg-muted shadow-sm">
                    <Image src={category.imageUrl} alt={category.name} fill className="object-contain" unoptimized />
                  </div>
                  <h3 className="font-semibold font-headline bg-primary text-white mt-4 p-2 rounded-md">{category.name}</h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold font-headline text-primary mb-12">Featured Products</h2>
          {isLoadingProducts ? (
            <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => <ProductCard key={p.__docId} product={{...p, id: p.__docId}} />)}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold font-headline text-center text-primary mb-12">Combo Offers</h2>
          <Carousel setApi={setComboApi} className="w-full" opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ml-4">
              {comboOfferData.map((combo, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2">
                  <Link href={`/products/${combo.productId}`} className="block group text-center">
                    <div className="relative aspect-[936/537] rounded-lg overflow-hidden shadow-sm">
                      <Image src={combo.imageUrl} alt={combo.title} fill className="object-contain" unoptimized />
                    </div>
                    <h3 className="font-semibold bg-primary text-white mt-4 p-2 rounded-md">{combo.title}</h3>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold font-headline text-primary mb-8">Quality & Trust</h2>
          <div className="flex justify-center">
            <div className="relative w-full max-w-4xl aspect-[3750/710]">
              <Image src={getImageUrl('site_assets/homepage/cert_gmp.png')} alt="Trust Banner" fill className="object-contain" unoptimized />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold font-headline text-center text-primary mb-8">In The Spotlight</h2>
          <Carousel opts={{ loop: true, align: "start" }} plugins={[Autoplay({ delay: 6000 })]} className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {magazineImages.map((media, index) => (
                <CarouselItem key={index} className="md:basis-1/3 p-4">
                  <div className="aspect-[3/4] relative rounded-lg border bg-white overflow-hidden">
                    <Image src={media.imageUrl} alt={media.title} fill className="object-contain" unoptimized />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="flex justify-center">
            <div className="relative w-full max-w-4xl aspect-[3750/710]">
              <Image src={getImageUrl('site_assets/homepage/trendsetters_award.webp')} alt="Award" fill className="object-contain rounded-xl" unoptimized />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
