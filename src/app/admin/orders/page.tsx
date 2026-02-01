
'use client';

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, Search, Download, Loader2, ListFilter, Printer } from 'lucide-react';
import Link from 'next/link';
import { useCollection, useFirebase, errorEmitter, FirestorePermissionError, useUser } from '@/firebase';
import { collectionGroup, query, DocumentData, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
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
import { Checkbox } from '@/components/ui/checkbox';
import { CSVLink } from 'react-csv';

interface Order extends DocumentData {
    __docId: string; // The Firestore document ID
    id: string; // The human-readable ID like SVW1034
    orderId: string; // Fallback for older data
    customer: { name: string; email: string; phone?: string; };
    createdAt: { seconds: number; nanoseconds: number; };
    orderStatus: string;
    totalAmount: number;
    userId: string;
    items: { name: string, quantity: number, sellingPrice: number }[];
    shippingAddress: {
        name: string;
        address: string;
        city: string;
        state: string;
        zip: string;
        phone?: string;
    };
    paymentDetails?: {
        cfPaymentId?: string;
    }
}

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Processing': return 'secondary';
        case 'Shipped': return 'outline';
        case 'Delivered': return 'default';
        case 'Cancelled': return 'destructive';
        default: return 'outline';
    }
};

const orderStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
const superAdminEmails = ['kavinvnayakam@gmail.com', 'media@shreevarma.org'];

export default function OrdersDashboardPage() {
    
    const { firestore } = useFirebase();
    const { user } = useUser();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const isSuperAdmin = useMemo(() => user?.email && superAdminEmails.includes(user.email), [user]);

    const ordersQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collectionGroup(firestore, 'orders'));
    }, [firestore]);

    const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

    const filteredOrders = useMemo(() => {
        if (!orders) return [];
        
        let filtered = [...orders].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.orderStatus === statusFilter);
        }

        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(order => 
                (order.customer?.name?.toLowerCase().includes(lowercasedQuery)) ||
                (order.id?.toLowerCase().includes(lowercasedQuery)) ||
                (order.orderId?.toLowerCase().includes(lowercasedQuery)) ||
                (order.__docId?.toLowerCase().includes(lowercasedQuery))
            );
        }

        return filtered;
    }, [orders, searchQuery, statusFilter]);

    const handleStatusUpdate = async (order: Order, newStatus: string) => {
        if (!firestore || !order.userId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not update status. User context missing.' });
            return;
        }
        
        setUpdatingStatusId(order.__docId);
        const orderRef = doc(firestore, `users/${order.userId}/orders`, order.__docId);

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
            setUpdatingStatusId(null);
        }
    };
    
    const handleDeleteOrder = async () => {
        if (!firestore || !orderToDelete || !orderToDelete.userId) return;

        setIsDeleting(true);
        const docRef = doc(firestore, `users/${orderToDelete.userId}/orders`, orderToDelete.__docId);
        
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
            setOrderToDelete(null);
        }
    };
    
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedOrders(filteredOrders.map(o => o.__docId));
        } else {
            setSelectedOrders([]);
        }
    };

    const handleSelectOrder = (orderId: string, checked: boolean) => {
        if (checked) {
            setSelectedOrders(prev => [...prev, orderId]);
        } else {
            setSelectedOrders(prev => prev.filter(id => id !== orderId));
        }
    };
    
    const csvData = useMemo(() => {
        if (selectedOrders.length === 0 || !orders) return [];

        const data: any[] = [];
        const headers = ["Order ID", "Order Date", "Name", "Product Name", "Quantity", "Value", "Line Item Total", "Billing Address", "Billing City", "Zip Code", "Discount Code", "Payment Reference"];
        
        const selectedData = selectedOrders.flatMap(orderId => {
            const order = orders.find(o => o.__docId === orderId);
            if (!order) return [];

            return order.items.map(item => ({
                "Order ID": order.id || order.orderId,
                "Order Date": order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A',
                "Name": order.shippingAddress?.name || order.customer?.name,
                "Product Name": item.name,
                "Quantity": item.quantity,
                "Value": item.sellingPrice,
                "Line Item Total": item.quantity * item.sellingPrice,
                "Billing Address": order.shippingAddress.address,
                "Billing City": order.shippingAddress.city,
                "Zip Code": order.shippingAddress.zip,
                "Discount Code": "", // Placeholder
                "Payment Reference": order.paymentDetails?.cfPaymentId || "",
            }));
        });

        return [headers, ...selectedData.map(row => Object.values(row))];

    }, [selectedOrders, orders]);


    return (
        <div className="space-y-6">
             <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Order Management</h1>
                    <p className="text-muted-foreground">View and manage all customer orders.</p>
                </div>
            </header>
            
            <AlertDialog>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start flex-wrap gap-4">
                            <div>
                                <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
                                <CardDescription>An overview of all recent orders placed in the store.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <div className="relative w-full sm:w-auto">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        placeholder="Search by name or order ID..." 
                                        className="pl-10 w-full sm:w-64"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline"><ListFilter className="mr-2 h-4 w-4" /> Filter</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onSelect={() => setStatusFilter('all')}>All</DropdownMenuItem>
                                        {orderStatuses.map(status => (
                                            <DropdownMenuItem key={status} onSelect={() => setStatusFilter(status)}>{status}</DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button variant="outline" disabled={selectedOrders.length === 0}>
                                    <CSVLink data={csvData} filename={"shreevarma-orders.csv"} className="flex items-center">
                                        <Download className="mr-2 h-4 w-4" /> Export
                                    </CSVLink>
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
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">
                                            <Checkbox
                                                checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                                                onCheckedChange={handleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.map(order => (
                                        <TableRow key={order.__docId} data-state={selectedOrders.includes(order.__docId) && "selected"}>
                                            <TableCell>
                                                <Checkbox
                                                     checked={selectedOrders.includes(order.__docId)}
                                                     onCheckedChange={(checked) => handleSelectOrder(order.__docId, !!checked)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <Link href={`/admin/orders/${order.__docId}?userId=${order.userId}`} className="hover:underline">
                                                    {order.id || order.orderId || order.__docId.substring(0, 8).toUpperCase()}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{order.customer?.name}</div>
                                                <div className="text-xs text-muted-foreground">{order.customer?.email}</div>
                                            </TableCell>
                                            <TableCell>{order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</TableCell>
                                            <TableCell>
                                                {updatingStatusId === order.__docId ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Badge variant={getStatusVariant(order.orderStatus)}>{order.orderStatus}</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">₹{Math.round(order.totalAmount)}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/orders/${order.__docId}?userId=${order.userId}`}>View Details</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSub>
                                                            <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
                                                            <DropdownMenuSubContent>
                                                                {orderStatuses.map(status => (
                                                                    <DropdownMenuItem key={status} onClick={() => handleStatusUpdate(order, status)} disabled={order.orderStatus === status}>
                                                                        {status}
                                                                    </DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuSubContent>
                                                        </DropdownMenuSub>
                                                         <DropdownMenuItem asChild>
                                                            <Link href={`/admin/orders/${order.__docId}/invoice?userId=${order.userId}`} target="_blank">
                                                                <Printer className="mr-2 h-4 w-4"/>Print Invoice
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        {isSuperAdmin && (
                                                            <>
                                                                <DropdownMenuSeparator />
                                                                <AlertDialogTrigger asChild>
                                                                    <DropdownMenuItem className="text-destructive" onSelect={() => setOrderToDelete(order)}>
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </AlertDialogTrigger>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {filteredOrders.length === 0 && (
                                <div className="text-center py-10 text-muted-foreground">
                                    <p>No orders found{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
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
                        This action cannot be undone. This will permanently delete this order from your records.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOrderToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteOrder} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

