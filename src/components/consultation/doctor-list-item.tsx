
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MapPin, BriefcaseMedical, IndianRupee, Clock, Video } from 'lucide-react';
import type { Specialist } from '@/components/home/specialists-data';
import PlaceholderImages from '@/lib/placeholder-images.json';
import { useEffect, useState } from 'react';

interface DoctorListItemProps {
    doctor: Specialist;
    onBookNow: () => void;
    hideBookButton?: boolean;
}

export function DoctorListItem({ doctor, onBookNow, hideBookButton = false }: DoctorListItemProps) {
    const doctorImage = PlaceholderImages.placeholderImages.find(img => img.id === doctor.imageId);
    
    return (
        <div className="bg-card p-4 rounded-lg shadow-sm border flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-shrink-0 flex flex-col items-center">
                <Link href={`/doctors/${doctor.slug}`} className="block">
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                        {doctorImage && (
                            <Image src={doctorImage.imageUrl} alt={doctor.name} fill className="object-cover" data-ai-hint={doctor.hint} />
                        )}
                    </div>
                </Link>
                <Button variant="link" asChild>
                    <Link href={`/doctors/${doctor.slug}`}>View Profile</Link>
                </Button>
            </div>
            <div className="flex-grow">
                <Link href={`/doctors/${doctor.slug}`} className="hover:underline">
                    <h3 className="text-xl font-bold font-headline text-primary">{doctor.name} ({doctor.specialty})</h3>
                </Link>
                <div className="text-muted-foreground text-sm space-y-2 mt-2">
                    <p className="flex items-center gap-2"><Clock className="w-4 h-4"/> {doctor.experience}</p>
                    <p className="flex items-center gap-2"><BriefcaseMedical className="w-4 h-4"/> {doctor.specialty}</p>
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {doctor.location}</p>
                    <p className="flex items-center gap-2"><IndianRupee className="w-4 h-4"/> {doctor.consultationFee} Consultation fee at clinic</p>
                </div>
                <div className="mt-2">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        <ThumbsUp className="w-4 h-4"/>
                        <span>{doctor.rating * 20}%</span>
                    </div>
                </div>
            </div>
            {!hideBookButton && (
                <div className="flex-shrink-0 md:w-48 text-center">
                    <Button onClick={onBookNow} size="lg" disabled={!doctor.isAvailableForVideo}>
                        <Video className="mr-2 h-5 w-5" /> 
                        {doctor.isAvailableForVideo ? 'Book Video Call' : 'Not Available'}
                    </Button>
                </div>
            )}
        </div>
    );
}
