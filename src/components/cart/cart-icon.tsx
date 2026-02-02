'use client';

import { useCart } from '@/hooks/use-cart';
import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CartIcon() {
  const { cartCount } = useCart();

  return (
    <div className="relative group p-2">
      <ShoppingCart className="h-6 w-6 text-primary transition-transform group-hover:scale-110 duration-300" />
      
      {cartCount > 0 && (
        <>
          {/* Subtle pulse effect for attention */}
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-20"></span>
            <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-primary text-[10px] font-black text-white shadow-sm">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          </span>
        </>
      )}
      
      <span className="sr-only">Shopping Cart ({cartCount} items)</span>
    </div>
  );
}