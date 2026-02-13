'use client';

import React, { useMemo, useState } from 'react';
import { useFirebase, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { ProductCard } from '@/components/products/product-card';
import { Loader2, Plus, Minus, Play } from 'lucide-react';
import type { Product } from '@/lib/placeholder-data';

export default function VajeeCarePage() {
  const { firestore } = useFirebase();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Firebase Query for Men's Intimacy Category
  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'products'), 
      where('category', '==', "Men's Intimacy")
    );
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const faqs = [
    { q: "What Is Vajee Care Used For?", a: "Vajee Care is an Ayurvedic formulation that helps improve male vitality, stamina, and performance. It supports reproductive health, reduces fatigue, and enhances overall energy levels naturally." },
    { q: "How Do I Book An Online Consultation?", a: "You can book a consultation by calling 9994244111. Our Ayurvedic doctors will guide you with personalized recommendations based on your lifestyle and health concerns." },
    { q: "Are There Any Side Effects To Vajee Care?", a: "Vajee Care is made from natural herbs and is generally safe when taken as advised. However, if you have any existing health conditions or are taking medications, consult a doctor before use." },
    { q: "HOW LONG DOES IT TAKE TO SEE RESULTS?", a: "INDIVIDUAL RESULTS MAY VARY, BUT SOME USERS NOTICE IMPROVEMENTS WITHIN A FEW WEEKS OF REGULAR USE." },
    { q: "IS IT SAFE TO COMBINE VAJEE CARE WITH MY EXISTING MEDICATIONS?", a: "YES, YOU CAN SAFELY USE VAJEE CARE ALONGSIDE YOUR OTHER PRESCRIBED MEDICATIONS." }
  ];

  const features = [
    { title: "Your Health", desc: "This boosts scout energy levels, supports your internal systems and performance." },
    { title: "Your Mood", desc: "Helps ease stress and supports a positive state of mind naturally." },
    { title: "Vitality", desc: "Ensures you stay active and focused throughout your busy day." },
    { title: "Metabolism", desc: "Supports healthy digestion and internal energy conversion." }
  ];

  return (
    <div className="min-h-screen bg-[#FDF0EE] text-[#5C2D2D] font-sans overflow-x-hidden">
      
      {/* 1. HERO SECTION (Text Left, Image Right) */}
      <section className="px-6 py-12 md:py-20 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-7xl font-serif font-bold leading-tight mb-8">
            “Reclaim your <br className="hidden md:block" /> strength, <br className="hidden md:block" /> Naturally”
          </h1>
         
        </div>
        <div className="flex-1 w-full aspect-square md:aspect-[4/5] bg-[#E8D5D2] rounded-[2rem] shadow-inner flex items-center justify-center italic text-gray-400">
          Hero Image Container
        </div>
      </section>

      {/* 2. VIDEO SECTION (Full Width Layout) */}
      <section className="px-6 py-10 max-w-7xl mx-auto">
        <div className="relative w-full aspect-video bg-[#D9C5C1] rounded-[2.5rem] overflow-hidden flex items-center justify-center shadow-2xl group cursor-pointer">
           <span className="text-gray-500 font-medium">Video Content Container</span>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-[#D32F2F] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                <Play className="text-white fill-white ml-1" size={32} />
              </div>
           </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (Firebase) */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">Best Seller Products</h2>
            <p className="opacity-70 mt-2 font-medium">Explore our premium range for Men's Intimacy</p>
          </div>
          
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-[#D32F2F]" /></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {products?.slice(0, 8).map((product) => (
              <ProductCard key={product.__docId} product={{...product, id: product.__docId}} />
            ))}
          </div>
        )}
      </section>

      {/* 4. FEEL GREAT SECTION (Natural Formulations) - Desktop & Mobile Design */}
      <section className="py-20 bg-[#FAE7E3]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-16">
            Feel Great With Our Natural Formulations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {features.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-full aspect-square bg-white/50 rounded-[2rem] mb-6 relative overflow-hidden flex items-center justify-center border border-white/40 shadow-sm transition group-hover:shadow-md">
                   <div className="w-[80%] h-[80%] bg-[#E8D5D2] rounded-2xl flex items-center justify-center italic text-xs text-gray-400">
                     Feature {i+1} Image
                   </div>
                   <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[#D32F2F] flex items-center justify-center text-[#D32F2F] font-bold">
                     +
                   </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-sm opacity-80 leading-relaxed px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-center mb-12">Frequently Asking Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#F2DED9]">
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-6 flex justify-between items-center text-left"
              >
                <span className="font-bold text-[#5C2D2D] md:text-lg">{faq.q}</span>
                {openFaq === idx ? <Minus className="text-[#D32F2F]" /> : <Plus className="text-[#D32F2F]" />}
              </button>
              {openFaq === idx && (
                <div className="p-6 pt-0 text-[#7D5A5A] leading-relaxed border-t border-[#FDF0EE] animate-in fade-in slide-in-from-top-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. ABOUT / IMAGE ROUNDED SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
         <div className="flex-1 relative flex justify-center">
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-[#E8D5D2] border-[15px] border-white shadow-2xl flex items-center justify-center italic text-gray-400">
              About Image
            </div>
            {/* Design Accents */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#FAE7E3] rounded-full hidden md:block"></div>
            <div className="absolute bottom-10 -right-4 w-20 h-20 bg-[#FAE7E3] rounded-full hidden md:block"></div>
         </div>
         <div className="flex-1 text-center md:text-left">
           <h2 className="text-3xl font-serif font-bold mb-6">About VajeeCare</h2>
           <p className="text-lg leading-relaxed mb-8 opacity-80">
             VajeeCare is an Ayurvedic formulation that helps improve male vitality, stamina, and performance. 
             It supports reproductive health, reduces fatigue, and enhances overall energy levels naturally.
           </p>
           <button className="bg-[#D32F2F] text-white px-10 py-4 rounded-full font-bold shadow-lg">Our Story →</button>
         </div>
      </section>

      

    </div>
  );
}