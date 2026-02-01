
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle, ArrowRight, ShoppingBag, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initializeFirebase } from "@/firebase/index";
import { useUser } from "@/firebase/auth/use-user";
import { doc, onSnapshot } from "firebase/firestore";
import { useCart } from "@/hooks/use-cart";

interface SuccessClientProps {
  orderId: string;
}

export default function SuccessClient({ orderId }: SuccessClientProps) {
  const { firestore } = initializeFirebase();
  const { user } = useUser();
  const { clearCart } = useCart();
  
  const [status, setStatus] = useState<"verifying" | "success" | "timeout">("verifying");

  useEffect(() => {
    // Safety check for initialization
    if (!firestore || !user || !orderId || orderId === "undefined") return;

    // Listen to the permanent user order path (populated by the Webhook)
    const orderRef = doc(firestore, "users", user.uid, "orders", orderId);
    
    const unsubscribe = onSnapshot(orderRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        
        // 🔥 Trigger success only when the webhook has updated the status to PAID
        if (data.paymentStatus === "PAID") {
          setStatus((prevStatus) => {
            if (prevStatus !== 'success') {
                clearCart();
            }
            return 'success';
          });
        }
      }
    }, (error) => {
      console.error("Firestore Listener Error:", error);
    });

    // 🕒 30-second safety timeout. Webhooks can occasionally be slow.
    const timer = setTimeout(() => {
      setStatus(prev => (prev === "verifying" ? "timeout" : prev));
    }, 30000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [firestore, user, orderId, clearCart]);

  // --- 1. VERIFYING STATE ---
  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
        <h1 className="text-3xl font-bold font-headline mb-2 text-primary">Verifying Payment</h1>
        <p className="text-muted-foreground max-w-sm">
          We're confirming your transaction with the bank. This usually takes a few seconds. Please do not refresh.
        </p>
      </div>
    );
  }

  // --- 2. TIMEOUT STATE (Webhook taking too long) ---
  if (status === "timeout") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-6" />
        <h1 className="text-3xl font-bold font-headline mb-2">Processing Order</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Confirmation is taking slightly longer than expected. Your order will appear in your profile history once confirmed.
        </p>
        <Button asChild variant="outline" className="rounded-full px-8">
          <Link href="/profile/orders">Go to My Orders</Link>
        </Button>
      </div>
    );
  }

  // --- 3. SUCCESS STATE ---
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="bg-green-100 p-4 rounded-full mb-6">
        <CheckCircle className="h-20 w-20 text-green-600" />
      </div>
      <h1 className="text-4xl font-bold font-headline mb-2 text-green-800">Payment Confirmed!</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Success! Your order <span className="font-mono font-bold text-primary">#{orderId.slice(0, 8)}</span> has been received and is being processed.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="rounded-full px-8 shadow-md">
          <Link href={`/profile/orders/${orderId}`}>
            View Order Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="lg" className="rounded-full px-8">
          <Link href="/products">
            <ShoppingBag className="mr-2 h-4 w-4" /> Keep Shopping
          </Link>
        </Button>
      </div>
    </div>
  );
}
