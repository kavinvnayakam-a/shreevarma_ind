

'use client';

import { Suspense } from 'react';
import ProductsPageContent from '@/components/products/ProductsPageContent';
import { Loader2 } from 'lucide-react';


export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><Loader2 className="h-16 w-16 animate-spin" /></div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
