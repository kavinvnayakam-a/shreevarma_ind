'use client';

import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import PlaceholderImages from '@/lib/placeholder-images.json';
import { Button } from '@/components/ui/button';
import { SpecialistsCarousel } from '@/components/home/specialists-carousel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { healthConditionsData } from '../health-conditions-data';
import { cn } from '@/lib/utils';
import React, { useMemo } from 'react';

const allHealthConditions = healthConditionsData.map(condition => {
    const img = PlaceholderImages.placeholderImages.find(p => p.id === `health-${condition.id}`);
    return {
        ...condition,
        imageUrl: img?.imageUrl || '',
        imageHint: img?.imageHint || '',
    };
});

export default function DiseaseDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  
  const condition = useMemo(() => 
    allHealthConditions.find((c) => c.slug === slug), 
  [slug]);

  if (!condition) {
    notFound();
    return null;
  }

  const faqs = [
    {
      question: `What are ${condition.name.toLowerCase()}?`,
      answer: condition.description
    },
    {
      question: "What are the common symptoms?",
      answer: "Common signs and symptoms include stomach pain or cramps, indigestion or heartburn, bloating and excessive gas, nausea or vomiting, diarrhea or constipation, and loss of appetite in chronic cases."
    },
    {
      question: "What causes digestive problems?",
      answer: "Digestive diseases can occur due to many reasons, including infections, stress, poor dietary habits, and chronic conditions like autoimmune or genetic disorders."
    },
    {
      question: `Can ${condition.name.toLowerCase()} be prevented?`,
      answer: "While not all digestive diseases can be prevented, a healthy lifestyle including a balanced diet, regular exercise, stress management, and avoiding smoking and excessive alcohol can significantly reduce the risk."
    },
    {
      question: "How are they treated?",
      answer: "Ayurvedic treatment focuses on balancing the doshas through diet, lifestyle modifications, herbal remedies, and detoxification therapies like Panchakarma."
    },
    {
      question: "When should I see a doctor?",
      answer: "You should consult a doctor if you experience persistent or severe symptoms, unexplained weight loss, blood in your stool, or difficulty swallowing."
    }
  ];

  // Unified Heading Styles
  const HEADING_STYLE = "text-3xl md:text-5xl font-bold font-headline text-primary uppercase tracking-tight";
  const SUB_HEADING_STYLE = "text-2xl md:text-3xl font-bold font-headline text-primary uppercase tracking-tight";

  const SectionHeading = ({ children }: { children: React.ReactNode }) => (
    <div className="mt-12 mb-8">
        <h2 className={SUB_HEADING_STYLE}>{children}</h2>
        <div className="w-20 h-1.5 bg-primary mt-4"></div>
    </div>
  );

  return (
    <div className="flex flex-col bg-white min-h-screen font-sans selection:bg-primary/10">
      {/* Hero Section - 1712x776 Speed Optimized */}
      <section className="relative w-full aspect-[16/9] md:aspect-[1712/776] max-h-[65vh] overflow-hidden bg-white">
        <Image
          src={condition.imageUrl}
          alt={condition.name}
          fill
          className="object-cover"
          priority={true}
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          quality={90}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
            <div className="container mx-auto">
                <h1 className={cn("text-4xl md:text-7xl leading-none", HEADING_STYLE, "text-white")}>
                    {condition.name}
                </h1>
            </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-20 right-[-10%] opacity-5 pointer-events-none">
            <Image 
                src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0249163472.firebasestorage.app/o/ShreeVarma%2Felegant-happy-buddha-purnima-religious-background-design%201.png?alt=media&token=05020f0d-cbd7-4de9-b5b0-c823c6d6686e"
                alt="background leaf"
                width={600}
                height={800}
            />
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto">
            <p className="text-xl leading-relaxed text-slate-700 mb-16 border-l-4 border-primary pl-8 font-medium italic">
              {condition.description}
            </p>

            <SectionHeading>Common Causes</SectionHeading>
            <ul className="space-y-6 list-none p-0 mb-16">
              {[
                "Infections (viral, bacterial, or parasitic) that affect the gut.",
                "Dietary Habits like eating spicy, fatty, or processed foods.",
                "High stress, lack of exercise, and poor sleep patterns.",
                "Chronic Conditions like Autoimmune or genetic disorders."
              ].map((text, i) => (
                <li key={i} className="flex gap-4 items-start text-slate-600 font-medium text-lg">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2.5 shrink-0" />
                    {text}
                </li>
              ))}
            </ul>

            <SectionHeading>Key Symptoms</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
               {["Stomach pain", "Indigestion", "Bloating", "Nausea", "Loss of appetite"].map((s, i) => (
                   <div key={i} className="flex items-center gap-4 p-5 bg-[#F9F8F6] rounded-xl font-bold font-headline text-primary uppercase tracking-tight text-sm">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {s}
                   </div>
               ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Specialists Section */}
      <section className="py-24 bg-white border-t border-slate-100">
          <div className="container mx-auto px-6 text-center">
              <h2 className={cn("mb-6", HEADING_STYLE)}>Talk to Our Certified Ayurveda Specialists</h2>
              <p className="text-lg text-muted-foreground font-medium mb-16">Easy access to experienced doctors for your health needs online or at the clinic.</p>
              <SpecialistsCarousel />
              <div className="text-center mt-16">
                  <Button asChild variant="outline" className="rounded-full px-12 h-14 border-2 border-primary text-primary font-bold font-headline uppercase tracking-tight hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/5">
                      <Link href="/consultation">View all doctors</Link>
                  </Button>
              </div>
          </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#F9F8F6] border-t border-slate-100">
          <div className="container mx-auto px-6">
              <h2 className={cn("text-center mb-16", HEADING_STYLE)}>Frequently Asked Questions</h2>
              <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm">
                  <Accordion type="single" collapsible className="w-full">
                      {faqs.map((faq, index) => (
                           <AccordionItem value={`item-${index}`} key={index} className="border-slate-100 last:border-0">
                              <AccordionTrigger className="text-left font-bold font-headline uppercase tracking-tight text-primary hover:text-primary/70 transition-colors py-6">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-slate-600 font-medium leading-relaxed pb-6">
                                {faq.answer}
                              </AccordionContent>
                           </AccordionItem>
                      ))}
                  </Accordion>
              </div>
          </div>
      </section>
    </div>
  );
}