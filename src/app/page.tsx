
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
import { categories } from '@/components/products/category-data';


const heroSlides = [
    {
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Homepage%2FBanner%201%20Desktop.webp?alt=media&token=d4ecaad0-ea23-4788-b395-6a29b3f3b75c`,
        mobileImageUrl: `https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Homepage%2FBanner%201%20Mobile.webp?alt=media&token=41755d6d-4149-4146-a72d-59c49861d4a2`,
        title: 'Shreevarma Product Banner 1',
        imageHint: 'ayurvedic products banner'
    },
    {
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Homepage%2FBanner%202%20desktop.webp?alt=media&token=13d2251b-6ae1-40eb-bc81-7e6f02e372b3`,
        mobileImageUrl: `https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Homepage%2FBanner%202%20Mobile.webp?alt=media&token=9caa98c9-28ee-459e-a6eb-2456b628ff4c`,
        title: 'Shreevarma Product Banner 2',
        imageHint: 'ayurvedic products offer'
    },
    {
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Homepage%2FBanner%203%20desktop.webp?alt=media&token=f76c8feb-8743-453d-9cd7-9913200f01dd`,
        mobileImageUrl: `https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Homepage%2FBanner%203%20mobile.webp?alt=media&token=6c31b5a8-ad8f-4b84-82a3-debb5598bdea`,
        title: 'Shreevarma Family Banner',
        imageHint: 'ayurvedic products family'
    }
];

const magazineImages = [
    { title: 'Spotlight 1', imageUrl: `https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Homepage%2FSpotlight-1.webp?alt=media&token=586ed6e3-743b-43ec-9958-4c0ef376869d`, imageHint: 'spotlight feature' },
    { title: 'Spotlight 2', imageUrl: `https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Homepage%2FSpotlight-2.webp?alt=media&token=73a8c242-c260-4470-a6e4-62081d671ff4`, imageHint: 'spotlight feature' },
    { title: 'Spotlight 3', imageUrl: `https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Homepage%2FSpotlight-3.webp?alt=media&token=de76f8c0-d3e9-448e-a9af-0b6b4bc7f53e`, imageHint: 'spotlight feature' },
    { title: 'Spotlight 4', imageUrl: `https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Homepage%2FSpotlight-4.webp?alt=media&token=f2c14626-0965-449d-b6da-d14b5e0c1939`, imageHint: 'spotlight feature' },
    { title: 'Spotlight 5', imageUrl: `https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Homepage%2FSpotlight-5.webp?alt=media&token=905b1a5a-9c04-404e-91c2-3b8a6b93f22b`, imageHint: 'spotlight feature' },
];
const staticMagazineImage = {
  imageUrl: `https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Homepage%2Ftrendetters_1.webp?alt=media&token=31534b6e-10f5-4237-add1-089f8e8aeb50`,
  title: 'Trendsetters Award 2024',
  imageHint: 'award ceremony'
};

const testimonials = [
  { name: 'Priya S.', text: "I've been a regular customer for their products. They are authentic and effective. The online consultation was also very helpful.", rating: 5 },
  { name: 'Rohan M.', text: "Excellent service and genuine products. The doctors are very knowledgeable and patient. Highly recommended!", rating: 5 },
  { name: 'Anjali K.', text: "The personalized care I received was exceptional. My health has significantly improved after following their advice.", rating: 5 },
];

const comboOfferData = [
    {
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Homepage%2Fmaharaja-combo.webp?alt=media&token=25aa7d60-6064-477c-bd62-e012df0a86e5",
        title: "Maharaja Combo",
        productId: "3aYsjAtOGxqHNfqJwEJt",
        imageHint: "maharaja combo products"
    },
    {
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Homepage%2Fvajee-care-combo.webp?alt=media&token=3888313d-491f-4751-8eca-13e560252b71",
        title: "Vajee Care Combo",
        productId: "XxatfDb9S0K0Vflzbfuz",
        imageHint: "vajee care products"
    },
    {
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Homepage%2Fshreecare-combo.webp?alt=media&token=61c2a630-488d-4c5b-b0cb-d77e420d3bba",
        title: "Shree Care Combo",
        productId: "MbfO8VokStMkBF7uV6hk",
        imageHint: "shree care products"
    },
    {
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Homepage%2Forthocure-combo.webp?alt=media&token=c2af35ce-4059-4eb0-a89b-2462edf6c8bc",
        title: "Orthocure Combo",
        productId: "lGlrvuhCenADiXtbrGjp",
        imageHint: "orthocure combo products"
    },
    {
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Homepage%2Fhair-care-combo.webp?alt=media&token=de4ae486-fb3f-47af-98d7-3937ecf8feea",
        title: "Hair Care Combo",
        productId: "ASGIty0IjZV0GoQAHDgu",
        imageHint: "hair care products"
    }
];

// Function to shuffle an array
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


export default function HomePage() {
  const plugin = React.useRef(
      Autoplay({ delay: 8000, stopOnInteraction: true })
  );
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  
  const [comboApi, setComboApi] = React.useState<CarouselApi>()
  const [comboCurrent, setComboCurrent] = React.useState(0)
  const [comboCount, setComboCount] = React.useState(0)
  
  const { firestore } = useFirebase();

  const productsQuery = useMemo(
    () => (firestore ? query(collection(firestore, 'products'), where('category', '==', 'Health')) : null),
    [firestore]
  );
  const { data: allFeaturedProducts, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);

  const featuredProducts = useMemo(() => {
    if (!allFeaturedProducts) return [];
    // Shuffle the array and take the first 4
    return shuffleArray([...allFeaturedProducts]).slice(0, 4);
  }, [allFeaturedProducts]);
  

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    const handleSelect = (api: CarouselApi) => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);
  
  React.useEffect(() => {
    if (!comboApi) {
      return
    }
 
    setComboCount(comboApi.scrollSnapList().length)
    setComboCurrent(comboApi.selectedScrollSnap())
 
    comboApi.on("select", () => {
      setComboCurrent(comboApi.selectedScrollSnap())
    })
  }, [comboApi])

  return (
    <div className="flex flex-col bg-[#FCFBF9]">
      {/* Hero Section */}
      <section className="w-full bg-transparent mt-0">
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          className="w-full relative"
          opts={{
            align: "start",
            loop: true,
          }}
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
                        data-ai-hint={slide.imageHint}
                        priority={index === 0}
                    />
                    <Image
                        src={slide.imageUrl}
                        alt={slide.title}
                        fill
                        className="object-cover hidden md:block"
                        data-ai-hint={slide.imageHint}
                        priority={index === 0}
                    />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "h-2 w-2 rounded-full bg-primary/50 transition-all",
                  current === index ? "w-4 bg-primary" : "hover:bg-primary/75"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
      </section>
      
      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold font-headline text-center text-primary mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={category.name} className="p-1">
                <Link href={`/${category.slug}`} className="block group text-center">
                  <div className="relative overflow-hidden rounded-lg aspect-[694/869]">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      data-ai-hint={category.imageHint}
                      priority={index < 3}
                    />
                  </div>
                  <h3 className="font-semibold font-headline bg-primary text-primary-foreground mt-4 p-2 rounded-md">{category.name}</h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Featured Products</h2>
            <p className="text-lg text-muted-foreground mt-2">Handpicked for your wellness journey</p>
          </div>
          {isLoadingProducts ? (
             <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {featuredProducts?.map((product) => (
              <ProductCard key={product.__docId} product={{...product, id: product.__docId}} />
            ))}
          </div>
          )}
        </div>
      </section>
      
      {/* Combo Offers Section */}
        <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold font-headline text-primary">Combo Offers</h2>
                    <p className="text-lg text-muted-foreground mt-2">Great savings on our popular product combinations</p>
                </div>
                <Carousel setApi={setComboApi} className="w-full" opts={{ align: "start", loop: true }}>
                    <CarouselContent className="-ml-4">
                        {comboOfferData.map((combo, index) => (
                            <CarouselItem key={index} className="pl-4 md:basis-1/2">
                                <Link href={`/products/${combo.productId}`} className="block group">
                                    <div className="p-1">
                                        <div className="overflow-hidden">
                                            <div className="relative aspect-[936/537] overflow-hidden rounded-lg">
                                                <Image
                                                    src={combo.imageUrl}
                                                    alt={combo.title}
                                                    fill
                                                    className="object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    data-ai-hint={combo.imageHint}
                                                    priority={index < 2}
                                                />
                                            </div>
                                            <h3 className="font-semibold font-headline bg-primary text-primary-foreground mt-4 p-2 rounded-md text-center">{combo.title}</h3>
                                        </div>
                                    </div>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <div className="flex justify-center gap-2 mt-4">
                    {Array.from({ length: comboCount }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => comboApi?.scrollTo(index)}
                            className={cn(
                                "h-2 w-2 rounded-full bg-primary/20 transition-all",
                                comboCurrent === index ? "w-4 bg-primary" : "hover:bg-primary/50"
                            )}
                            aria-label={`Go to combo slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square max-w-md mx-auto w-full">
              <video 
                src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Homepage%2FOur%20Story%20(1).mp4?alt=media&token=3a3b70f4-9dcf-462f-b5ce-4844d7a30111"
                autoPlay
                loop
                muted
                playsInline
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
            <div>
              <ScrollText className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-3xl font-bold font-headline text-primary mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-6">For over 25 years, Shreevarma has been dedicated to reviving ancient Ayurvedic wisdom for modern wellness. We believe in holistic healing, crafting each product with pure, ethically sourced ingredients to bring balance and vitality to your life. Our journey is one of passion, purity, and a deep respect for nature's healing power.</p>
              <Button variant="outline" asChild>
                <Link href="/about">Read More <ArrowRight className="ml-2"/></Link>
              </Button>
            </div>
          </div>
      </section>
      
      {/* Certification Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold font-headline text-primary mb-8">Committed to Quality &amp; Trust</h2>
          <div className="flex justify-center items-center">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Certificates.webp?alt=media&token=26fe07fe-04df-47dd-9503-7cc36637cce9"
              alt="Shreevarma Certifications"
              width={800}
              height={150}
              className="object-contain"
              data-ai-hint="certifications banner"
              loading="lazy"
            />
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
