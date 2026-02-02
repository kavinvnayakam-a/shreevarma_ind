import Image from 'next/image';
import { notFound } from 'next/navigation';
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

type Props = {
  params: Promise<{ slug: string }>;
};

const allHealthConditions = healthConditionsData.map(condition => {
    const img = PlaceholderImages.placeholderImages.find(p => p.id === `health-${condition.id}`);
    return {
        ...condition,
        imageUrl: img?.imageUrl || '',
        imageHint: img?.imageHint || '',
    };
});

export async function generateStaticParams() {
  return allHealthConditions.map((condition) => ({
    slug: condition.slug,
  }));
}

export default async function DiseaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const condition = allHealthConditions.find((c) => c.slug === slug);

  if (!condition) {
    notFound();
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

  const Heading = ({ children }: { children: React.ReactNode }) => (
    <div className="mt-10">
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary">{children}</h2>
        <div className="w-24 h-1 bg-[#72392F] mt-2 mb-6"></div>
    </div>
  );

  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Hero Section - 1712x776 Speed Optimized */}
      <section className="relative w-full aspect-[16/9] md:aspect-[1712/776] max-h-[60vh] overflow-hidden bg-white">
        <Image
          src={condition.imageUrl}
          alt={condition.name}
          fill
          className="object-cover"
          
          // --- IMMEDIATE LOADING PERFORMANCE ---
          priority={true}           // Highest priority for LCP
          loading="eager"           // No lazy loading
          fetchPriority="high"      // Hint for browser engine
          sizes="100vw"             // Pre-calculates width
          quality={90}              // Sharpness for wide headers
          // -------------------------------------
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
            <div className="container mx-auto">
                <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter drop-shadow-md">
                    {condition.name}
                </h1>
            </div>
        </div>
      </section>

      {/* Main Content Section - Pure White Background */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-20 right-[-10%] opacity-5 pointer-events-none">
            <Image 
                src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0249163472.firebasestorage.app/o/ShreeVarma%2Felegant-happy-buddha-purnima-religious-background-design%201.png?alt=media&token=05020f0d-cbd7-4de9-b5b0-c823c6d6686e"
                alt="background leaf"
                width={600}
                height={800}
            />
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="prose prose-slate lg:prose-lg max-w-4xl mx-auto">
            <p className="text-xl leading-relaxed text-muted-foreground mb-12 border-l-4 border-primary pl-6 italic">
              {condition.description}
            </p>

            <Heading>Common Causes</Heading>
            <ul className="space-y-4 list-none p-0 mb-8">
              {[
                "Infections (viral, bacterial, or parasitic) that affect the gut.",
                "Dietary Habits like eating spicy, fatty, or processed foods.",
                "High stress, lack of exercise, and poor sleep patterns.",
                "Chronic Conditions like Autoimmune or genetic disorders."
              ].map((text, i) => (
                <li key={i} className="flex gap-3 items-start text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    {text}
                </li>
              ))}
            </ul>

            <Heading>Key Symptoms</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
               {["Stomach pain", "Indigestion", "Bloating", "Nausea", "Loss of appetite"].map((s, i) => (
                   <div key={i} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl font-bold text-primary shadow-sm">
                       <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {s}
                   </div>
               ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Specialists Section - Background turned white */}
      <section className="py-16 bg-white border-t border-slate-50">
          <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold font-headline text-primary">Talk to Our Certified Ayurveda Specialists</h2>
              <p className="text-lg text-muted-foreground mb-12">Easy access to experienced doctors for your health needs online or at the clinic.</p>
              <SpecialistsCarousel />
              <div className="text-center mt-12">
                  <Button variant="outline" className="rounded-full px-8">View more</Button>
              </div>
          </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold font-headline text-center text-primary mb-8">Frequently Asking Questions</h2>
              <div className="max-w-3xl mx-auto">
                  <Accordion type="single" collapsible className="w-full">
                      {faqs.map((faq, index) => (
                           <AccordionItem value={`item-${index}`} key={index} className="border-slate-100">
                              <AccordionTrigger className="text-left hover:text-primary transition-colors">{faq.question}</AccordionTrigger>
                              <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
                           </AccordionItem>
                      ))}
                  </Accordion>
              </div>
          </div>
      </section>
    </div>
  );
}