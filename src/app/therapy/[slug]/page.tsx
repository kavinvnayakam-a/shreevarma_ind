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
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const therapy = therapiesData.find((t) => t.slug === params.slug);

  if (!therapy) {
    return {
      title: 'Therapy Not Found',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${therapy.name} Therapy`,
    description: therapy.what.substring(0, 160),
    openGraph: {
      title: `${therapy.name} | Ayurvedic Therapy | Shreevarma's Wellness`,
      description: therapy.what.substring(0, 160),
      images: [therapy.imageUrl, ...previousImages],
    },
  };
}

function Section({ title, content, icon }: { title: string, content: string, icon: React.ReactNode }) {
    if (!content) return null;
    return (
        <div className="space-y-3">
            <h2 className="text-2xl font-bold font-headline text-primary flex items-center gap-3">
                {icon}
                {title}
            </h2>
            <div className="prose prose-sm lg:prose-base max-w-none text-muted-foreground whitespace-pre-wrap">
                {content}
            </div>
        </div>
    )
}

export default function TherapyDetailPage({ params }: { params: { slug: string } }) {
  const therapy = therapiesData.find((t) => t.slug === params.slug);

  if (!therapy) {
    notFound();
  }

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative w-full h-64 md:h-96">
        <Image 
          src={therapy.imageUrl} 
          alt={therapy.name} 
          fill 
          className="object-cover" 
          priority 
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">{therapy.name}</h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-12">
            <Section title="What is it?" content={therapy.what} icon={<Heart className="w-6 h-6" />} />
            <Section title="Why is it done?" content={therapy.why} icon={<UserCheck className="w-6 h-6" />} />
            <Section title="Who needs it?" content={therapy.who} icon={<Users className="w-6 h-6" />} />
          </div>
          
          {/* Right Sticky Card */}
          <div className="lg:sticky top-24">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-xl">Therapy at a Glance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-primary mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5"/>Key Benefits</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {therapy.benefits.map((benefit, i) => <li key={i} className="capitalize">{benefit}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-semibold text-primary mb-2 flex items-center gap-2"><Target className="w-5 h-5"/>Body Parts Targeted</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{therapy.bodyParts}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-primary mb-2 flex items-center gap-2"><Clock className="w-5 h-5"/>Session Duration</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{therapy.duration}</p>
                    </div>
                    <Button asChild size="lg" className="w-full">
                        <Link href="/consultation">Book a Session</Link>
                    </Button>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
