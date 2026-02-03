
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirebase, useDoc } from '@/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';

import {
  doc,
  setDoc,
  DocumentData,
} from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, ShoppingBag, PlusCircle, Home, Building, MapPin, Pencil, Trash2, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddressForm, addressSchema, type AddressFormValues } from '@/components/checkout/address-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface UserProfile extends DocumentData {
  shippingAddresses?: AddressFormValues[];
  phone?: string;
}

export default function CheckoutPageClient() {
  const router = useRouter();
  const { toast } = useToast();
  const { cartItems, cartTotal } = useCart();
  const { user, isUserLoading } = useUser();
  const { firestore, firebaseApp } = useFirebase();

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressFormValues | null>(null);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressFormValues | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<AddressFormValues | null>(null);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
  });

  const userRef = useMemo(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: profile, isLoading: profileLoading, refetch } = useDoc<UserProfile>(userRef);
  const savedAddresses = profile?.shippingAddresses || [];

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/checkout');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (!profileLoading) {
      if (savedAddresses.length > 0 && !selectedAddress) {
        setSelectedAddress(savedAddresses[0]);
      } else if (savedAddresses.length === 0) {
        setIsAddressFormOpen(true);
      }
    }
  }, [profileLoading, savedAddresses, selectedAddress]);

  const handlePlaceOrder = async () => {
    if (!user || !user.email || !selectedAddress || !firestore || !firebaseApp) {
      toast({ variant: 'destructive', title: 'Missing Info', description: 'Please select a shipping address or wait for services to load.' });
      return;
    }

    if (typeof window.Cashfree === 'undefined') {
      toast({ variant: 'destructive', title: 'Payment Error', description: 'Payment SDK not loaded. Please refresh.' });
      return;
    }

    setIsProcessing(true);

    try {
      const functions = getFunctions(firebaseApp);
      const createCashfreeOrder = httpsCallable(functions, 'createCashfreeOrder');

      const result: any = await createCashfreeOrder({
          cartItems,
          cartTotal,
          customerName: selectedAddress.name,
          customerEmail: user.email,
          customerPhone: selectedAddress.phone,
          shippingAddress: selectedAddress,
      });

      const response = result.data;

      if (!response.success || !response.payment_session_id) {
        throw new Error(response.error || 'Failed to create payment session via function.');
      }

      const cashfree = window.Cashfree({
        mode: "sandbox", // Force sandbox mode for testing
      });

      await cashfree.checkout({
        paymentSessionId: response.payment_session_id,
        redirectTarget: "_modal",
      });

    } catch (err: any) {
      console.error("Checkout Error:", err);
      toast({ 
        variant: 'destructive', 
        title: 'Checkout Failed', 
        description: err.message || "Could not connect to payment service." 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveAddress = async (data: AddressFormValues) => {
    if (!userRef) return;
    setIsProcessing(true);
    try {
      const current = profile?.shippingAddresses || [];
      const updated = editingAddress
        ? current.map(a => (a.address === editingAddress.address && a.zip === editingAddress.zip ? data : a))
        : [...current, data];
      await setDoc(userRef, { shippingAddresses: updated, phone: data.phone }, { merge: true });
      setSelectedAddress(data);
      setIsAddressFormOpen(false);
      setEditingAddress(null);
      refetch();
    } catch { toast({ variant: 'destructive', title: 'Failed to save' }); }
    finally { setIsProcessing(false); }
  };

  const handleDeleteAddress = async () => {
    if (!userRef || !addressToDelete) return;
    setIsProcessing(true);
    try {
      const current = profile?.shippingAddresses || [];
      const updated = current.filter(a => !(a.address === addressToDelete.address && a.zip === addressToDelete.zip));
      await setDoc(userRef, { shippingAddresses: updated }, { merge: true });
      if (selectedAddress?.address === addressToDelete.address && selectedAddress?.zip === addressToDelete.zip) {
        setSelectedAddress(updated[0] || null);
      }
      setAddressToDelete(null);
      refetch();
    } catch { toast({ variant: 'destructive', title: 'Deletion failed' }); }
    finally { setIsProcessing(false); }
  };

  if (isUserLoading || profileLoading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-[#6f3a2f]" /></div>;
  if (cartItems.length === 0) return <div className="text-center py-20 bg-[#F9F5F1] min-h-screen"><ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" /><h2 className="mt-4 text-2xl font-bold font-headline">Your cart is empty</h2></div>;

  const AddressIcon = ({ tag }: { tag: string }) => {
    if (tag === 'Office') return <Building className="h-5 w-5" />;
    if (tag === 'Other') return <MapPin className="h-5 w-5" />;
    return <Home className="h-5 w-5" />;
  };

  return (
    <div className="bg-[#F9F5F1] min-h-screen pb-12">
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="beforeInteractive" />
      
      <AlertDialog>
        <Dialog open={isAddressFormOpen} onOpenChange={setIsAddressFormOpen}>
          <div className="container mx-auto py-12 grid lg:grid-cols-2 gap-10 px-6">
            
            {/* Left: Address Selection */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-black font-headline text-primary uppercase tracking-tighter">Shipping Details</h1>
                  <Button variant="outline" size="sm" className="rounded-full border-[#6f3a2f] text-[#6f3a2f] hover:bg-[#6f3a2f]/5" onClick={() => { setEditingAddress(null); setIsAddressFormOpen(true); }}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New
                  </Button>
              </div>

              <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
                <CardContent className="pt-6">
                  {savedAddresses.length > 0 ? (
                    <RadioGroup value={selectedAddress ? JSON.stringify(selectedAddress) : ''} onValueChange={v => setSelectedAddress(JSON.parse(v))} className="space-y-4">
                      {savedAddresses.map((addr, i) => (
                        <Label key={i} className={cn('flex gap-4 border p-5 rounded-2xl cursor-pointer transition-all relative', selectedAddress?.address === addr.address && selectedAddress.zip === addr.zip ? 'border-[#6f3a2f] bg-[#6f3a2f]/5 ring-1 ring-[#6f3a2f]' : 'hover:border-[#6f3a2f]/30 bg-white')}>
                          <RadioGroupItem value={JSON.stringify(addr)} className="mt-1 border-[#6f3a2f] text-[#6f3a2f]" />
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 font-black text-primary uppercase text-xs tracking-widest mb-2">
                                <AddressIcon tag={addr.tag} /> {addr.tag}
                            </div>
                            <p className="font-bold text-base">{addr.name}</p>
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed italic">{addr.address}, {addr.city} - {addr.zip}</p>
                            <p className="text-xs font-mono mt-2 text-[#6f3a2f] font-bold">{addr.phone}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-white shadow-sm" onClick={(e) => { e.preventDefault(); setEditingAddress(addr); setIsAddressFormOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-destructive hover:bg-white shadow-sm" onClick={(e) => { e.preventDefault(); setAddressToDelete(addr); }}><Trash2 className="w-4 h-4" /></Button>
                            </AlertDialogTrigger>
                          </div>
                        </Label>
                      ))}
                    </RadioGroup>
                  ) : <div className="text-center py-16 border-2 border-dashed rounded-[2rem] bg-white/50"><p className="text-muted-foreground italic">Please add a shipping address to continue.</p></div>}
                </CardContent>
              </Card>
            </div>

            {/* Right: Summary & Payment */}
            <div className="lg:sticky lg:top-24 h-fit">
              <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                <div className="h-2 bg-[#6f3a2f] w-full" />
                <CardHeader className="pb-2">
                  <CardTitle className="font-headline text-3xl text-primary tracking-tighter uppercase">Order Summary</CardTitle>
                  <CardDescription className="font-medium italic">{cartItems.length} items to be delivered</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5 max-h-[35vh] overflow-auto pr-2 mb-6 scrollbar-hide">
                    {cartItems.map((item, index) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="relative h-16 w-16 rounded-2xl bg-slate-50 flex-shrink-0 overflow-hidden border border-slate-100">
                            <Image
                              src={item.imageUrls?.[0] || 'https://placehold.co/100'}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                              priority={index < 2}
                            />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm text-primary line-clamp-1">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-black text-sm text-[#6f3a2f]">₹{Math.round(item.sellingPrice * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-6 opacity-50" />
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-medium text-slate-500">Subtotal<span>₹{Math.round(cartTotal)}</span></div>
                    <div className="flex justify-between text-sm font-medium text-slate-500">Shipping<span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">Free Delivery</span></div>
                    <div className="flex justify-between text-3xl font-black pt-4 text-primary tracking-tighter">Total<span>₹{Math.round(cartTotal)}</span></div>
                  </div>

                  <Button 
                    onClick={handlePlaceOrder} 
                    disabled={isProcessing || !selectedAddress} 
                    className="w-full mt-10 h-16 text-lg font-headline rounded-full bg-[#6f3a2f] hover:bg-[#5a2e25] text-white shadow-xl transition-all active:scale-95 mb-4"
                  >
                    {isProcessing ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...</>
                    ) : (
                        <><ShieldCheck className="mr-2 h-5 w-5" /> Pay & Confirm Order</>
                    )}
                  </Button>
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 text-center">
                    Secure Modal Checkout
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Modal Components */}
          <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
            <DialogHeader><DialogTitle className="font-headline text-2xl text-primary">{editingAddress ? 'Update Address' : 'New Shipping Address'}</DialogTitle></DialogHeader>
            <AddressForm form={form} onSubmit={handleSaveAddress} isProcessing={isProcessing} submitButtonText={editingAddress ? 'Update' : 'Save Address'} />
          </DialogContent>

          <AlertDialogContent className="rounded-[2rem]">
            <AlertDialogHeader><AlertDialogTitle className="font-headline">Delete this address?</AlertDialogTitle></AlertDialogHeader>
            <p className="text-sm text-muted-foreground italic">This action cannot be undone.</p>
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel className="rounded-full" onClick={() => setAddressToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAddress} disabled={isProcessing} className="bg-destructive hover:bg-destructive/90 rounded-full">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </Dialog>
      </AlertDialog>
    </div>
  );
}
