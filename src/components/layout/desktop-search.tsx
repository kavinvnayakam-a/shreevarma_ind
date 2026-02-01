
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useFirebase, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Search, Loader2, ShoppingBag, User, Heart } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';

import { specialists } from '@/components/home/specialists-data';
import PlaceholderImages from '@/lib/placeholder-images.json';
import { Product } from '@/lib/placeholder-data';


const healthTopics = PlaceholderImages.placeholderImages
  .filter(img => img.id.startsWith('health-'))
  .map(img => ({
    name: img.description?.replace('Image for ', '') || '',
    slug: img.description?.replace('Image for ', '').toLowerCase().replace(/\s/g, '-') || '',
  }));
  
export function DesktopSearch() {
  const [open, setOpen] = useState(false);
  const [queryText, setQueryText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ products: Product[]; doctors: any[]; topics: any[] }>({ products: [], doctors: [], topics: [] });

  const { firestore } = useFirebase();

  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), orderBy('name'));
  }, [firestore]);

  const { data: allProducts } = useCollection<Product>(productsQuery);

  const debouncedSearch = useMemo(() => {
    let timer: NodeJS.Timeout;
    return (searchQuery: string) => {
      clearTimeout(timer);
      if (searchQuery.length > 1) {
        setIsLoading(true);
        timer = setTimeout(() => {
          if (allProducts) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(lowerCaseQuery));
            const filteredDoctors = specialists.filter(d => d.name.toLowerCase().includes(lowerCaseQuery));
            const filteredTopics = healthTopics.filter(t => t.name.toLowerCase().includes(lowerCaseQuery));
            setResults({ products: filteredProducts, doctors: filteredDoctors, topics: filteredTopics });
          }
          setIsLoading(false);
        }, 300);
      } else {
        setResults({ products: [], doctors: [], topics: [] });
        setIsLoading(false);
      }
    };
  }, [allProducts]);
  
  useEffect(() => {
    debouncedSearch(queryText);
  }, [queryText, debouncedSearch]);

  const hasResults = results.products.length > 0 || results.doctors.length > 0 || results.topics.length > 0;
  const isInitialState = queryText.length <= 1 && !hasResults;
  const topProducts = useMemo(() => allProducts?.slice(0, 5) || [], [allProducts]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products, doctors..."
            className="w-full justify-start pl-9"
            onFocus={() => setOpen(true)}
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        onOpenAutoFocus={(e) => e.preventDefault()} // Prevent stealing focus from input
      >
        <div className="max-h-[60vh] overflow-y-auto p-4">
           {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isInitialState ? (
            <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm"><ShoppingBag className="w-4 h-4"/> Top Products</h3>
                  <ul className="space-y-2">
                    {topProducts.map(product => (
                      <li key={`prod-${(product as any).__docId}`}>
                        <Link href={`/products/${(product as any).__docId}`} onClick={() => setOpen(false)} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted">
                           <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0">
                                {product.imageUrls && product.imageUrls[0] &&
                                    <Image src={product.imageUrls[0]} alt={product.name} width={48} height={48} className="object-contain"/>
                                }
                           </div>
                           <span className="font-medium text-sm">{product.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
            </div>
           ) : queryText.length > 1 && !hasResults ? (
            <p className="text-center text-muted-foreground py-10">No results found for &quot;{queryText}&quot;</p>
          ) : (
             <div className="space-y-6">
              {results.products.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm"><ShoppingBag className="w-4 h-4"/> Products</h3>
                  <ul className="space-y-2">
                    {results.products.slice(0, 5).map(product => (
                      <li key={`prod-${(product as any).__docId}`}>
                        <Link href={`/products/${(product as any).__docId}`} onClick={() => setOpen(false)} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted">
                           <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0">
                                {product.imageUrls && product.imageUrls[0] &&
                                    <Image src={product.imageUrls[0]} alt={product.name} width={48} height={48} className="object-contain"/>
                                }
                           </div>
                           <span className="font-medium text-sm">{product.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {results.doctors.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm"><User className="w-4 h-4"/> Doctors</h3>
                  <ul className="space-y-2">
                    {results.doctors.slice(0, 3).map(doctor => (
                      <li key={`doc-${doctor.name}`}>
                        <Link href={`/doctors/${doctor.slug}`} onClick={() => setOpen(false)} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                            {PlaceholderImages.placeholderImages.find(img => img.id === doctor.imageId) && 
                                <Image src={PlaceholderImages.placeholderImages.find(img => img.id === doctor.imageId)!.imageUrl} alt={doctor.name} width={48} height={48} className="object-cover"/>
                            }
                          </div>
                          <span className="font-medium text-sm">{doctor.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {results.topics.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm"><Heart className="w-4 h-4"/> Health Topics</h3>
                   <ul className="space-y-2">
                    {results.topics.slice(0, 3).map(topic => (
                      <li key={`topic-${topic.slug}`}>
                        <Link href={`/diseases/${topic.slug}`} onClick={() => setOpen(false)} className="block p-2 rounded-md hover:bg-muted font-medium text-sm">
                          {topic.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
           )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
