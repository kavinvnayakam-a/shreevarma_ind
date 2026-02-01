
'use client';

import CheckoutPageClient from './CheckoutPageClient';
import { useEffect } from 'react';

export default function CheckoutPage() {
  // The Cashfree SDK is loaded globally in layout.tsx.
  // This check ensures the window.Cashfree object is available before rendering the client component,
  // but we no longer need to call the `load` function from the `cashfree-pg` npm package here.
  useEffect(() => {
    if (typeof window.Cashfree === 'undefined' && !window.cashfreeSDKLoaded) {
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.onload = () => {
        window.cashfreeSDKLoaded = true;
        // You might need to trigger a re-render here if CheckoutPageClient depends on it
      };
      document.body.appendChild(script);
    }
  }, []);
  
  return <CheckoutPageClient />;
}
