
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { useState, useEffect } from 'react';

// Mock data to simulate a real order
const mockOrder = {
    orderId: 'SHREE-12345',
    customer: { email: 'customer@example.com' },
    orderDate: new Date(),
    status: 'Processing',
    totalAmount: 42.97,
    items: [
        {
            productId: 'prod-1',
            name: 'Triphala Churna',
            quantity: 1,
            sellingPrice: 12.99,
            imageUrls: ['https://images.unsplash.com/photo-1662058595162-10e024b1a907?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxheXVydmVkYSUyMGJvdHRsZXxlbnwwfHx8fDE3NjIzMTYwMzF8MA&ixlib=rb-4.1.0&q=80&w=1080'],
        },
        {
            productId: 'prod-2',
            name: 'Chyawanprash',
            quantity: 1,
            sellingPrice: 19.99,
            imageUrls: ['https://images.unsplash.com/photo-1609150990057-f13c984a12f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxoZWFsdGglMjBzdXBwbGVtZW50fGVufDB8fHx8MTc2MjIzMDEwOHww&ixlib=rb-4.1.0&q=80&w=1080'],
        },
    ],
    shippingAddress: {
        name: 'John Doe',
        address: '123 Wellness Lane',
        city: 'Ayurveda City',
        state: 'Holistic State',
        zip: '12345',
    }
};

export default function OrderConfirmationPreviewPage() {
  const order = mockOrder;
  const [formattedOrderDate, setFormattedOrderDate] = useState('');
  
  useEffect(() => {
    // This code will only run on the client, after hydration
    const orderDate = new Date();
    setFormattedOrderDate(orderDate.toLocaleDateString());
  }, []); // Empty dependency array ensures this runs once on mount


  const getBadgeVariant = (status: string) => {
    switch(status) {
        case 'Delivered': return 'default';
        case 'Shipped': return 'secondary';
        case 'Cancelled': return 'destructive';
        default: return 'outline';
    }
  }

  return (
    <div className="bg-[#F9F5F1] py-12">
        <div className="container mx-auto px-6">
            <Card className="max-w-4xl mx-auto border-primary/20 shadow-lg">
                <CardHeader className="text-center bg-primary/5 rounded-t-lg p-8">
                    <Logo className="h-12 w-auto mx-auto mb-4" />
                    <CheckCircle className="w-16 h-16 text-accent mx-auto" />
                    <h1 className="text-3xl font-bold font-headline text-primary mt-4">Thank You for Your Order!</h1>
                    <CardDescription>
                        Your order has been placed successfully. A confirmation email has been sent to {order.customer.email}.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="mb-6 text-center">
                        <h2 className="text-xl font-bold">Order #{order.orderId}</h2>
                        <div className="text-muted-foreground mt-1">
                            {formattedOrderDate ? <>Placed on {formattedOrderDate} <Badge variant={getBadgeVariant(order.status)} className="ml-2">{order.status}</Badge></> : 'Loading date...'}
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-2 font-headline">Items Ordered</h3>
                                <ul className="space-y-4">
                                    {order.items.map((item) => {
                                        const productImage = item.imageUrls && item.imageUrls.length > 0
                                            ? item.imageUrls[0]
                                            : 'https://placehold.co/100x100/F5F5DC/333333?text=No+Image';

                                        return (
                                        <li key={item.productId} className="flex items-center gap-4">
                                            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                                                <Image src={productImage} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium">₹{Math.round(item.sellingPrice * item.quantity)}</p>
                                        </li>
                                    )})}
                                </ul>
                            </div>
                             <div>
                                <h3 className="font-semibold text-lg mb-2 font-headline">Payment Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span>Subtotal:</span> <span className="font-medium">₹{Math.round(order.totalAmount)}</span></div>
                                    <div className="flex justify-between"><span>Shipping:</span> <span className="font-medium">Free</span></div>
                                    <Separator className="my-2"/>
                                    <div className="flex justify-between text-base font-bold"><span>Total:</span> <span>₹{Math.round(order.totalAmount)}</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                             <div>
                                <h3 className="font-semibold text-lg mb-2 font-headline">Shipping Address</h3>
                                <div className="text-sm text-muted-foreground">
                                    <p className="font-medium text-foreground">{order.shippingAddress.name}</p>
                                    <p>{order.shippingAddress.address}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2 font-headline">Shipping Updates</h3>
                                <div className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                                    Note: Once the product is shipped, you will get notified through WhatsApp and your registered email.
                                </div>
                            </div>
                        </div>
                    </div>
                    <Separator className="my-6"/>
                    <div className="flex justify-center gap-4">
                        <Button asChild><Link href="/products">Continue Shopping</Link></Button>
                        <Button asChild variant="outline"><Link href="/profile">View All Orders</Link></Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
