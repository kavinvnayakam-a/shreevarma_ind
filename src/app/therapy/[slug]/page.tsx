'use client';

import { notFound, useParams } from 'next/navigation';
import { therapiesData } from '../therapy-data';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Heart, Users, Target, UserCheck, ChevronRight } from 'lucide-react';
import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

const HEADING_STYLE = "font-bold font-headline text-primary uppercase tracking-tight";

function Section({ title, content, icon }: { title: string, content: string, icon: React.ReactNode }) {
    if (!content) return null;
    return (
        <div className="space-y-6">
            <h2 className={cn("text-2xl md:text-3xl flex items-center gap-4", HEADING_STYLE)}>
                <span className="p-2.5 rounded-xl bg-primary/5 text-primary shrink-0">
                    {icon}
                </span>
                {title}
            </h2>
            {/* UPDATED CONTENT FONT STYLE */}
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap pl-0 md:pl-[4.5rem] text-base md:text-lg font-medium tracking-normal">
                {content}
            </div>
        </div>
    )
}

export default function TherapyDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  
  const therapy = useMemo(() => 
    therapiesData.find((t) => t.slug === slug), 
  [slug]);

  if (!therapy) {
    notFound();
    return null;
  }

  return (
    <div className="bg-[#FDFCFB] min-h-screen font-sans selection:bg-primary/10">
      {/* Hero Section */}
      <section className="relative w-full aspect-[16/9] md:aspect-[1712/776] max-h-[70vh] overflow-hidden bg-white">
        <Image 
          src={therapy.imageUrl} 
          alt={therapy.name} 
          fill 
          className="object-cover object-center" 
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
                <nav className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight text-white/70 font-headline">
                    <Link href="/therapy" className="hover:text-white transition-colors">Therapies</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-white">{therapy.name}</span>
                </nav>
                <h1 className={cn("text-4xl md:text-7xl leading-none", HEADING_STYLE, "text-white")}>
                    {therapy.name}
                </h1>
            </div>
        </div>
      </section>

      <main className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-20 items-start">
          
          <div className="lg:col-span-2 space-y-24">
            <Section 
                title="What is it?" 
                content={therapy.what} 
                icon={<Heart className="w-5 h-5" />} 
            />
            <Section 
                title="Why is it done?" 
                content={therapy.why} 
                icon={<UserCheck className="w-5 h-5" />} 
            />
            <Section 
                title="Who needs it?" 
                content={therapy.who} 
                icon={<Users className="w-5 h-5" />} 
            />
          </div>
          
          <aside className="lg:sticky top-32">
            <Card className="shadow-2xl border-none bg-white rounded-[2rem] overflow-hidden">
                <div className="h-2 bg-primary w-full" />
                <CardHeader className="p-8 pb-4">
                    <CardTitle className={cn("text-2xl", HEADING_STYLE)}>Therapy Details</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-10">
                    <div>
                        <h3 className="font-bold font-headline text-primary text-[11px] uppercase tracking-tight mb-5 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4"/> Key Benefits
                        </h3>
                        <ul className="space-y-4">
                            {therapy.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-semibold">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                    <span className="uppercase tracking-tight text-[10px]">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-8 pt-8 border-t border-slate-50">
                        <div className="flex gap-4">
                            <Target className="w-6 h-6 text-primary shrink-0" />
                            <div>
                                <h3 className="font-bold text-[11px] uppercase tracking-tight text-primary font-headline">Target Areas</h3>
                                <p className="text-sm font-semibold text-slate-600 mt-1 uppercase tracking-tight">{therapy.bodyParts}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Clock className="w-6 h-6 text-primary shrink-0" />
                            <div>
                                <h3 className="font-bold text-[11px] uppercase tracking-tight text-primary font-headline">Duration</h3>
                                <p className="text-sm font-semibold text-slate-600 mt-1 uppercase tracking-tight">{therapy.duration}</p>
                            </div>
                        </div>
                    </div>

                    <Button asChild size="lg" className="w-full h-14 rounded-xl bg-primary hover:opacity-90 text-white font-bold font-headline uppercase tracking-tight text-[11px] shadow-lg shadow-primary/20">
                        <Link href="/consultation">Book This Session</Link>
                    </Button>
                </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}