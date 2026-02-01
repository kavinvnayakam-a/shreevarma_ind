
'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export function CartIcon() {
  const { cartCount } = useCart();

  return (
    <div className="relative">
      <ShoppingCart className="h-5 w-5" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
          {cartCount}
        </span>
      )}
      <span className="sr-only">Shopping Cart</span>
    </div>
  );
}
