
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { ListOrdered, User, Calendar, LogOut, ArrowRight, PlusCircle, Home, Building, MapPin, Pencil, Trash2, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUser, useAuth, useFirebase, useCollection, useDoc } from '@/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useMemo, useEffect, useState } from 'react';
import { collection, query, orderBy, DocumentData, doc, setDoc, arrayRemove, where } from 'firebase/firestore';
import { AddressForm, addressSchema, type AddressFormValues } from '@/components/checkout/address-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Order extends DocumentData {
    orderId: string;
    createdAt: { seconds: number, nanoseconds: number };
    orderStatus: string;
    totalAmount: number;
    __docId: string; 
}

interface Consultation extends DocumentData {
    __docId: string;
    doctor: { name: string, specialty: string };
    consultationDate: string;
    type: string;
    status: 'Upcoming' | 'Completed' | 'Cancelled';
}

interface UserProfile extends DocumentData {
    shippingAddresses?: AddressFormValues[];
    phone?: string;
}

export default function ProfileClient() {
    const { user, isUserLoading } = useUser();
    const { firestore } = useFirebase();
    const auth = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressFormValues | null>(null);
    const [addressToDelete, setAddressToDelete] = useState<AddressFormValues | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const activeTab = searchParams.get('tab') || 'orders';

    const userRef = useMemo(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userProfile, isLoading: isProfileLoading, refetch } = useDoc<UserProfile>(userRef);

    const ordersQuery = useMemo(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, `users/${user.uid}/orders`), orderBy('createdAt', 'desc'));
    }, [firestore, user]);
    const { data: orders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);
    
    const consultationsQuery = useMemo(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, `consultations`), where('patientId', '==', user.uid));
    }, [firestore, user]);

    const { data: appointments, isLoading: areAppointmentsLoading } = useCollection<Consultation>(consultationsQuery);
    
    const sortedAppointments = useMemo(() => {
        if (!appointments) return [];
        return [...appointments].sort((a, b) => {
            const dateA = a.consultationDate ? new Date(a.consultationDate).getTime() : 0;
            const dateB = b.consultationDate ? new Date(b.consultationDate).getTime() : 0;
            return dateB - dateA;
        });
    }, [appointments]);


    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
    });

    useEffect(() => {
        if (editingAddress) {
            form.reset(editingAddress);
        } else {
            form.reset({
                name: user?.displayName || '',
                phone: userProfile?.phone || user?.phoneNumber || '',
                address: '', city: '', state: '', zip: '',
                tag: 'Home'
            });
        }
    }, [editingAddress, user, userProfile, form]);


    const handleLogout = async () => {
        if (!auth) return;
        try {
            await signOut(auth);
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
            toast({
                variant: 'destructive',
                title: 'Logout Failed',
                description: 'Could not log you out. Please try again.',
            });
        }
    };

    const handleAddressSubmit = async (data: AddressFormValues) => {
        if (!userRef) return;
        setIsSubmitting(true);
        try {
            const currentAddresses = userProfile?.shippingAddresses || [];
            let updatedAddresses: AddressFormValues[];

            if (editingAddress) {
                updatedAddresses = currentAddresses.map(addr =>
                    (addr.address === editingAddress.address && addr.zip === editingAddress.zip) ? data : addr
                );
            } else {
                updatedAddresses = [...currentAddresses, data];
            }

            await setDoc(userRef, { shippingAddresses: updatedAddresses }, { merge: true });

            setEditingAddress(null);
            setIsAddressFormOpen(false);
            refetch();

        } catch (error) {
            console.error("Failed to update profile:", error);
            toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not save your address.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAddress = async () => {
        if (!userRef || !addressToDelete) return;
        setIsSubmitting(true);
        try {
            await setDoc(userRef, {
                shippingAddresses: arrayRemove(addressToDelete)
            }, { merge: true });
            setAddressToDelete(null);
            refetch();
        } catch (error) {
            console.error("Failed to delete address:", error);
            toast({ variant: 'destructive', title: 'Deletion Failed', description: 'Could not remove address.' });
        } finally {
            setIsSubmitting(false);
        }
    };


    const getBadgeVariant = (status: string) => {
        switch (status) {
            case 'Delivered': return 'default';
            case 'Shipped': return 'secondary';
            case 'Cancelled': return 'destructive';
            default: return 'outline';
        }
    };

    const AddressIcon = ({ tag }: { tag: string }) => {
        switch (tag) {
            case 'Home': return <Home className="w-5 h-5" />;
            case 'Office': return <Building className="w-5 h-5" />;
            default: return <MapPin className="w-5 h-5" />;
        }
    };

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading || isProfileLoading || !user) {
        return (
            <div className="container mx-auto flex justify-center items-center min-h-[calc(100vh-14rem)]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <AlertDialog>
                <Dialog open={isAddressFormOpen} onOpenChange={setIsAddressFormOpen}>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                        <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-md">
                            {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                            <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold font-headline">{user.displayName || 'User'}</h1>
                            <p className="text-muted-foreground">{user.email}</p>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive-foreground hover:bg-destructive mt-2" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>

                    <Tabs defaultValue={activeTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
                            <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" /> Profile</TabsTrigger>
                            <TabsTrigger value="orders"><ListOrdered className="mr-2 h-4 w-4" /> Orders</TabsTrigger>
                            <TabsTrigger value="appointments"><Calendar className="mr-2 h-4 w-4" /> Appointments</TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile" className="mt-6">
                            <Card>
                                <CardHeader className="flex flex-row justify-between items-start">
                                    <div>
                                        <CardTitle className="font-headline">Shipping Addresses</CardTitle>
                                        <CardDescription>Manage your saved shipping locations.</CardDescription>
                                    </div>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" onClick={() => setEditingAddress(null)}>
                                            <PlusCircle className="mr-2" /> Add New
                                        </Button>
                                    </DialogTrigger>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {userProfile?.shippingAddresses && userProfile.shippingAddresses.length > 0 ? (
                                            userProfile.shippingAddresses.map((addr, index) => (
                                                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                                                    <AddressIcon tag={addr.tag} />
                                                    <div className="flex-grow">
                                                        <p className="font-semibold">{addr.name} <Badge variant="secondary" className="ml-2">{addr.tag}</Badge></p>
                                                        <p className="text-sm text-muted-foreground">{addr.address}, {addr.city}, {addr.state} - {addr.zip}</p>
                                                        <p className="text-sm text-muted-foreground">Phone: {addr.phone}</p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" onClick={() => { setEditingAddress(addr); setIsAddressFormOpen(true); }}>
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setAddressToDelete(addr)}>
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground text-center py-4">No addresses saved yet.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="orders" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-headline">Order History</CardTitle>
                                    <CardDescription>Check the status of all your recent orders.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {areOrdersLoading ? (
                                        <div className="flex justify-center items-center p-10">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        </div>
                                    ) : orders && orders.length > 0 ? (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <Card key={order.__docId} className="overflow-hidden">
                                                    <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4 bg-muted/50">
                                                        <div className="grid grid-cols-2 sm:grid-cols-4 md:flex md:gap-6 text-sm">
                                                            <div>
                                                                <p className="text-muted-foreground">Order ID</p>
                                                                <p className="font-medium">#{order.orderId || order.__docId.substring(0, 7).toUpperCase()}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-muted-foreground">Date Placed</p>
                                                                <p className="font-medium">{order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-muted-foreground">Total Amount</p>
                                                                <p className="font-medium">₹{Math.round(order.totalAmount)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="self-start md:self-center">
                                                            <Button asChild variant="secondary" size="sm">
                                                                <Link href={`/profile/orders/${order.__docId}`}>
                                                                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center gap-4">
                                                            <Badge variant={getBadgeVariant(order.orderStatus)}>{order.orderStatus || 'Unknown'}</Badge>
                                                            <p className="text-sm text-muted-foreground">Your order is currently {order.orderStatus ? order.orderStatus.toLowerCase() : 'being processed'}.</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 text-muted-foreground">
                                            <p>You haven't placed any orders yet.</p>
                                            <Button variant="link" asChild><Link href="/products">Start Shopping</Link></Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="appointments" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-headline">My Appointments</CardTitle>
                                    <CardDescription>Your scheduled and past consultations.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {areAppointmentsLoading ? (
                                        <div className="flex justify-center items-center p-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                                    ) : sortedAppointments && sortedAppointments.length > 0 ? (
                                        <ul className="space-y-4">
                                            {sortedAppointments.map((appt) => {
                                                const isJoinable = appt.status === 'Upcoming' && !!appt.doctor?.id;
                                                const isEnded = appt.status === 'Completed' || appt.status === 'Cancelled';
                                                
                                                return (
                                                <li key={appt.__docId} className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between p-4 bg-muted/50 rounded-lg gap-4 border">
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-background p-3 rounded-full border">
                                                            <Calendar className="h-6 w-6 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">Dr. {appt.doctor?.name || 'Unassigned'}</p>
                                                            <p className="text-sm text-muted-foreground">{new Date(appt.consultationDate).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 sm:gap-4 self-end sm:self-center">
                                                        <Badge variant={appt.type === "Video Consultation" ? "secondary" : "outline"}>{appt.type}</Badge>
                                                        <Button
                                                            asChild={isJoinable && !isEnded}
                                                            size="sm"
                                                            disabled={!isJoinable || isEnded}
                                                            className={cn(
                                                                isJoinable && !isEnded && "bg-green-600 hover:bg-green-700 text-white"
                                                            )}
                                                            >
                                                            {isJoinable && !isEnded ? (
                                                                <Link href={`/consultations/${appt.__docId}`}>
                                                                    <Video className="mr-2 h-4 w-4" />
                                                                    Join Session
                                                                </Link>
                                                            ) : (
                                                                <button>
                                                                    <Video className="mr-2 h-4 w-4" />
                                                                    {isEnded ? 'Consultation Ended' : (appt.doctor?.id ? 'Join Now' : 'Assigning Doctor...')}
                                                                </button>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </li>
                                            )})}
                                        </ul>
                                    ) : (
                                        <div className="text-center text-muted-foreground py-10">
                                            <p>You have no upcoming appointments.</p>
                                            <Button variant="link" asChild className="mt-2">
                                                <Link href="/consultation">Book a Consultation</Link>
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                            <DialogDescription>
                                Please fill in the details for your shipping address.
                            </DialogDescription>
                        </DialogHeader>
                        <AddressForm
                            form={form}
                            onSubmit={handleAddressSubmit}
                            isProcessing={isSubmitting}
                            submitButtonText={editingAddress ? 'Save Changes' : 'Add Address'}
                        />
                    </DialogContent>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently remove this address from your profile.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setAddressToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAddress} disabled={isSubmitting} className="bg-destructive hover:bg-destructive/90">
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </Dialog>
            </AlertDialog>
        </div>
    );
}
