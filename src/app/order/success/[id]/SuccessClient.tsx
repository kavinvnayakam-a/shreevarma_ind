"use client";

import { useEffect, useState, useRef } from "react";
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
  const hasCleared = useRef(false); // Prevents multiple cart clears
  
  const [status, setStatus] = useState<"verifying" | "success" | "timeout">("verifying");

  useEffect(() => {
    if (!firestore || !user || !orderId || orderId === "undefined") return;

    // Listener for the path populated by your new Webhook
    const orderRef = doc(firestore, "users", user.uid, "orders", orderId);
    
    const unsubscribe = onSnapshot(orderRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        
        if (data.paymentStatus === "PAID") {
          if (!hasCleared.current) {
            clearCart();
            hasCleared.current = true;
          }
          setStatus("success");
        }
      }
    }, (error) => {
      console.error("Production Listener Error:", error);
    });

    const timer = setTimeout(() => {
      setStatus(prev => (prev === "verifying" ? "timeout" : prev));
    }, 35000); // 35s for production safety

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [firestore, user, orderId, clearCart]);

  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <Loader2 className="h-16 w-16 animate-spin text-[#6f3a2f] mb-6" />
        <h1 className="text-3xl font-black font-headline mb-2 text-primary uppercase">Securing Payment</h1>
        <p className="text-muted-foreground max-w-sm italic">
          Waiting for bank confirmation. Please do not close this window.
        </p>
      </div>
    );
  }

  if (status === "timeout") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-6" />
        <h1 className="text-3xl font-black font-headline mb-2 uppercase">Nearly There!</h1>
        <p className="text-muted-foreground mb-8 max-w-md italic">
          Your payment is successful, but our systems are still syncing. Your order will appear in your profile shortly.
        </p>
        <Button asChild className="rounded-full px-8 bg-[#6f3a2f]">
          <Link href="/profile/orders">Check Order History</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="bg-green-50 p-6 rounded-full mb-6 border-2 border-green-500">
        <CheckCircle className="h-20 w-20 text-green-600" />
      </div>
      <h1 className="text-4xl font-black font-headline mb-2 text-[#6f3a2f] uppercase tracking-tighter">Order Success!</h1>
      <p className="text-muted-foreground mb-8 max-w-md italic text-lg">
        Thank you! Order <span className="font-mono font-bold text-primary">#{orderId.slice(0, 8)}</span> has been confirmed. A confirmation email is on its way.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="rounded-full px-10 shadow-xl bg-[#6f3a2f] hover:bg-[#5a2e25]">
          <Link href={`/profile/orders/${orderId}`}>
            Track Order <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full px-10 border-[#6f3a2f] text-[#6f3a2f]">
          <Link href="/">
            <ShoppingBag className="mr-2 h-4 w-4" /> Home
          </Link>
        </Button>
      </div>
    </div>
  );
}