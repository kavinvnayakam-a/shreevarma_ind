'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ClinicListItem } from '@/components/clinics/clinic-list-item';
import { clinicsData } from './clinics-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContactForm } from '@/components/clinics/contact-form';
import { MapPin, Sparkles } from 'lucide-react';

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

    return (
        <div className="bg-[#F9F5F1] min-h-screen">
            {/* Header / Filter Section */}
            <section className="pt-16 pb-20">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <MapPin className="text-[#6f3a2f] w-5 h-5" />
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#6f3a2f]/60">Find Your Center</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black font-headline text-primary uppercase tracking-tighter leading-none mb-6">
                            Explore 15+ Trusted Ayurveda Centers Nearby
                        </h2>
                        <p className="text-lg text-muted-foreground italic leading-relaxed">
                            Quality care made accessible with expert Ayurvedic doctors, close to your location.
                        </p>
                    </div>

                    {/* Styled Filters */}
                    <div className="flex justify-center gap-4 flex-wrap bg-white/50 backdrop-blur-sm p-6 rounded-[2rem] border border-white max-w-4xl mx-auto mb-16 shadow-sm">
                        <Select value={city} onValueChange={setCity}>
                            <SelectTrigger className="w-full sm:w-[210px] rounded-full bg-white border-slate-100 font-bold text-xs uppercase tracking-widest h-12">
                                <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl">
                                {cities.map(c => <SelectItem key={c} value={c} className="text-xs uppercase font-bold">{c === 'all' ? 'All Cities' : c}</SelectItem>)}
                            </SelectContent>
                        </Select>

                        <Select value={area} onValueChange={setArea} disabled={city === 'all'}>
                            <SelectTrigger className="w-full sm:w-[210px] rounded-full bg-white border-slate-100 font-bold text-xs uppercase tracking-widest h-12">
                                <SelectValue placeholder="Select Area" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl">
                                {areas.map(a => <SelectItem key={a} value={a} className="text-xs uppercase font-bold">{a === 'all' ? 'All Areas' : a}</SelectItem>)}
                            </SelectContent>
                        </Select>

                        <Button className="w-full sm:w-auto px-10 rounded-full bg-[#6f3a2f] hover:bg-[#5a2e25] text-white font-black uppercase text-xs tracking-[0.2em] h-12 shadow-lg transition-all active:scale-95">
                            Search Centers
                        </Button>
                    </div>

                    {/* Clinic Cards List */}
                    <div className="space-y-8 max-w-5xl mx-auto">
                        {filteredClinics.slice(0, visibleClinics).map((clinic) => (
                            /* Note: Ensure ClinicListItem component accepts a 'disabled' prop 
                               or manually update it to hide the enquiry button.
                            */
                            <ClinicListItem key={clinic.id} clinic={clinic} />
                        ))}
                    </div>
                    
                    {filteredClinics.length === 0 && (
                        <div className="text-center py-20 bg-white/30 rounded-[3rem] border border-dashed border-slate-300">
                            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">No clinics found for your current selection.</p>
                        </div>
                    )}

                    {visibleClinics < filteredClinics.length && (
                        <div className="text-center mt-16">
                            <Button 
                                variant="outline" 
                                onClick={showMoreClinics}
                                className="rounded-full px-12 border-[#6f3a2f] text-[#6f3a2f] font-black uppercase text-xs tracking-widest hover:bg-[#6f3a2f] hover:text-white transition-all h-14"
                            >
                                View More Centers
                            </Button>
                        </div>
                    )}
                </div>
            </section>

             {/* Contact Form Section */}
            <section className="py-24 bg-white rounded-t-[4rem] shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
                    <div className="relative">
                         <div className="relative w-full aspect-square max-w-md mx-auto">
                            <Image 
                                src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/logos%2FJournery%20Today.webp?alt=media&token=fcf565f8-d3eb-4e0e-9086-9cc93e6b1251"
                                alt="Get Personalized Assistance" 
                                fill
                                className="object-contain"
                                priority 
                                loading="eager"
                                fetchPriority="high"
                                quality={90}
                                sizes="(max-width: 768px) 100vw, 500px"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="text-left mb-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="text-[#6f3a2f] w-5 h-5" />
                                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#6f3a2f]/60">Expert Assistance</span>
                            </div>
                            <h2 className="text-4xl font-black font-headline text-primary uppercase tracking-tighter leading-none mb-6">
                                Get Personalized Assistance
                            </h2>
                            <p className="text-lg text-muted-foreground italic leading-relaxed">
                                Share a few details and let us find the perfect Ayurvedic doctor to match your specific requirements.
                            </p>
                        </div>
                        <div className="bg-[#F9F5F1]/50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
                            <ContactForm />
                        </div>
                        
                        {/* Disabling/Removing the Enquiry Button logic 
                          If you have a separate 'Enquiry' button here, it is now removed 
                        */}
                    </div>
                </div>
            </section>
        </div>
    );
}