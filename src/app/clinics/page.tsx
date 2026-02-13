'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ClinicListItem } from '@/components/clinics/clinic-list-item';
import { clinicsData } from './clinics-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContactForm } from '@/components/clinics/contact-form';
import { MapPin, Sparkles, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ClinicsPage() {
    const [visibleClinics, setVisibleClinics] = useState(5);
    const [city, setCity] = useState('all');
    const [area, setArea] = useState('all');

    const cities = useMemo(() => ['all', ...Array.from(new Set(clinicsData.map(c => c.city)))], []);
    const areas = useMemo(() => {
        if (city === 'all') return ['all'];
        return ['all', ...Array.from(new Set(clinicsData.filter(c => c.city === city).map(c => c.area)))];
    }, [city]);

    const filteredClinics = useMemo(() => {
        return clinicsData.filter(clinic => {
            const cityMatch = city === 'all' || clinic.city === city;
            const areaMatch = area === 'all' || clinic.area === area;
            return cityMatch && areaMatch;
        });
    }, [city, area]);

    const showMoreClinics = () => {
        setVisibleClinics(prev => prev + 5);
    };

    // Unified Heading Style
    const HEADING_STYLE = "text-3xl md:text-5xl font-bold font-headline text-primary uppercase tracking-tight";

    return (
        <div className="bg-[#F9F5F1] min-h-screen font-sans selection:bg-primary/10">
            {/* Header / Filter Section */}
            <section className="pt-16 pb-20">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <MapPin className="text-primary w-5 h-5" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 font-headline">Find Your Center</span>
                        </div>
                        <h2 className={cn("mb-8 leading-[1.1]", HEADING_STYLE)}>
                            Explore 15+ Trusted Ayurveda Centers Nearby
                        </h2>
                        <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                            Quality care made accessible with expert Ayurvedic doctors, close to your location.
                        </p>
                    </div>

                    {/* Styled Filters */}
                    <div className="flex justify-center gap-4 flex-wrap bg-white p-8 rounded-[2rem] border border-primary/5 max-w-4xl mx-auto mb-20 shadow-sm">
                        <Select value={city} onValueChange={setCity}>
                            <SelectTrigger className="w-full sm:w-[220px] rounded-xl bg-[#F9F5F1] border-none font-bold text-[11px] uppercase tracking-tight h-14 px-6">
                                <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none shadow-xl">
                                {cities.map(c => (
                                    <SelectItem key={c} value={c} className="text-[11px] uppercase font-bold tracking-tight py-3">
                                        {c === 'all' ? 'All Cities' : c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={area} onValueChange={setArea} disabled={city === 'all'}>
                            <SelectTrigger className="w-full sm:w-[220px] rounded-xl bg-[#F9F5F1] border-none font-bold text-[11px] uppercase tracking-tight h-14 px-6">
                                <SelectValue placeholder="Select Area" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none shadow-xl">
                                {areas.map(a => (
                                    <SelectItem key={a} value={a} className="text-[11px] uppercase font-bold tracking-tight py-3">
                                        {a === 'all' ? 'All Areas' : a}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button className="w-full sm:w-auto px-12 rounded-xl bg-primary hover:opacity-90 text-white font-bold font-headline uppercase text-[11px] tracking-tight h-14 transition-all shadow-lg shadow-primary/20">
                            Search Centers
                        </Button>
                    </div>

                    {/* Clinic Cards List */}
                    <div className="space-y-6 max-w-5xl mx-auto">
                        {filteredClinics.slice(0, visibleClinics).map((clinic) => (
                            <ClinicListItem key={clinic.id} clinic={clinic} />
                        ))}
                    </div>
                    
                    {filteredClinics.length === 0 && (
                        <div className="text-center py-20 bg-white/50 rounded-[2.5rem] border border-dashed border-primary/10">
                            <p className="text-xs font-bold uppercase tracking-tight text-muted-foreground/60 font-headline">No clinics found for your selection.</p>
                        </div>
                    )}

                    {visibleClinics < filteredClinics.length && (
                        <div className="text-center mt-16">
                            <Button 
                                onClick={showMoreClinics}
                                variant="outline"
                                className="rounded-full px-12 py-8 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold font-headline uppercase tracking-tight flex items-center gap-3 transition-all"
                            >
                                View More Centers
                                <ChevronDown className="w-5 h-5" />
                            </Button>
                        </div>
                    )}
                </div>
            </section>

             {/* Contact Form Section */}
            <section className="py-32 bg-white rounded-t-[4rem]">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="relative aspect-square max-w-lg mx-auto lg:mx-0 overflow-hidden">
                            <Image 
                                src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/logos%2FJournery%20Today.webp?alt=media&token=fcf565f8-d3eb-4e0e-9086-9cc93e6b1251"
                                alt="Get Personalized Assistance" 
                                fill
                                sizes="(max-width: 768px) 100vw, 600px"
                                className="object-cover"
                                priority 
                                loading="eager"
                                unoptimized
                            />
                        </div>
                        
                        <div className="space-y-12">
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-6">
                                    <Sparkles className="text-primary w-5 h-5" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 font-headline">Expert Assistance</span>
                                </div>
                                <h2 className={cn("leading-[1.1]", HEADING_STYLE)}>
                                    Get Personalized Assistance
                                </h2>
                                <p className="text-xl text-muted-foreground font-medium mt-8 leading-relaxed">
                                    Share a few details and let us find the perfect Ayurvedic doctor to match your specific health requirements.
                                </p>
                            </div>
                            <div className="bg-[#F9F5F1] p-10 rounded-[2.5rem] border border-primary/5">
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}