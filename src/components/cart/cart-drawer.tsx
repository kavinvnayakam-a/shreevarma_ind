'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import {
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ChevronRight,
  Loader2,
  X
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { SheetBody, SheetFooter, SheetPanel } from './cart-sheet';
import { Product } from '@/lib/placeholder-data';
import { useCollection, useFirebase } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import { useMemo } from 'react';
import { Card } from '../ui/card';

const productFamilies = [
    'Vajee care', 'Shreecare', 'Sarasbrahmi', 'Keshya amruth hair', 'Charmatejas', 'Psoraxit', 'Kumkumadi', 'Amruthuls', 
    'Arshocare', 'Brih-G', 'Hruthcare', 'Maharaja', 'Orthocure', 'Manasa', 'Mehnil', 'Reknown', 'Respokalp', 'Rakkshak', 
    'ShreeSlim', 'Liv immune', 'Sinit', 'Thyrex', 'Yakruth care', 'Vata shamani', 'Pitta shamani', 'Kapha shamani', 'Detox', 
    'Swascare', 'Chyavaan'
];

export function CartDrawer() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, addToCart } = useCart();
  const { firestore } = useFirebase();

  // Speed Optimization: limit suggestions fetch to 40 items
  const allProductsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), limit(40));
  }, [firestore]);

  const { data: allProducts, isLoading } = useCollection<Product>(allProductsQuery);
  
  const suggestedProducts = useMemo(() => {
    if (!allProducts || cartItems.length === 0) return [];
    
    const familiesInCart = new Set<string>();
    cartItems.forEach(item => {
        const family = productFamilies.find(f => item.name.toLowerCase().includes(f.toLowerCase()));
        if (family) familiesInCart.add(family);
    });

    const suggestions = allProducts.filter(p => {
        const pId = (p as any).__docId;
        if (cartItems.some(item => item.id === pId)) return false;
        return Array.from(familiesInCart).some(family => p.name.toLowerCase().includes(family.toLowerCase()));
    });

    return suggestions.slice(0, 5);
  }, [allProducts, cartItems]);

  return (
    <SheetPanel className="w-[80%] sm:max-w-md bg-white border-l border-slate-100 p-0 flex flex-col h-full shadow-2xl">
      {/* Header with Custom Close Icon (Default Shadcn Close hidden in SheetPanel) */}
      <SheetHeader className="p-6 flex flex-row items-center justify-between border-b border-slate-50 shrink-0">
        <SheetTitle className="text-xl font-black uppercase tracking-tighter text-primary">
            Wellness Cart
        </SheetTitle>
        <SheetClose className="rounded-full p-2 hover:bg-slate-50 transition-all focus-visible:outline-none active:scale-90">
          <X className="w-5 h-5 text-primary" />
          <span className="sr-only">Close</span>
        </SheetClose>
      </SheetHeader>

      {cartItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 p-10 bg-white">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-primary/10" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black uppercase tracking-tight text-primary">Your cart is empty</h3>
            <p className="text-xs text-muted-foreground font-medium italic">Begin your journey to wellness.</p>
          </div>
          <SheetClose asChild>
            <Button asChild className="rounded-2xl px-8 py-6 font-bold uppercase tracking-widest text-[10px] shadow-sm">
              <Link href="/products">Shop Products</Link>
            </Button>
          </SheetClose>
        </div>
      ) : (
        <>
          <SheetBody className="flex-1 overflow-y-auto bg-white scrollbar-hide">
            <div className="p-6 space-y-6">
              {cartItems.map((item) => {
                const imageUrl = item.imageUrls?.[0] || 'https://placehold.co/200x200/FFFFFF/72392F?text=Product';
                return (
                  <div key={item.id} className="flex items-center gap-4 group">
                    <div className="relative aspect-square w-20 rounded-2xl overflow-hidden border border-slate-50 bg-white shrink-0 shadow-sm">
                        <Image
                          src={imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="80px"
                          quality={85}
                        />
                    </div>
                    <div className="flex-grow space-y-1">
                      <SheetClose asChild>
                        <Link
                          href={`/products/${item.id}`}
                          className="font-black text-[11px] uppercase tracking-tight text-primary hover:opacity-70 transition-opacity block leading-tight line-clamp-2"
                        >
                          {item.name}
                        </Link>
                      </SheetClose>
                      <p className="font-bold text-sm text-primary">
                        ₹{Math.round(item.sellingPrice)}
                      </p>
                      
                      <div className="flex items-center justify-between gap-2 pt-2">
                        <div className="flex items-center border border-slate-100 rounded-xl bg-white p-0.5 shadow-sm">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-slate-50 transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-xs font-black">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-slate-50 transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground/30 hover:text-red-500 h-8 w-8 transition-colors"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recommendations Section */}
            <div className="px-6 py-8 bg-slate-50/50">
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-primary/40 mb-4 flex items-center gap-2">
                <ChevronRight className="w-3 h-3" /> Frequently Bought Together
              </h4>
                {isLoading ? (
                    <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary"/></div>
                ) : suggestedProducts.length > 0 ? (
                    <Carousel opts={{ align: 'start', loop: false }} className="w-full">
                        <CarouselContent>
                        {suggestedProducts.map((p: Product) => (
                            <CarouselItem key={(p as any).__docId} className="basis-full">
                                <Card className="p-3 flex items-center gap-4 rounded-2xl border-none bg-white shadow-sm mx-1">
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0">
                                        <Image
                                            src={p.imageUrls?.[0] || 'https://placehold.co/200x200/FFFFFF/72392F?text=Product'}
                                            alt={p.name}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                            quality={75}
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-[10px] font-black uppercase text-primary leading-tight line-clamp-1">{p.name}</p>
                                        <p className="text-xs font-bold text-primary">₹{Math.round(p.sellingPrice)}</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="rounded-full border-primary text-primary text-[10px] font-bold hover:bg-primary hover:text-white transition-all" onClick={() => addToCart({...p, id: (p as any).__docId})}>Add</Button>
                                </Card>
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                    </Carousel>
                ) : (
                    <p className="text-center text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest italic">Personalizing recommendations...</p>
                )}
            </div>
          </SheetBody>

          <SheetFooter className="p-6 bg-white border-t border-slate-50 shrink-0 shadow-[0_-15px_40px_rgba(0,0,0,0.04)]">
              <div className="flex justify-between items-center w-full mb-6">
                  <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Grand Total</span>
                  <span className="font-black text-2xl text-primary tracking-tighter">₹{Math.round(cartTotal)}</span>
              </div>
               <SheetClose asChild>
                  <Button asChild size="lg" className="w-full h-16 rounded-2xl bg-primary hover:opacity-95 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/10 transition-transform active:scale-[0.98]">
                      <Link href="/checkout">Secure Checkout</Link>
                  </Button>
               </SheetClose>
          </SheetFooter>
        </>
      )}
    </SheetPanel>
  );
}