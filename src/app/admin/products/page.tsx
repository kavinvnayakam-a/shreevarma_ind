
'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, orderBy, DocumentData, doc, deleteDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, PlusCircle, Pencil, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface ProductData extends DocumentData {
    name: string;
    brand: string;
    sellingPrice: number;
    category: string;
    imageUrls: string[];
    inventoryQuantity?: number;
}

export default function AdminProductsPage() {
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const productsQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, "products"), orderBy("name"));
    }, [firestore]);

    const { data: products, isLoading } = useCollection<ProductData>(productsQuery);

    const filteredProducts = useMemo(() => {
        if (!products) return [];
        return products.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [products, searchQuery]);

    const handleDeleteProduct = async () => {
        if (!firestore || !selectedProductId) return;

        setIsDeleting(true);
        const docRef = doc(firestore, 'products', selectedProductId);
        
        try {
            await deleteDoc(docRef);
        } catch (error: any) {
            const contextualError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'delete',
            });
            errorEmitter.emit('permission-error', contextualError);
        } finally {
            setIsDeleting(false);
            setSelectedProductId(null);
        }
    };


    return (
        <div className="container mx-auto">
            <AlertDialog>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start flex-wrap gap-4">
                            <div>
                                <CardTitle>Products</CardTitle>
                                <CardDescription>Manage your product inventory.</CardDescription>
                            </div>
                             <div className="flex items-center gap-2 w-full sm:w-auto">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        placeholder="Search products..." 
                                        className="pl-10"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button asChild>
                                    <Link href="/admin/products/new"><PlusCircle className="mr-2 h-4 w-4" />Create</Link>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                             <>
                                {filteredProducts && filteredProducts.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                            <TableHead className="w-[80px]">Image</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Brand</TableHead>
                                            <TableHead>Stock</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredProducts.map((product) => (
                                                <TableRow key={product.__docId}>
                                                    <TableCell>
                                                        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                                                            {product.imageUrls && product.imageUrls[0] ? (
                                                                <Image src={product.imageUrls[0]} alt={product.name} fill className="object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">No Img</div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">{product.name}</TableCell>
                                                    <TableCell>{product.category}</TableCell>
                                                    <TableCell>{product.brand}</TableCell>
                                                    <TableCell>{product.inventoryQuantity ?? 'N/A'}</TableCell>
                                                    <TableCell className="text-right">₹{Math.round(product.sellingPrice)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button asChild variant="ghost" size="icon">
                                                            <Link href={`/admin/products/${product.__docId}/edit`}>
                                                                <Pencil className="h-4 w-4"/>
                                                            </Link>
                                                        </Button>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" onClick={() => setSelectedProductId(product.__docId)}>
                                                                <Trash2 className="h-4 w-4 text-destructive"/>
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-10 text-muted-foreground">
                                        <p>No products found{searchQuery ? ` for "${searchQuery}"` : ". Get started by creating one."}</p>
                                    </div>
                                )}
                             </>
                        )}
                    </CardContent>
                </Card>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the product
                        and remove its data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedProductId(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProduct} disabled={isDeleting}>
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
