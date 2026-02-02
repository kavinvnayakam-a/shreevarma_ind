'use client';
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, IndianRupee, Clock, ShieldCheck, Search, CheckCircle2 } from 'lucide-react';
import { specialists } from '@/components/home/specialists-data';
import { DoctorListItem } from '@/components/consultation/doctor-list-item';
import { BookingModal } from '@/components/consultation/BookingModal';
import { cn } from '@/lib/utils';

const BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'shreevarma-india-location.firebasestorage.app';

const placeholders = [
    'Search by Doctor name...',
    'Search by specialty...',
    'e.g., Dr. Shreevarma',
];

export default function ConsultationPage() {
    const [mounted, setMounted] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [visibleDoctors, setVisibleDoctors] = useState(4);
    const [searchQuery, setSearchQuery] = useState('');
    const [placeholder, setPlaceholder] = useState(placeholders[0]);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Typing Animation logic
    useEffect(() => {
        let typingTimeout: NodeJS.Timeout;
        let currentPlaceholderIndex = 0;
        let currentText = '';
        let isDeleting = false;

        const type = () => {
            const fullText = placeholders[currentPlaceholderIndex];
            let typeSpeed = 100;
            if (isDeleting) {
                currentText = fullText.substring(0, currentText.length - 1);
                typeSpeed = 50;
            } else {
                currentText = fullText.substring(0, currentText.length + 1);
                typeSpeed = 100;
            }
            setPlaceholder(currentText);
            if (!isDeleting && currentText === fullText) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && currentText === '') {
                isDeleting = false;
                currentPlaceholderIndex = (currentPlaceholderIndex + 1) % placeholders.length;
                typeSpeed = 500;
            }
            typingTimeout = setTimeout(type, typeSpeed);
        };
        typingTimeout = setTimeout(type, 100);
        return () => clearTimeout(typingTimeout);
    }, []);

    const getImageUrl = (path: string) => {
        const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(path)}?alt=media`;
        return mounted ? `${baseUrl}&t=${new Date().getHours()}` : baseUrl;
    };

    const filteredDoctors = useMemo(() => {
        return specialists.filter(doctor => {
            const nameMatch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
            const specialtyMatch = doctor.specialty?.toLowerCase().includes(searchQuery.toLowerCase());
            return nameMatch || specialtyMatch;
        });
    }, [searchQuery]);

    return (
        <div className="relative min-h-screen bg-[#FDFCFB]">
            
            {/* FLOATING ACTION BUTTON */}
            <div className="fixed top-1/2 -translate-y-1/2 right-0 z-[100]">
                <Button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="flex flex-row items-center gap-4 h-auto py-7 px-4 animate-shine rounded-l-2xl rounded-r-none shadow-2xl bg-primary hover:bg-primary/90 text-white transition-all group border-y border-l border-white/20"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                    <Video className="w-6 h-6 -rotate-90 group-hover:scale-110 transition-transform" />
                    <span className="font-bold tracking-widest uppercase text-xs md:text-sm">
                        Book Consultation
                    </span>
                </Button>
            </div>

            {/* HERO SECTION */}
            <section className="relative bg-white w-full">
                <div className="relative w-full min-h-[300px] md:min-h-[368px] aspect-square md:aspect-[1400/368] overflow-hidden">
                    <Image 
                        src={getImageUrl('site_assets/consultation/hero_mobile.png')} 
                        alt="Consultation Mobile Banner" 
                        fill 
                        className="object-cover md:hidden" 
                        priority 
                        unoptimized
                    />
                    <Image 
                        src={getImageUrl('site_assets/consultation/hero_desktop.png')} 
                        alt="Consultation Desktop Banner" 
                        fill 
                        className="object-cover hidden md:block" 
                        priority 
                        unoptimized
                    />
                </div>
            </section>

            {/* SEARCH BOX */}
            <section className="relative -mt-8 z-20 px-6">
                <div className="container mx-auto max-w-2xl">
                    <div className="relative group shadow-lg rounded-2xl overflow-hidden border border-primary/10">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-primary/60 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-8 py-5 bg-white border-none focus:ring-0 text-lg transition-all outline-none text-primary font-medium"
                        />
                    </div>
                </div>
            </section>

            {/* NEW ATTRACTIVE INFO SECTION */}
            <section className="py-20 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Fee Card */}
                        <div className="group p-8 rounded-3xl bg-white border border-primary/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                <IndianRupee className="w-7 h-7" />
                            </div>
                            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-2">Consultation Fee</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-primary">₹500</span>
                                <span className="text-muted-foreground font-medium">/ session</span>
                            </div>
                            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">Professional Ayurvedic guidance at an affordable price point.</p>
                        </div>

                        {/* Timing Card */}
                        <div className="group p-8 rounded-3xl bg-white border border-primary/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors text-amber-600">
                                <Clock className="w-7 h-7" />
                            </div>
                            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-2">Availability</h3>
                            <div className="text-2xl font-black text-primary">Mon — Sat</div>
                            <div className="text-lg font-bold text-amber-600/80">10:00 AM - 07:00 PM</div>
                            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">Flexible booking slots throughout the week to suit your schedule.</p>
                        </div>

                        {/* Privacy Card */}
                        <div className="group p-8 rounded-3xl bg-white border border-primary/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors text-emerald-600">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-2">Privacy Assurance</h3>
                            <div className="text-2xl font-black text-primary uppercase">100% Private</div>
                            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">End-to-end encrypted video consultations ensuring patient confidentiality.</p>
                        </div>

                    </div>
                </div>
            </section>

            {/* DOCTORS LIST */}
            <section className="py-12 bg-[#F9F8F6]">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto space-y-6">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Our Specialists</h2>
                            <div className="h-px flex-1 bg-primary/10 ml-6 hidden md:block" />
                        </div>
                        {filteredDoctors.slice(0, visibleDoctors).map((doctor) => (
                            <DoctorListItem key={doctor.slug} doctor={doctor} onBookNow={() => setIsBookingModalOpen(true)} />
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US - Cleaned up version */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div className="relative w-full aspect-[4/5] max-w-md mx-auto">
                            <Image 
                                src={getImageUrl('site_assets/consultation/why_choose_docs.png')} 
                                alt="Doctors at Shreevarma" 
                                fill 
                                className="object-cover" 
                                unoptimized
                            />
                        </div>
                        <div className="space-y-10">
                            <div>
                                <h2 className="text-5xl font-black font-headline text-primary leading-[1.1] tracking-tighter uppercase">Why Choose <br/> Our Doctors?</h2>
                                <p className="text-muted-foreground text-lg mt-6 font-medium">Shreevarma combines traditional pulse diagnosis with modern digital convenience.</p>
                            </div>
                            <div className="grid gap-6">
                                {[
                                    { title: "25+ Years Experience", desc: "Expertise in complex chronic conditions." },
                                    { title: "Nadi Pariksha Experts", desc: "Traditional pulse diagnosis via digital medium." },
                                    { title: "Global Patient Base", desc: "Trusted by thousands across the globe." },
                                    { title: "Certified Practitioners", desc: "BAMS & MD qualified Ayurvedic specialists." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 items-start">
                                        <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-lg text-primary">{item.title}</h4>
                                            <p className="text-muted-foreground">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <BookingModal open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen} />
        </div>
    );
}