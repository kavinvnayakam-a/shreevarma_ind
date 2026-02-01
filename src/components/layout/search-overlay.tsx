
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, User, ShoppingBag, Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useCollection, useFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { specialists } from '@/components/home/specialists-data';
import PlaceholderImages from '@/lib/placeholder-images.json';
import Image from 'next/image';
import { Product } from '@/lib/placeholder-data';

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
  
const placeholders = [
  'Search for doctors...',
  'Search for clinics...',
  'Search for ayurvedic products...',
  'Search for health topics...',
];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [queryText, setQueryText] = useState('');
  const [results, setResults] = useState<{ products: Product[]; doctors: any[]; topics: any[] }>({ products: [], doctors: [], topics: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState(placeholders[0]);
  
  const { firestore } = useFirebase();
  
  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), orderBy('name'));
  }, [firestore]);
  
  const { data: allProducts } = useCollection<Product>(productsQuery);

  useEffect(() => {
    if (!isOpen) {
        setQueryText('');
        return;
    };

    let typingTimeout: NodeJS.Timeout;
    let currentPlaceholderIndex = 0;
    let currentText = '';
    let isDeleting = false;

    const type = () => {
      const fullText = placeholders[currentPlaceholderIndex];
      let typeSpeed = 100;

      if (isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1);
        typeSpeed = 50;
      } else {
        currentText = fullText.substring(0, currentText.length + 1);
        typeSpeed = 100;
      }

      setPlaceholder(currentText);

      if (!isDeleting && currentText === fullText) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && currentText === '') {
        isDeleting = false;
        currentPlaceholderIndex = (currentPlaceholderIndex + 1) % placeholders.length;
        typeSpeed = 500;
      }
      
      typingTimeout = setTimeout(type, typeSpeed);
    };

    typingTimeout = setTimeout(type, 100);

    return () => clearTimeout(typingTimeout);
  }, [isOpen]);

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

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryText(e.target.value);
  }

  const hasResults = results.products.length > 0 || results.doctors.length > 0 || results.topics.length > 0;
  const isInitialState = queryText.length <= 1 && !hasResults;

  const topProducts = useMemo(() => allProducts?.slice(0, 5) || [], [allProducts]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 m-0 bg-background max-w-full w-full h-full max-h-full rounded-none border-none sm:rounded-none flex flex-col">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <div className="flex items-center p-4 border-b">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            value={queryText}
            onChange={handleQueryChange}
            placeholder={placeholder}
            className="border-none shadow-none focus-visible:ring-0 text-base"
            autoFocus
          />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isInitialState ? (
            <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2"><ShoppingBag className="w-4 h-4"/> Top Selling Products</h3>
                  <ul className="space-y-2">
                    {topProducts.map(product => (
                      <li key={`prod-${(product as any).__docId}`}>
                        <Link href={`/products/${(product as any).__docId}`} onClick={onClose} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted">
                           <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                                {product.imageUrls && product.imageUrls[0] &&
                                    <Image src={product.imageUrls[0]} alt={product.name} width={48} height={48} className="object-contain"/>
                                }
                           </div>
                           <span className="font-medium">{product.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2"><User className="w-4 h-4"/> Top Doctors</h3>
                  <ul className="space-y-2">
                    {specialists.slice(0,3).map(doctor => (
                      <li key={`doc-${doctor.name}`}>
                        <Link href={`/doctors/${doctor.slug}`} onClick={onClose} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                            {PlaceholderImages.placeholderImages.find(img => img.id === doctor.imageId) && 
                                <Image src={PlaceholderImages.placeholderImages.find(img => img.id === doctor.imageId)!.imageUrl} alt={doctor.name} width={48} height={48} className="object-cover"/>
                            }
                          </div>
                          <span className="font-medium">{doctor.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                 <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2"><Heart className="w-4 h-4"/> Popular Topics</h3>
                   <ul className="space-y-2">
                    {healthTopics.slice(0,3).map(topic => (
                      <li key={`topic-${topic.slug}`}>
                        <Link href={`/diseases/${topic.slug}`} onClick={onClose} className="block p-2 rounded-md hover:bg-muted font-medium">
                          {topic.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
            </div>
          ) : queryText.length > 1 && !hasResults ? (
            <p className="text-center text-muted-foreground">No results found for &quot;{queryText}&quot;</p>
          ) : (
            <div className="space-y-6">
              {results.products.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2"><ShoppingBag className="w-4 h-4"/> Products</h3>
                  <ul className="space-y-2">
                    {results.products.map(product => (
                      <li key={`prod-${(product as any).__docId}`}>
                        <Link href={`/products/${(product as any).__docId}`} onClick={onClose} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted">
                           <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                                {product.imageUrls && product.imageUrls[0] &&
                                    <Image src={product.imageUrls[0]} alt={product.name} width={48} height={48} className="object-contain"/>
                                }
                           </div>
                           <span className="font-medium">{product.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {results.doctors.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2"><User className="w-4 h-4"/> Doctors</h3>
                  <ul className="space-y-2">
                    {results.doctors.map(doctor => (
                      <li key={`doc-${doctor.name}`}>
                        <Link href={`/doctors/${doctor.slug}`} onClick={onClose} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                            {PlaceholderImages.placeholderImages.find(img => img.id === doctor.imageId) && 
                                <Image src={PlaceholderImages.placeholderImages.find(img => img.id === doctor.imageId)!.imageUrl} alt={doctor.name} width={48} height={48} className="object-cover"/>
                            }
                          </div>
                          <span className="font-medium">{doctor.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {results.topics.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2"><Heart className="w-4 h-4"/> Health Topics</h3>
                   <ul className="space-y-2">
                    {results.topics.map(topic => (
                      <li key={`topic-${topic.slug}`}>
                        <Link href={`/diseases/${topic.slug}`} onClick={onClose} className="block p-2 rounded-md hover:bg-muted font-medium">
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
      </DialogContent>
    </Dialog>
  );
}
