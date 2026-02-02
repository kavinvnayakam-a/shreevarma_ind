
'use client';

import { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '@/components/products/product-card';
import { useFirebase, useCollection } from '@/firebase';
import { collection, query, orderBy, DocumentData } from 'firebase/firestore';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '@/lib/placeholder-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useSearchParams } from 'next/navigation';

function FilterContent({
    searchQuery, setSearchQuery, category, setCategory, categories, brand, setBrand, brands, disease, setDisease, diseases, sortOrder, setSortOrder
}: {
    searchQuery: string; setSearchQuery: (q: string) => void;
    category: string; setCategory: (c: string) => void; categories: string[];
    brand: string; setBrand: (b: string) => void; brands: string[];
    disease: string; setDisease: (d: string) => void; diseases: string[];
    sortOrder: string; setSortOrder: (s: string) => void;
}) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="search-filter">Search</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        id="search-filter"
                        placeholder="Search products..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'All Categories' : c}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Brand</Label>
                <Select value={brand} onValueChange={setBrand}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by brand" />
                    </SelectTrigger>
                    <SelectContent>
                        {brands.map(b => <SelectItem key={b} value={b}>{b === 'all' ? 'All Brands' : b}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Disease</Label>
                <Select value={disease} onValueChange={setDisease}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by disease" />
                    </SelectTrigger>
                    <SelectContent>
                        {diseases.map(d => <SelectItem key={d} value={d}>{d === 'all' ? 'All Diseases' : d}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Sort By</Label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                        <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                        <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                        <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}


export default function ProductsPageContent() {
    const heroImage = {
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/product%20pages%2Fproduct%20page.webp?alt=media&token=edd0547c-221b-4d9d-9d47-b241d6a75bc4",
        description: "Ayurvedic products displayed on a shelf.",
        imageHint: "ayurvedic products family"
    };

    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') || 'all';

    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('name-asc');
    const [brand, setBrand] = useState('all');
    const [category, setCategory] = useState('all'); // Set to 'all' by default
    const [disease, setDisease] = useState('all');
    
    const { firestore } = useFirebase();
    
    const productsQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, "products"), orderBy("name"));
    }, [firestore]);

    const { data: allProducts, isLoading } = useCollection<Product>(productsQuery);

    const brands = useMemo(() => {
        if (!allProducts) return ['all'];
        return ['all', ...Array.from(new Set(allProducts.map(p => p.brand).filter(Boolean)))];
    }, [allProducts]);
    
    const categories = useMemo(() => {
        if (!allProducts) return ['all'];
        return ['all', ...Array.from(new Set(allProducts.map(p => p.category).filter(Boolean)))];
    }, [allProducts]);

    const diseases = useMemo(() => {
        if (!allProducts) return ['all'];
        const allTags = allProducts.flatMap(p => p.tags || []);
        return ['all', ...Array.from(new Set(allTags))];
    }, [allProducts]);

    const filteredAndSortedProducts = useMemo(() => {
        if (!allProducts) return [];

        let filtered = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (brand !== 'all') {
            filtered = filtered.filter(p => p.brand === brand);
        }

        if (category !== 'all') {
            filtered = filtered.filter(p => p.category === category);
        }

        if (disease !== 'all') {
            filtered = filtered.filter(p => p.tags?.includes(disease));
        }

        const sortable = [...filtered];

        switch (sortOrder) {
            case 'price-asc':
                sortable.sort((a, b) => a.sellingPrice - b.sellingPrice);
                break;
            case 'price-desc':
                sortable.sort((a, b) => b.sellingPrice - a.sellingPrice);
                break;
            case 'name-asc':
                sortable.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sortable.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }

        return sortable;
    }, [searchQuery, sortOrder, brand, category, disease, allProducts]);
    
    const filterProps = {
        searchQuery, setSearchQuery, category, setCategory, categories, brand, setBrand, brands, disease, setDisease, diseases, sortOrder, setSortOrder
    };

  return (
    <div className="bg-[#F9F5F1]">
        {/* Hero Section */}
        <section className="relative h-auto bg-white flex items-center justify-center text-center">
            <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={1920}
                height={720}
                className="w-full h-auto object-contain"
                data-ai-hint={heroImage.imageHint}
                priority
            />
        </section>

        {/* Main Content Section */}
        <section className="py-16">
            <div className="container mx-auto px-6">
                 <div className="grid lg:grid-cols-4 gap-8 items-start">
                    {/* Filters Sidebar for Desktop */}
                    <aside className="hidden lg:block lg:col-span-1 lg:sticky top-24">
                        <Card>
                            <CardHeader>
                                <CardTitle>Filters</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FilterContent {...filterProps} />
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Products Grid */}
                    <main className="lg:col-span-3">
                        <div className="flex justify-between items-center mb-4 lg:hidden">
                             <h2 className="text-xl font-bold">Products</h2>
                             <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline"><SlidersHorizontal className="mr-2 h-4 w-4"/> Filters</Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-full max-w-sm p-4">
                                     <SheetHeader className="text-left mb-4">
                                        <SheetTitle>Filters</SheetTitle>
                                    </SheetHeader>
                                    <FilterContent {...filterProps} />
                                </SheetContent>
                            </Sheet>
                        </div>
                         {isLoading ? (
                            <div className="flex justify-center items-center py-16">
                                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                                    {filteredAndSortedProducts.map((product) => (
                                        <ProductCard key={product.__docId} product={{...product, id: product.__docId}} />
                                    ))}
                                </div>

                                {filteredAndSortedProducts.length === 0 && (
                                    <div className="text-center py-16 text-muted-foreground bg-white rounded-lg shadow-sm">
                                        <p>No products found for the selected filters.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </section>
    </div>
  );
}
