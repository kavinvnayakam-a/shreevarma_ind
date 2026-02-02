
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PlaceholderImages from '@/lib/placeholder-images.json';
import { Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SubHeader } from '@/components/ui/sub-header';
import { healthConditionsData } from './health-conditions-data';

const allHealthConditions = healthConditionsData.map(condition => {
    const img = PlaceholderImages.placeholderImages.find(p => p.id === `health-${condition.id}`);
    return {
        ...condition,
        imageUrl: img?.imageUrl || '',
        imageHint: img?.imageHint || '',
    };
});


export default function DiseasesPage() {
    const heroImage = {
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/diseasepageheader%2FDisease%20Hero.webp?alt=media&token=95a9ca63-409e-4f07-b18d-c0dfe16420cf",
        description: "A doctor and a nurse with a mortar and pestle with herbs.",
        imageHint: "doctor herbs"
    };

    const whyChooseImage = {
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/diseasepageheader%2Fwhy%20choose%20us%20disease%20page.webp?alt=media&token=abba2cb1-8ad2-48f2-bd47-bb5115effc47",
        imageHint: "doctor with patient"
    };
    
    const [searchQuery, setSearchQuery] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const filteredHealthConditions = useMemo(() => {
        if (!searchQuery) {
            return allHealthConditions;
        }
        return allHealthConditions.filter(condition =>
            condition.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const displayedHealthConditions = useMemo(() => {
        if (isExpanded) {
            return filteredHealthConditions;
        }
        return filteredHealthConditions.slice(0, 8);
    }, [filteredHealthConditions, isExpanded]);

    const searchSuggestions = useMemo(() => {
        if (searchQuery) {
            return filteredHealthConditions.slice(0, 5);
        }
        return allHealthConditions.slice(0, 5);
    }, [searchQuery, filteredHealthConditions]);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="flex flex-col bg-[#F9F5F1]">

            {/* Hero Section */}
            <section className="relative pt-8 md:pt-6">
                <div className="container mx-auto px-6">
                    
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="text-left relative">
                            <div className="absolute inset-0 opacity-10">
                                <Image
                                    src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0249163472.firebasestorage.app/o/ShreeVarma%2FWorld%20Mask.png?alt=media&token=e08b375f-fa34-4f53-bd84-e0e0cdd6b4b8"
                                    alt="World Mask"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="relative">
                                <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4 font-headline text-foreground">
                                    “Explore Health Conditions”
                                </h1>
                                <p className="text-lg text-muted-foreground mb-6">
                                    Understand common diseases, their symptoms, and treatment options.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Button asChild size="lg">
                                        <Link href="/consultation">Consult Doctor</Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline">
                                        <Link href="#">Find near by Clinic</Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline">
                                        <Link href="/products">Buy Product</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-64 md:h-96 w-full">
                            {heroImage && (
                                <Image
                                    src={heroImage.imageUrl}
                                    alt={heroImage.description || 'Health conditions'}
                                    width={500}
                                    height={384}
                                    className="object-contain w-full h-auto"
                                    data-ai-hint={heroImage.imageHint}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Explore Conditions Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Explore Health Conditions</h2>
                        <p className="text-lg text-muted-foreground mt-2">Learn about common diseases, their symptoms, and treatments.</p>
                    </div>
                    <div className="flex justify-center mb-12">
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="relative w-full max-w-sm">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by Disease"
                                        className="pl-10"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                {searchSuggestions.length > 0 && (
                                <ul className="py-2">
                                    <li className="px-4 py-2 text-sm font-semibold text-muted-foreground">
                                        {searchQuery ? 'Suggestions' : 'Top Topics'}
                                    </li>
                                    {searchSuggestions.map((condition) => (
                                        <li key={condition.id}>
                                            <Link href={`/diseases/${condition.slug}`}
                                                className="block px-4 py-2 text-sm hover:bg-muted"
                                            >
                                                {condition.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                )}
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {displayedHealthConditions.map((condition) => (
                            <Link key={condition.id} href={`/diseases/${condition.slug}`} id={condition.slug} className="block">
                                <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-xl group h-full">
                                    <div className="relative aspect-[1112/888] w-full overflow-hidden">
                                        <Image
                                            src={condition.imageUrl}
                                            alt={condition.name}
                                            fill
                                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                            data-ai-hint={condition.imageHint}
                                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                                        />
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="font-headline text-lg">{condition.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-sm line-clamp-2">{condition.description.split('.').slice(0, 2).join('.') + '.'}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" className="w-full bg-[#72392F] text-primary-foreground hover:bg-[#5f2f27]">Learn More</Button>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                    </div>
                    {searchQuery && filteredHealthConditions.length === 0 && (
                        <p className="text-center mt-8 text-muted-foreground">No results found for &quot;{searchQuery}&quot;</p>
                    )}
                    {filteredHealthConditions.length > 8 && !searchQuery && (
                        <div className="text-center mt-12">
                            <Button variant="outline" size="lg" onClick={toggleExpanded}>
                                {isExpanded ? 'Show Less' : 'View More'}
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Why Choose Our Doctors?</h2>
                        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">At Shree Varma, we ensure you receive the best Ayurvedic care.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative w-full aspect-square max-w-sm mx-auto">
                            {whyChooseImage && <Image src={whyChooseImage.imageUrl} alt="Why Choose Us" width={400} height={400} className="object-contain w-full h-auto" data-ai-hint={whyChooseImage.imageHint} />}
                        </div>
                        <div>
                            <ul className="space-y-6 text-lg">
                                <li className="flex items-start gap-4">
                                    <span className="font-bold text-primary text-2xl">1.</span>
                                    <div>
                                        <h3 className="font-semibold text-xl">Certified Specialists</h3>
                                        <p className="text-muted-foreground text-base">Our doctors are trained in authentic Ayurvedic and Siddha practices.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="font-bold text-primary text-2xl">2.</span>
                                    <div>
                                        <h3 className="font-semibold text-xl">Personalized Care</h3>
                                        <p className="text-muted-foreground text-base">Every treatment is tailored to your unique health needs.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="font-bold text-primary text-2xl">3.</span>
                                    <div>
                                        <h3 className="font-semibold text-xl">Trusted Expertise</h3>
                                        <p className="text-muted-foreground text-base">Years of clinical experience across various health conditions.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="font-bold text-primary text-2xl">4.</span>
                                    <div>
                                        <h3 className="font-semibold text-xl">Accessible Consultations</h3>
                                        <p className="text-muted-foreground text-base">Online and offline appointments to suit your lifestyle.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
