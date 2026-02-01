
'use client';

import * as React from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import PlaceholderImages from '@/lib/placeholder-images.json';
import { Card } from '@/components/ui/card';
import { Button } from '../ui/button';
import { specialists } from './specialists-data';
import { cn } from '@/lib/utils';

interface SpecialistsCarouselProps {
  showDots?: boolean;
}

export function SpecialistsCarousel({ showDots = false }: SpecialistsCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const autoplayEnabled = !showDots;
  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true, active: autoplayEnabled }));

  React.useEffect(() => {
    if (!api) {
      return;
    }
 
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);


  return (
    <div>
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={autoplayEnabled ? plugin.current.stop : undefined}
        onMouseLeave={autoplayEnabled ? plugin.current.reset : undefined}
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent className="-ml-4">
          {specialists.map((specialist) => {
              const specImage = PlaceholderImages.placeholderImages.find(img => img.id === specialist.imageId);
              return (
                <CarouselItem key={specialist.name} className="basis-full md:basis-1/2 lg:basis-1/3 pl-4">
                  <div className="p-1 pt-14">
                      <div className="text-center pt-14 pb-6 relative flex flex-col items-center border rounded-lg">
                          <div className="absolute -top-14 w-28 h-28 rounded-full overflow-hidden shadow-lg bg-background z-10 border-4 border-background">
                              {specImage && <Image src={specImage.imageUrl} alt={specialist.name} width={112} height={112} className="object-cover w-full h-auto" data-ai-hint={specImage.hint} loading="lazy" />}
                          </div>
                          <div className="flex flex-col items-center gap-1">
                              <h3 className="font-bold text-xl font-headline mt-2">{specialist.name}</h3>
                              <p className="text-muted-foreground text-sm">{specialist.specialty}</p>
                              <p className="font-semibold text-green-700 text-sm">{specialist.experience}</p>
                              <p className="text-muted-foreground text-sm">{specialist.location}</p>
                              {specialist.languages && <p className="text-muted-foreground text-xs px-2">({specialist.languages})</p>}
                              <Button asChild className="mt-3 bg-[#72392F] hover:bg-[#5f2f27] text-white">
                                  <Link href={`/doctors/${specialist.slug}`}>Book Appointment</Link>
                              </Button>
                          </div>
                      </div>
                  </div>
                </CarouselItem>
              )
          })}
        </CarouselContent>
        {!showDots && (
          <>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80" />
          </>
        )}
      </Carousel>
      {showDots && (
         <div className="py-2 flex justify-center gap-2 mt-4">
            {Array.from({ length: count }).map((_, index) => (
            <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                    "h-2 w-2 rounded-full bg-primary/20 transition-all",
                    current === index ? "w-4 bg-primary" : "hover:bg-primary/50"
                )}
                aria-label={`Go to slide ${index + 1}`}
            />
            ))}
        </div>
      )}
    </div>
  );
}
