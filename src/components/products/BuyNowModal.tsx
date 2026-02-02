'use client';

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { useFirebase, useCollection } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore'; // Removed where to keep logic flexible
import type { Product } from '@/lib/placeholder-data';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface BuyNowModalProps {
  product: Product & { __docId?: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Verified product family keywords
const productFamilies = [
    'Vajee care', 'Shreecare', 'Sarasbrahmi', 'Keshya amruth hair', 'Charmatejas', 'Psoraxit', 'Kumkumadi', 'Amruthuls', 
    'Arshocare', 'Brih-G', 'Hruthcare', 'Maharaja', 'Orthocure', 'Manasa', 'Mehnil', 'Reknown', 'Respokalp', 'Rakkshak', 
    'ShreeSlim', 'Liv immune', 'Sinit', 'Thyrex', 'Yakruth care', 'Vata shamani', 'Pitta shamani', 'Kapha shamani', 'Detox', 
    'Swascare', 'Chyavaan'
];

export function BuyNowModal({ product, open, onOpenChange }: BuyNowModalProps) {
  const router = useRouter();
  const { addToCart, cartItems } = useCart();
  const { firestore } = useFirebase();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // OPTIMIZATION: Limit total fetch to 50 items to find family matches faster without taxing the browser
  const allProductsQuery = useMemo(() => {
    if (!firestore || !open) return null; // Only fetch when modal actually opens
    return query(collection(firestore, 'products'), limit(50));
  }, [firestore, open]);

  const { data: allProducts, isLoading } = useCollection<Product>(allProductsQuery);

  const suggestedProducts = useMemo(() => {
    if (!allProducts || !product) return [];

    const productId = product.__docId || product.id;
    
    const mainProductFamily = productFamilies.find(family => 
        product.name.toLowerCase().includes(family.toLowerCase())
    );

    if (!mainProductFamily) {
        return allProducts
            .filter(p => {
                const pId = (p as any).__docId;
                return pId !== productId && p.category === product.category && !cartItems.some(item => item.id === pId);
            })
            .slice(0, 4);
    }
    
    const familySuggestions = allProducts.filter(p => {
        const pId = (p as any).__docId;
        return pId !== productId && 
               p.name.toLowerCase().includes(mainProductFamily.toLowerCase()) && 
               !cartItems.some(item => item.id === pId);
    });
    
    return familySuggestions.length > 0 ? familySuggestions.slice(0, 4) : allProducts.slice(0, 4);

  }, [allProducts, product, cartItems]);
  

  const handleAddToCart = (productToAdd: Product) => {
    const id = (productToAdd as any).__docId || productToAdd.id;
    addToCart({...productToAdd, id });
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    const productId = product.__docId || product.id;
    const isMainProductInCart = cartItems.some(item => item.id === productId);
    if (!isMainProductInCart) {
        addToCart({...product, id: productId});
    }
    router.push('/checkout');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-[2rem] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-black text-2xl text-primary uppercase tracking-tighter">Frequently Bought Together</DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium italic">
            Complete your {product.name.split(' ')[0]} wellness routine
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-40 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">Finding matches...</p>
            </div>
          ) : suggestedProducts.length > 0 ? (
            <ScrollArea className="h-[320px] pr-4">
                <div className="space-y-3">
                {suggestedProducts.map((p) => {
                    const id = (p as any).__docId;
                    return (
                    <div key={id} className="flex items-center gap-4 p-3 border border-slate-50 rounded-2xl bg-white hover:border-primary/20 transition-colors group">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0">
                            <Image
                                src={p.imageUrls?.[0] || 'https://placehold.co/200x200/FFFFFF/72392F?text=Product'}
                                alt={p.name}
                                fill
                                sizes="80px"
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                priority // Eager load these as they are small and critical for conversion
                                quality={75}
                            />
                        </div>
                        <div className="flex-grow space-y-1">
                            <p className="font-black text-primary text-xs uppercase leading-tight line-clamp-2">{p.name}</p>
                            <p className="font-bold text-sm text-primary">₹{Math.round(p.sellingPrice)}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="rounded-full border-primary text-primary font-bold hover:bg-primary hover:text-white"
                          onClick={() => handleAddToCart(p)}
                        >
                            Add
                        </Button>
                    </div>
                )})}
                </div>
            </ScrollArea>
          ) : (
            <div className="text-center text-muted-foreground h-40 flex items-center justify-center bg-slate-50/50 rounded-2xl">
                <p className="text-sm font-medium italic">Tailoring personalized recommendations for you...</p>
            </div>
          )}
        </div>

        <DialogFooter className="sm:flex-col gap-3">
            <Button 
                onClick={handleCheckout} 
                className="w-full py-7 rounded-2xl font-black uppercase tracking-widest shadow-lg" 
                disabled={isCheckingOut}
            >
                {isCheckingOut ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    `Checkout — ₹${cartItems.reduce((acc, item) => acc + item.sellingPrice, 0)}`
                )}
            </Button>
            <Button 
                onClick={() => onOpenChange(false)} 
                className="w-full text-primary font-bold hover:bg-primary/5 uppercase tracking-widest text-xs" 
                variant="ghost"
            >
                Continue Shopping
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}