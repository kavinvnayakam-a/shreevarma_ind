
'use client';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/product-card';
import PlaceholderImages from '@/lib/placeholder-images.json';
import { ArrowRight, PlayCircle, Star, Heart, Leaf, Shield, UserCheck, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Counter } from '@/components/home/counter';
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
  { name: 'Online Consultation', subheading: 'Instant video calls with certified doctors', imageId: 'service-1', hint: 'online consultation' },
  { name: 'Clinic Visit', subheading: 'Meet our doctors in trusted healthcare centers', imageId: 'service-2', hint: 'clinic consultation' },
  { name: 'Specialist Doctors', subheading: 'Qualified experts in multiple fields', imageId: 'service-3', hint: 'medicine delivery' },
  { name: 'Buy Products', subheading: 'Quality ayurvedic products, delivered with care', imageId: 'service-4', hint: 'ayurveda therapy' },
  { name: 'Therapy', subheading: '"Ayurvedic care, personalized"', imageId: 'service-5', hint: 'wellness products' },
];

const testimonials = [
  { name: 'Priya S.', text: "I've been a regular customer for their products. They are authentic and effective. The online consultation was also very helpful.", imageId: 'testimonial-1', hint: 'woman portrait' },
  { name: 'Rohan M.', text: "Excellent service and genuine products. The doctors are very knowledgeable and patient. Highly recommended!", imageId: 'testimonial-2', hint: 'man portrait' },
  { name: 'Anjali K.', text: "The personalized care I received was exceptional. My health has significantly improved after following their advice.", imageId: 'testimonial-3', hint: 'woman smiling' },
];

const GoogleLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.35 11.1H12.18v2.8h5.13c-.22 1.84-1.6 3.1-3.43 3.1-2.05 0-3.72-1.67-3.72-3.72s1.67-3.72 3.72-3.72c1.1 0 2.05.47 2.65 1.03l2.2-2.2C16.02 6.03 14.21 5 12.18 5c-3.87 0-7 3.13-7 7s3.13 7 7 7c4.08 0 6.7-2.84 6.7-6.82 0-.45-.05-.88-.13-1.28z"/></svg>
)

export default function OrganisationPage() {
  const whyChooseImage = { imageUrl: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/organisationpaeg%2Fwhy%20choose%20us%20disease%20page.webp?alt=media&token=6051e26c-ec1b-4817-95f8-c98c3181cc69", imageHint: "ayurvedic elements" };
  const videoThumbnail = { imageUrl: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/organisationpaeg%2FShreevarma%20Sir%20image%20landscape.webp?alt=media&token=ce60fa48-80ba-481c-b36f-d4f9ebdda245", imageHint: "man portrait" };
  const discoveryImage1 = { imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/organisationpaeg%2Forganisation%20page-.webp?alt=media&token=44f21963-e146-4a8b-ad66-4622a1b43dff', imageHint: 'ayurveda therapy' };

  const { firestore } = useFirebase();
  const productsQuery = useMemo(
    () => (firestore ? query(collection(firestore, 'products'), orderBy('name'), limit(8)) : null),
    [firestore]
  );
  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  
  const allHealthConditions = healthConditionsData.map(condition => {
    const img = PlaceholderImages.placeholderImages.find(p => p.id === `health-${condition.id}`);
    return {
        ...condition,
        imageUrl: img?.imageUrl || '',
        imageHint: img?.imageHint || '',
    };
  });

  return (
    <div className="flex flex-col bg-[#F9F5F1]">
       <section>
          <div className="relative w-full aspect-square md:aspect-[1400/368]">
            <picture>
              <source media="(max-width: 767px)" srcSet={'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/organisationpaeg%2FOrganisation%20Mobile%20.webp?alt=media&token=555924e8-7d64-4d93-a7a4-9d2e85a037de'} />
              <source media="(min-width: 768px)" srcSet={'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/organisationpaeg%2Foraganisation%20desktop%20hero.webp?alt=media&token=d6e471ce-e107-42cc-a554-417ddbbc36be'} />
              <Image
                  src={'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/organisationpaeg%2Foraganisation%20desktop%20hero.webp?alt=media&token=d6e471ce-e107-42cc-a554-417ddbbc36be'}
                  alt="Site-wide offer banner"
                  fill
                  className="object-cover"
                  data-ai-hint="offer banner"
                  priority
              />
            </picture>
          </div>
        </section>

      {/* Our Key Services Section */}
      <section className="py-16 bg-[#f9f5ee] relative overflow-hidden">
        <Image src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/ShreeVarma%2FFlower.png?alt=media&token=2f81a749-82c7-43a2-910b-d84d98f025c8" alt="Flower decoration" width={150} height={150} className="absolute top-0 left-0 opacity-50" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Our Key Services</h2>
            <p className="text-lg text-muted-foreground mt-2">Choose the care that suits your needs – online or at our clinics.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-8 md:gap-x-12">
            {services.map((service, index) => {
              const serviceImage = PlaceholderImages.placeholderImages.find((img) => img.id === service.imageId);
              return (
              <div key={service.name} className="flex flex-col items-center text-center w-36 md:w-48">
                  <div className="relative aspect-square w-24 md:w-28 mb-2">
                    {serviceImage && <Image src={serviceImage.imageUrl} alt={service.name} width={112} height={112} className="object-contain w-full h-auto" data-ai-hint={serviceImage.hint} />}
                  </div>
                  <h3 className="font-semibold text-base md:text-lg">{index + 1}. {service.name}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 px-1">{service.subheading}</p>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Why Choose Dr. Shreevarma's wellness?</h2>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">Trusted healthcare built on experience, expertise, and patient satisfaction</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative w-full aspect-square max-w-sm mx-auto">
                {whyChooseImage && <Image src={whyChooseImage.imageUrl} alt="Why Choose Us" width={384} height={384} className="object-contain w-full h-auto" data-ai-hint={whyChooseImage.imageHint}/>}
            </div>
            <div>
                <ul className="space-y-4 text-lg">
                    <li className="flex items-start gap-4"><UserCheck className="w-6 h-6 text-accent shrink-0 mt-1"/><span>Personalized care that addresses the root cause of your health issues.</span></li>
                    <li className="flex items-start gap-4"><Heart className="w-6 h-6 text-accent shrink-0 mt-1"/><span>From consultation to treatment, our focus is on your holistic well-being.</span></li>
                    <li className="flex items-start gap-4"><Leaf className="w-6 h-6 text-accent shrink-0 mt-1"/><span>100% Ayurvedic approach for a natural and sustainable healing experience.</span></li>
                    <li className="flex items-start gap-4"><Shield className="w-6 h-6 text-accent shrink-0 mt-1"/><span>A venture with a rich legacy of trust and service for over 25 years.</span></li>
                </ul>
            </div>
        </div>
        <div className="mt-16 grid grid-cols-2 gap-y-8 md:flex md:justify-around items-center text-center bg-white py-8 md:py-6 rounded-lg shadow-md">
            <div className="px-4"><p className="text-3xl font-bold text-primary"><Counter target={25} suffix="+" /></p><p className="text-muted-foreground text-sm">Years of Excellence</p></div>
            <div className="md:border-l md:border-gray-300 h-12 hidden md:block"></div>
            <div className="px-4"><p className="text-3xl font-bold text-primary"><Counter target={100} suffix="+" /></p><p className="text-muted-foreground text-sm">Professional Doctors</p></div>
            <div className="md:border-l md:border-gray-300 h-12 hidden md:block"></div>
            <div className="px-4"><p className="text-3xl font-bold text-primary"><Counter target={5} suffix="L+" /></p><p className="text-muted-foreground text-sm">Happy Patients</p></div>
             <div className="md:border-l md:border-gray-300 h-12 hidden md:block"></div>
            <div className="px-4"><p className="text-3xl font-bold text-primary"><Counter target={100} suffix="%" /></p><p className="text-muted-foreground text-sm">Trusted Care</p></div>
        </div>
        </div>
      </section>

      {/* Ayurvedic Care Section */}
      <section className="py-16 text-center bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold font-headline mb-2 text-primary">Ayurvedic Care for Your Health</h2>
          <p className="text-lg text-muted-foreground mb-12">We are having a wide range of Ayurvedic treatments for your health problems</p>
          <Carousel
            opts={{ align: 'start', loop: true }}
            plugins={[plugin.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {allHealthConditions.map((condition) => (
                <CarouselItem key={condition.id} className="basis-1/2 md:basis-1/4 lg:basis-1/5 pl-4">
                  <div className="text-center group">
                    <Card className="overflow-hidden rounded-lg shadow-sm group-hover:shadow-lg transition-shadow">
                      <Link href={`/diseases/${condition.slug}`} className="block">
                        <div className="relative aspect-[1112/888]">
                          <Image
                            src={condition.imageUrl}
                            alt={condition.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            data-ai-hint={condition.imageHint}
                            sizes="(max-width: 768px) 50vw, 20vw"
                            loading="lazy"
                          />
                        </div>
                      </Link>
                    </Card>
                    <Button asChild className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
                      <Link href={`/diseases/${condition.slug}`}>{condition.name}</Link>
                    </Button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
          <div className="mt-12">
            <Button asChild variant="outline">
                <Link href="/diseases">Explore All Health Conditions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Guide to Wisdom Living Section */}
      <section className="py-16 bg-[#F9F5F1] text-center">
        <h2 className="text-3xl font-bold font-headline mb-2 text-primary">Shreevarma's Guide to Wisdom Living</h2>
        <p className="text-lg text-muted-foreground mb-8 px-4">Get access to all ayurvedic solutions under one roof</p>
        <div className="container mx-auto px-6">
            <div className="relative aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg group">
                {videoThumbnail && <Image src={videoThumbnail.imageUrl} alt="Wisdom Living Guide" fill className="object-cover" data-ai-hint={videoThumbnail.imageHint} />}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <PlayCircle className="w-20 h-20 text-white/80 group-hover:text-white transition-colors" />
                </div>
            </div>
        </div>
      </section>

      {/* Specialists Section */}
        <section className="py-16 bg-[#F9F5F1]">
            <div className="container mx-auto px-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="w-6 h-6 text-yellow-400 -ml-2" fill="currentColor"/>
                    <h2 className="text-3xl font-bold font-headline text-primary">Talk to Our Certified Ayurveda Specialists</h2>
                    <Star className="w-6 h-6 text-yellow-400 -mr-2" fill="currentColor"/>
                </div>
                <p className="text-lg text-muted-foreground mb-12">Easy access to experienced doctors for your health needs, online or at the clinic.</p>
                <SpecialistsCarousel showDots={true} />
                 <div className="text-center mt-12">
                    <Button asChild variant="outline">
                        <Link href="/consultation">View more <ArrowRight className="ml-2"/></Link>
                    </Button>
                </div>
            </div>
        </section>

      {/* Discovery Section */}
      <section className="py-16 bg-[#F9F5F1]">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
              <div>
                  <h2 className="text-3xl font-bold font-headline mb-6 text-primary">Discover the Healing Power of Ayurveda</h2>
                  <p className="text-lg text-muted-foreground mb-6">Explore authentic ayurveda, and get a tailored treatment plan from our experts</p>
                  <ul className="space-y-3 text-muted-foreground">
                      <li>- All therapies are performed with authentic ayurvedic oils and herbs.</li>
                      <li>- Our physicians will suggest the ideal therapies based on your health condition.</li>
                      <li>- The duration and frequency of the therapies vary as per the patient's condition.</li>
                  </ul>
                  <Button variant="link" className="px-0 mt-4 text-primary">Explore Our Therapies <ArrowRight className="ml-2"/></Button>
              </div>
              <div className="relative aspect-square rounded-lg overflow-hidden">
                  {discoveryImage1 && <Image src={discoveryImage1.imageUrl} alt="Ayurveda therapy" width={500} height={500} className="object-cover w-full h-auto" data-ai-hint={discoveryImage1.imageHint} />}
              </div>
          </div>
      </section>

      {/* Our Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Our Products</h2>
            <p className="text-lg text-muted-foreground mt-2">Explore our wide range of ayurvedic products</p>
          </div>
           {isLoadingProducts ? (
             <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products?.map((product) => (
              <ProductCard key={product.__docId} product={{...product, id: product.__docId}} />
            ))}
          </div>
          )}
          <div className="text-center mt-12">
            <Button asChild variant="outline">
                <Link href="/products">View More <ArrowRight className="ml-2"/></Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
