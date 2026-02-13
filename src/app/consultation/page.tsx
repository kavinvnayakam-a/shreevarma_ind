'use client';
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Video, IndianRupee, Clock, ShieldCheck, CheckCircle2, ChevronDown } from 'lucide-react';
import { specialists } from '@/components/home/specialists-data';
import { DoctorListItem } from '@/components/consultation/doctor-list-item';
import { BookingModal } from '@/components/consultation/BookingModal';

const BUCKET = 'shreevarma-india-location.firebasestorage.app';

export default function ConsultationPage() {
    const [mounted, setMounted] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    
    const DOCTORS_PER_PAGE = 4;
    const [visibleDoctors, setVisibleDoctors] = useState(DOCTORS_PER_PAGE);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getImageUrl = (path: string) => {
        const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(path)}?alt=media`;
        return mounted ? `${baseUrl}&t=${new Date().getHours()}` : baseUrl;
    };

    const handleLoadMore = () => {
        setVisibleDoctors(prev => prev + DOCTORS_PER_PAGE);
    };

    // Unified Heading Style to match Home & Products
    const HEADING_STYLE = "text-3xl md:text-5xl font-bold font-headline text-primary uppercase tracking-tight";

    return (
        <div className="relative min-h-screen bg-[#FDFCFB] font-sans selection:bg-primary/10 pb-32">
            
            {/* STICKY BOTTOM ACTION */}
            <div className="md:hidden fixed bottom-20 left-0 w-full z-[40] px-4 py-3 bg-gradient-to-t from-[#FDFCFB] via-[#FDFCFB]/90 to-transparent">
                <Button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full h-14 rounded-xl shadow-xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-3 transition-all active:scale-[0.98] border border-white/20 font-bold font-headline uppercase tracking-tight"
                >
                    <Video className="w-5 h-5" />
                    <span className="text-xs">
                        Book Consultation Now
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
                        sizes="(max-width: 768px) 100vw, 1400px"
                        className="object-cover md:hidden" 
                        priority
                        loading="eager"
                        unoptimized
                    />
                    <Image 
                        src={getImageUrl('site_assets/consultation/hero_desktop.png')} 
                        alt="Consultation Desktop Banner" 
                        fill 
                        sizes="100vw"
                        className="object-cover hidden md:block" 
                        priority
                        loading="eager"
                        unoptimized
                    />
                </div>
            </section>

            {/* INFO SECTION */}
            <section className="py-20 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="group p-10 rounded-[2rem] bg-white border border-primary/5 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                                <IndianRupee className="w-8 h-8" />
                            </div>
                            <h3 className="text-xs uppercase tracking-tight text-muted-foreground font-bold font-headline mb-3">Consultation Fee</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-bold font-headline text-primary tracking-tight">₹500</span>
                                <span className="text-muted-foreground font-bold text-xs uppercase tracking-tight">/ Session</span>
                            </div>
                        </div>

                        <div className="group p-10 rounded-[2rem] bg-white border border-primary/5 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-8 group-hover:bg-amber-500 group-hover:text-white transition-all text-amber-600">
                                <Clock className="w-8 h-8" />
                            </div>
                            <h3 className="text-xs uppercase tracking-tight text-muted-foreground font-bold font-headline mb-3">Availability</h3>
                            <div className="text-3xl font-bold font-headline text-primary tracking-tight uppercase">Mon — Sat</div>
                            <div className="text-lg font-bold text-amber-600/80 mt-1 uppercase tracking-tight">10AM - 7PM</div>
                        </div>

                        <div className="group p-10 rounded-[2rem] bg-white border border-primary/5 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-8 group-hover:bg-emerald-500 group-hover:text-white transition-all text-emerald-600">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-xs uppercase tracking-tight text-muted-foreground font-bold font-headline mb-3">Data Security</h3>
                            <div className="text-3xl font-bold font-headline text-primary tracking-tight uppercase">100% Private</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* DOCTORS LIST */}
            <section className="py-20 bg-[#F9F8F6]">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto space-y-10">
                        <div className="flex items-center gap-8 mb-16">
                            <h2 className={HEADING_STYLE}>Our Specialists</h2>
                            <div className="h-[2px] w-full bg-primary/10" />
                        </div>
                        
                        <div className="grid gap-6">
                            {specialists.slice(0, visibleDoctors).map((doctor) => (
                                <DoctorListItem key={doctor.slug} doctor={doctor} onBookNow={() => setIsBookingModalOpen(true)} />
                            ))}
                        </div>

                        {visibleDoctors < specialists.length && (
                            <div className="flex justify-center pt-16">
                                <Button 
                                    onClick={handleLoadMore}
                                    variant="outline"
                                    className="px-12 py-8 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold font-headline uppercase tracking-tight flex items-center gap-3 transition-all"
                                >
                                    Load More Doctors
                                    <ChevronDown className="w-5 h-5" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="relative w-full aspect-square max-w-lg mx-auto lg:mx-0 overflow-hidden">
                            <Image 
                                src={getImageUrl('site_assets/consultation/why_choose_docs.png')} 
                                alt="Expert Doctors" 
                                fill 
                                sizes="(max-width: 768px) 100vw, 600px"
                                className="object-cover" 
                                priority
                                loading="eager"
                                unoptimized
                            />
                        </div>

                        <div className="space-y-12">
                            <div>
                                <h2 className={HEADING_STYLE}>
                                    Why Choose <br/> Our Doctors?
                                </h2>
                                <p className="text-muted-foreground text-xl mt-8 font-medium leading-relaxed">
                                    Shreevarma specialists combine traditional pulse diagnosis with modern digital convenience.
                                </p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-8">
                                {[
                                    { title: "25+ Years", desc: "CLINICAL EXCELLENCE." },
                                    { title: "Nadi Pariksha", desc: "TRADITIONAL EXPERTS." },
                                    { title: "Global Trust", desc: "40+ COUNTRIES SERVED." },
                                    { title: "Certified", desc: "BAMS & MD QUALIFIED." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 items-start p-6 bg-[#FDFCFB] border border-primary/5">
                                        <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold font-headline text-lg text-primary uppercase tracking-tight leading-tight">{item.title}</h4>
                                            <p className="text-muted-foreground text-[10px] font-bold mt-1 uppercase tracking-tight">{item.desc}</p>
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