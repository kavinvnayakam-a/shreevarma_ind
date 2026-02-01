
'use client';

import * as React from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import PlaceholderImages from '@/lib/placeholder-images.json';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HealthProblemsCarouselProps {
  showArrows?: boolean;
}

export function HealthProblemsCarousel({ showArrows = true }: HealthProblemsCarouselProps) {
  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  
  const healthImages = PlaceholderImages.placeholderImages.filter(img => img.id.startsWith('health-'));

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
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
            align: 'start',
            loop: true,
        }}
        >
        <CarouselContent>
            {healthImages.map((image) => (
            <CarouselItem key={image.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
                <div className="p-1">
                <Card className="overflow-hidden">
                    <CardContent className="flex aspect-square items-center justify-center p-0">
                    <Image
                        src={image.imageUrl}
                        alt={image.description || 'Health problem image'}
                        width={400}
                        height={400}
                        className="object-cover w-full h-full"
                        data-ai-hint={image.imageHint}
                        loading="lazy"
                    />
                    </CardContent>
                </Card>
                </div>
            </CarouselItem>
            ))}
        </CarouselContent>
        {showArrows && (
            <>
                <CarouselPrevious className="bg-background/50 hover:bg-background/80 border-foreground/20 text-foreground" />
                <CarouselNext className="bg-background/50 hover:bg-background/80 border-foreground/20 text-foreground" />
            </>
        )}
        </Carousel>
        {!showArrows && (
            <div className="py-2 flex justify-center gap-2 mt-4">
                {healthImages.map((_, index) => (
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
