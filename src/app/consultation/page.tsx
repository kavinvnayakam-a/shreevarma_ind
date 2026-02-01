
'use client';
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Video, IndianRupee, Clock, ShieldCheck } from 'lucide-react';
import { specialists } from '@/components/home/specialists-data';
import { DoctorListItem } from '@/components/consultation/doctor-list-item';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BookingModal } from '@/components/consultation/BookingModal';

const tamilNaduCities = [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Vellore', 'Erode', 'Thoothukudi', 'Dindigul', 'Thanjavur', 'Hosur', 'Nagercoil', 'Kanchipuram', 'Kumarapalayam', 'Karur', 'Udhagamandalam', 'Tiruvannamalai', 'Pondicherry', 'Kumbakonam', 'Rajapalayam', 'Pudukkottai', 'Neyveli', 'Ambur', 'Viluppuram', 'Nagapattinam'
];

const placeholders = [
    'Search by Doctor name...',
    'Search by specialty...',
    'e.g., Dr. Shreevarma',
];

const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/`;
const urlSuffix = `?alt=media`;

const getImageUrl = (path: string) => `${baseUrl}${encodeURIComponent(path)}${urlSuffix}`;

export default function ConsultationPage() {
    const whyChooseImage = {
        imageUrl: getImageUrl('site_assets/consultation/why_choose_docs.png'),
        imageHint: 'doctors collage'
    };
    
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [visibleDoctors, setVisibleDoctors] = useState(4);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('all');
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [placeholder, setPlaceholder] = useState(placeholders[0]);

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

    useEffect(() => {
        if (searchQuery.length > 1) {
            setIsPopoverOpen(true);
        } else {
            setIsPopoverOpen(false);
        }
    }, [searchQuery]);

    const filteredDoctors = useMemo(() => {
        return specialists.filter(doctor => {
            const nameMatch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
            const cityMatch = selectedCity === 'all' || !selectedCity ? true : doctor.location.toLowerCase().includes(selectedCity.toLowerCase());
            return nameMatch && cityMatch;
        });
    }, [searchQuery, selectedCity]);

    const showMoreDoctors = () => {
        setVisibleDoctors(prev => prev + 4);
    };
    
    const searchSuggestions = useMemo(() => {
        if (searchQuery.length < 2) return [];
        return specialists.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
    }, [searchQuery]);

  return (
    <div className="relative min-h-screen bg-[#F9F5F1]">
      
      {/* FLOATING CONSULTATION BAR - Wrapped in a position anchor */}
      <div className="fixed top-1/2 -translate-y-1/2 right-0 z-[100]">
        <Button
            onClick={() => setIsBookingModalOpen(true)}
            className="flex flex-row items-center gap-4 h-auto py-7 px-4 animate-shine rounded-l-2xl rounded-r-none shadow-2xl bg-primary hover:bg-primary/90 text-white transition-all group border-y border-l border-white/20"
            aria-label="Book a video consultation"
            style={{ 
            writingMode: 'vertical-rl', 
            textOrientation: 'mixed'
            }}
        >
            <Video className="w-6 h-6 -rotate-90 group-hover:scale-110 transition-transform" />
            <span className="font-bold tracking-widest uppercase text-xs md:text-sm">
            Book Consultation
            </span>
        </Button>
      </div>

       {/* Hero Section */}
      <section className="relative bg-white w-full">
          <div className="relative w-full aspect-square sm:aspect-[1400/368]">
              <picture>
                  <source media="(max-width: 767px)" srcSet={getImageUrl('site_assets/consultation/hero_mobile.png')} />
                  <source media="(min-width: 768px)" srcSet={getImageUrl('site_assets/consultation/hero_desktop.png')} />
                  <Image 
                      src={getImageUrl('site_assets/consultation/hero_desktop.png')} 
                      alt="Online Doctor Consultation" 
                      fill 
                      className="object-cover" 
                      priority
                  />
              </picture>
          </div>
      </section>

      {/* Consultation Info Section */}
        <section className="py-16">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Video Consultation Details</h2>
                    <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">Everything you need to know before booking your appointment.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="text-center border-primary/20 bg-white/50">
                        <CardHeader className="items-center">
                            <div className="bg-primary/10 rounded-full p-3 w-fit">
                                <IndianRupee className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle>Consultation Fee</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">₹500</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center border-primary/20 bg-white/50">
                         <CardHeader className="items-center">
                            <div className="bg-primary/10 rounded-full p-3 w-fit">
                                <Clock className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle>Available Timings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-semibold text-lg">Monday - Saturday</p>
                            <p className="text-muted-foreground">10:00 AM to 7:00 PM</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center border-primary/20 bg-white/50">
                        <CardHeader className="items-center">
                            <div className="bg-primary/10 rounded-full p-3 w-fit">
                                <ShieldCheck className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle>User Consent</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">By booking, you agree to our terms and conditions to a recorded video session for quality and training purposes.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

      {/* Doctors List Section */}
       <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-primary">100+ Professional Doctor Available</h2>
            <p className="text-muted-foreground">Book appointments with minimum wait-time & verified doctor details</p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {filteredDoctors.slice(0, visibleDoctors).map((doctor) => (
                <DoctorListItem key={doctor.slug} doctor={doctor} onBookNow={() => setIsBookingModalOpen(true)} />
            ))}
          </div>
          
          {filteredDoctors.length === 0 && (
            <div className="text-center text-muted-foreground py-10">
                <p>No doctors found for your current search criteria.</p>
            </div>
          )}

          {visibleDoctors < filteredDoctors.length && (
            <div className="text-center mt-12">
              <Button variant="outline" onClick={showMoreDoctors}>View More</Button>
            </div>
          )}
        </div>
      </section>

     {/* Why Choose Us Section */}
    <section className="py-16">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Why Choose Our Doctors?</h2>
                <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">At Shree Varma, we ensure you receive the best Ayurvedic care.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative w-full aspect-square max-w-md mx-auto">
                    {whyChooseImage && <Image src={whyChooseImage.imageUrl} alt="Why Choose Us" fill className="object-contain rounded-lg" />}
                </div>
                <div>
                    <ul className="space-y-6 text-lg">
                         <li className="flex items-start gap-4">
                            <span className="font-bold text-primary text-2xl">1.</span>
                            <div>
                                <h3 className="font-semibold text-xl">Certified Specialists</h3>
                                <p className="text-muted-foreground text-base">Our doctors are trained in authentic Ayurvedic and Siddha practices.</p>
                            </div>
                        </li>
                         <li className="flex items-start gap-4">
                            <span className="font-bold text-primary text-2xl">2.</span>
                            <div>
                                <h3 className="font-semibold text-xl">Personalized Care</h3>
                                <p className="text-muted-foreground text-base">Every treatment is tailored to your unique health needs.</p>
                            </div>
                        </li>
                         <li className="flex items-start gap-4">
                            <span className="font-bold text-primary text-2xl">3.</span>
                            <div>
                                <h3 className="font-semibold text-xl">Trusted Expertise</h3>
                                <p className="text-muted-foreground text-base">Years of clinical experience across various health conditions.</p>
                            </div>
                        </li>
                         <li className="flex items-start gap-4">
                            <span className="font-bold text-primary text-2xl">4.</span>
                            <div>
                                <h3 className="font-semibold text-xl">Accessible Consultations</h3>
                                <p className="text-muted-foreground text-base">Online and offline appointments to suit your lifestyle.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
    
    <BookingModal 
        open={isBookingModalOpen} 
        onOpenChange={setIsBookingModalOpen} 
    />
    </div>
  );
}
