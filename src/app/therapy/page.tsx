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

    return (
        <div className="flex flex-col bg-white overflow-x-hidden">
            {/* 1. HERO SECTION - Clean White Background */}
            <section className="relative py-10 md:py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                        <div className="space-y-6 md:space-y-8 order-2 md:order-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-primary/5 rounded-full text-primary font-bold text-[10px] md:text-sm tracking-widest uppercase">
                                <Sparkles className="w-3 h-3 md:w-4 md:h-4" /> 25 Years of Healing Legacy
                            </div>
                            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-primary leading-[0.9] uppercase">
                                Authentic <br/> Ayurveda
                            </h1>
                            <p className="text-base md:text-xl text-muted-foreground max-w-md mx-auto md:mx-0 leading-relaxed">
                                Experience {therapiesData.length}+ traditional therapies designed to restore balance and rejuvenate your spirit.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
                                <Button asChild size="lg" className="rounded-xl h-14 md:px-6 md:py-7 shadow-lg bg-primary font-bold uppercase tracking-wider text-xs md:text-base">
                                    <Link href="/products" className="flex items-center gap-2">
                                        <ShoppingBag className="w-5 h-5" /> Buy Products
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="rounded-xl h-14 md:px-6 md:py-7 border-primary text-primary font-bold uppercase tracking-wider text-xs md:text-base">
                                    <Link href="/consultation" className="flex items-center gap-2">
                                        <Video className="w-5 h-5" /> Consult Doctor
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        
                        {/* Removed Gray background from image container */}
                        <div className="relative aspect-video md:aspect-[2800/1656] w-full bg-white rounded-2xl overflow-hidden order-1 md:order-2">
                            <Image 
                                src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2FTherapy%20Hero%20Image.webp?alt=media&token=ad2c170e-e680-4320-bee8-a98d20881031" 
                                alt="Ayurvedic Treatment" 
                                fill 
                                className="object-cover" 
                                priority 
                                unoptimized
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. SEARCH & THERAPY GRID */}
            <section className="py-12 md:py-20 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6">
                        <div className="space-y-1">
                            <h2 className="text-3xl md:text-4xl font-black text-primary uppercase tracking-tighter">Our Therapies</h2>
                            <p className="text-muted-foreground text-sm font-medium italic">Pure healing, naturally delivered</p>
                        </div>
                        
                        <div className="relative w-full max-w-md">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/30" />
                                        <Input 
                                            placeholder="Search treatments..." 
                                            className="pl-12 h-14 md:py-7 rounded-2xl border-primary/10 bg-white shadow-sm focus:ring-primary text-base md:text-lg"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2 rounded-2xl shadow-2xl border-primary/5 bg-white" align="start">
                                    <ul className="space-y-1">
                                        {searchSuggestions.map((therapy) => (
                                            <li key={therapy.id}>
                                                <Link href={`/therapy/${therapy.slug}`} className="block px-3 py-3 text-sm font-medium rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">
                                                    {therapy.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Grid displaying the therapies */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {displayedTherapies.map((therapy) => (
                            <Card key={therapy.id} className="flex flex-col border border-slate-100 bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
                                <div className="relative aspect-[16/11] w-full overflow-hidden bg-slate-50">
                                    <Image 
                                        src={therapy.imageUrl} 
                                        alt={therapy.name} 
                                        fill 
                                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                                        unoptimized
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                </div>
                                <CardHeader className="pt-5 md:pt-6">
                                    <CardTitle className="font-black text-lg md:text-xl text-primary uppercase tracking-tight leading-tight line-clamp-1">
                                        {therapy.name}
                                    </CardTitle>
                                </CardHeader>
                                
                                <CardContent className="flex-grow">
                                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                                        {therapy.what}
                                    </p>
                                </CardContent>

                                <CardFooter className="pb-6 md:pb-8">
                                    <Button asChild className="w-full rounded-2xl h-12 md:py-6 font-bold uppercase tracking-widest bg-[#72392F] text-white hover:bg-[#5f2f27] border-none transition-colors text-[10px] md:text-xs">
                                        <Link href={`/therapy/${therapy.slug}`}>View Details</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Expand Button logic */}
                    {filteredTherapies.length > 8 && !searchQuery && (
                        <div className="text-center mt-12 md:mt-16">
                            <Button 
                                variant="outline" 
                                size="lg" 
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="rounded-full h-12 md:h-14 px-8 md:px-12 border-primary text-primary font-bold hover:bg-primary/5 text-sm uppercase tracking-widest gap-2"
                            >
                                {isExpanded ? 'Show Less' : `Explore All ${therapiesData.length} Therapies`}
                                <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* 3. WHY CHOOSE SECTION - Fixed Mobile Spill & Removed Gray Background */}
            <section className="py-16 md:py-24 bg-white overflow-hidden w-full border-t border-slate-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-center">
                        <div className="space-y-8 md:space-y-10">
                            <div className="max-w-xl">
                                <h2 className="text-3xl md:text-5xl font-black text-primary tracking-tighter leading-[1.1] md:leading-none uppercase">
                                    Why Choose <br className="hidden md:block"/> Shreevarma?
                                </h2>
                                <p className="text-base md:text-lg text-muted-foreground mt-4 md:mt-6 font-medium">
                                    Shreevarma combines traditional pulse diagnosis with modern digital convenience.
                                </p>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { t: "Expert Vaidyas", d: "Consultations by BAMS/MD Ayurvedic Doctors with decades of experience." },
                                    { t: "Purity & Hygiene", d: "Strict clinical standards and sanitized environments for every session." },
                                    { t: "Personalized Care", d: "Therapies customized based on your unique body constitution (Prakriti)." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-primary mt-1 shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-lg md:text-xl text-primary">{item.t}</h4>
                                            <p className="text-muted-foreground text-sm leading-relaxed">{item.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Image container with White Background and shadow for depth */}
                        <div className="relative aspect-square w-full max-w-[500px] mx-auto md:ml-auto bg-white rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                           <Image 
                             src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2FJournery%20Today.webp?alt=media&token=e35c3433-44e4-4cce-9356-646b5e8842ff" 
                             alt="Shreevarma Excellence" 
                             fill 
                             className="object-cover" 
                             unoptimized
                             sizes="(max-width: 768px) 100vw, 50vw"
                           />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}