
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Star, Aperture, MessageSquare, Compass } from 'lucide-react';
import type { Clinic } from '@/app/clinics/clinics-data';
import { Badge } from '@/components/ui/badge';

interface ClinicListItemProps {
    clinic: Clinic;
}

export function ClinicListItem({ clinic }: ClinicListItemProps) {
    return (
        <div className="bg-card p-4 rounded-lg shadow-sm border flex flex-col md:flex-row gap-6">
            <div className="relative w-full md:w-1/3 h-56 md:h-auto rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
                <Image src={clinic.imageUrl} alt={clinic.name} width={150} height={150} className="object-contain" data-ai-hint={clinic.imageHint} />
            </div>
            <div className="flex-grow md:w-2/3">
                <h3 className="text-xl font-bold font-headline text-primary">{clinic.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current"/>
                        <span className="font-bold text-foreground">{clinic.rating}</span>
                    </div>
                     <span>({clinic.reviewCount} Reviews)</span>
                </div>
                 <div className="text-muted-foreground text-sm space-y-2 mt-4">
                    <p className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-1 shrink-0"/> {clinic.address}</p>
                    <p className="flex items-center gap-2"><Phone className="w-4 h-4"/> {clinic.phone}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {clinic.facilities.map(facility => (
                        <Badge key={facility} variant="outline">{facility}</Badge>
                    ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild>
                        <Link href={`tel:${clinic.phone}`}>Book Appointment</Link>
                    </Button>
                     <Button variant="outline" asChild>
                        <Link href={clinic.mapLink} target="_blank" rel="noopener noreferrer">
                           <Compass className="mr-2"/> Get Direction
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={clinic.mapLink} target="_blank" rel="noopener noreferrer">
                            <MessageSquare className="mr-2"/> Give Feedback
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
