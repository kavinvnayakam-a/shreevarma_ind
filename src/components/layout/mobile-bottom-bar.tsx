'use client';

import {
  Video,
  ShoppingBag,
  User,
  ShoppingCart,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { Sheet, SheetTrigger } from '../ui/sheet';
import { CartDrawer } from '../cart/cart-drawer';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/consultation', icon: Video, label: 'Consult' },
  { href: '/products', icon: ShoppingBag, label: 'Shop' },
  { href: '/', icon: Home, label: 'Home', isLogo: true },
  { href: '#cart', icon: ShoppingCart, label: 'Cart', isCart: true },
  { href: '/profile', icon: User, label: 'Account' },
];

export function MobileBottomBar() {
  const pathname = usePathname();
  const { cartCount, isCartOpen, setCartOpen } = useCart();
  const { user } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-background border-t border-border/40 shadow-[0_-1px_4px_rgba(0,0,0,0.05)] z-50">
      <nav className="h-full">
        <ul className="flex justify-around items-center h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            // 1. CENTER LOGO BUTTON
            if (item.isLogo) {
              return (
                <li key={item.href} className="relative">
                  <Link href={item.href} className="block">
                    <div className="relative -top-6 flex items-center justify-center h-16 w-16 bg-background rounded-full shadow-md border border-border/40">
                       <Image 
                        src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Homepage%2FLOGO%20(2).webp?alt=media&token=d5eb0f25-93b7-4cff-b3aa-fea48263bf92" 
                        alt="Logo" 
                        width={50} 
                        height={50} 
                        className="object-contain" 
                       />
                    </div>
                  </Link>
                </li>
              );
            }

            // 2. CART TRIGGER ITEM
            if (item.isCart) {
                return (
                    <li key={item.href} className="flex-1">
                        {!isClient ? (
                             <div className="flex flex-col items-center justify-center text-center gap-1 text-muted-foreground">
                                <div className="relative">
                                    <ShoppingCart className="h-6 w-6" />
                                </div>
                                <span className="text-xs font-medium">{item.label}</span>
                            </div>
                        ) : (
                            <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
                                <SheetTrigger asChild>
                                    <button className={cn(
                                        'flex flex-col items-center justify-center text-center gap-1 transition-colors w-full',
                                        isCartOpen ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                                    )}>
                                        <div className="relative">
                                          <ShoppingCart className="h-6 w-6" />
                                          {cartCount > 0 && (
                                            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                                              {cartCount}
                                            </span>
                                          )}
                                        </div>
                                        <span className="text-xs font-medium">{item.label}</span>
                                    </button>
                                </SheetTrigger>
                                <CartDrawer />
                            </Sheet>
                        )}
                    </li>
                )
            }

            // 3. REGULAR NAVIGATION ITEMS (CONSULT, SHOP, ACCOUNT)
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center text-center gap-1 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                  )}
                >
                  <div className="relative h-6 w-6">
                    {item.href === '/profile' && user ? (
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                            <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                                {user.displayName?.charAt(0) || user.email?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    ) : (
                        <item.icon className="h-6 w-6" />
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}