'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search, User, ShoppingBag, Heart, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCollection, useFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { specialists } from '@/components/home/specialists-data';
import PlaceholderImages from '@/lib/placeholder-images.json';
import { Product } from '@/lib/placeholder-data';
import { cn } from '@/lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const healthTopics = PlaceholderImages.placeholderImages
  .filter(img => img.id.startsWith('health-'))
  .map(img => ({
    name: img.description?.replace('Image for ', '') || '',
    slug: img.description?.replace('Image for ', '').toLowerCase().replace(/\s/g, '-') || '',
  }));

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [queryText, setQueryText] = useState('');
  const [results, setResults] = useState<{ products: Product[]; doctors: any[]; topics: any[] }>({ products: [], doctors: [], topics: [] });
  const [isLoading, setIsLoading] = useState(false);
  
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[60] bg-white md:hidden animate-in slide-in-from-top duration-300">
      <div className="max-w-md mx-auto bg-white shadow-2xl overflow-hidden rounded-b-[2rem] border-x border-b border-slate-50">
        
        {/* FIX: Improved Search Input Bar with better spacing */}
        <div className="relative flex items-center px-6 h-16 bg-white border-b border-slate-50">
          <Search className="absolute left-6 h-4 w-4 text-primary/40 pointer-events-none" />
          
          <Input
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Search doctors, products..."
            /* pl-10 ensures the text starts after the icon */
            className="w-full border-none shadow-none focus-visible:ring-0 text-sm font-medium h-full pl-10 pr-10"
            autoFocus
          />

          <button 
            onClick={() => { setQueryText(''); onClose(); }} 
            className="absolute right-4 p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-primary" />
          </button>
        </div>

        {/* Results Dropdown Area */}
        <div className="max-h-[70vh] overflow-y-auto bg-white pb-6 scrollbar-hide">
          {isLoading ? (
            <div className="flex justify-center p-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : queryText.length > 1 ? (
            <div className="p-4 space-y-6">
              {!hasResults && (
                <div className="py-10 text-center">
                  <p className="text-sm text-muted-foreground italic">No matches found</p>
                </div>
              )}
              
              {results.products.length > 0 && (
                <SearchSection title="Products" icon={<ShoppingBag className="w-4 h-4" />}>
                  {results.products.map(p => (
                    <ResultItem 
                      key={(p as any).__docId || p.id} 
                      href={`/products/${(p as any).__docId || p.id}`} 
                      title={p.name} 
                      image={p.imageUrls?.[0]} 
                      onClose={onClose} 
                    />
                  ))}
                </SearchSection>
              )}

              {results.doctors.length > 0 && (
                <SearchSection title="Doctors" icon={<User className="w-4 h-4" />}>
                  {results.doctors.map(d => (
                    <ResultItem 
                      key={d.name} 
                      href={`/doctors/${d.slug}`} 
                      title={d.name} 
                      image={PlaceholderImages.placeholderImages.find(img => img.id === d.imageId)?.imageUrl} 
                      isCircle 
                      onClose={onClose} 
                    />
                  ))}
                </SearchSection>
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
               <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">
                 Shreevarma Search
               </p>
            </div>
          )}
        </div>
      </div>

      <div 
        className="fixed inset-0 -z-10 bg-black/20 backdrop-blur-sm" 
        onClick={onClose} 
      />
    </div>
  );
}

function SearchSection({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="space-y-3 px-2">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary/40 flex items-center gap-2">
        {icon} {title}
      </h3>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}

function ResultItem({ href, title, image, isCircle, onClose }: { href: string, title: string, image?: string, isCircle?: boolean, onClose: () => void }) {
  return (
    <li>
      <Link 
        href={href} 
        onClick={onClose} 
        className="flex items-center gap-4 p-2 rounded-2xl hover:bg-slate-50 transition-colors"
      >
        <div className={cn(
          "relative w-12 h-12 overflow-hidden bg-slate-50 shrink-0", 
          isCircle ? "rounded-full" : "rounded-xl"
        )}>
          {image ? <Image src={image} alt={title} fill className="object-cover" sizes="48px" /> : <div className="w-full h-full bg-slate-100" />}
        </div>
        <span className="text-sm font-bold text-primary">{title}</span>
      </Link>
    </li>
  );
}