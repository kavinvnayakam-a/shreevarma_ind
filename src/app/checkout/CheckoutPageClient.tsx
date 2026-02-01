
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirebase, useDoc } from '@/firebase';

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
import { Loader2, ShoppingBag, PlusCircle, Home, Building, MapPin, Pencil, Trash2 } from 'lucide-react';
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
  const { firestore } = useFirebase();

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
        setIsAddressFormOpen(false);
      } else if (savedAddresses.length === 0) {
        setIsAddressFormOpen(true);
      }
    }
  }, [profileLoading, savedAddresses, selectedAddress]);
  
  useEffect(() => {
    if (editingAddress) {
        form.reset(editingAddress);
    } else {
        form.reset({
            name: user?.displayName || '',
            phone: profile?.phone || user?.phoneNumber || '',
            address: '', city: '', state: '', zip: '',
            tag: 'Home'
        });
    }
  }, [editingAddress, user, profile, form]);

  const handlePlaceOrder = async () => {
    if (!user || !user.email || !selectedAddress || !firestore) {
      toast({ variant: 'destructive', title: 'Missing Information', description: 'Please select or add a shipping address.' });
      return;
    }

    if (typeof window.Cashfree === 'undefined') {
      toast({ variant: 'destructive', title: 'Payment Gateway Not Found', description: 'Please refresh the page.' });
      return;
    }

    setIsProcessing(true);

    try {
      const apiResponse = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.uid,
            cartItems,
            cartTotal,
            customerName: selectedAddress.name,
            customerEmail: user.email,
            customerPhone: selectedAddress.phone,
            shippingAddress: selectedAddress,
          })
      });

      const response = await apiResponse.json();

      if (!response.success || !response.payment_session_id) {
        throw new Error(response.error || 'Failed to initiate payment session');
      }

      const cashfree = window.Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === 'sandbox' ? 'sandbox' : 'production',
      });

      await cashfree.checkout({
        paymentSessionId: response.payment_session_id,
      });

    } catch (err: any) {
      console.error("Checkout Error:", err);
      toast({ 
        variant: 'destructive', 
        title: 'Order Failed', 
        description: err.message || "An unexpected error occurred." 
      });
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
    } catch { toast({ variant: 'destructive', title: 'Failed to save address' }); }
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

  if (isUserLoading || profileLoading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  if (cartItems.length === 0) return <div className="text-center py-20"><ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" /><h2 className="mt-4 text-2xl font-bold font-headline">Your cart is empty</h2></div>;

  const AddressIcon = ({ tag }: { tag: string }) => {
    if (tag === 'Office') return <Building className="h-5 w-5" />;
    if (tag === 'Other') return <MapPin className="h-5 w-5" />;
    return <Home className="h-5 w-5" />;
  };

  return (
    <AlertDialog>
      <Dialog open={isAddressFormOpen} onOpenChange={setIsAddressFormOpen}>
        <div className="container mx-auto py-10 grid lg:grid-cols-2 gap-8 px-6">
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle className="font-headline text-2xl">Shipping Address</CardTitle>
                <CardDescription>Where should we deliver your order?</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => { setEditingAddress(null); setIsAddressFormOpen(true); }}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New
              </Button>
            </CardHeader>
            <CardContent>
              {savedAddresses.length > 0 ? (
                <RadioGroup value={selectedAddress ? JSON.stringify(selectedAddress) : ''} onValueChange={v => setSelectedAddress(JSON.parse(v))} className="space-y-3">
                  {savedAddresses.map((addr, i) => (
                    <Label key={i} className={cn('flex gap-4 border p-4 rounded-xl cursor-pointer transition-all', selectedAddress?.address === addr.address && selectedAddress.zip === addr.zip ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50 bg-white')}>
                      <RadioGroupItem value={JSON.stringify(addr)} className="mt-1" />
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 font-bold text-foreground capitalize"><AddressIcon tag={addr.tag} /> {addr.tag}</div>
                        <p className="text-sm text-muted-foreground mt-1">{addr.name}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed italic">{addr.address}, {addr.city} - {addr.zip}</p>
                        <p className="text-xs font-mono mt-1">{addr.phone}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.preventDefault(); setEditingAddress(addr); setIsAddressFormOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={(e) => { e.preventDefault(); setAddressToDelete(addr); }}><Trash2 className="w-4 h-4" /></Button>
                        </AlertDialogTrigger>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              ) : <div className="text-center py-10 border-2 border-dashed rounded-xl"><p className="text-muted-foreground">No addresses saved yet.</p></div>}
            </CardContent>
          </Card>

          <Card className="sticky top-24 h-fit border-none shadow-md overflow-hidden bg-white">
            <div className="h-1 bg-primary w-full" />
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
              <CardDescription>{cartItems.length} item(s) in your cart</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[40vh] overflow-auto pr-2 mb-4 scrollbar-hide">
                {cartItems.map((item, index) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative h-14 w-14 border rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                        <Image
                          src={item.imageUrls?.[0] || 'https://placehold.co/100'}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                          priority={index === 0}
                        />
                    </div>
                    <div className="flex-1 text-sm">
                        <p className="font-bold line-clamp-1">{item.name}</p>
                        <p className="text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-sm">₹{Math.round(item.sellingPrice * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <Separator className="my-6" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">Subtotal<span>₹{Math.round(cartTotal)}</span></div>
                <div className="flex justify-between text-sm text-muted-foreground">Shipping<span className="text-green-600 font-medium">FREE</span></div>
                <div className="flex justify-between text-2xl font-bold pt-4 text-primary">Total<span>₹{Math.round(cartTotal)}</span></div>
              </div>

              <Button onClick={handlePlaceOrder} disabled={isProcessing || !selectedAddress} className="w-full mt-8 h-14 text-lg font-headline shadow-lg hover:shadow-xl transition-all">
                {isProcessing ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Initializing Gateway...</> : 'Pay & Confirm Order'}
              </Button>
              <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-tighter">Secure SSL Encrypted Payment via Cashfree PG</p>
            </CardContent>
          </Card>
        </div>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>{editingAddress ? 'Update Address' : 'New Shipping Address'}</DialogTitle></DialogHeader>
          <AddressForm form={form} onSubmit={handleSaveAddress} isProcessing={isProcessing} submitButtonText={editingAddress ? 'Update' : 'Save Address'} />
        </DialogContent>

        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
          <p className="text-sm text-muted-foreground">This address will be removed from your profile permanently.</p>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAddressToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAddress} disabled={isProcessing} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </Dialog>
    </AlertDialog>
  );
}
