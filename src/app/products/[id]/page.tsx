'use client';

import { notFound, useParams } from 'next/navigation';
import { useDoc, useFirebase, useCollection } from '@/firebase';
import { doc, collection, query, where, limit } from 'firebase/firestore';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Star, Minus, Plus, ShieldCheck, Info, Leaf, ChevronRight, Share2 } from 'lucide-react';
import { ProductCard } from '@/components/products/product-card';
import type { Product } from '@/lib/placeholder-data';
import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { ProductReviews } from '@/components/products/product-reviews';
import { Separator } from '@/components/ui/separator';
import { BuyNowModal } from '@/components/products/BuyNowModal';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = useMemo(() => {
    const id = params?.id;
    return typeof id === 'string' ? decodeURIComponent(id) : '';
  }, [params?.id]);

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
  const { data: reviews } = useCollection<any>(reviewsQuery);
  
  const relatedProductsQuery = useMemo(
    () => (firestore && product?.category ? query(collection(firestore, 'products'), where('category', '==', product.category), limit(5)) : null),
    [firestore, product?.category]
  );
  const { data: allProducts } = useCollection<Product>(relatedProductsQuery);

  const overallRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    return reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / reviews.length;
  }, [reviews]);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 150);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isSoldOut = useMemo(() => {
    if (!product) return false;
    return (product.inventoryQuantity === 0 || (product.inventoryQuantity && product.inventoryQuantity < 0)) && !product.continueSellingWhenOutOfStock;
  }, [product]);

  const handleShare = async () => {
    const shareData = {
      title: product?.name || 'Ayurvedic Wellness',
      url: typeof window !== 'undefined' ? window.location.href : '',
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { console.log("Share failed", err); }
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast({ title: "Link Copied", description: "Link copied to clipboard." });
    }
  };

  if (isProductLoading || !productId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
        <p className="mt-4 text-xs font-bold font-headline uppercase tracking-tight text-primary/40">Loading Wellness...</p>
      </div>
    );
  }

  if (!product && !isProductLoading) {
    notFound();
    return null;
  }

  const relatedProducts = allProducts?.filter((p) => (p as any).__docId !== productId).slice(0, 4);
  const images = product?.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : ['https://placehold.co/600x600/FFFFFF/72392F?text=No+Image'];

  const HEADING_STYLE = "font-bold font-headline text-primary uppercase tracking-tight";

  return (
    <div className="bg-background min-h-screen font-sans">
      {product && <BuyNowModal product={{...product, id: productId}} open={isBuyNowModalOpen} onOpenChange={setIsBuyNowModalOpen} />}
      
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 pb-32 md:pb-16">
        {/* Breadcrumbs */}
        <nav className="mb-6 md:mb-8 overflow-hidden">
            <ol className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-tight text-muted-foreground/60 whitespace-nowrap overflow-x-auto scrollbar-hide">
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                <ChevronRight className="w-3 h-3 opacity-30 shrink-0"/>
                <li><Link href="/products" className="hover:text-primary transition-colors">Products</Link></li>
                {product?.category && (
                    <>
                        <ChevronRight className="w-3 h-3 opacity-30 shrink-0"/>
                        <li className="text-primary truncate">{product.category}</li>
                    </>
                )}
            </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-start">
          {/* Gallery */}
          <div className="flex flex-col gap-4 md:gap-6 md:sticky top-28">
            <div className="aspect-square w-full relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 bg-white shadow-sm">
              <Image
                src={images[selectedImage]}
                alt={product?.name || 'Product'}
                fill
                className="object-cover" 
                priority
                loading="eager"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, index) => (
                  <button key={index} onClick={() => setSelectedImage(index)} className={cn("aspect-square w-16 md:w-20 shrink-0 relative rounded-xl md:rounded-2xl overflow-hidden border-2 bg-white transition-all", selectedImage === index ? 'border-primary shadow-md' : 'border-transparent opacity-50')}>
                    <Image src={img} alt="thumb" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-5 md:gap-6">
            <div className="flex justify-between items-start gap-4">
                <h1 className={cn("text-3xl md:text-6xl leading-[0.9] md:leading-none", HEADING_STYLE)}>
                  {product?.name}
                </h1>
                <Button variant="outline" size="icon" className="rounded-full border-slate-100 shrink-0 bg-white shadow-sm h-10 w-10 md:h-12 md:w-12" onClick={handleShare}>
                    <Share2 className="h-4 w-4 text-primary"/>
                </Button>
            </div>

            <div className="flex items-center gap-3">
               <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("w-3 h-3 md:w-4 md:h-4", i < Math.round(overallRating) ? "text-yellow-400 fill-yellow-400" : "text-slate-200")} />
                    ))}
                </div>
              <span className="text-[10px] md:text-xs font-bold text-muted-foreground/60 uppercase tracking-tight">({reviews?.length || 0} reviews)</span>
            </div>

            <p className="text-3xl md:text-4xl font-bold font-headline text-primary tracking-tight">₹{Math.round(product?.sellingPrice || 0)}</p>
            
            {!isSoldOut && (
                <div className="hidden md:flex flex-col gap-4">
                    <div className="flex gap-4">
                        <div className="flex items-center border border-slate-200 rounded-2xl bg-white p-1">
                            <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus className="w-4 h-4" /></Button>
                            <span className="w-12 text-center font-bold font-headline">{quantity}</span>
                            <Button variant="ghost" size="icon" onClick={() => setQuantity(q => q + 1)}><Plus className="w-4 h-4" /></Button>
                        </div>
                        <Button 
                          onClick={() => addToCart({ ...product!, id: productId, quantity })} 
                          size="lg" 
                          className="flex-grow rounded-2xl h-14 font-bold font-headline uppercase tracking-tight bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all"
                        >
                             Add to Cart
                        </Button>
                    </div>
                    <Button 
                      size="lg" 
                      className="w-full h-14 rounded-2xl bg-primary hover:opacity-90 text-white font-bold font-headline uppercase tracking-tight shadow-xl" 
                      onClick={() => setIsBuyNowModalOpen(true)}
                    >
                        Buy Now
                    </Button>
                </div>
            )}

            <div className="mt-4 md:mt-8">
              <Accordion type="single" collapsible defaultValue="item-0" className="w-full bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                <AccordionItem value="item-0" className="border-slate-100">
                    <AccordionTrigger className="px-5 md:px-8 py-4 font-bold uppercase text-[10px] md:text-xs tracking-tight hover:no-underline text-primary font-headline">
                        <div className="flex items-center gap-3"><Info className="w-4 h-4"/> Product Story</div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 md:px-8 pb-6 text-sm md:text-base text-muted-foreground leading-relaxed">
                      {product?.description}
                    </AccordionContent>
                </AccordionItem>
                {product?.ingredients && (
                  <AccordionItem value="item-1" className="border-slate-100">
                    <AccordionTrigger className="px-5 md:px-8 py-4 font-bold uppercase text-[10px] md:text-xs tracking-tight hover:no-underline text-primary font-headline">
                        <div className="flex items-center gap-3"><Leaf className="w-4 h-4"/> Ingredients</div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 md:px-8 pb-6 text-sm md:text-base text-muted-foreground leading-relaxed">
                      {product.ingredients}
                    </AccordionContent>
                  </AccordionItem>
                )}
                {product?.directionOfUse && (
                  <AccordionItem value="item-2" className="border-none">
                    <AccordionTrigger className="px-5 md:px-8 py-4 font-bold uppercase text-[10px] md:text-xs tracking-tight hover:no-underline text-primary font-headline">
                        <div className="flex items-center gap-3"><ShieldCheck className="w-4 h-4"/> Usage Ritual</div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 md:px-8 pb-6 text-sm md:text-base text-muted-foreground leading-relaxed">
                      {product.directionOfUse}
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>
          </div>
        </div>

        {/* Banners with specific aspect ratios */}
        <div className="mt-16 md:mt-24 flex flex-col gap-0">
            {product?.bannerImageUrl1 && (
                <div className="relative w-full aspect-[4000/1044]">
                    <Image src={product.bannerImageUrl1} alt="Banner 1" fill className="object-cover" sizes="100vw" />
                </div>
            )}
            {product?.bannerImageUrl2 && (
                <div className="relative w-full aspect-[4000/1919]">
                    <Image src={product.bannerImageUrl2} alt="Banner 2" fill className="object-cover" sizes="100vw" />
                </div>
            )}
            {product?.bannerImageUrl3 && (
                <div className="relative w-full aspect-[4000/1919]">
                    <Image src={product.bannerImageUrl3} alt="Banner 3" fill className="object-cover" sizes="100vw" />
                </div>
            )}
        </div>

        <Separator className="my-16 md:my-24 opacity-30"/>
        
        <div className="px-1">
          <ProductReviews productId={productId} />
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-20 md:mt-32">
            <h2 className={cn("text-2xl md:text-3xl text-center mb-8 md:mb-12", HEADING_STYLE)}>
              You May Also Seek
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {relatedProducts.map((p: any) => <ProductCard key={p.__docId} product={{...p, id: p.__docId}} />)}
            </div>
          </div>
        )}
      </div>

       {/* Mobile Floating CTA */}
       <div className={cn(
           "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border/40 p-4 md:hidden z-50 transition-all duration-500 ease-in-out shadow-[0_-10px_40px_rgba(0,0,0,0.08)]", 
           isScrolled ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
       )}>
        {isSoldOut ? (
            <Button size="lg" disabled className="w-full h-14 rounded-2xl font-bold font-headline uppercase tracking-tight">Sold Out</Button>
        ) : (
            <div className="flex items-center gap-2 w-full max-w-lg mx-auto">
                <Button 
                    onClick={() => addToCart({ ...product!, id: productId, quantity })} 
                    size="lg" 
                    className="flex-1 bg-white text-primary border-2 border-primary h-12 rounded-xl font-bold font-headline uppercase tracking-tight text-[10px] px-2"
                >
                    Add to Cart
                </Button>
                <Button 
                    onClick={() => setIsBuyNowModalOpen(true)} 
                    size="lg" 
                    className="flex-[2] bg-primary text-white h-12 rounded-xl font-bold font-headline uppercase tracking-tight text-[11px] shadow-lg active:scale-95 transition-transform"
                >
                    Buy Now
                </Button>
            </div>
        )}
      </div>
    </div>
  );
}