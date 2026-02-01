
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Heart, Shield, Leaf, Users } from 'lucide-react';
import { SubHeader } from '@/components/layout/sub-header';
import PlaceholderImages from '@/lib/placeholder-images.json';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const therapies = [
    { id: 't1', name: 'Podi kizhi', description: 'Effective in treating joint pain, inflammation, and stiffness by inducing therapeutic sweating.', imageId: 'therapy-1', imageHint: 'herbal pouch massage' },
    { id: 't2', name: 'Abhyangam', description: 'A full-body massage with warm herbal oils to nourish the body and calm the mind.', imageId: 'therapy-2', imageHint: 'oil massage therapy' },
    { id: 't3', name: 'Greeva Vasti', description: 'A specialized treatment for neck pain and stiffness using warm medicated oil.', imageId: 'therapy-3', imageHint: 'neck oil treatment' },
    { id: 't4', name: 'Kati Vasti', description: 'A lower back therapy with warm oil to relieve pain, sciatica, and lumbar issues.', imageId: 'therapy-4', imageHint: 'back oil treatment' },
    { id: 't5', name: 'Shiro Dhara', description: 'A continuous stream of warm oil on the forehead to reduce stress and anxiety.', imageId: 'therapy-5', imageHint: 'forehead oil therapy' },
    { id: 't6', name: 'Udwartana', description: 'An invigorating herbal powder massage to improve circulation and aid in weight loss.', imageId: 'therapy-6', imageHint: 'herbal powder massage' },
    { id: 't7', name: 'Pichu', description: 'Application of a cotton pad soaked in warm oil to treat localized pain and stiffness.', imageId: 'therapy-7', imageHint: 'oil soaked cotton' },
    { id: 't8', name: 'Nadi Sweda', description: 'A localized steam therapy to relieve pain and inflammation in specific body parts.', imageId: 'therapy-8', imageHint: 'steam therapy' },
    { id: 't9', name: 'Jaloukavacharanam', description: 'Leech therapy used for blood purification and treating skin and circulatory disorders.', imageId: 'therapy-9', imageHint: 'leech therapy' },
];

const featuredTherapies = [
    { id: 'f1', name: 'Hrid Vasti', imageId: 'therapy-4', imageHint: 'back oil treatment' },
    { id: 'f2', name: 'Takra Dhara', imageId: 'therapy-5', imageHint: 'forehead oil therapy' },
    { id: 'f3', name: 'Kizhi / Vasti / Udwartana', imageId: 'therapy-6', imageHint: 'herbal powder massage' },
];

const whyChooseReasons = [
  { icon: Leaf, text: '100% Ayurvedic oils & Herbs' },
  { icon: Users, text: 'Experienced Doctors & Therapists' },
  { icon: Heart, text: 'Personalised treatment plans' },
  { icon: Shield, text: 'Safe & natural healing' },
];

const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/`;
const urlSuffix = `?alt=media`;

const getImageUrl = (path: string) => `${baseUrl}${encodeURIComponent(path)}${urlSuffix}`;

export default function TherapyPage() {
    const heroImage = {
        imageUrl: getImageUrl("site_assets/therapy/hero.png"),
        description: "A woman receiving a Shirodhara Ayurvedic treatment.",
        imageHint: "shirodhara treatment"
    };
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTherapies = therapies.filter(therapy =>
        therapy.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col bg-[#F9F5F1]">

            {/* Hero Section */}
            <section className="relative pt-8 md:pt-6 bg-white">
                <div className="container mx-auto px-6">
                    
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="text-left relative">
                             <div className="relative">
                                <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4 font-headline text-foreground">
                                    "Explore Our Ayurvedic Therapies"
                                </h1>
                                <div className="w-48 h-1 bg-[#72392F] mb-4"></div>
                                <p className="text-lg text-muted-foreground mb-6 max-w-md">
                                    Traditional Treatments Designed To Heal, Relax And Rejuvenate Your Body And Mind
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Button asChild size="lg">
                                        <Link href="/products">Buy Products</Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline">
                                        <Link href="/consultation">Consult Doctor</Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline">
                                        <Link href="#">Find near by Clinic</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-80 md:h-96 w-full">
                            {heroImage && (
                                <Image
                                    src={heroImage.imageUrl}
                                    alt={heroImage.description || 'Ayurvedic Therapies'}
                                    fill
                                    className="object-contain"
                                    priority
                                    data-ai-hint={heroImage.imageHint}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

             {/* Therapies List Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex justify-center mb-12">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search by therapy"
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTherapies.map((therapy) => {
                            const therapyImage = PlaceholderImages.placeholderImages.find(p => p.id === therapy.imageId);
                            return (
                                <Card key={therapy.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-xl group">
                                    <div className="relative aspect-video w-full overflow-hidden">
                                        {therapyImage && (
                                            <Image
                                                src={therapyImage.imageUrl}
                                                alt={therapy.name}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                data-ai-hint={therapyImage.imageHint}
                                            />
                                        )}
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="font-headline text-xl">{therapy.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-sm">{therapy.description}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" className="w-full bg-[#72392F] text-primary-foreground hover:bg-[#5f2f27]">View Details</Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                    {filteredTherapies.length === 0 && (
                        <p className="text-center mt-8 text-muted-foreground">No therapies found for &quot;{searchQuery}&quot;</p>
                    )}
                    {therapies.length > 9 && filteredTherapies.length > 9 && (
                        <div className="text-center mt-12">
                            <Button variant="outline" size="lg">View More</Button>
                        </div>
                    )}
                </div>
            </section>
            
            {/* Featured Therapies Section */}
            <section className="py-16 bg-[#F9F5F1]">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold font-headline text-center text-primary mb-2">Featured Therapies</h2>
                    <p className="text-lg text-muted-foreground text-center mb-8">Experience our most popular Ayurvedic treatments for wellness and rejuvenation.</p>
                     <Carousel opts={{ align: 'start', loop: true }} className="w-full max-w-4xl mx-auto">
                        <CarouselContent>
                            {featuredTherapies.map((therapy) => {
                                const fTherapyImage = PlaceholderImages.placeholderImages.find(p => p.id === therapy.imageId);
                                return (
                                    <CarouselItem key={therapy.id} className="md:basis-1/2 lg:basis-1/3">
                                        <div className="p-1">
                                             <Card className="overflow-hidden bg-green-800 text-white">
                                                <div className="relative aspect-video w-full">
                                                    {fTherapyImage && <Image src={fTherapyImage.imageUrl} alt={therapy.name} fill className="object-cover" data-ai-hint={fTherapyImage.imageHint}/>}
                                                </div>
                                                <CardContent className="p-4 text-center">
                                                    <h3 className="font-semibold font-headline">{therapy.name}</h3>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                );
                            })}
                        </CarouselContent>
                        <CarouselPrevious className="bg-background/50 hover:bg-background/80" />
                        <CarouselNext className="bg-background/50 hover:bg-background/80" />
                    </Carousel>
                </div>
            </section>
            
            {/* Why Choose Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold font-headline text-primary mb-6">Why Choose Shreevarma Therapies?</h2>
                        <p className="text-lg text-muted-foreground mb-8">Experience authentic Ayurvedic healing with our safe, personalized care.</p>
                        <div className="grid grid-cols-2 gap-6">
                            {whyChooseReasons.map((reason, index) => {
                                const Icon = reason.icon;
                                return (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="bg-primary/10 text-primary p-3 rounded-full">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <p className="font-medium text-foreground">{reason.text}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="relative aspect-square rounded-lg overflow-hidden"><Image src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/ShreeVarma%2FDoctors%20Image%2Fshreevarma.jpeg?alt=media&token=6f28e406-9d57-4036-b1a3-946cc3378321" alt="Doctor" layout="fill" className="object-cover" /></div>
                        <div className="relative aspect-square rounded-lg overflow-hidden"><Image src="https://images.unsplash.com/photo-1654133536179-88066c7a16a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxheXVydmVkYSUyMGhlcmJzfGVufDB8fHx8MTc2MjMxNjAzMXww&ixlib=rb-4.1.0&q=80&w=1080" alt="Herbs" layout="fill" className="object-cover" /></div>
                        <div className="relative aspect-square rounded-lg overflow-hidden"><Image src="https://images.unsplash.com/photo-1511766836919-bc10e68e2d1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHx3b21hbiUyMHJlbGF4aW5nfGVufDB8fHx8MTc2MjMxNjIzMHww&ixlib=rb-4.1.0&q=80&w=1080" alt="Relaxation" layout="fill" className="object-cover" /></div>
                        <div className="relative aspect-square rounded-lg overflow-hidden"><Image src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/ShreeVarma%2FDr.Jayaroopa.png?alt=media&token=487d6056-b072-46a4-84c4-72210874e0d4" alt="Doctor" layout="fill" className="object-cover" /></div>
                    </div>
                </div>
            </section>
        </div>
    );
}
