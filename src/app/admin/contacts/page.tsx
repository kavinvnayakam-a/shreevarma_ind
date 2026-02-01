
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, Search, Loader2, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useCollection, useFirebase } from '@/firebase';
import { collection, query, DocumentData, collectionGroup } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface UserProfile extends DocumentData {
    __docId: string;
    firstName?: string;
    lastName?: string;
    name?: string; // Fallback
    email?: string;
    phone?: string;
    shippingAddresses?: any[];
}

interface Order extends DocumentData {
    userId: string;
}


export default function ContactsDashboardPage() {
    
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    
    const usersQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'users'));
    }, [firestore]);

    const ordersQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collectionGroup(firestore, 'orders'));
    }, [firestore]);

    const { data: users, isLoading: usersLoading } = useCollection<UserProfile>(usersQuery);
    const { data: orders, isLoading: ordersLoading } = useCollection<Order>(ordersQuery);

    const orderCounts = useMemo(() => {
        if (!orders) return new Map();
        return orders.reduce((acc, order) => {
            if (order.userId) {
                acc.set(order.userId, (acc.get(order.userId) || 0) + 1);
            }
            return acc;
        }, new Map<string, number>());
    }, [orders]);

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        
        let filtered = [...users];

        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(user => 
                (user.name?.toLowerCase().includes(lowercasedQuery)) ||
                (user.email?.toLowerCase().includes(lowercasedQuery))
            );
        }

        return filtered;
    }, [users, searchQuery]);

    const isLoading = usersLoading || ordersLoading;

    return (
        <div className="space-y-6">
             <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Contacts</h1>
                    <p className="text-muted-foreground">View and manage all registered users.</p>
                </div>
            </header>
            
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div>
                            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
                            <CardDescription>An overview of all users in the system.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative w-full sm:w-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search by name or email..." 
                                    className="pl-10 w-full sm:w-64"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
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
                                    <TableHead>User</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Addresses</TableHead>
                                    <TableHead>Total Orders</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map(user => (
                                    <TableRow key={user.__docId}>
                                        <TableCell>
                                            <p className="font-medium leading-none">{user.name || `${user.firstName || ''} ${user.lastName || ''}`}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                                        </TableCell>
                                        <TableCell>
                                            {user.phone ? (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone className="w-4 h-4 text-muted-foreground"/> {user.phone}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground italic">No phone</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm">
                                               <MapPin className="w-4 h-4 text-muted-foreground"/> {user.shippingAddresses?.length || 0} saved
                                            </div>
                                        </TableCell>
                                         <TableCell>
                                            <div className="font-medium text-center">{orderCounts.get(user.__docId) || 0}</div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/profile?userId=${user.__docId}`}>View Profile</Link>
                                                    </DropdownMenuItem>
                                                     <DropdownMenuItem asChild>
                                                        <Link href={`/admin/orders?userId=${user.__docId}`}>View Orders</Link>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {filteredUsers.length === 0 && (
                            <div className="text-center py-10 text-muted-foreground">
                                <p>No users found{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
                            </div>
                        )}
                    </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

