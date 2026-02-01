
'use client';
import Image from 'next/image';
import { specialists } from '@/components/home/specialists-data';
import PlaceholderImages from '@/lib/placeholder-images.json';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Phone, Calendar, CheckCircle, GraduationCap, MapPin, Clock, Languages, IndianRupee } from 'lucide-react';
import { SpecialistsCarousel } from '@/components/home/specialists-carousel';
import { cn } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { BookingModal } from '@/components/consultation/BookingModal';

const faqs = [
    {
      question: "How do I book an appointment with the doctor?",
      answer: "You can book an appointment by clicking the 'Book Consultation' button on this page. You will be able to choose between an online video consultation or an in-clinic visit."
    },
    {
      question: "What should I expect during my first consultation?",
      answer: "During your first consultation, the doctor will conduct a thorough assessment of your health history, current symptoms, and lifestyle. Based on this, a personalized treatment plan will be created for you."
    },
    {
      question: "What are the consultation fees?",
      answer: "Consultation fees vary. Please proceed to the booking page to see the detailed fee structure for both online and in-clinic appointments."
    },
    {
      question: "Can I get a refund if I cancel my appointment?",
      answer: "Yes, we have a cancellation policy. Please refer to our terms and conditions page for details on refunds and rescheduling."
    }
  ];

export default function DrJayaroopaProfilePage() {
  const doctor = specialists.find((d) => d.slug === 'dr-jayaroopa');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  if (!doctor) {
    notFound();
  }

  const doctorImage = PlaceholderImages.placeholderImages.find(img => img.id === doctor.imageId);

  const Heading = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn(className)}>
        <h2 className="font-headline text-xl md:text-2xl font-bold text-primary">{children}</h2>
        <div className="w-16 h-0.5 bg-[#72392F] mt-2 mb-4"></div>
    </div>
  );

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        
        {/* Main Profile Card */}
        <Card className="overflow-hidden mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="relative md:col-span-1 bg-primary/5 min-h-[250px] md:min-h-0 aspect-square">
                    {doctorImage && <Image src={doctorImage.imageUrl} alt={doctor.name} fill className="object-cover" data-ai-hint={doctor.hint} />}
                </div>
                <div className="md:col-span-2 p-6">
                    <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary">{doctor.name}</h1>
                    <p className="text-muted-foreground font-medium">{doctor.specialty}</p>

                     <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-4">
                        <div className="flex items-center gap-1.5"><Clock className="w-4 h-4"/><span>{doctor.experience}</span></div>
                        <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/><span>{doctor.location}</span></div>
                        <div className="flex items-center gap-1.5"><Languages className="w-4 h-4"/><span>{doctor.languages || 'English, Tamil'}</span></div>
                    </div>
                     <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mt-3">
                        <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-4 h-4 fill-current"/>
                            <span className="font-bold text-foreground">{doctor.rating}</span>
                            <span className="text-xs text-muted-foreground">({doctor.reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <IndianRupee className="w-4 h-4 text-muted-foreground"/>
                            <span className="font-semibold text-foreground">{doctor.consultationFee || 500} Fee</span>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="flex flex-wrap gap-3">
                        <Button size="lg" className="bg-[#72392F] hover:bg-[#5f2f27] text-white flex-grow sm:flex-grow-0" onClick={() => setIsBookingModalOpen(true)}><Calendar className="mr-2"/> Book Consultation</Button>
                        <Button size="lg" variant="outline" className="flex-grow sm:flex-grow-0"><Phone className="mr-2"/> Call Clinic</Button>
                    </div>
                </div>
            </div>
        </Card>

        {/* Details Tabs */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <Tabs defaultValue="about" className="w-full">
                    <div className="overflow-x-auto pb-2">
                        <TabsList className="grid w-full grid-cols-3 md:w-auto">
                            <TabsTrigger value="about">About</TabsTrigger>
                            <TabsTrigger value="conditions">Treatments</TabsTrigger>
                            <TabsTrigger value="certifications">Certifications</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="about" className="mt-4 p-6 border rounded-lg bg-card">
                        <Heading>About the Doctor</Heading>
                        <p className="text-muted-foreground">{doctor.about}</p>
                    </TabsContent>
                    <TabsContent value="conditions" className="mt-4 p-6 border rounded-lg bg-card">
                        <Heading>Conditions Treated</Heading>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-muted-foreground">
                            {doctor.conditionsTreated.map(condition => (
                                <li key={condition} className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-primary mt-1 shrink-0"/>
                                    <span>{condition}</span>
                                </li>
                            ))}
                        </ul>
                    </TabsContent>
                    <TabsContent value="certifications" className="mt-4 p-6 border rounded-lg bg-card">
                        <Heading>Board Certifications</Heading>
                        <ul className="space-y-3 text-muted-foreground">
                            {doctor.certifications.map(cert => (
                                <li key={cert} className="flex items-start gap-2">
                                    <GraduationCap className="w-4 h-4 text-primary mt-1 shrink-0"/>
                                    <span>{cert}</span>
                                </li>
                            ))}
                        </ul>
                    </TabsContent>
                </Tabs>
            </div>
            
            {/* FAQ Section */}
            <div className="lg:col-span-1 space-y-4 lg:sticky top-24">
                <Heading>Frequently Asked Questions</Heading>
                <Accordion type="single" collapsible className="w-full bg-card rounded-lg p-4 border">
                    {faqs.map((faq, index) => (
                         <AccordionItem value={`item-${index}`} key={index} className={index === faqs.length - 1 ? "border-b-0" : ""}>
                            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                            <AccordionContent>{faq.answer}</AccordionContent>
                         </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>

        {/* Related Doctors */}
        <section className="py-16 mt-8 border-t">
            <div className="container mx-auto px-0 text-center">
                <h2 className="text-3xl font-bold font-headline text-primary mb-2">Our Related Doctors</h2>
                <p className="text-lg text-muted-foreground mb-12">Find other specialists with similar expertise.</p>
                <SpecialistsCarousel />
            </div>
        </section>

      </div>
      <BookingModal open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen} />
    </div>
  );
}
