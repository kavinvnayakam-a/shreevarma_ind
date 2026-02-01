
'use client';

import { useMemo, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { ProductCard } from '@/components/products/product-card';
import { useFirebase, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import type { Product } from '@/lib/placeholder-data';
import { categories, categoryHeros, defaultHero } from '@/components/products/category-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

export default function CategoryPage() {
  const params = useParams();
  const { firestore } = useFirebase();
  const categorySlug = params.category as string;
  const [selectedDisease, setSelectedDisease] = useState('all');

  const categoryInfo = useMemo(() => {
    return categories.find(c => c.slug === categorySlug);
  }, [categorySlug]);

  if (!categoryInfo) {
    notFound();
  }

  const categoryName = categoryInfo.name;
  const categoryHeroInfo = categoryHeros[categoryInfo.slug] || defaultHero;

  const productsQuery = useMemo(() => {
    if (!firestore || !categoryName) return null;
    return query(collection(firestore, 'products'), where('category', '==', categoryName));
  }, [firestore, categoryName]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const diseases = useMemo(() => {
    if (!products) return ['all'];
    const allTags = products.flatMap(p => p.tags || []);
    return ['all', ...Array.from(new Set(allTags))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (selectedDisease === 'all') return products;
    return products.filter(p => p.tags?.includes(selectedDisease));
  }, [products, selectedDisease]);

  return (
    <div className="bg-[#F9F5F1]">
      {/* Hero Section */}
      <section className="relative w-full aspect-square md:aspect-[1400/368] bg-white">
        <Image
            src={categoryHeroInfo.mobile}
            alt={categoryName}
            fill
            className="object-cover md:hidden"
            data-ai-hint={categoryHeroInfo.hint}
            priority
        />
        <Image
            src={categoryHeroInfo.desktop}
            alt={categoryName}
            fill
            className="object-cover hidden md:block"
            data-ai-hint={categoryHeroInfo.hint}
            priority
        />
      </section>

      {/* Main Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">{categoryName}</h1>
          </div>
          
          {categorySlug === 'Health' && diseases.length > 1 && (
            <Card className="max-w-md mx-auto mb-12 p-4 shadow-md">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <h3 className="font-semibold text-primary">Filter by Disease:</h3>
                  <Select value={selectedDisease} onValueChange={setSelectedDisease}>
                      <SelectTrigger className="w-full sm:w-[220px]">
                          <SelectValue placeholder="Select a disease" />
                      </SelectTrigger>
                      <SelectContent>
                          {diseases.map(d => (
                              <SelectItem key={d} value={d}>
                                  {d === 'all' ? 'All Diseases' : d}
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </div>
            </Card>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {filteredProducts && filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.__docId} product={{...product, id: product.__docId}} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground bg-white rounded-lg shadow-sm">
                  <p>No products found for the selected filter.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
