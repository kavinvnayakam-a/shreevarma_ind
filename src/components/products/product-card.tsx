
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/lib/placeholder-data';
import { Star, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product & { __docId?: string };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const imageUrl = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls[0]
    : 'https://placehold.co/400x400/F9F5F1/72392F?text=No+Image';

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
    <div className="group flex flex-col text-center items-center gap-2 transition-all bg-white p-4 rounded-lg border shadow-sm hover:shadow-xl h-full">
        <Link href={`/products/${productId}`} className="block w-full">
            <div className="aspect-square relative w-full bg-transparent rounded-lg overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    data-ai-hint={product.name}
                    loading="lazy"
                />
            </div>
        </Link>
        <div className="flex flex-col items-center gap-1 mt-2 flex-grow w-full">
             <h3 className="font-semibold text-sm h-10 flex items-center justify-center leading-tight">
                <Link href={`/products/${productId}`} className="hover:text-primary">{product.name}</Link>
             </h3>
             <div className="flex-grow"></div>
             <div className="flex text-yellow-400 my-1">
                <Star className="w-4 h-4 fill-current"/>
                <Star className="w-4 h-4 fill-current"/>
                <Star className="w-4 h-4 fill-current"/>
                <Star className="w-4 h-4 fill-current"/>
                <Star className="w-4 h-4 fill-current"/>
            </div>
             <div className="flex items-baseline justify-center gap-2 mb-2">
                <p className="text-lg font-bold text-primary">
                    ₹{Math.round(product.sellingPrice)}
                </p>
                {hasDiscount && (
                    <p className="text-sm text-muted-foreground line-through">
                        ₹{product.comparedAtPrice ? Math.round(product.comparedAtPrice) : ''}
                    </p>
                )}
            </div>
            <Button onClick={handleAddToCart} size="sm" className="w-full" disabled={isSoldOut}>
                 {isSoldOut ? 'Sold Out' : (
                    <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                    </>
                )}
            </Button>
        </div>
    </div>
  );
}
