'use client';

import CheckoutPageClient from './CheckoutPageClient';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const [isSDKReady, setIsSDKReady] = useState(false);

  useEffect(() => {
    // Check if script is already present in the window from layout.tsx
    if (typeof window !== 'undefined' && window.Cashfree) {
      setIsSDKReady(true);
    }
  }, []);

  return (
    <>
      {/* Using Next.js Script component is safer than document.createElement.
          It handles deduplication automatically if it's also in layout.tsx.
      */}
      <Script 
        src="https://sdk.cashfree.com/js/v3/cashfree.js" 
        strategy="afterInteractive"
        onLoad={() => setIsSDKReady(true)}
      />

      {isSDKReady ? (
        <CheckoutPageClient />
      ) : (
        <div className="flex h-screen w-full items-center justify-center bg-[#F9F5F1]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-[#6f3a2f]" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">
              Securing Payment Gateway...
            </p>
          </div>
        </div>
      )}
    </>
  );
}