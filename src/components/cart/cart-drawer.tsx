
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
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Separator } from '../ui/separator';
import { SheetBody, SheetFooter, SheetPanel } from './cart-sheet';
import { Product } from '@/lib/placeholder-data';
import { useCollection, useFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { useMemo } from 'react';
import { Card } from '../ui/card';
import { Loader2 } from 'lucide-react';


const productFamilies = [
    'Vajee care', 'Shreecare', 'Sarasbrahmi', 'Keshya amruth hair', 'Charmatejas', 'Psoraxit', 'Kumkumadi', 'Amruthuls', 
    'Arshocare', 'Brih-G', 'Hruthcare', 'Maharaja', 'Orthocure', 'Manasa', 'Mehnil', 'Reknown', 'Respokalp', 'Rakkshak', 
    'ShreeSlim', 'Liv immune', 'Sinit', 'Thyrex', 'Yakruth care', 'Vata shamani', 'Pitta shamani', 'Kapha shamani', 'Detox', 
    'Swascare', 'Chyavaan'
];

export function CartDrawer() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, addToCart } = useCart();
  const { firestore } = useFirebase();

  const allProductsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'));
  }, [firestore]);

  const { data: allProducts, isLoading } = useCollection<Product>(allProductsQuery);
  
  const suggestedProducts = useMemo(() => {
    if (!allProducts || cartItems.length === 0) return [];
    
    // Find all families present in the cart
    const familiesInCart = new Set<string>();
    cartItems.forEach(item => {
        const family = productFamilies.find(f => item.name.toLowerCase().includes(f.toLowerCase()));
        if (family) {
            familiesInCart.add(family);
        }
    });

    if (familiesInCart.size === 0) return []; // No families found in cart

    // Find other products in those families
    const suggestions = allProducts.filter(p => {
        const pId = (p as any).__docId;
        const isInCart = cartItems.some(item => item.id === pId);
        if (isInCart) return false;

        const belongsToFamily = Array.from(familiesInCart).some(family => p.name.toLowerCase().includes(family.toLowerCase()));
        return belongsToFamily;
    });

    return suggestions.slice(0, 5); // Limit suggestions

  }, [allProducts, cartItems]);


  return (
    <SheetPanel>
      <SheetHeader className="p-4 border-b text-center">
        <SheetTitle>Shopping Cart</SheetTitle>
      </SheetHeader>

      {cartItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 p-6">
          <ShoppingCart className="w-24 h-24 text-muted-foreground" />
          <h3 className="text-xl font-semibold">Your cart is empty</h3>
          <SheetClose asChild>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </SheetClose>
        </div>
      ) : (
        <>
          <SheetBody>
            <div className="p-4 space-y-4">
              {cartItems.map((item) => {
                const imageUrl = item.imageUrls && item.imageUrls.length > 0
                  ? item.imageUrls[0]
                  : 'https://placehold.co/100x100/F5F5DC/333333?text=No+Image';
                return (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="relative aspect-square w-20 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          data-ai-hint={item.name}
                        />
                    </div>
                    <div className="flex-grow">
                      <SheetClose asChild>
                        <Link
                          href={`/products/${item.id}`}
                          className="font-semibold text-sm hover:underline"
                        >
                          {item.name}
                        </Link>
                      </SheetClose>
                      <p className="text-sm text-muted-foreground">
                        by {item.brand}
                      </p>
                      <p className="font-bold text-sm my-1">
                        ₹{Math.round(item.sellingPrice)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            -
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          variant="link"
                          className="text-muted-foreground text-xs p-0 h-auto"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator />
            
            <div className="p-4">
              <h4 className="font-semibold mb-4 text-center">
                Frequently Bought Together
              </h4>
                {isLoading ? (
                    <div className="flex justify-center items-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin"/>
                    </div>
                ) : suggestedProducts.length > 0 ? (
                    <Carousel
                        opts={{ align: 'start', loop: false }}
                        className="w-full"
                    >
                        <CarouselContent>
                        {suggestedProducts.map((p: Product) => {
                            const imageUrl = p.imageUrls && p.imageUrls.length > 0
                            ? p.imageUrls[0]
                            : 'https://placehold.co/100x100/F5F5DC/333333?text=No+Image';
                            return (
                            <CarouselItem key={(p as any).__docId} className="basis-full">
                                <div className="p-1">
                                    <Card className="p-2 flex items-center gap-2">
                                        <Image
                                            src={imageUrl}
                                            alt={p.name}
                                            width={64}
                                            height={64}
                                            className="rounded"
                                        />
                                        <div className="flex-grow">
                                            <p className="text-sm font-medium leading-tight">{p.name}</p>
                                            <p className="text-xs text-muted-foreground">₹ {Math.round(p.sellingPrice)}</p>
                                        </div>
                                        <Button size="sm" onClick={() => addToCart({...p, id: (p as any).__docId})}>Add</Button>
                                    </Card>
                                </div>
                            </CarouselItem>
                            );
                        })}
                        </CarouselContent>
                        {suggestedProducts.length > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-4">
                                <CarouselPrevious className="relative -left-0 top-0 translate-y-0" />
                                <CarouselNext className="relative -right-0 top-0 translate-y-0" />
                            </div>
                        )}
                    </Carousel>
                ) : (
                    <p className="text-center text-xs text-muted-foreground">No recommendations for now.</p>
                )}
            </div>

          </SheetBody>

          <SheetFooter>
              <div className="flex justify-between font-bold text-lg">
                  <span>Subtotal</span>
                  <span>₹{Math.round(cartTotal)}</span>
              </div>
               <SheetClose asChild>
                  <Button asChild size="lg" className="w-full">
                      <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
              </SheetClose>
          </SheetFooter>
        </>
      )}
    </SheetPanel>
  );
}
