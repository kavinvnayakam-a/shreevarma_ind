'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, MapPin, ShoppingBag, Video, CheckCircle2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { therapiesData } from './therapy-data';

export default function TherapyPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const filteredTherapies = useMemo(() => {
        if (!searchQuery) return therapiesData;
        return therapiesData.filter(t => 
            t.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const displayedTherapies = useMemo(() => {
        if (isExpanded || searchQuery) return filteredTherapies;
        return filteredTherapies.slice(0, 8);
    }, [filteredTherapies, isExpanded, searchQuery]);

    const searchSuggestions = useMemo(() => {
        if (searchQuery) return filteredTherapies.slice(0, 5);
        return therapiesData.slice(0, 5);
    }, [searchQuery, filteredTherapies]);

    return (
        <div className="flex flex-col bg-white">
            {/* 1. HERO SECTION */}
            <section className="relative py-12 md:py-24 bg-white border-b overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full text-primary font-bold text-sm tracking-widest uppercase">
                                <Sparkles className="w-4 h-4" /> 25 Years of Healing Legacy
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-primary leading-[0.9] uppercase">
                                Authentic <br/> Ayurveda
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-md leading-relaxed">
                                Experience 18+ traditional therapies designed to restore balance to your Doshas and rejuvenate your spirit.
                            </p>
                            
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Button asChild size="lg" className="rounded-xl px-6 py-7 shadow-lg bg-primary">
                                    <Link href="/products" className="flex items-center gap-2">
                                        <ShoppingBag className="w-5 h-5" /> Buy Products
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="rounded-xl px-6 py-7 border-primary text-primary">
                                    <Link href="/consultation" className="flex items-center gap-2">
                                        <Video className="w-5 h-5" /> Consult Doctor
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        
                        {/* Hero Image - Background set to white */}
                        <div className="relative aspect-[2800/1656] w-full bg-white rounded-2xl overflow-hidden">
                            <Image 
                                src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2FTherapy%20Hero%20Image.webp?alt=media&token=ad2c170e-e680-4320-bee8-a98d20881031" 
                                alt="Shirodhara Treatment" 
                                fill 
                                className="object-cover" 
                                priority 
                                loading="eager"
                                fetchPriority="high"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. SEARCH & LIST */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Our Therapies</h2>
                            <p className="text-muted-foreground font-medium italic">Pure healing, naturally delivered</p>
                        </div>
                        
                        <div className="relative w-full max-w-md">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/30" />
                                        <Input 
                                            placeholder="Search treatments..." 
                                            className="pl-12 py-7 rounded-2xl border-primary/10 bg-white shadow-sm focus:ring-primary text-lg"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2 rounded-2xl shadow-2xl border-primary/5 bg-white" align="start">
                                    <ul className="space-y-1">
                                        <li className="px-3 py-2 text-xs font-bold text-primary/40 uppercase tracking-widest">
                                            {searchQuery ? 'Suggestions' : 'Top Therapies'}
                                        </li>
                                        {searchSuggestions.map((therapy) => (
                                            <li key={therapy.id}>
                                                <Link href={`/therapy/${therapy.slug}`}
                                                    className="block px-3 py-3 text-sm font-medium rounded-xl hover:bg-primary/5 hover:text-primary transition-colors"
                                                >
                                                    {therapy.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {displayedTherapies.map((therapy, index) => (
                            <Card key={therapy.id} className="flex flex-col border border-slate-100 bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
                                <div className="relative aspect-[16/12] w-full overflow-hidden bg-white">
                                    <Image 
                                        src={therapy.imageUrl} 
                                        alt={therapy.name} 
                                        fill 
                                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                                        priority={index < 4}
                                        loading={index < 4 ? "eager" : "lazy"}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                </div>
                                <CardHeader className="pt-6">
                                    <CardTitle className="font-black text-xl text-primary uppercase tracking-tight leading-tight">
                                        {therapy.name}
                                    </CardTitle>
                                </CardHeader>
                                
                                <CardContent className="flex-grow">
                                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                                        {therapy.what}
                                    </p>
                                </CardContent>

                                <CardFooter className="pb-8">
                                    <Button asChild className="w-full rounded-2xl py-6 font-bold uppercase tracking-widest bg-[#72392F] text-white hover:bg-[#5f2f27] border-none transition-colors">
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
                                size="lg" 
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="rounded-full px-12 border-primary text-primary font-bold hover:bg-primary/5"
                            >
                                {isExpanded ? 'Show Less' : 'Explore All Therapies'}
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* 3. WHY CHOOSE - Background set to white */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10">
                            <div>
                                <h2 className="text-5xl font-black font-headline text-primary tracking-tighter leading-none uppercase">Why Choose <br/> Shreevarma?</h2>
                                <p className="text-lg text-muted-foreground mt-6 font-medium">Shreevarma combines traditional pulse diagnosis with modern digital convenience.</p>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { t: "Expert Vaidyas", d: "Consultations by BAMS/MD Ayurvedic Doctors with decades of experience." },
                                    { t: "Purity & Hygiene", d: "Strict clinical standards and sanitized environments for every session." },
                                    { t: "Personalized Care", d: "Therapies customized based on your unique body constitution (Prakriti)." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <CheckCircle2 className="w-6 h-6 text-primary mt-1 shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-xl text-primary">{item.t}</h4>
                                            <p className="text-muted-foreground text-sm leading-relaxed">{item.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Why Choose Image - Background set to white */}
                        <div className="relative aspect-square w-full max-w-lg mx-auto md:ml-auto bg-white rounded-lg overflow-hidden">
                           <Image 
                             src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2FJournery%20Today.webp?alt=media&token=e35c3433-44e4-4cce-9356-646b5e8842ff" 
                             alt="Shreevarma Excellence" 
                             fill 
                             className="object-cover" 
                             sizes="(max-width: 768px) 100vw, 50vw"
                           />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}