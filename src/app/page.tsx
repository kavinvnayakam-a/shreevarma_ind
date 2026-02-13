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
import { collection, query, where, limit } from 'firebase/firestore';
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
  
  const { firestore } = useFirebase();

  useEffect(() => { setMounted(true); }, []);

  const getImageUrl = (path: string) => {
    return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(path)}?alt=media`;
  };

  const heroSlides = useMemo(() => [
    { imageUrl: getImageUrl('site_assets/homepage/hero_desktop_1.webp'), mobileImageUrl: getImageUrl('site_assets/homepage/hero_mobile_1.webp'), title: 'Banner 1' },
    { imageUrl: getImageUrl('site_assets/homepage/hero_desktop_2.webp'), mobileImageUrl: getImageUrl('site_assets/homepage/hero_mobile_2.webp'), title: 'Banner 2' },
    { imageUrl: getImageUrl('site_assets/homepage/hero_desktop_3.webp'), mobileImageUrl: getImageUrl('site_assets/homepage/hero_mobile_3.webp'), title: 'Banner 3' }
  ], []);

  const dynamicCategories = useMemo(() => {
    return staticCategories.map(cat => {
        let cleanSlug = cat.slug.toLowerCase().split('-')[0]; 
        if(cleanSlug === 'men\'s') cleanSlug = 'mens';
        if(cleanSlug === 'women\'s') cleanSlug = 'womens';
        return { ...cat, imageUrl: getImageUrl(`site_assets/homepage/category_${cleanSlug}.webp`) }
    });
  }, []);

  const comboOfferData = useMemo(() => [
    { imageUrl: getImageUrl('site_assets/homepage/maharaja-combo.webp'), title: "Maharaja Combo", productId: "3aYsjAtOGxqHNfqJwEJt" },
    { imageUrl: getImageUrl('site_assets/homepage/vajee-care-combo.webp'), title: "Vajee Care Combo", productId: "XxatfDb9S0K0Vflzbfuz" },
    { imageUrl: getImageUrl('site_assets/homepage/shreecare-combo.webp'), title: "Shree Care Combo", productId: "MbfO8VokStMkBF7uV6hk" },
    { imageUrl: getImageUrl('site_assets/homepage/orthocure-combo.webp'), title: "Orthocure Combo", productId: "lGlrvuhCenADiXtbrGjp" },
    { imageUrl: getImageUrl('site_assets/homepage/hair-care-combo.webp'), title: "Hair Care Combo", productId: "ASGIty0IjZV0GoQAHDgu" }
  ], []);

  const magazineImages = useMemo(() => [
    { title: 'Spotlight 1', imageUrl: getImageUrl('site_assets/homepage/spotlight_1.webp') },
    { title: 'Spotlight 2', imageUrl: getImageUrl('site_assets/homepage/spotlight_2.webp') },
    { title: 'Spotlight 3', imageUrl: getImageUrl('site_assets/homepage/spotlight_3.webp') },
    { title: 'Spotlight 4', imageUrl: getImageUrl('site_assets/homepage/spotlight_4.webp') },
    { title: 'Spotlight 5', imageUrl: getImageUrl('site_assets/homepage/spotlight_5.webp') },
  ], []);

  const productsQuery = useMemo(() => 
    (firestore ? query(collection(firestore, 'products'), where('category', '==', 'Health'), limit(4)) : null), [firestore]
  );
  
  const { data: featuredProducts, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  useEffect(() => {
    if (!comboApi) return;
    setComboCurrent(comboApi.selectedScrollSnap());
    comboApi.on("select", () => setComboCurrent(comboApi.selectedScrollSnap()));
  }, [comboApi]);

  const HEADING_STYLE = "text-3xl font-bold font-headline text-center text-primary mb-12 uppercase tracking-tight";

  return (
    <div className="flex flex-col bg-white">
      {/* 1. Hero Section */}
      <section className="w-full bg-white">
        <Carousel setApi={setApi} plugins={[plugin.current]} className="w-full relative" opts={{ align: "start", loop: true }}>
          <CarouselContent className="-ml-0">
            {heroSlides.map((slide, index) => (
              <CarouselItem key={index} className="pl-0">
                <div className="w-full relative min-h-[300px] md:min-h-[368px] aspect-square md:aspect-[1400/368] rounded-b-2xl overflow-hidden bg-white">
                    <Image src={slide.mobileImageUrl} alt={slide.title} fill className="object-cover md:hidden" priority={index === 0} sizes="100vw" />
                    <Image src={slide.imageUrl} alt={slide.title} fill className="object-cover hidden md:block" priority={index === 0} sizes="(max-width: 1400px) 100vw, 1400px" />
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
      
      {/* 2. Shop By Category */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className={HEADING_STYLE}>Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {dynamicCategories.map((category) => (
              <div key={category.name} className="p-1">
                <Link href={`/${category.slug}`} className="block group text-center">
                  <div className="relative overflow-hidden rounded-2xl aspect-[694/869] bg-white shadow-sm border border-slate-50 group-hover:shadow-lg transition-all">
                    <Image src={category.imageUrl} alt={category.name} fill className="object-contain p-2" sizes="(max-width: 768px) 50vw, 33vw" />
                  </div>
                  <h3 className="font-bold font-headline bg-primary text-white mt-4 p-3 rounded-xl transition-transform group-hover:scale-95">{category.name}</h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="py-16 bg-white border-t border-slate-50 min-h-[400px]">
        <div className="container mx-auto px-6 text-center">
          <h2 className={HEADING_STYLE}>Featured Products</h2>
          {isLoadingProducts ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <div key={i} className="aspect-[4/5] bg-slate-50 animate-pulse rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts?.map((p) => <ProductCard key={p.__docId} product={{...p, id: p.__docId}} />)}
            </div>
          )}
        </div>
      </section>

      {/* 4. Combo Offers */}
      <section className="py-16 bg-white border-t border-slate-50">
        <div className="container mx-auto px-6">
          <h2 className={HEADING_STYLE}>Combo Offers</h2>
          <Carousel setApi={setComboApi} className="w-full" opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ml-4">
              {comboOfferData.map((combo, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2">
                  <Link href={`/products/${combo.productId}`} className="block group text-center">
                    <div className="relative aspect-[936/537] rounded-2xl overflow-hidden shadow-sm border border-slate-50 bg-white">
                      <Image src={combo.imageUrl} alt={combo.title} fill className="object-contain group-hover:scale-105 transition-transform" sizes="(max-width: 768px) 100vw, 50vw" />
                    </div>
                    <h3 className="font-bold bg-primary text-white mt-4 p-3 rounded-xl shadow-md uppercase">{combo.title}</h3>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center items-center gap-2 mt-8">
              {comboOfferData.map((_, index) => (
                <button key={index} onClick={() => comboApi?.scrollTo(index)} className={cn("h-2 w-2 rounded-full bg-primary/20", comboCurrent === index ? "w-4 bg-primary" : "")} />
              ))}
            </div>
          </Carousel>
        </div>
      </section>

      {/* 5. Our Story */}
      <section className="py-24 bg-white border-t border-slate-50">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square max-w-md mx-auto w-full">
              <video src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Homepage%2FOur%20Story%20(1).mp4?alt=media&token=3a3b70f4-9dcf-462f-b5ce-4844d7a30111" autoPlay loop muted playsInline className="object-cover w-full h-full rounded-3xl shadow-2xl" />
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <ScrollText className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold font-headline text-primary uppercase tracking-tight">Our Story</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">For over 25 years, Shreevarma has been dedicated to reviving ancient Ayurvedic wisdom for modern wellness. We believe in holistic healing through passion and purity.</p>
              <Button variant="outline" asChild size="lg" className="rounded-full px-10 border-primary text-primary hover:bg-primary/5 transition-colors">
                <Link href="/about">Read More <ArrowRight className="ml-2"/></Link>
              </Button>
            </div>
          </div>
      </section>

      {/* 6. Quality & Trust */}
      <section className="py-16 bg-white border-t border-slate-50">
        <div className="container mx-auto px-6">
          <h2 className={HEADING_STYLE}>Quality & Trust</h2>
          <div className="flex justify-center">
            <div className="relative w-full max-w-4xl aspect-[3750/710] min-h-[80px]">
              <Image src={getImageUrl('site_assets/homepage/cert_gmp.png')} alt="Trust Banner" fill className="object-contain" sizes="100vw" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Spotlight & Awards */}
      <section className="py-24 bg-white border-t border-slate-50">
        <div className="container mx-auto px-6">
          <h2 className={HEADING_STYLE}>In The Spotlight</h2>
          <Carousel opts={{ loop: true, align: "start" }} plugins={[Autoplay({ delay: 6000 })]} className="w-full max-w-5xl mx-auto">
            <CarouselContent className="-ml-4">
              {magazineImages.map((media, index) => (
                <CarouselItem key={index} className="sm:basis-1/2 md:basis-1/3 pl-4">
                  <div className="aspect-[3/4] relative rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <Image src={media.imageUrl} alt={media.title} fill className="object-contain p-4" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="flex justify-center mt-16">
            <div className="relative w-full max-w-4xl aspect-[3750/710] min-h-[100px]">
              <Image src={getImageUrl('site_assets/homepage/trendsetters_award.webp')} alt="Award" fill className="object-contain rounded-2xl shadow-sm" sizes="100vw" />
            </div>
          </div>
        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section className="py-24 bg-white border-t border-slate-50">
        <div className="container mx-auto px-6">
          <h2 className={HEADING_STYLE}>Words of Wellness</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { name: 'Priya S.', text: "I've been a regular customer. The products are authentic and results are visible." },
              { name: 'Rohan M.', text: "Genuine Ayurvedic products. The doctor consultation was a game changer." },
              { name: 'Anjali K.', text: "Exceptional care and pure ingredients. My wellness journey started here." },
            ].map((t, i) => (
              <Card key={i} className="p-10 border-none bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 border-t-4 border-t-primary">
                <CardContent className="p-0">
                  <div className="flex text-yellow-500 mb-6">
                    {[...Array(5)].map((_, star) => <Star key={star} className="w-5 h-5 fill-current" />)}
                  </div>
                  <p className="text-lg italic text-muted-foreground mb-6 leading-relaxed">"{t.text}"</p>
                  <p className="font-bold text-primary tracking-widest uppercase text-sm">— {t.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}