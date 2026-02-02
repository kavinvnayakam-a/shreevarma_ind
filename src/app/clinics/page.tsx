
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ClinicListItem } from '@/components/clinics/clinic-list-item';
import { clinicsData } from './clinics-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContactForm } from '@/components/clinics/contact-form';

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
        <div className="bg-[#F9F5F1]">
            {/* Clinics List Section */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Explore 15+ Trusted Ayurveda Centers Nearby</h2>
                        <p className="text-lg text-muted-foreground mt-2">Quality care made accessible with expert Ayurvedic doctors, close to your location</p>
                    </div>
                    <div className="flex justify-center gap-4 flex-wrap bg-white p-4 rounded-lg shadow-md max-w-3xl mx-auto mb-12">
                        <Select value={city} onValueChange={setCity}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                            <SelectContent>
                                {cities.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'All Cities' : c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={area} onValueChange={setArea} disabled={city === 'all'}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Select Area" />
                            </SelectTrigger>
                            <SelectContent>
                                {areas.map(a => <SelectItem key={a} value={a}>{a === 'all' ? 'All Areas' : a}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {/* Mock dropdowns, can be made functional later */}
                        <Select>
                            <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Treatments" /></SelectTrigger>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Facilities" /></SelectTrigger>
                        </Select>
                    </div>

                    <div className="space-y-6 max-w-5xl mx-auto">
                        {filteredClinics.slice(0, visibleClinics).map((clinic) => (
                            <ClinicListItem key={clinic.id} clinic={clinic} />
                        ))}
                    </div>
                    
                    {filteredClinics.length === 0 && (
                        <div className="text-center text-muted-foreground py-10">
                            <p>No clinics found for your current selection.</p>
                        </div>
                    )}

                    {visibleClinics < filteredClinics.length && (
                        <div className="text-center mt-12">
                        <Button variant="outline" onClick={showMoreClinics}>View More</Button>
                        </div>
                    )}
                </div>
            </section>

             {/* Contact Form Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                         <div className="relative max-w-sm mx-auto">
                            <Image src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/logos%2FJournery%20Today.webp?alt=media&token=fcf565f8-d3eb-4e0e-9086-9cc93e6b1251"
                                alt="Get Started" width={500} height={500} className="object-contain"/>
                        </div>
                    </div>
                    <div>
                        <div className="text-left mb-8">
                            <h2 className="text-3xl font-bold font-headline text-primary">Get Personalized Assistance</h2>
                            <p className="text-lg text-muted-foreground mt-2">Share a few details and let us find the perfect Ayurvedic doctor to match your specific requirements.</p>
                        </div>
                        <ContactForm />
                    </div>
                </div>
            </section>
        </div>
    );
}
