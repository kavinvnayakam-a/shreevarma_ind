'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, CheckCircle2, Sparkles, MapPin, ShoppingBag, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

const BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'shreevarma-india-location.firebasestorage.app';

const therapies = [
    { id: 't1', name: 'Podi Kizhi', slug: 'podi-kizhi', description: 'Herbal powder bolus massage for joint pain and stiffness.' },
    { id: 't2', name: 'Abhyangam', slug: 'abhyangam', description: 'Classic full-body synchronized massage with medicated oils.' },
    { id: 't3', name: 'Greeva Vasti', slug: 'greeva-vasti', description: 'Targeted oil pooling for neck and cervical spine care.' },
    { id: 't4', name: 'Kati Vasti', slug: 'kati-vasti', description: 'Warm oil treatment for lower back and sciatica relief.' },
    { id: 't5', name: 'Shirodhara', slug: 'shirodhara', description: 'Continuous oil stream on forehead for stress and sleep.' },
    { id: 't6', name: 'Udwartana', slug: 'udwartana', description: 'Dry herbal powder massage for weight loss and detox.' },
    { id: 't7', name: 'Janu Vasti', slug: 'janu-vasti', description: 'Specialized therapy for knee joint strengthening.' },
    { id: 't8', name: 'Pizhichil', slug: 'pizhichil', description: 'Royal oil bath combining massage and heat therapy.' },
    { id: 't9', name: 'Njavara Kizhi', slug: 'njavara-kizhi', description: 'Medicated rice bolus massage for muscle nourishment.' },
    { id: 't10', name: 'Nadi Sweda', slug: 'nadi-sweda', description: 'Localized steam therapy to open pores and reduce pain.' },
    { id: 't11', name: 'Takradhara', slug: 'takradhara', description: 'Cooling buttermilk stream for skin and mental calm.' },
    { id: 't12', name: 'Netra Tarpanam', slug: 'netra-tarpanam', description: 'Nourishing oil pooling for eye health and strain.' },
    { id: 't13', name: 'Nasya', slug: 'nasya', description: 'Nasal administration of oils for sinus and head clarity.' },
    { id: 't14', name: 'Pichu', slug: 'pichu', description: 'Medicated oil padding for localized inflammation.' },
    { id: 't15', name: 'Uro Vasti', slug: 'uro-vasti', description: 'Chest area oil pooling for respiratory and heart health.' },
    { id: 't16', name: 'Ksheeradhara', slug: 'ksheeradhara', description: 'Medicated milk stream for inflammatory conditions.' },
    { id: 't17', name: 'Patra Pinda Sweda', slug: 'patra-pinda-sweda', description: 'Fresh herbal leaf bolus massage for chronic pain.' },
    { id: 't18', name: 'Jaloukavacharanam', slug: 'leech-therapy', description: 'Traditional leech therapy for blood purification.' },
];

export default function TherapyPage() {
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => { setMounted(true); }, []);

    const getImageUrl = (path: string) => {
        const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(path)}?alt=media`;
        return mounted ? `${baseUrl}&t=${new Date().getHours()}` : baseUrl;
    };

    const filteredTherapies = useMemo(() => {
        return therapies.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
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
                        
                        <div className="relative aspect-square w-full max-w-lg mx-auto md:ml-auto">
                            <div className="relative aspect-square w-full rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                                <Image src={getImageUrl("site_assets/therapy/hero.png")} alt="Shirodhara Treatment" fill className="object-cover" priority unoptimized />
                            </div>
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
                                        src={getImageUrl(`site_assets/therapy/list_${therapy.slug}.webp`)} 
                                        alt={therapy.name} 
                                        fill 
                                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                                        unoptimized
                                    />
                                    {/* Gradient Removed as requested */}
                                </div>
                                <CardHeader className="pt-8">
                                    <CardTitle className="font-black text-2xl text-primary uppercase tracking-tight">{therapy.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="min-h-[80px]">
                                    <p className="text-muted-foreground text-sm leading-relaxed">{therapy.description}</p>
                                </CardContent>
                                <CardFooter className="pb-8">
                                    <Button className="w-full rounded-2xl py-6 font-bold uppercase tracking-widest border-primary text-primary hover:bg-primary hover:text-white transition-colors" variant="outline">
                                        View Details
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
                        {/* SINGLE SQUARE IMAGE - Clean (No Shadow/Radius override) */}
                        <div className="relative aspect-square w-full max-w-lg mx-auto md:ml-auto">
                            <div className="relative aspect-square w-full rounded-[3rem] overflow-hidden shadow-2xl">
                                <Image src={getImageUrl('site_assets/therapy/why_choose_main.webp')} alt="Shreevarma Excellence" fill className="object-cover" unoptimized />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}