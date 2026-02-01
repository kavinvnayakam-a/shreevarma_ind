
'use client';

import { notFound, useParams } from 'next/navigation';
import { useDoc, useFirebase, useCollection } from '@/firebase';
import { doc, collection, query, where, DocumentData, orderBy, limit } from 'firebase/firestore';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Loader2, Star, Minus, Plus, ShieldCheck, Info, Leaf, ChevronRight, Share2, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { ProductCard } from '@/components/products/product-card';
import type { Product } from '@/lib/placeholder-data';
import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { ProductReviews } from '@/components/products/product-reviews';
import { Separator } from '@/components/ui/separator';
import { BuyNowModal } from '@/components/products/BuyNowModal';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Review = {
    id: string;
    rating: number;
};


export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { firestore } = useFirebase();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);
  
  const productRef = useMemo(
    () => (firestore && productId ? doc(firestore, 'products', productId) : null),
    [firestore, productId]
  );
  const { data: product, isLoading: isProductLoading } = useDoc<Product>(productRef);

  const reviewsQuery = useMemo(() => {
    if (!firestore || !productId) return null;
    return query(collection(firestore, `products/${productId}/reviews`));
  }, [firestore, productId]);
  const { data: reviews, isLoading: areReviewsLoading } = useCollection<Review>(reviewsQuery);
  
  const relatedProductsQuery = useMemo(
    () => (firestore && product?.category ? query(collection(firestore, 'products'), where('category', '==', product.category), limit(5)) : null),
    [firestore, product]
  );
  const { data: allProducts, isLoading: areProductsLoading } = useCollection<Product>(relatedProductsQuery);

  const overallRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / reviews.length;
  }, [reviews]);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isSoldOut = useMemo(() => {
    if (!product) return false;
    return (product.inventoryQuantity === 0 || (product.inventoryQuantity && product.inventoryQuantity < 0)) && !product.continueSellingWhenOutOfStock;
  }, [product]);

  if (isProductLoading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-14rem)]"><Loader2 className="h-16 w-16 animate-spin" /></div>;
  }

  if (!product) {
    notFound();
    return null;
  }
  
  const discountPercentage = product.comparedAtPrice && product.sellingPrice
    ? Math.round(((product.comparedAtPrice - product.sellingPrice) / product.comparedAtPrice) * 100)
    : 0;

  const relatedProducts = allProducts
    ?.filter((p) => (p as any).__docId !== productId)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart({ ...product, id: productId, quantity });
  };

  const images = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls
    : ['https://placehold.co/600x600/F9F5F1/72392F?text=No+Image'];

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };
  
  const categorySlug = product.category ? product.category.replace(/\s+/g, '-').replace(/'/g, '') : 'products';

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out this product: ${product.name}`;

  return (
    <div className="bg-[#F9F5F1]">
      {product && <BuyNowModal product={{...product, id: productId}} open={isBuyNowModalOpen} onOpenChange={setIsBuyNowModalOpen} />}
      <div className="container mx-auto px-4 py-8 pb-32 md:pb-8">
         {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-foreground">Home</Link></li>
                <li><ChevronRight className="w-4 h-4"/></li>
                <li><Link href="/products" className="hover:text-foreground">Products</Link></li>
                {product.category && (
                    <>
                        <li><ChevronRight className="w-4 h-4"/></li>
                        <li><Link href={`/${categorySlug}`} className="hover:text-foreground">{product.category}</Link></li>
                    </>
                )}
                <li><ChevronRight className="w-4 h-4"/></li>
                <li className="font-medium text-foreground">{product.name}</li>
            </ol>
        </nav>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4 md:sticky top-24">
            <div className="aspect-square w-full relative overflow-hidden rounded-lg border bg-white">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
               {discountPercentage > 0 && (
                <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <span>{discountPercentage}% OFF</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, index) => (
                  <button key={index} onClick={() => setSelectedImage(index)} className={cn("aspect-square w-20 h-20 relative rounded-md overflow-hidden border-2 bg-white", selectedImage === index ? 'border-primary' : 'border-transparent')}>
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-4">
            {product.brand && (
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{product.brand}</p>
            )}
            <div className="flex justify-between items-start gap-4">
                <h1 className="text-3xl md:text-4xl font-bold font-headline flex-1">{product.name}</h1>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Share2 className="h-5 w-5"/>
                        <span className="sr-only">Share</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer">
                          <Facebook className="h-5 w-5" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                         <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-5 w-5" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="h-5 w-5"/>
                        </a>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
            </div>
            <div className="flex items-center gap-2">
               <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={cn(
                                "w-5 h-5",
                                i < Math.round(overallRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            )}
                        />
                    ))}
                </div>
              {reviews && reviews.length > 0 && <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>}
            </div>
            <p className="text-3xl font-bold text-primary">₹{Math.round(product.sellingPrice)}
              {product.comparedAtPrice && product.comparedAtPrice > product.sellingPrice && (
                <span className="text-lg text-muted-foreground line-through ml-2">₹{Math.round(product.comparedAtPrice)}</span>
              )}
            </p>
            
            {isSoldOut ? (
                <Button size="lg" disabled className="w-full">Sold Out</Button>
            ) : (
                <>
                <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-md bg-white">
                        <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => handleQuantityChange(-1)}><Minus className="w-4 h-4" /></Button>
                        <span className="w-12 text-center font-bold">{quantity}</span>
                        <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => handleQuantityChange(1)}><Plus className="w-4 h-4" /></Button>
                    </div>
                    <Button onClick={handleAddToCart} size="lg" className="flex-grow">
                        <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                    </Button>
                    </div>
                    <Button size="lg" className="w-full bg-[#72392F] hover:bg-[#5f2f27] text-white animate-shine" onClick={() => setIsBuyNowModalOpen(true)}>Buy Now</Button>
                </>
            )}

            {/* Accordion for details */}
            <div className="mt-6">
              <Accordion type="single" collapsible defaultValue="item-0" className="w-full bg-white rounded-lg border">
                {product.description && (
                  <AccordionItem value="item-0">
                    <AccordionTrigger className="px-6"><Info className="mr-2"/> About the product</AccordionTrigger>
                    <AccordionContent className="px-6">{product.description}</AccordionContent>
                  </AccordionItem>
                )}
                {product.ingredients && (
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="px-6"><Leaf className="mr-2"/> Ingredients</AccordionTrigger>
                    <AccordionContent className="px-6">{product.ingredients}</AccordionContent>
                  </AccordionItem>
                )}
                {product.directionOfUse && (
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="px-6"><ShieldCheck className="mr-2"/> How to use</AccordionTrigger>
                    <AccordionContent className="px-6">{product.directionOfUse}</AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>
          </div>
        </div>

        {/* Description Banners */}
        <div className="my-16 flex flex-col">
            {product.bannerImageUrl1 && 
                <div className="relative w-full aspect-[4000/1044]">
                    <Image src={product.bannerImageUrl1} alt="Product Banner 1" fill sizes="100vw" className="object-cover" data-ai-hint="product benefit" />
                </div>
            }
             {product.bannerImageUrl2 && 
                <div className="relative w-full aspect-[4000/1919]">
                    <Image src={product.bannerImageUrl2} alt="Product Banner 2" fill sizes="100vw" className="object-cover" data-ai-hint="product ingredients" />
                </div>
            }
             {product.bannerImageUrl3 && 
                <div className="relative w-full aspect-[4000/1919]">
                    <Image src={product.bannerImageUrl3} alt="Product Banner 3" fill sizes="100vw" className="object-cover" data-ai-hint="product results" />
                </div>
            }
        </div>

        <Separator className="my-16"/>
        
        {/* Reviews Section */}
        <ProductReviews productId={productId} />

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl font-bold font-headline text-center mb-8">Related Products</h2>
            {areProductsLoading ? (
              <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {relatedProducts.map((p: any) => <ProductCard key={p.__docId} product={{...p, id: p.__docId}} />)}
              </div>
            )}
          </div>
        )}
      </div>

       {/* Sticky Footer for Mobile */}
      <div className={cn("fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-2 md:hidden z-40 transition-transform duration-300", isScrolled ? 'translate-y-full' : 'translate-y-0')}>
        {isSoldOut ? (
            <Button size="lg" disabled className="w-full h-14 text-lg">Sold Out</Button>
        ) : (
            <div className="flex items-center gap-2 h-14">
                <Button onClick={handleAddToCart} size="lg" className="flex-1 bg-white text-primary border border-primary hover:bg-gray-100 h-full">
                    Add to Cart
                </Button>
                <Button size="lg" className="flex-1 bg-[#72392F] hover:bg-[#5f2f27] text-white h-full animate-shine" onClick={() => setIsBuyNowModalOpen(true)}>Buy Now</Button>
            </div>
        )}
      </div>

    </div>
  );
}
