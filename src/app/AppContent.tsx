
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartProvider } from '@/context/cart-provider';
import { MobileBottomBar } from '@/components/layout/mobile-bottom-bar';
import { Truck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProductPage = pathname.startsWith('/products/');
  const isConsultationSession = pathname.startsWith('/consultation/session/');
  const isInvoicePage = pathname.includes('/invoice');
  const [showMobileNav, setShowMobileNav] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowMobileNav(window.scrollY > 50);
    };

    if (isProductPage) {
      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      setShowMobileNav(true);
    }

    return () => {
      if (isProductPage) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isProductPage]);
  
  if (isConsultationSession || isInvoicePage) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <div className="bg-primary text-primary-foreground text-center p-2 text-sm font-medium flex items-center justify-center gap-2 animate-shine">
          <Truck className="h-4 w-4" />
          <span>Free shipping on orders above ₹999</span>
        </div>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      {showMobileNav && <MobileBottomBar />}
    </CartProvider>
  );
}
