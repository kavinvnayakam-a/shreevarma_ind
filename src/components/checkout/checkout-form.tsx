'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import React from 'react';

export const addressSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  address: z.string().min(5, 'Street address is required.'),
  city: z.string().min(2, 'City is required.'),
  state: z.string().min(2, 'State is required.'),
  zip: z.string().min(5, 'A valid zip code is required.'),
  phone: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number."),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
    onSubmit: (data: AddressFormValues) => void;
    isProcessing: boolean;
    defaultValues?: Partial<AddressFormValues>;
}

export function AddressForm({ onSubmit, isProcessing, defaultValues }: AddressFormProps) {
    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            name: defaultValues?.name || '',
            address: defaultValues?.address || '',
            city: defaultValues?.city || '',
            state: defaultValues?.state || '',
            zip: defaultValues?.zip || '',
            phone: defaultValues?.phone || '',
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>Enter your shipping address to continue.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                       <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g. John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                       <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>Street Address</FormLabel><FormControl><Input placeholder="e.g. 123 Wellness Lane" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="e.g. Ayurveda City" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="state" render={({ field }) => (<FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="e.g. Holistic State" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="zip" render={({ field }) => (<FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input placeholder="e.g. 12345" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                       <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="10-digit mobile number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <Button type="submit" disabled={isProcessing} size="lg" className="w-full mt-6">
                            {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Proceeding...</> : 'Proceed to Payment'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
