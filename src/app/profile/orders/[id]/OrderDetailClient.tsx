
"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Loader2, CheckCircle, ArrowLeft, Package, Truck, Home } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { initializeFirebase } from "@/firebase/index"; 
import { useUser } from "@/firebase/auth/use-user";
import { doc, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface OrderDetailClientProps {
  params: Promise<{ id: string }>;
}

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  sellingPrice: number;
  imageUrls?: string[];
}

interface Order {
  orderId: string;
  createdAt: { toDate: () => Date };
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone?: string;
  }
}

const getStatusStep = (status: Order['orderStatus']) => {
    if (status === 'Delivered') return 2;
    if (status === 'Shipped') return 1;
    if (status === 'Processing') return 0;
    return -1; // For cancelled or other states
};

export default function OrderDetailClient({ params }: OrderDetailClientProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const { firestore } = initializeFirebase();
  const { user, isLoading: isUserLoading } = useUser();

  const [order, setOrder] = useState<Order | null>(null);
  const [isDocLoading, setIsDocLoading] = useState(true);

  useEffect(() => {
    if (!firestore || !user || !orderId || orderId === "undefined") {
      if (!isUserLoading && !user) setIsDocLoading(false);
      return;
    }

    const permanentRef = doc(firestore, "users", user.uid, "orders", orderId);
    
    const unsubscribe = onSnapshot(permanentRef, (snapshot) => {
      if (snapshot.exists()) {
        setOrder(snapshot.data() as Order);
      } else {
        setOrder(null);
      }
      setIsDocLoading(false);
    }, (err) => {
      console.error("Firestore access error:", err);
      setIsDocLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, user, orderId, isUserLoading]);

  // Loading State
  if (isUserLoading || isDocLoading) {
    return (
      <div className="container mx-auto flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
        <p className="text-muted-foreground text-sm font-medium">Loading order details...</p>
      </div>
    );
  }

  // Not Found State
  if (!order) {
    return (
      <div className="container mx-auto text-center py-20 px-6">
        <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
           <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold font-headline">Order Not Found</h1>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          We couldn't find an order with ID <span className="font-mono font-bold text-primary">{orderId.slice(0,8)}</span>.
        </p>
        <Button asChild variant="outline" className="mt-8">
          <Link href="/profile/orders"><ArrowLeft className="mr-2 h-4 w-4"/> Back to My Orders</Link>
        </Button>
      </div>
    );
  }

  const currentStep = getStatusStep(order.orderStatus);

  return (
    <div className="bg-[#F9F5F1] min-h-screen py-8 sm:py-12">
        <div className="container mx-auto px-4">
             <div className="max-w-5xl mx-auto mb-6">
                <Button asChild variant="ghost" size="sm" className="mb-4">
                    <Link href="/profile"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Profile</Link>
                </Button>
            </div>
            
            <Card className="max-w-5xl mx-auto shadow-md border-none overflow-hidden">
                <CardHeader className="bg-white p-6 border-b">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                            <h1 className="text-2xl font-bold font-headline">Order #{order.orderId}</h1>
                            <p className="text-muted-foreground">Placed on {order.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <Badge variant="secondary" className="px-3 py-1 text-base">{order.orderStatus}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                     <div className="mb-8">
                        <h3 className="font-semibold mb-4">Order Status</h3>
                        <div className="flex justify-between items-center">
                            <div className={cn("flex flex-col items-center text-center", currentStep >= 0 ? "text-primary" : "text-muted-foreground")}>
                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border-2", currentStep >= 0 ? "bg-primary text-primary-foreground border-primary" : "bg-muted")}>
                                    <Package className="w-5 h-5"/>
                                </div>
                                <p className="text-xs mt-2 font-medium">Processing</p>
                            </div>
                            <div className={cn("flex-1 h-0.5", currentStep >= 1 ? "bg-primary" : "bg-muted-foreground/20")}></div>
                             <div className={cn("flex flex-col items-center text-center", currentStep >= 1 ? "text-primary" : "text-muted-foreground")}>
                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border-2", currentStep >= 1 ? "bg-primary text-primary-foreground border-primary" : "bg-muted")}>
                                    <Truck className="w-5 h-5"/>
                                </div>
                                <p className="text-xs mt-2 font-medium">Shipped</p>
                            </div>
                            <div className={cn("flex-1 h-0.5", currentStep >= 2 ? "bg-primary" : "bg-muted-foreground/20")}></div>
                            <div className={cn("flex flex-col items-center text-center", currentStep >= 2 ? "text-primary" : "text-muted-foreground")}>
                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border-2", currentStep >= 2 ? "bg-primary text-primary-foreground border-primary" : "bg-muted")}>
                                    <Home className="w-5 h-5"/>
                                </div>
                                <p className="text-xs mt-2 font-medium">Delivered</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                             <h3 className="font-semibold mb-4">Items Ordered</h3>
                             <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={item.productId + index} className="flex gap-4">
                                        <div className="relative w-20 h-20 rounded-lg bg-muted border overflow-hidden">
                                            <Image src={item.imageUrls?.[0] || 'https://placehold.co/100'} alt={item.name} fill className="object-contain" />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold">₹{Math.round(item.sellingPrice * item.quantity)}</p>
                                    </div>
                                ))}
                             </div>
                        </div>
                         <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-2">Shipping Address</h3>
                                <div className="text-sm text-muted-foreground">
                                    <p className="font-medium text-foreground">{order.shippingAddress.name}</p>
                                    <p>{order.shippingAddress.address}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                                    <p>{order.shippingAddress.phone}</p>
                                </div>
                            </div>
                             <div>
                                <h3 className="font-semibold mb-2">Payment Summary</h3>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between"><span>Subtotal</span><span>₹{Math.round(order.totalAmount)}</span></div>
                                    <div className="flex justify-between"><span>Shipping</span><span className="font-semibold text-green-600">Free</span></div>
                                    <Separator className="my-2"/>
                                    <div className="flex justify-between font-bold text-base"><span>Total</span><span>₹{Math.round(order.totalAmount)}</span></div>
                                    <div className="flex justify-between pt-1">
                                        <span className="text-muted-foreground">Paid with</span>
                                        <Badge variant="outline" className="capitalize">{order.paymentStatus}</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
