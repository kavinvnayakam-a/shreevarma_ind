'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, CheckCircle2, Sparkles, MapPin, ShoppingBag, Video } from 'lucide-react';

const therapies = [
    { id: 't19', name: 'Vamana', slug: 'vamana', description: 'Therapeutic vomiting for cleansing Kapha dosha.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2FVamana.webp?alt=media&token=02731b7f-71b8-48e1-8d2b-a3668dafc7a6' },
    { id: 't2', name: 'Abhyangam', slug: 'abhyangam', description: 'Classic full-body synchronized massage with medicated oils.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fabhyangam.webp?alt=media&token=e64e1510-c56b-4088-9b17-9c36603d59ac' },
    { id: 't20', name: 'Acupuncture', slug: 'acupuncture', description: 'Ancient Chinese therapy using fine needles to balance energy.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Facupuncture.webp?alt=media&token=0fdeeb3d-b4a9-4089-866b-78f5fca3c12e' },
    { id: 't21', name: 'Basti', slug: 'basti', description: 'Medicated enema therapy, a cornerstone of Panchakarma.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fbasti.webp?alt=media&token=a369202c-d9d3-41d0-ad41-7ef689a964d6' },
    { id: 't17', name: 'Elakizhi', slug: 'elakizhi', description: 'Fresh herbal leaf bolus massage for chronic pain.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Felakizhi.webp?alt=media&token=8724c1cf-65b6-4ee0-ac25-83a01b1bfc78' },
    { id: 't3', name: 'Greeva Vasti', slug: 'greeva-vasti', description: 'Targeted oil pooling for neck and cervical spine care.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fgreeva-basti.webp?alt=media&token=7aa1ffa6-6210-44a9-8735-5a477b72e999' },
    { id: 't7', name: 'Janu Vasti', slug: 'janu-vasti', description: 'Specialized therapy for knee joint strengthening.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fjanu-basti.webp?alt=media&token=6adc1450-86c0-4e1b-80df-e08fbb10bc92' },
    { id: 't22', name: 'Karnapooranam', slug: 'karnapooranam', description: 'Ear therapy with warm medicated oil for ear health.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fkarnapooranam.webp?alt=media&token=eff0f270-48df-4f1c-952f-1bbaa493f1df' },
    { id: 't4', name: 'Kati Vasti', slug: 'kati-vasti', description: 'Warm oil treatment for lower back and sciatica relief.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fkati-vasti.webp?alt=media&token=faa9c3e3-bf2f-4eb9-95a3-4ebe030f9808' },
    { id: 't23', name: 'Lepam', slug: 'lepam', description: 'Application of herbal paste for skin conditions and pain.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Flepam.webp?alt=media&token=4054e610-6f95-453e-86f4-3a579fe2ce57' },
    { id: 't24', name: 'Mukha Lepam', slug: 'mukha-lepam', description: 'Ayurvedic facial treatment with herbal pastes.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fmukha-lepam.webp?alt=media&token=609a0a38-6ddb-4558-a1af-0a99ddb1cd7b' },
    { id: 't13', name: 'Nasyam', slug: 'nasyam', description: 'Nasal administration of oils for sinus and head clarity.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fnasyam.webp?alt=media&token=2bdf5c29-cedb-4ff9-9705-e3626020c6cd' },
    { id: 't9', name: 'Navarakizhi', slug: 'navarakizhi', description: 'Medicated rice bolus massage for muscle nourishment.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fnavarakizhi.webp?alt=media&token=a37586c5-0ff6-44d1-a685-a752fdd47b13' },
    { id: 't12', name: 'Netra Tarpanam', slug: 'netra-tarpanam', description: 'Nourishing oil pooling for eye health and strain.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fnetra-tarpanam.webp?alt=media&token=01e02346-f68a-425a-9e6f-cec65bf5239e' },
    { id: 't25', name: 'Pada Abhyangam', slug: 'pada-abhyangam', description: 'Soothing Ayurvedic foot massage to balance doshas.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fpada-abhyangam.webp?alt=media&token=14b27e01-7a86-45c1-adc7-b99990aeeb13' },
    { id: 't14', name: 'Pichu', slug: 'pichu', description: 'Medicated oil padding for localized inflammation.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fpichu.webp?alt=media&token=e75d6674-5b2c-49f5-91b6-3a7f95d09ff8' },
    { id: 't8', name: 'Pizhichil', slug: 'pizhichil', description: 'Royal oil bath combining massage and heat therapy.', imageUrl: 'http://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fpizhichil.webp?alt=media&token=89bc2874-5427-4bff-a78d-a647d176f14a' },
    { id: 't1', name: 'Podikizhi', slug: 'podikizhi', description: 'Herbal powder bolus massage for joint pain and stiffness.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fpodikizhi.webp?alt=media&token=01b91345-f424-4d54-bdea-22b24ddca91f' },
    { id: 't18', name: 'Raktamokshana', slug: 'raktamokshana', description: 'Traditional bloodletting therapy for purification.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fraktamokshana.webp?alt=media&token=71c35cc9-f70e-442d-84ef-0a0ca9a7cbe1' },
    { id: 't26', name: 'Shiro Abhyangam', slug: 'shiro-abhyangam', description: 'Traditional Indian head massage to relieve stress.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fshiro-abhyangam.webp?alt=media&token=7e7d8052-787e-438c-938b-059308b23ceb' },
    { id: 't5', name: 'Shirodhara', slug: 'shirodhara', description: 'Continuous oil stream on forehead for stress and sleep.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fshirodhara.webp?alt=media&token=3eae7a87-b9aa-4c45-ae33-14be8931d376' },
    { id: 't10', name: 'Swedana', slug: 'swedana', description: 'Localized steam therapy to open pores and reduce pain.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fswedana.webp?alt=media&token=d0ec91b3-263d-4b67-8c47-2af24aa1ffeb' },
    { id: 't11', name: 'Takradhara', slug: 'takradhara', description: 'Cooling buttermilk stream for skin and mental calm.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Ftakradhara.webp?alt=media&token=1e5ec8bc-f37c-4375-966e-58fcbd31658e' },
    { id: 't6', name: 'Udvarthanam', slug: 'udvarthanam', description: 'Dry herbal powder massage for weight loss and detox.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fudvarthanam.webp?alt=media&token=db1f0dc0-152b-4518-99a5-2593e55ab430' },
    { id: 't27', name: 'Valuka Swedana', slug: 'valuka-swedana', description: 'Fomentation therapy using heated sand-filled boluses.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fvaluka-swedana.webp?alt=media&token=73adb783-4e3f-4bf0-8bda-d47267236475' },
    { id: 't28', name: 'Varma', slug: 'varma', description: 'Pressure point therapy to stimulate vital energy points.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fvarma.webp?alt=media&token=2490d84a-8827-4b15-a82b-d484d59229c4' },
    { id: 't29', name: 'Virechana', slug: 'virechana', description: 'Therapeutic purgation for cleansing Pitta dosha.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2Fvirechana.webp?alt=media&token=d9a78447-300f-4012-8315-b7c3c865dd83' },
];


export default function TherapyPage() {
    const [searchQuery, setSearchQuery] = useState('');

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
                        <div className="relative aspect-square w-full max-w-lg mx-auto md:ml-auto">
                           <Image src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/therapy%20page%2FJournery%20Today.webp?alt=media&token=e35c3433-44e4-4cce-9356-646b5e8842ff" alt="Shreevarma Excellence" fill className="object-cover rounded-lg" unoptimized />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
