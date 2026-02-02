import { notFound } from 'next/navigation';
import { therapiesData } from '../therapy-data';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Heart, Users, Target, UserCheck } from 'lucide-react';
import React from 'react';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return therapiesData.map((therapy) => ({
    slug: therapy.slug,
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const therapy = therapiesData.find((t) => t.slug === slug);

  if (!therapy) {
    return { title: 'Therapy Not Found' };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${therapy.name} Therapy | Shreevarma's Wellness`,
    description: therapy.what.substring(0, 160),
    openGraph: {
      title: `${therapy.name} | Ayurvedic Therapy`,
      description: therapy.what.substring(0, 160),
      images: [therapy.imageUrl, ...previousImages],
    },
  };
}

function Section({ title, content, icon }: { title: string, content: string, icon: React.ReactNode }) {
    if (!content) return null;
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold font-headline text-primary flex items-center gap-3">
                <span className="p-2 rounded-lg bg-primary/10 text-primary">
                    {icon}
                </span>
                {title}
            </h2>
            <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap pl-11">
                {content}
            </div>
        </div>
    )
}

export default async function TherapyDetailPage({ params }: Props) {
  const { slug } = await params;
  const therapy = therapiesData.find((t) => t.slug === slug);

  if (!therapy) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section - Optimized for 1712x776 ratio */}
      <section className="relative w-full aspect-[16/9] md:aspect-[1712/776] max-h-[70vh] overflow-hidden bg-slate-100">
        <Image 
          src={therapy.imageUrl} 
          alt={therapy.name} 
          fill 
          className="object-cover object-center" 
          
          // --- PERFORMANCE OPTIMIZATIONS ---
          priority={true}           // Highest priority: Preloads the image
          loading="eager"           // Tells browser to download immediately
          fetchPriority="high"      // Hint for modern browsers (LCP optimization)
          sizes="100vw"             // Ensures proper resolution selection
          quality={90}              // Slight bump in quality for wide headers
          // ---------------------------------
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
            <div className="container mx-auto">
                <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter drop-shadow-sm">
                    {therapy.name}
                </h1>
            </div>
        </div>
      </section>

      <main className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-16 items-start">
          
          <div className="lg:col-span-2 space-y-16">
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
          
          <aside className="lg:sticky top-28">
            <Card className="shadow-xl border-primary/10 overflow-hidden">
                <div className="h-2 bg-primary" />
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Therapy Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div>
                        <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5"/> Key Benefits
                        </h3>
                        <ul className="grid grid-cols-1 gap-2">
                            {therapy.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground capitalize">
                                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6 pt-4 border-t border-border">
                        <div className="flex gap-4">
                            <Target className="w-6 h-6 text-primary shrink-0" />
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">Target Areas</h3>
                                <p className="text-sm text-muted-foreground">{therapy.bodyParts}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Clock className="w-6 h-6 text-primary shrink-0" />
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">Duration</h3>
                                <p className="text-sm text-muted-foreground">{therapy.duration}</p>
                            </div>
                        </div>
                    </div>

                    <Button asChild size="lg" className="w-full text-base font-bold py-6">
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