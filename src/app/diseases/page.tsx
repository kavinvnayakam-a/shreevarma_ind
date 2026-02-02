'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PlaceholderImages from '@/lib/placeholder-images.json';
import { Search, Sparkles } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
        if (!searchQuery) return allHealthConditions;
        return allHealthConditions.filter(condition =>
            condition.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const displayedHealthConditions = useMemo(() => {
        if (isExpanded || searchQuery) return filteredHealthConditions;
        return filteredHealthConditions.slice(0, 8);
    }, [filteredHealthConditions, isExpanded, searchQuery]);

    const searchSuggestions = useMemo(() => {
        if (searchQuery) return filteredHealthConditions.slice(0, 5);
        return allHealthConditions.slice(0, 5);
    }, [searchQuery, filteredHealthConditions]);

    return (
        <div className="flex flex-col bg-white">

            {/* Hero Section - Pure White Background */}
            <section className="relative py-12 md:py-20 bg-white border-b overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full text-primary font-bold text-sm tracking-widest uppercase">
                                <Sparkles className="w-4 h-4" /> Root-Cause Healing
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-primary leading-[0.9] uppercase">
                                Explore <br/> Health <br/> Conditions
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-md leading-relaxed">
                                Understand common diseases, their symptoms, and holistic Ayurvedic treatment options.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Button asChild size="lg" className="rounded-xl px-8 shadow-lg bg-primary">
                                    <Link href="/consultation">Consult Doctor</Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="rounded-xl px-8 border-primary text-primary">
                                    <Link href="/clinics">Find Clinic</Link>
                                </Button>
                            </div>
                        </div>
                        <div className="relative aspect-square md:aspect-[4/3] w-full bg-white">
                            <Image
                                src={heroImage.imageUrl}
                                alt={heroImage.description || 'Health conditions'}
                                fill
                                className="object-contain drop-shadow-2xl"
                                // Performance fixes
                                priority={true}
                                loading="eager"
                                fetchPriority="high"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Explore Conditions Section - Pure White Background */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Common Ailments</h2>
                            <p className="text-muted-foreground font-medium italic">Holistic insights for your well-being</p>
                        </div>
                        
                        <div className="w-full max-w-md">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/30" />
                                        <Input
                                            placeholder="Search by Disease..."
                                            className="pl-12 py-7 rounded-2xl border-primary/10 bg-white shadow-sm focus:ring-primary text-lg"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2 rounded-2xl shadow-2xl border-primary/5 bg-white" align="start">
                                    <ul className="space-y-1">
                                        <li className="px-3 py-2 text-xs font-bold text-primary/40 uppercase tracking-widest">
                                            {searchQuery ? 'Suggestions' : 'Top Conditions'}
                                        </li>
                                        {searchSuggestions.map((condition) => (
                                            <li key={condition.id}>
                                                <Link href={`/diseases/${condition.slug}`}
                                                    className="block px-3 py-3 text-sm font-medium rounded-xl hover:bg-primary/5 hover:text-primary transition-colors"
                                                >
                                                    {condition.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {displayedHealthConditions.map((condition, index) => (
                            <Card key={condition.id} className="flex flex-col border border-slate-100 bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
                                <div className="relative aspect-[16/12] w-full overflow-hidden bg-white">
                                    <Image
                                        src={condition.imageUrl}
                                        alt={condition.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        // Speed Fix: Eager load top 4 visible cards
                                        priority={index < 4}
                                        loading={index < 4 ? "eager" : "lazy"}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                </div>
                                <CardHeader className="pt-6">
                                    <CardTitle className="font-black text-xl text-primary uppercase tracking-tight leading-tight">
                                        {condition.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                                        {condition.description}
                                    </p>
                                </CardContent>
                                <CardFooter className="pb-6">
                                    <Button asChild className="w-full rounded-xl py-5 font-bold uppercase tracking-widest bg-[#72392F] hover:bg-[#5f2f27] text-white border-none transition-colors">
                                        <Link href={`/diseases/${condition.slug}`}>Learn More</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {searchQuery && filteredHealthConditions.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-[3rem] mt-10">
                            <p className="text-xl text-muted-foreground italic">No results found for &quot;{searchQuery}&quot;</p>
                        </div>
                    )}

                    {filteredHealthConditions.length > 8 && !searchQuery && (
                        <div className="text-center mt-16">
                            <Button 
                                variant="outline" 
                                size="lg" 
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="rounded-full px-12 border-primary text-primary font-bold hover:bg-primary/5"
                            >
                                {isExpanded ? 'Show Less' : 'Explore All Conditions'}
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Section - Pure White Background */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative w-full aspect-square max-w-md mx-auto bg-white group">
                            <div className="absolute inset-0 bg-primary/5 rounded-full scale-110 group-hover:scale-125 transition-transform duration-700" />
                            <Image 
                                src={whyChooseImage.imageUrl} 
                                alt="Why Choose Us" 
                                fill
                                className="object-contain relative z-10" 
                                // Priority not needed here as it's further down the page
                                loading="lazy"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                        <div className="space-y-8">
                            <h2 className="text-5xl font-black font-headline text-primary tracking-tighter leading-none uppercase">
                                Why Choose Our <br/> Specialists?
                            </h2>
                            <div className="space-y-6">
                                {[
                                    { t: "Certified Specialists", d: "Expert Vaidyas trained in authentic Ayurvedic and Siddha practices." },
                                    { t: "Personalized Care", d: "Every treatment protocol is tailored to your unique Prakriti (constitution)." },
                                    { t: "Trusted Expertise", d: "Decades of clinical experience in treating chronic health conditions." },
                                    { t: "Holistic Access", d: "Seamless online and offline consultations for your convenience." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 items-start group">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
                                            {i + 1}
                                        </span>
                                        <div>
                                            <h3 className="font-bold text-xl text-primary">{item.t}</h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed">{item.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}