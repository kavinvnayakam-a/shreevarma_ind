
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlayCircle, Phone, MapPin, Stethoscope, User, Droplets, Leaf } from 'lucide-react';

const philosophyPoints = [
    { icon: Leaf, text: 'Authentic Ayurveda Treatments', description: 'Rooted in centuries-old practices' },
    { icon: Stethoscope, text: 'Expert Guidance', description: 'Personalized care by Dr. Shreevarma' },
    { icon: User, text: 'Patient-Centered Care', description: 'Comfort, support, and focus on your well-being' },
    { icon: Droplets, text: 'Holistic Healing', description: 'Treating mind, body, and spirit together' }
];

const whyChooseReasons = [
  { text: 'Authentic Ayurveda Care', description: 'Based on traditional wisdom and clinical expertise' },
  { text: 'Personalized Treatment Plans', description: 'Designed for your unique health needs' },
  { text: 'Experienced Practitioners', description: 'Compassionate guidance from certified experts' },
  { text: 'Holistic Wellness', description: 'Focus on body, mind, and spiritual balance' },
];

export default function AboutUsPage() {
    const heroImage = { 
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/aboutpage%2FAbout%20us%20hero.webp?alt=media&token=1b4f7724-0960-4a80-b122-0bc80144c829",
        imageHint: 'ayurvedic products collage' 
    };
    const aboutImage1 = { 
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/aboutpage%2FAbout%20us%20page%20image.webp?alt=media&token=601c6870-cc3c-4973-b5c9-d565b159f928",
        imageHint: 'ayurvedic ingredients'
    };
    const drShreevarmaImage = {
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/aboutpage%2FAbout%20us%20shreevarma.webp?alt=media&token=3f504a76-790a-494f-9303-5a9182cfb8e8",
        imageHint: 'Dr. Shreevarma'
    };
    const whyChooseImage = {
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/aboutpage%2FWhy%20Choose%20Us.webp?alt=media&token=a4e39fc6-b144-493e-a1de-f018e735299c",
        imageHint: 'ayurvedic ingredients tray'
    };
    const ctaImage = {
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/aboutpage%2FJournery%20Today.webp?alt=media&token=b00bc6e0-8b6b-483d-97c3-66d56e22f3bf",
        imageHint: 'ayurvedic therapy'
    };
    const philosophyImage = { 
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/aboutpage%2FOur%20Philoshopy.webp?alt=media&token=c1f6979d-f551-4347-bfcc-1868f80eac76",
        imageHint: 'doctor with patient'
    };


    const Heading = ({ children }: { children: React.ReactNode }) => (
        <div>
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">{children}</h2>
            <div className="w-24 h-1 bg-[#72392F] mt-2 mb-6"></div>
        </div>
    );

    return (
        <div className="bg-[#F9F5F1]">
            {/* Hero Section */}
            <section className="relative bg-white pt-8 md:pt-6">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-8 items-center py-12">
                        <div className="relative w-full max-w-md mx-auto aspect-square">
                           <Image src={heroImage.imageUrl} alt="About Shreevarma Wellness" width={448} height={448} className="object-contain w-full h-auto" data-ai-hint={heroImage.imageHint} />
                        </div>
                         <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">Your Journey to Holistic Wellness Begins Here</h1>
                             <div className="w-24 h-1 bg-[#72392F] mt-2 mb-6 mx-auto md:mx-0"></div>
                            <p className="text-lg text-muted-foreground mb-6">Welcome to Shreevarma Wellness Clinic—A place where health, harmony, and holistic healing come together. Our vision is to provide you with natural, time-tested care that nurtures your body, mind, and soul.</p>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <Button size="lg" variant="outline"><PlayCircle className="mr-2"/> Play video</Button>
                                <Button size="lg" asChild><Link href="/consultation">Book appointment</Link></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section className="py-16">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <Heading>About us</Heading>
                        <p className="text-muted-foreground mb-4">
                            "At Shreevarma's Wellness, we are dedicated to helping you achieve complete wellness. We combine the wisdom of traditional Ayurveda with modern healthcare insights to create personalized treatment plans. Whether you seek relief from chronic conditions or guidance for a healthier lifestyle, our clinic offers a safe, supportive, and caring environment for every patient."
                        </p>
                    </div>
                     <div className="relative aspect-[4/3] rounded-lg overflow-hidden h-full w-full order-1 md:order-2">
                        {aboutImage1 && <Image src={aboutImage1.imageUrl} alt="About us" width={600} height={450} className="object-contain w-full h-auto" data-ai-hint={aboutImage1.imageHint}/>}
                    </div>
                </div>
            </section>

             {/* Our Philosophy Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                         <div className="inline-block">
                            <Heading>Our Philosophy</Heading>
                         </div>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">How We Approach Your Wellness</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative aspect-square">
                            <Image src={philosophyImage.imageUrl} alt="Our Philosophy" width={500} height={500} className="object-contain w-full h-auto" data-ai-hint={philosophyImage.imageHint} />
                        </div>
                        <div className="space-y-8">
                            {philosophyPoints.map((point, index) => {
                                const Icon = point.icon;
                                return (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                                        <Icon className="w-6 h-6"/>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-foreground">{point.text}</h3>
                                        <p className="text-muted-foreground">{point.description}</p>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Meet Dr. Shreevarma Section */}
            <section className="py-16">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <Heading>Meet Dr. Shreevarma</Heading>
                         <p className="text-lg text-muted-foreground mb-4">Your trusted guide to holistic health.</p>
                        <p className="text-muted-foreground mb-6">Dr. Shreevarma is a passionate Ayurveda practitioner with years of experience in helping patients achieve lasting wellness. His philosophy combines knowledge, compassion, and personalized attention to ensure each patient receives care tailored to their unique needs. Under his guidance, the clinic focuses on holistic healing, preventive care, and a healthy lifestyle.</p>
                    </div>
                     <div className="relative w-full aspect-square order-1 md:order-2">
                        <Image src={drShreevarmaImage.imageUrl} alt="Dr. Shreevarma" width={500} height={500} className="object-contain w-full h-auto" data-ai-hint={drShreevarmaImage.imageHint}/>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-16 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Why choose us</h2>
                        <p className="text-lg text-muted-foreground mt-2">The Dr. shreevarma's Wellness Difference in care</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-0 relative">
                        <div className="relative aspect-[4/3] w-full h-full min-h-[300px] md:min-h-[450px] z-10">
                             <Image 
                                src={whyChooseImage.imageUrl} 
                                alt="Authentic Ayurveda Care" 
                                fill
                                className="object-cover rounded-lg"
                                data-ai-hint={whyChooseImage.imageHint}
                            />
                        </div>
                        <div className="bg-[#72392F] text-primary-foreground rounded-lg p-8 md:p-12 md:pl-24 h-full flex flex-col justify-center relative md:-ml-16">
                            <div className="space-y-6">
                               {whyChooseReasons.map((reason, index) => (
                                <div key={index}>
                                    <h3 className="font-semibold text-xl">{reason.text}</h3>
                                    <p className="text-primary-foreground/80">– {reason.description}</p>
                                </div>
                               ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Call to Action Section */}
            <section className="py-20 bg-white overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="relative h-80 w-full md:h-96">
                            {ctaImage && (
                                <Image
                                    src={ctaImage.imageUrl}
                                    alt="Start your journey"
                                    width={500}
                                    height={384}
                                    className="object-contain w-full h-auto"
                                    data-ai-hint={ctaImage.imageHint}
                                />
                            )}
                        </div>
                        <div className='text-center md:text-left'>
                            <h2 className="text-3xl font-bold font-headline text-primary mb-2">Start Your Ayurvedic Journey Today</h2>
                            <p className="text-lg text-muted-foreground mb-8">Talk to our certified and experienced doctors regarding your health issues. Get the best solutions and personalized therapies.</p>
                            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto"><MapPin className="mr-2"/> Find Nearby Clinic</Button>
                                <Button size="lg" asChild className="w-full sm:w-auto"><Link href="/consultation"><Phone className="mr-2"/> Book Consultation</Link></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
