
'use client';

import { UseFormReturn } from 'react-hook-form';
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
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

export const addressSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  address: z.string().min(5, 'Street address is required.'),
  city: z.string().min(2, 'City is required.'),
  state: z.string().min(2, 'State is required.'),
  zip: z.string().min(5, 'A valid zip code is required.'),
  phone: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number."),
  tag: z.enum(['Home', 'Office', 'Other']),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
    form: UseFormReturn<AddressFormValues>;
    onSubmit: (data: AddressFormValues) => void;
    isProcessing: boolean;
    submitButtonText?: string;
}

export function AddressForm({ form, onSubmit, isProcessing, submitButtonText = "Save and Continue" }: AddressFormProps) {

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g. John Doe" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
               <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>Street Address</FormLabel><FormControl><Input placeholder="e.g. 123 Wellness Lane" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="e.g. Ayurveda City" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="state" render={({ field }) => (<FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="e.g. Holistic State" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="zip" render={({ field }) => (<FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input placeholder="e.g. 12345" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                </div>
               <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="10-digit mobile number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
               
               <FormField
                    control={form.control}
                    name="tag"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Address Type</FormLabel>
                            <FormControl>
                                <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-row space-x-4"
                                >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="Home" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Home</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="Office" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Office</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="Other" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Other</FormLabel>
                                </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isProcessing} size="lg" className="w-full mt-6">
                    {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : submitButtonText}
                </Button>
            </form>
        </Form>
    );
}

    