
import Image from 'next/image';
import { notFound } from 'next/navigation';
import PlaceholderImages from '@/lib/placeholder-images.json';
import { SubHeader } from '@/components/layout/sub-header';
import { Button } from '@/components/ui/button';
import { SpecialistsCarousel } from '@/components/home/specialists-carousel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { healthConditionsData } from '../health-conditions-data';

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

export default function DiseaseDetailPage({ params }: { params: { slug: string } }) {
  const condition = allHealthConditions.find((c) => c.slug === params.slug);

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
    <div>
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary">{children}</h2>
        <div className="w-24 h-1 bg-[#72392F] mt-2 mb-4"></div>
    </div>
  );

  return (
    <div className="flex flex-col bg-[#F9F5F1]">
      {/* Hero Section */}
      <section className="relative pt-8 md:pt-6 bg-white">
        <div className="container mx-auto px-6">
          
          <div className="relative h-64 md:h-96 w-full mt-4">
            <Image
              src={condition.imageUrl}
              alt={condition.name}
              fill
              className="object-cover rounded-lg"
              data-ai-hint={condition.imageHint}
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-12 bg-white relative">
        <div className="absolute top-0 right-0 opacity-10">
            <Image 
                src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0249163472.firebasestorage.app/o/ShreeVarma%2Felegant-happy-buddha-purnima-religious-background-design%201.png?alt=media&token=05020f0d-cbd7-4de9-b5b0-c823c6d6686e"
                alt="background leaf"
                width={400}
                height={600}
            />
        </div>
        <div className="container mx-auto px-6 relative">
          <div className="prose lg:prose-lg max-w-4xl mx-auto">
            <h1 className="text-primary font-headline !mb-6">About {condition.name}</h1>
            <p className="mb-8">
              {condition.description}
            </p>

            <Heading>Causes</Heading>
            <p className="mb-4">Digestive diseases can occur due to many reasons, including:</p>
            <ul className="space-y-3 list-disc pl-5 mb-8">
              <li>Infections (viral, bacterial, or parasitic) that affect the gut.</li>
              <li>Dietary Habits like eating spicy, fatty, or processed foods, irregular meals.</li>
              <li>Stress & Lifestyle: High stress, lack of exercise, poor sleep.</li>
              <li>Chronic Conditions: Autoimmune or genetic disorders such as Crohn’s disease or ulcerative colitis.</li>
            </ul>

            <Heading>Symptoms</Heading>
            <p className="mb-4">Common signs and symptoms include:</p>
            <ul className="space-y-3 list-disc pl-5 mb-8">
              <li>Stomach pain or cramps</li>
              <li>Indigestion or heartburn</li>
              <li>Bloating and excessive gas</li>
              <li>Nausea or vomiting</li>
              <li>Diarrhea or constipation</li>
              <li>Loss of appetite in chronic cases</li>
            </ul>
            <Heading>Common Types of Digestive Diseases</Heading>
            <ul className="space-y-3 list-disc pl-5">
              <li>Heartburn or indigestion</li>
              <li>Gassy-bloating</li>
              <li>Gallstones</li>
              <li>Gastritis</li>
              <li>Irritable Bowel Syndrome (IBS)</li>
              <li>Constipation</li>
              <li>Ulcerative Colitis</li>
              <li>Peptic Ulcer</li>
              <li>Gastroenteritis</li>
              <li>Hyperacidity</li>
            </ul>
          </div>
        </div>
      </section>
      
        {/* Specialists Section */}
        <section className="py-16 bg-[#F9F5F1]">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold font-headline text-primary">Talk to Our Certified Ayurveda Specialists</h2>
                <p className="text-lg text-muted-foreground mb-12">Easy access to experienced doctors for your health needs online or at the clinic.</p>
                <SpecialistsCarousel />
                 <div className="text-center mt-12">
                    <Button variant="outline">View more</Button>
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
                             <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>{faq.question}</AccordionTrigger>
                                <AccordionContent>{faq.answer}</AccordionContent>
                             </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    </div>
  );
}
