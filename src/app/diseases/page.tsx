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
import { cn } from '@/lib/utils';

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

    // Unified Heading Style
    const HEADING_STYLE = "text-3xl md:text-5xl font-bold font-headline text-primary uppercase tracking-tight";

    return (
        <div className="flex flex-col bg-white selection:bg-primary/10">

            {/* Hero Section */}
            <section className="relative py-12 md:py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 relative z-10 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full text-primary font-bold text-[10px] md:text-xs tracking-widest uppercase font-headline">
                                <Sparkles className="w-4 h-4" /> Root-Cause Healing
                            </div>
                            <h1 className={cn("leading-[1.1]", HEADING_STYLE)}>
                                Explore <br/> Health <br/> Conditions
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto md:mx-0 leading-relaxed font-medium">
                                Understand common diseases, their symptoms, and holistic Ayurvedic treatment options.
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                                <Button asChild size="lg" className="rounded-xl px-10 h-14 bg-primary hover:opacity-90 font-bold font-headline uppercase tracking-tight text-[11px] shadow-lg shadow-primary/20">
                                    <Link href="/consultation">Consult Doctor</Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="rounded-xl px-10 h-14 border-2 border-primary text-primary hover:bg-primary/5 font-bold font-headline uppercase tracking-tight text-[11px]">
                                    <Link href="/clinics">Find Clinic</Link>
                                </Button>
                            </div>
                        </div>
                        <div className="relative aspect-square md:aspect-[4/3] w-full bg-white">
                            <Image
                                src={heroImage.imageUrl}
                                alt={heroImage.description || 'Health conditions'}
                                fill
                                className="object-contain"
                                priority={true}
                                loading="eager"
                                fetchPriority="high"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                unoptimized
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Explore Conditions Section */}
            <section className="py-20 bg-white border-t border-slate-50">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                        <div className="space-y-2">
                            <h2 className={HEADING_STYLE}>Common Ailments</h2>
                            <p className="text-muted-foreground text-[11px] font-bold uppercase tracking-[0.2em] font-headline">Holistic insights for your well-being</p>
                        </div>
                        
                        <div className="w-full max-w-md">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="relative">
                                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/30" />
                                        <Input
                                            placeholder="Search by Disease..."
                                            className="pl-14 h-14 rounded-xl border-none bg-slate-50 font-bold text-xs uppercase tracking-tight focus-visible:ring-primary"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2 rounded-xl shadow-2xl border-none bg-white" align="start">
                                    <ul className="space-y-1">
                                        <li className="px-4 py-2 text-[10px] font-bold text-primary/40 uppercase tracking-widest font-headline">
                                            {searchQuery ? 'Suggestions' : 'Top Conditions'}
                                        </li>
                                        {searchSuggestions.map((condition) => (
                                            <li key={condition.id}>
                                                <Link href={`/diseases/${condition.slug}`}
                                                    className="block px-4 py-3 text-[11px] font-bold uppercase tracking-tight rounded-lg hover:bg-primary/5 hover:text-primary transition-colors font-headline"
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
                                <div className="relative aspect-[16/12] w-full overflow-hidden">
                                    <Image
                                        src={condition.imageUrl}
                                        alt={condition.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        priority={index < 4}
                                        loading={index < 4 ? "eager" : "lazy"}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        unoptimized
                                    />
                                </div>
                                <CardHeader className="pt-6">
                                    <CardTitle className="font-bold text-sm text-primary uppercase tracking-tight leading-tight line-clamp-1 font-headline">
                                        {condition.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow pb-4">
                                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 font-medium">
                                        {condition.description}
                                    </p>
                                </CardContent>
                                <CardFooter className="pb-8">
                                    <Button asChild className="w-full rounded-xl h-12 bg-primary hover:opacity-90 text-white font-bold font-headline uppercase tracking-tight text-[10px] transition-all">
                                        <Link href={`/diseases/${condition.slug}`}>Learn More</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {searchQuery && filteredHealthConditions.length === 0 && (
                        <div className="text-center py-20 bg-white/50 rounded-[2.5rem] border border-dashed border-primary/10">
                            <p className="text-xs font-bold uppercase tracking-tight text-muted-foreground/60 font-headline">No results found for &quot;{searchQuery}&quot;</p>
                        </div>
                    )}

                    {filteredHealthConditions.length > 8 && !searchQuery && (
                        <div className="text-center mt-16">
                            <Button 
                                onClick={() => setIsExpanded(!isExpanded)}
                                variant="outline"
                                className="rounded-full h-14 px-12 border-2 border-primary text-primary font-bold font-headline uppercase tracking-tight hover:bg-primary hover:text-white transition-all text-xs shadow-lg shadow-primary/5"
                            >
                                {isExpanded ? 'Show Less' : 'Explore All Conditions'}
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Section */}
            <section className="py-32 bg-white border-t border-slate-50">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="relative w-full aspect-square max-w-lg mx-auto lg:mx-0 overflow-hidden">
                            <Image 
                                src={whyChooseImage.imageUrl} 
                                alt="Why Choose Us" 
                                fill
                                className="object-cover" 
                                loading="lazy"
                                sizes="(max-width: 768px) 100vw, 600px"
                                unoptimized
                            />
                        </div>
                        <div className="space-y-12">
                            <h2 className={cn("leading-[1.1]", HEADING_STYLE)}>
                                Why Choose Our <br/> Specialists?
                            </h2>
                            <div className="space-y-8">
                                {[
                                    { t: "CERTIFIED SPECIALISTS", d: "Expert Vaidyas trained in authentic Ayurvedic and Siddha practices." },
                                    { t: "PERSONALIZED CARE", d: "Every treatment protocol is tailored to your unique Prakriti (constitution)." },
                                    { t: "TRUSTED EXPERTISE", d: "Decades of clinical experience in treating chronic health conditions." },
                                    { t: "HOLISTIC ACCESS", d: "Seamless online and offline consultations for your convenience." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-5 group">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-bold text-xs font-headline">
                                            {i + 1}
                                        </span>
                                        <div>
                                            <h4 className="font-bold text-lg text-primary uppercase tracking-tight font-headline">{item.t}</h4>
                                            <p className="text-muted-foreground text-sm font-medium leading-relaxed mt-1">{item.d}</p>
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