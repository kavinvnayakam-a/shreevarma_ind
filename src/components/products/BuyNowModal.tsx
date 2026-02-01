
'use client';

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { useFirebase, useCollection } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import type { Product } from '@/lib/placeholder-data';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface BuyNowModalProps {
  product: Product & { __docId?: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// List of product family keywords
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

  // Use all products to find suggestions
  const allProductsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'));
  }, [firestore]);

  const { data: allProducts, isLoading } = useCollection<Product>(allProductsQuery);

  const suggestedProducts = useMemo(() => {
    if (!allProducts || !product) return [];

    const productId = product.__docId || product.id;
    
    // Find which family the main product belongs to
    const mainProductFamily = productFamilies.find(family => 
        product.name.toLowerCase().includes(family.toLowerCase())
    );

    if (!mainProductFamily) {
        // Fallback: If no family, suggest from the same category
        return allProducts
            .filter(p => (p as any).__docId !== productId && p.category === product.category && !cartItems.some(item => item.id === (p as any).__docId))
            .slice(0, 4);
    }
    
    // Find other products in the same family
    const familySuggestions = allProducts.filter(p => {
        const pId = (p as any).__docId;
        return pId !== productId && // Not the same product
               p.name.toLowerCase().includes(mainProductFamily.toLowerCase()) && // Belongs to the same family
               !cartItems.some(item => item.id === pId); // Not already in cart
    });
    
    return familySuggestions.slice(0, 4); // Limit to 4 suggestions

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Frequently Bought Together</DialogTitle>
          <DialogDescription>Customers who bought {product.name} also bought:</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : suggestedProducts.length > 0 ? (
            <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                {suggestedProducts.map((p) => {
                    const id = (p as any).__docId;
                    return (
                    <div key={id} className="flex items-center gap-4 p-2 border rounded-lg">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                            <Image
                                src={p.imageUrls?.[0] || 'https://placehold.co/100x100'}
                                alt={p.name}
                                fill
                                sizes="64px"
                                className="object-contain"
                            />
                        </div>
                        <div className="flex-grow">
                            <p className="font-semibold text-sm">{p.name}</p>
                            <p className="text-sm text-muted-foreground">₹{Math.round(p.sellingPrice)}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleAddToCart(p)}>
                            Add
                        </Button>
                    </div>
                )})}
                </div>
            </ScrollArea>
          ) : (
            <div className="text-center text-muted-foreground h-40 flex items-center justify-center">
                <p>No specific recommendations at this time.</p>
            </div>
          )}
        </div>
        <DialogFooter>
            <div className="w-full flex flex-col gap-2">
                <Button onClick={handleCheckout} className="w-full" disabled={isCheckingOut}>
                    {isCheckingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isCheckingOut ? 'Proceeding...' : `Checkout (${cartItems.length} items)`}
                </Button>
                 <Button onClick={() => onOpenChange(false)} className="w-full" variant="ghost">
                    Continue Shopping
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
