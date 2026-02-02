'use client';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/product-card';
import PlaceholderImages from '@/lib/placeholder-images.json';
import { ArrowRight, PlayCircle, Star, Heart, Leaf, Shield, UserCheck, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SpecialistsCarousel } from '@/components/home/specialists-carousel';
import { useCollection, useFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { Product } from '@/lib/placeholder-data';
import { useMemo, useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { healthConditionsData } from '../diseases/health-conditions-data';

const services = [
  { name: 'Online Consultation', subheading: 'Instant video calls with certified doctors', imageId: 'service-1' },
  { name: 'Clinic Visit', subheading: 'Meet our doctors in trusted healthcare centers', imageId: 'service-2' },
  { name: 'Specialist Doctors', subheading: 'Qualified experts in multiple fields', imageId: 'service-3' },
  { name: 'Buy Products', subheading: 'Quality ayurvedic products, delivered with care', imageId: 'service-4' },
  { name: 'Therapy', subheading: '"Ayurvedic care, personalized"', imageId: 'service-5' },
];

export default function OrganisationPage() {
  const whyChooseImage = "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/organisationpaeg%2Fwhy%20choose%20us%20disease%20page.webp?alt=media&token=6051e26c-ec1b-4817-95f8-c98c3181cc69";
  const videoThumbnail = "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/organisationpaeg%2FShreevarma%20Sir%20image%20landscape.webp?alt=media&token=ce60fa48-80ba-481c-b36f-d4f9ebdda245";
  const discoveryImage1 = 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/organisationpaeg%2Forganisation%20page-.webp?alt=media&token=44f21963-e146-4a8b-ad66-4622a1b43dff';

  const { firestore } = useFirebase();
  const productsQuery = useMemo(
    () => (firestore ? query(collection(firestore, 'products'), orderBy('name'), limit(8)) : null),
    [firestore]
  );
  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  
  const allHealthConditions = healthConditionsData.map(condition => {
    const img = PlaceholderImages.placeholderImages.find(p => p.id === `health-${condition.id}`);
    return { ...condition, imageUrl: img?.imageUrl || '' };
  });

  return (
    <div className="flex flex-col bg-[#F9F5F1]">
       {/* HERO BANNER - Final Fix for Position Error */}
       <section className="w-full">
            <div className="relative w-full aspect-[4/5] md:aspect-[1400/368] overflow-hidden">
                {/* Mobile Image: Hidden on Desktop */}
                <div className="block md:hidden relative w-full h-full">
                  <Image
                      src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/organisationpaeg%2FOrganisation%20Mobile%20.webp?alt=media&token=555924e8-7d64-4d93-a7a4-9d2e85a037de"
                      alt="Organisation Mobile Banner"
                      fill
                      className="object-cover"
                      priority
                      loading="eager"
                      fetchPriority="high"
                  />
                </div>

                {/* Desktop Image: Hidden on Mobile */}
                <div className="hidden md:block relative w-full h-full">
                  <Image
                      src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/organisationpaeg%2Foraganisation%20desktop%20hero.webp?alt=media&token=d6e471ce-e107-42cc-a554-417ddbbc36be"
                      alt="Organisation Desktop Banner"
                      fill
                      className="object-cover"
                      priority
                      loading="eager"
                      fetchPriority="high"
                      quality={90}
                  />
                </div>
            </div>
        </section>

      {/* KEY SERVICES - EAGER LOAD */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-headline text-primary">Our Key Services</h2>
            <div className="w-20 h-1 bg-primary/20 mx-auto mt-4"></div>
          </div>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20">
            {services.map((service, index) => {
              const imgData = PlaceholderImages.placeholderImages.find((img) => img.id === service.imageId);
              return (
              <div key={service.name} className="flex flex-col items-center text-center w-40 md:w-52 group">
                  <div className="relative w-24 md:w-32 aspect-square mb-6">
                    {imgData && (
                        <Image 
                            src={imgData.imageUrl} 
                            alt={service.name} 
                            fill 
                            className="object-contain group-hover:scale-110 transition-transform duration-300" 
                            sizes="128px" 
                            loading="eager" // Load early as these are near the top
                        />
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-primary">{index + 1}. {service.name}</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{service.subheading}</p>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-white/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative w-full aspect-square max-w-md mx-auto">
                <Image src={whyChooseImage} alt="Ayurveda Care" fill className="object-contain" sizes="500px" loading="eager" />
            </div>
            <div className="space-y-8">
                <h2 className="text-4xl font-bold font-headline text-primary">Why Choose Us?</h2>
                <ul className="space-y-6">
                    {[
                        { icon: UserCheck, text: "Personalized care addressing the root cause." },
                        { icon: Heart, text: "Focus on holistic mind-body well-being." },
                        { icon: Leaf, text: "100% Authentic Ayurvedic approach." },
                        { icon: Shield, text: "25+ Years of trusted clinical excellence." }
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-4">
                            <div className="bg-primary/10 p-2 rounded-lg"><item.icon className="w-6 h-6 text-primary"/></div>
                            <span className="text-lg text-muted-foreground leading-snug">{item.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AYURVEDIC CARE - Corrected Buttons (Brown #6f3a2f with White Text) */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold font-headline mb-4 text-primary">Ayurvedic Care for Your Health</h2>
          <p className="text-lg text-muted-foreground mb-16">Wide range of treatments for your health problems</p>
          <Carousel opts={{ align: 'start', loop: true }} plugins={[plugin.current]} className="w-full">
            <CarouselContent className="-ml-4">
              {allHealthConditions.map((condition) => (
                <CarouselItem key={condition.id} className="basis-1/2 md:basis-1/4 lg:basis-1/5 pl-4">
                  <div className="text-center group">
                      <Link href={`/diseases/${condition.slug}`} className="block relative aspect-square rounded-2xl overflow-hidden mb-4 bg-white">
                          <Image
                            src={condition.imageUrl}
                            alt={condition.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="250px"
                          />
                      </Link>
                    <Button asChild className="w-full bg-[#6f3a2f] hover:bg-[#5a2e25] text-white rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all shadow-md">
                        <Link href={`/diseases/${condition.slug}`}>{condition.name}</Link>
                    </Button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="py-24 bg-white/50">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold font-headline mb-12 text-primary">Guide to Wisdom Living</h2>
            <div className="relative aspect-video max-w-4xl mx-auto rounded-[2rem] overflow-hidden group shadow-2xl">
                <Image src={videoThumbnail} alt="Wisdom Guide" fill className="object-cover" sizes="1000px" />
                <div className="absolute inset-0 flex items-center justify-center bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    <PlayCircle className="w-24 h-24 text-white drop-shadow-lg opacity-90 group-hover:scale-110 transition-transform" />
                </div>
            </div>
        </div>
      </section>

      {/* DISCOVERY SECTION */}
      <section className="py-24">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
              <div>
                  <h2 className="text-4xl font-bold font-headline mb-6 text-primary leading-tight">Discover the Healing Power of Ayurveda</h2>
                  <p className="text-lg text-muted-foreground mb-8">Tailored treatment plans from our global experts</p>
                  <ul className="space-y-4">
                      {["Authentic ayurvedic oils and herbs.", "Ideal therapies based on your constitution.", "Frequency varies per patient condition."].map((li, i) => (
                          <li key={i} className="flex items-center gap-3 text-muted-foreground italic font-medium">
                              <Leaf className="w-4 h-4 text-primary/40" /> {li}
                          </li>
                      ))}
                  </ul>
                  <Button asChild className="mt-10 rounded-full px-8 bg-[#6f3a2f] hover:bg-[#5a2e25] text-white shadow-xl">
                      <Link href="/consultation">Explore Our Therapies <ArrowRight className="ml-2"/></Link>
                  </Button>
              </div>
              <div className="relative aspect-square rounded-[3rem] overflow-hidden">
                  <Image src={discoveryImage1} alt="Ayurveda therapy" fill className="object-cover" sizes="600px" />
              </div>
          </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold font-headline text-primary mb-16">Our Trusted Products</h2>
           {isLoadingProducts ? (
             <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" /></div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {products?.map((product) => (
                <ProductCard key={product.__docId} product={{...product, id: product.__docId}} />
                ))}
            </div>
          )}
          <Button asChild variant="outline" className="mt-16 rounded-full px-10 border-primary text-primary">
            <Link href="/products">View All Products <ArrowRight className="ml-2"/></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}