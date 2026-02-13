'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/lib/placeholder-data';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product & { __docId?: string };
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const imageUrl = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls[0]
    : 'https://placehold.co/600x600/FFFFFF/72392F?text=No+Image';

  const productId = product.__docId || product.id;

  const handleAddToCart = () => {
    addToCart({...product, id: productId});
  };
  
  const hasDiscount = product.comparedAtPrice && product.comparedAtPrice > product.sellingPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((product.comparedAtPrice! - product.sellingPrice) / product.comparedAtPrice!) * 100)
    : 0;
    
  const isSoldOut = (product.inventoryQuantity !== undefined && product.inventoryQuantity <= 0) && !product.continueSellingWhenOutOfStock;

  return (
    <div className="group flex flex-col text-center items-center gap-0 transition-all bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl h-full overflow-hidden">
        <Link href={`/products/${productId}`} className="block w-full">
            <div className="aspect-[4/5] relative w-full bg-white overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    priority={priority}
                    loading={priority ? "eager" : "lazy"}
                    fetchPriority={priority ? "high" : "auto"}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    quality={85}
                />
                
                {hasDiscount && !isSoldOut && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg z-10 uppercase tracking-tighter">
                    {discountPercentage}% OFF
                  </div>
                )}
            </div>
        </Link>

        <div className="flex flex-col items-center gap-1 p-6 pt-4 flex-grow w-full">
             {/* Updated Name Font to match Heading Style */}
             <h3 className="text-sm font-bold font-headline h-10 flex items-center justify-center leading-tight text-primary uppercase tracking-tight">
                <Link href={`/products/${productId}`} className="hover:opacity-70 transition-opacity">
                    {product.name}
                </Link>
             </h3>
             
             <div className="flex text-yellow-400 my-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current"/>
                ))}
            </div>

             <div className="flex items-baseline justify-center gap-2 mb-4">
                {/* Updated Price Font */}
                <p className="text-xl font-bold font-headline text-primary tracking-tight">
                    ₹{Math.round(product.sellingPrice)}
                </p>
                {hasDiscount && (
                    <p className="text-xs text-muted-foreground line-through opacity-50 font-medium">
                        ₹{product.comparedAtPrice ? Math.round(product.comparedAtPrice) : ''}
                    </p>
                )}
            </div>

            {/* Updated Button Font */}
            <Button 
              onClick={handleAddToCart} 
              size="lg" 
              className="w-full rounded-2xl font-bold uppercase tracking-tight text-[11px] py-6 shadow-md" 
              disabled={isSoldOut}
            >
                 {isSoldOut ? 'Sold Out' : 'Add to Cart'}
            </Button>
        </div>
    </div>
  );
}