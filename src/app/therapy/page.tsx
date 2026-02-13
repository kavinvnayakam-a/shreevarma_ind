'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, ShoppingBag, Video, CheckCircle2, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { therapiesData } from './therapy-data';
import { cn } from '@/lib/utils';

export default function TherapyPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    // Filters based on search
    const filteredTherapies = useMemo(() => {
        if (!searchQuery) return therapiesData;
        return therapiesData.filter(t => 
            t.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    // Handles the "Show More" logic
    const displayedTherapies = useMemo(() => {
        if (isExpanded || searchQuery) return filteredTherapies;
        return filteredTherapies.slice(0, 8);
    }, [filteredTherapies, isExpanded, searchQuery]);

    const searchSuggestions = useMemo(() => {
        if (searchQuery) return filteredTherapies.slice(0, 5);
        return therapiesData.slice(0, 5);
    }, [searchQuery, filteredTherapies]);

    // Unified Heading Style
    const HEADING_STYLE = "text-3xl md:text-5xl font-bold font-headline text-primary uppercase tracking-tight";

    return (
        <div className="flex flex-col bg-white overflow-x-hidden font-sans selection:bg-primary/10">
            {/* 1. HERO SECTION */}
            <section className="relative py-10 md:py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                        <div className="space-y-6 md:space-y-8 order-2 md:order-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-primary/5 rounded-full text-primary font-bold text-[10px] md:text-sm tracking-widest uppercase font-headline">
                                <Sparkles className="w-3 h-3 md:w-4 md:h-4" /> 25 Years of Healing Legacy
                            </div>
                            <h1 className={cn("leading-[0.9]", HEADING_STYLE)}>
                                Authentic <br/> Ayurveda
                            </h1>
                            <p className="text-base md:text-xl text-muted-foreground max-w-md mx-auto md:mx-0 leading-relaxed font-medium">
                                Experience {therapiesData.length}+ traditional therapies designed to restore balance and rejuvenate your spirit.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
                                <Button asChild size="lg" className="rounded-xl h-14 md:px-8 bg-primary hover:opacity-90 font-bold font-headline uppercase tracking-tight text-[11px] shadow-lg shadow-primary/20">
                                    <Link href="/products" className="flex items-center gap-2">
                                        <ShoppingBag className="w-4 h-4" /> Buy Products
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="rounded-xl h-14 md:px-8 border-2 border-primary text-primary hover:bg-primary/5 font-bold font-headline uppercase tracking-tight text-[11px]">
                                    <Link href="/consultation" className="flex items-center gap-2">
                                        <Video className="w-4 h-4" /> Consult Doctor
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        
                        <div className="relative aspect-video md:aspect-[2800/1656] w-full bg-white rounded-2xl overflow-hidden order-1 md:order-2">
                            <Image 
                                src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2FTherapy%20Hero%20Image.webp?alt=media&token=ad2c170e-e680-4320-bee8-a98d20881031" 
                                alt="Ayurvedic Treatment" 
                                fill 
                                className="object-cover" 
                                priority 
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. SEARCH & THERAPY GRID */}
            <section className="py-12 md:py-20 bg-white border-t border-slate-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8">
                        <div className="space-y-2">
                            <h2 className={HEADING_STYLE}>Our Therapies</h2>
                            <p className="text-muted-foreground text-[11px] font-bold uppercase tracking-[0.2em] font-headline">Pure healing, naturally delivered</p>
                        </div>
                        
                        <div className="relative w-full max-w-md">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="relative">
                                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/30" />
                                        <Input 
                                            placeholder="Search treatments..." 
                                            className="pl-14 h-14 rounded-xl border-none bg-slate-50 font-bold text-xs uppercase tracking-tight focus-visible:ring-primary"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2 rounded-xl shadow-2xl border-none bg-white" align="start">
                                    <ul className="space-y-1">
                                        {searchSuggestions.map((therapy) => (
                                            <li key={therapy.id}>
                                                <Link href={`/therapy/${therapy.slug}`} className="block px-4 py-3 text-[11px] font-bold uppercase tracking-tight rounded-lg hover:bg-primary/5 hover:text-primary transition-colors font-headline">
                                                    {therapy.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {displayedTherapies.map((therapy) => (
                            <Card key={therapy.id} className="flex flex-col border border-slate-100 bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
                                <div className="relative aspect-[16/11] w-full overflow-hidden">
                                    <Image 
                                        src={therapy.imageUrl} 
                                        alt={therapy.name} 
                                        fill 
                                        className="object-cover transition-transform duration-700 group-hover:scale-105" 
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                </div>
                                <CardHeader className="pt-6">
                                    <CardTitle className="font-bold text-sm text-primary uppercase tracking-tight leading-tight line-clamp-1 font-headline">
                                        {therapy.name}
                                    </CardTitle>
                                </CardHeader>
                                
                                <CardContent className="flex-grow pb-4">
                                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 font-medium">
                                        {therapy.what}
                                    </p>
                                </CardContent>

                                <CardFooter className="pb-8">
                                    <Button asChild className="w-full rounded-xl h-12 bg-primary hover:opacity-90 font-bold font-headline uppercase tracking-tight text-[10px] transition-all">
                                        <Link href={`/therapy/${therapy.slug}`}>View Details</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {filteredTherapies.length > 8 && !searchQuery && (
                        <div className="text-center mt-16">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="rounded-full h-14 px-12 border-2 border-primary text-primary font-bold font-headline uppercase tracking-tight hover:bg-primary hover:text-white transition-all text-xs gap-3 shadow-lg shadow-primary/5"
                            >
                                {isExpanded ? 'Show Less' : `Explore All ${therapiesData.length} Therapies`}
                                <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* 3. WHY CHOOSE SECTION */}
            <section className="py-24 bg-white overflow-hidden w-full border-t border-slate-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-12">
                            <div className="max-w-xl">
                                <h2 className={cn("leading-[1.1]", HEADING_STYLE)}>
                                    Why Choose <br/> Shreevarma?
                                </h2>
                                <p className="text-xl text-muted-foreground mt-8 font-medium leading-relaxed">
                                    Shreevarma combines traditional pulse diagnosis with modern digital convenience.
                                </p>
                            </div>
                            <div className="space-y-8">
                                {[
                                    { t: "EXPERT VAIDYAS", d: "Consultations by qualified BAMS/MD Doctors with clinical excellence." },
                                    { t: "PURITY & HYGIENE", d: "Strict clinical standards and sanitized environments for every session." },
                                    { t: "PERSONALIZED CARE", d: "Therapies customized based on your unique body constitution." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-5 group">
                                        <CheckCircle2 className="w-6 h-6 text-primary mt-1 shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-lg text-primary uppercase tracking-tight font-headline">{item.t}</h4>
                                            <p className="text-muted-foreground text-sm font-medium leading-relaxed mt-1">{item.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="relative aspect-square w-full max-w-[500px] mx-auto lg:ml-auto bg-white rounded-none overflow-hidden">
                           <Image 
                             src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2FJournery%20Today.webp?alt=media&token=e35c3433-44e4-4cce-9356-646b5e8842ff" 
                             alt="Shreevarma Excellence" 
                             fill 
                             className="object-cover" 
                             sizes="(max-width: 768px) 100vw, 500px"
                           />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}