'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, MapPin, ShoppingBag, Video, CheckCircle2 } from 'lucide-react';
import { therapiesData } from './therapy-data';


export default function TherapyPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTherapies = useMemo(() => {
        return therapiesData.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery]);

    return (
        <div className="flex flex-col bg-[#FDFCFB]">
            {/* 1. HERO SECTION WITH BUTTONS */}
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
                            
                            {/* ACTION BUTTONS */}
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Button asChild size="lg" className="rounded-xl px-6 py-7 shadow-lg bg-primary hover:bg-primary/90">
                                    <Link href="/products" className="flex items-center gap-2">
                                        <ShoppingBag className="w-5 h-5" /> Buy Products
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="rounded-xl px-6 py-7 border-primary text-primary hover:bg-primary/5">
                                    <Link href="/consultation" className="flex items-center gap-2">
                                        <Video className="w-5 h-5" /> Consult Doctor
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="ghost" className="rounded-xl px-6 py-7 text-primary hover:bg-primary/5 underline underline-offset-4">
                                    <Link href="/clinics" className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5" /> Find Near by Clinic
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        
                        <div className="relative aspect-[2800/1656] w-full">
                            <Image src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2FTherapy%20Hero%20Image.webp?alt=media&token=ad2c170e-e680-4320-bee8-a98d20881031" alt="Shirodhara Treatment" fill className="object-cover" priority unoptimized />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. SEARCH & LIST (No Gradients) */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Our Therapies</h2>
                            <p className="text-muted-foreground font-medium italic">Pure healing, naturally delivered</p>
                        </div>
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/30" />
                            <Input 
                                placeholder="Search treatments..." 
                                className="pl-12 py-7 rounded-2xl border-primary/10 bg-white shadow-sm focus:ring-primary text-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredTherapies.map((therapy) => (
                            <Card key={therapy.id} className="border-none bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
                                <div className="relative aspect-[16/11] w-full overflow-hidden bg-muted">
                                    <Image 
                                        src={therapy.imageUrl} 
                                        alt={therapy.name} 
                                        fill 
                                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                                        unoptimized
                                    />
                                </div>
                                <CardHeader className="pt-8">
                                    <CardTitle className="font-black text-2xl text-primary uppercase tracking-tight">{therapy.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="min-h-[80px]">
                                    <p className="text-muted-foreground text-sm leading-relaxed">{therapy.what.split('.').slice(0, 2).join('.') + '.'}</p>
                                </CardContent>
                                <CardFooter className="pb-8">
                                    <Button asChild className="w-full rounded-2xl py-6 font-bold uppercase tracking-widest border-primary text-primary hover:bg-primary hover:text-white transition-colors" variant="outline">
                                        <Link href={`/therapy/${therapy.slug}`}>View Details</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. WHY CHOOSE - SINGLE SQUARE IMAGE */}
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
                        <div className="relative aspect-square w-full max-w-lg mx-auto md:ml-auto">
                           <Image src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2FJournery%20Today.webp?alt=media&token=e35c3433-44e4-4cce-9356-646b5e8842ff" alt="Shreevarma Excellence" fill className="object-cover rounded-lg" unoptimized />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
