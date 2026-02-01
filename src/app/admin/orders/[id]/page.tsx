
'use client';

import { notFound, useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { useDoc, useFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, DocumentData, updateDoc } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { Loader2, ArrowLeft, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  sellingPrice: number;
  imageUrls: string[];
}

interface Order extends DocumentData {
    __docId: string; // Firestore Document ID
    orderId: string; 
    createdAt: { seconds: number, nanoseconds: number };
    orderStatus: string;
    totalAmount: number;
    items: OrderItem[];
    customer: {
        name: string;
        email: string;
    };
    shippingAddress: {
        name: string;
        address: string;
        city: string;
        state: string;
        zip: string;
    };
}

const orderStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const firestoreId = params.id as string;
  
  const { firestore } = useFirebase();
  const [isUpdating, setIsUpdating] = useState(false);

  const orderRef = useMemo(() => {
    if (!firestore || !userId || !firestoreId) return null;
    return doc(firestore, `users/${userId}/orders`, firestoreId);
  }, [firestore, userId, firestoreId]);

  const { data: order, isLoading } = useDoc<Order>(orderRef);

  const getBadgeVariant = (status: string) => {
    switch(status) {
        case 'Delivered': return 'default';
        case 'Shipped': return 'secondary';
        case 'Cancelled': return 'destructive';
        default: return 'outline';
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
        if (!orderRef) return;
        setIsUpdating(true);
        try {
            await updateDoc(orderRef, { orderStatus: newStatus });
        } catch (error) {
            const contextualError = new FirestorePermissionError({
                path: orderRef.path,
                operation: 'update',
                requestResourceData: { orderStatus: newStatus },
            });
            errorEmitter.emit('permission-error', contextualError);
        } finally {
            setIsUpdating(false);
        }
  };

  if (isLoading) {
    return (
        <div className="container mx-auto flex justify-center items-center min-h-[calc(100vh-14rem)]">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  if (!order || !userId) {
    notFound();
    return null;
  }
  
  const orderDate = order.createdAt ? new Date(order.createdAt.seconds * 1000) : new Date();

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
            <Button asChild variant="ghost" className="mb-4 -ml-4">
                <Link href="/admin/orders"><ArrowLeft className="mr-2 h-4 w-4" />Back to All Orders</Link>
            </Button>
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Order #{order.orderId || order.__docId.substring(0,8).toUpperCase()}</h1>
                    <div className="text-sm text-muted-foreground mt-1">
                        Placed on {orderDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                     <Badge variant={getBadgeVariant(order.orderStatus)} className="text-sm px-3 py-1">
                        {order.orderStatus}
                     </Badge>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" disabled={isUpdating}>
                                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Change Status'}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {orderStatuses.map(status => (
                                <DropdownMenuItem 
                                    key={status} 
                                    onClick={() => handleStatusUpdate(status)}
                                    disabled={order.orderStatus === status}
                                >
                                    {status}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                     </DropdownMenu>
                </div>
            </div>
        </div>
        <main className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Item</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-center">Quantity</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                             <TableBody>
                                {order.items.map((item, index) => {
                                    const productImage = item.imageUrls && item.imageUrls.length > 0
                                        ? item.imageUrls[0]
                                        : 'https://placehold.co/100x100/F5F5DC/333333?text=No+Image';

                                    return (
                                        <TableRow key={item.productId + index}>
                                            <TableCell>
                                                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted border">
                                                    <Image src={productImage} alt={item.name} fill className="object-cover" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Link href={`/products/${item.productId}`} className="font-semibold hover:underline">{item.name}</Link>
                                            </TableCell>
                                            <TableCell className="text-center">{item.quantity}</TableCell>
                                            <TableCell className="text-right font-medium">₹{Math.round(item.sellingPrice * item.quantity)}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        <Separator className="my-6" />
                        <div className="w-full max-w-sm ml-auto space-y-2 text-sm">
                             <div className="flex justify-between"><span>Subtotal:</span> <span className="font-medium">₹{Math.round(order.totalAmount)}</span></div>
                             <div className="flex justify-between"><span>Shipping:</span> <span className="font-medium">Free</span></div>
                             <div className="flex justify-between text-base font-bold pt-2 border-t mt-2"><span>Total:</span> <span className="font-medium">₹{Math.round(order.totalAmount)}</span></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-8 md:sticky top-24">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User className="w-5 h-5"/>Customer Details</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-4">
                        <div>
                            <p className="font-medium text-foreground">{order.customer.name}</p>
                            <p className="text-muted-foreground">{order.customer.email}</p>
                        </div>
                        <Separator />
                        <div>
                            <p className="font-medium text-foreground flex items-center gap-2"><MapPin className="w-4 h-4"/>Shipping Address</p>
                            <address className="text-muted-foreground not-italic mt-1">
                                {order.shippingAddress.name}<br/>
                                {order.shippingAddress.address}<br/>
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                            </address>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}

    