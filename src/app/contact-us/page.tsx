
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin } from 'lucide-react';

const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/`;
const urlSuffix = `?alt=media`;

const getImageUrl = (path: string) => `${baseUrl}${encodeURIComponent(path)}${urlSuffix}`;

export default function ContactUsPage() {
    const contactImage = getImageUrl("site_assets/contact/main.png");

    const Heading = ({ children }: { children: React.ReactNode }) => (
        <div>
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">{children}</h2>
            <div className="w-24 h-1 bg-[#72392F] mt-2 mb-6"></div>
        </div>
    );
    
    return (
        <div className="bg-[#F9F5F1]">
            {/* Hero Section */}
            <section className="bg-white py-16">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">Get In Touch</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">We're here to help and answer any question you might have. We look forward to hearing from you.</p>
                </div>
            </section>
            
            {/* Contact Details & Form Section */}
            <section className="py-16">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
                    {/* Left Column - Details */}
                    <div className="space-y-8">
                        <div>
                            <Heading>Contact Information</Heading>
                            <p className="text-muted-foreground mb-6">Reach out to us through any of the following channels. Our team is ready to assist you.</p>
                            <div className="space-y-4 text-muted-foreground">
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 text-primary shrink-0 mt-1"/>
                                    <div>
                                        <h3 className="font-bold text-foreground">Our Address</h3>
                                        <p>No. 3/195, PRV Building, Parthasarathy Nagar, Poonamallee Mount High Road, Manapakkam, Chennai - 600 125</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Mail className="w-6 h-6 text-primary shrink-0 mt-1"/>
                                    <div>
                                        <h3 className="font-bold text-foreground">Email Us</h3>
                                        <p>mainadmin@shreevarma.org</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Phone className="w-6 h-6 text-primary shrink-0 mt-1"/>
                                    <div>
                                        <h3 className="font-bold text-foreground">Call Us</h3>
                                        <p>+91 9500946631 / +91 9500946632</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden h-full w-full">
                            <Image src={contactImage} alt="Contact Us" fill className="object-contain" data-ai-hint="contact collage"/>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div>
                        <Card className="p-6 shadow-lg">
                            <h3 className="text-2xl font-bold font-headline text-primary mb-4">Send us a Message</h3>
                            <form className="space-y-4">
                                <Input placeholder="Your Name" />
                                <Input type="email" placeholder="Your Email Address" />
                                <Input placeholder="Subject" />
                                <Textarea placeholder="Your Message" rows={5}/>
                                <Button type="submit" className="w-full">Send Message</Button>
                            </form>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
