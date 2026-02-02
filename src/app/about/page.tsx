'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  PlayCircle, Phone, MapPin, Stethoscope, 
  User, Droplets, Leaf, ChevronRight 
} from 'lucide-react';

// Data Arrays for Sections
const philosophyPoints = [
    { icon: Leaf, text: 'Authentic Ayurveda Treatments', description: 'Rooted in centuries-old practices' },
    { icon: Stethoscope, text: 'Expert Guidance', description: 'Personalized care by Dr. Shreevarma' },
    { icon: User, text: 'Patient-Centered Care', description: 'Comfort, support, and focus on your well-being' },
    { icon: Droplets, text: 'Holistic Healing', description: 'Treating mind, body, and spirit together' }
];

const whyChooseReasons = [
  { text: 'Authentic Ayurveda Care', description: 'Based on traditional wisdom and clinical expertise' },
  { text: 'Personalized Treatment Plans', description: 'Designed for your unique health needs' },
  { text: 'Experienced Practitioners', description: 'Compassionate guidance from certified experts' },
  { text: 'Holistic Wellness', description: 'Focus on body, mind, and spiritual balance' },
];

export default function AboutUsPage() {
    // Image Assets
    const heroImage = { url: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/aboutpage%2FAbout%20us%20hero.webp?alt=media&token=1b4f7724-0960-4a80-b122-0bc80144c829", alt: 'Shreevarma Hero' };
    const aboutImage1 = { url: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/aboutpage%2FAbout%20us%20page%20image.webp?alt=media&token=601c6870-cc3c-4973-b5c9-d565b159f928", alt: 'Ayurvedic Ingredients' };
    const drShreevarmaImage = { url: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/aboutpage%2FAbout%20us%20shreevarma.webp?alt=media&token=3f504a76-790a-494f-9303-5a9182cfb8e8", alt: 'Dr. Shreevarma' };
    const whyChooseImage = { url: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/aboutpage%2FWhy%20Choose%20Us.webp?alt=media&token=a4e39fc6-b144-493e-a1de-f018e735299c", alt: 'Quality Care' };
    const ctaImage = { url: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/aboutpage%2FJournery%20Today.webp?alt=media&token=b00bc6e0-8b6b-483d-97c3-66d56e22f3bf", alt: 'Ayurvedic Therapy' };
    const philosophyImage = { url: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/aboutpage%2FOur%20Philoshopy.webp?alt=media&token=c1f6979d-f551-4347-bfcc-1868f80eac76", alt: 'Philosophy' };

    const Heading = ({ children }: { children: React.ReactNode }) => (
        <div className="mb-6">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary leading-tight">{children}</h2>
            <div className="w-20 h-1 bg-[#72392F] mt-3"></div>
        </div>
    );

    return (
        <div className="bg-[#F9F5F1] min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-12 md:pt-16 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative w-full max-w-lg mx-auto aspect-square order-2 md:order-1">
                           <Image 
                                src={heroImage.url} 
                                alt={heroImage.alt}
                                width={600} 
                                height={600} 
                                className="object-contain"
                                priority
                                fetchPriority="high"
                                quality={90}
                            />
                        </div>
                         <div className="text-center md:text-left order-1 md:order-2">
                            <h1 className="text-4xl md:text-6xl font-bold font-headline text-primary mb-6 leading-[1.1]">Your Journey to Holistic Wellness Begins Here</h1>
                            <p className="text-lg text-muted-foreground mb-8 italic leading-relaxed">
                                Welcome to Shreevarma Wellness Clinic—A place where health, harmony, and holistic healing come together.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <Button size="lg" variant="outline" className="rounded-full px-8 border-primary/20 hover:bg-white transition-all"><PlayCircle className="mr-2 h-5 w-5"/> Play video</Button>
                                <Button size="lg" asChild className="rounded-full px-8 shadow-md bg-[#72392F] hover:bg-[#5f2f27] text-white"><Link href="/consultation">Book appointment</Link></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section className="py-24">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <Heading>About us</Heading>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            "At Shreevarma's Wellness, we are dedicated to helping you achieve complete wellness. We combine the wisdom of traditional Ayurveda with modern healthcare insights to create personalized treatment plans."
                        </p>
                    </div>
                     <div className="relative aspect-[4/3] order-1 md:order-2 flex justify-center">
                        <Image 
                            src={aboutImage1.url} 
                            alt={aboutImage1.alt} 
                            width={550} 
                            height={412} 
                            className="object-contain" 
                            loading="eager" 
                        />
                    </div>
                </div>
            </section>

            {/* Our Philosophy Section */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div className="relative aspect-square flex justify-center">
                            <Image src={philosophyImage.url} alt={philosophyImage.alt} width={500} height={500} className="object-contain" />
                        </div>
                        <div className="space-y-12">
                            <Heading>Our Philosophy</Heading>
                            <div className="grid gap-10">
                                {philosophyPoints.map((point, index) => {
                                    const Icon = point.icon;
                                    return (
                                    <div key={index} className="flex items-start gap-6 group">
                                        <div className="bg-primary/5 text-primary rounded-2xl w-14 h-14 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                            <Icon className="w-7 h-7"/>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-foreground mb-1">{point.text}</h3>
                                            <p className="text-muted-foreground leading-relaxed">{point.description}</p>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Meet Dr. Shreevarma Section */}
            <section className="py-24">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <Heading>Meet Dr. Shreevarma</Heading>
                        <p className="text-xl font-medium text-primary mb-6 italic">Your trusted guide to holistic health.</p>
                        <p className="text-muted-foreground leading-relaxed text-lg italic">
                            Dr. Shreevarma is a passionate Ayurveda practitioner with years of experience in helping patients achieve lasting wellness. His philosophy combines knowledge and personalized attention.
                        </p>
                    </div>
                     <div className="relative aspect-square order-1 md:order-2 flex justify-center">
                        <Image src={drShreevarmaImage.url} alt={drShreevarmaImage.alt} width={500} height={500} className="object-contain" />
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-0 overflow-hidden rounded-[2.5rem] shadow-xl">
                        <div className="relative h-[450px] md:h-full min-h-[400px]">
                             <Image 
                                src={whyChooseImage.url} 
                                alt={whyChooseImage.alt} 
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="bg-[#72392F] text-white p-12 md:p-20 flex flex-col justify-center h-full">
                            <Heading><span className="text-white">Why choose us</span></Heading>
                            <div className="space-y-10 mt-6">
                               {whyChooseReasons.map((reason, index) => (
                                <div key={index} className="border-l border-white/20 pl-8 transition-all hover:border-white">
                                    <h3 className="font-bold text-2xl mb-2">{reason.text}</h3>
                                    <p className="text-white/70 text-base leading-relaxed">{reason.description}</p>
                                </div>
                               ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* CTA Section */}
            <section className="py-32">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative aspect-video flex justify-center">
                            <Image src={ctaImage.url} alt={ctaImage.alt} width={550} height={310} className="object-contain" />
                        </div>
                        <div className='text-center md:text-left'>
                            <h2 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-6 leading-tight">Start Your Ayurvedic Journey Today</h2>
                            <p className="text-lg text-muted-foreground mb-12 leading-relaxed italic">
                                Talk to our certified and experienced doctors regarding your health issues. Get the best solutions and personalized therapies.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Button variant="outline" size="lg" asChild className="rounded-full px-10 border-primary text-primary hover:bg-primary/5 h-14">
                                    <Link href="/clinics"><MapPin className="mr-2 h-5 w-5"/> Find Clinic</Link>
                                </Button>
                                <Button size="lg" asChild className="rounded-full px-10 bg-[#72392F] hover:bg-[#5f2f27] text-white shadow-lg h-14">
                                    <Link href="/consultation"><Phone className="mr-2 h-5 w-5"/> Book Consultation</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}