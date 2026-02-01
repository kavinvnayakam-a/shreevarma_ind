'use client';

import { useMemo, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useParams, useSearchParams } from 'next/navigation';
import { useFirebase, useCollection, useDoc } from '@/firebase';
import { collection, query, doc, DocumentData, updateDoc } from 'firebase/firestore';
import { Product } from '@/lib/placeholder-data';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from '@/components/ui/command';
import { Loader2, PlusCircle, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

type PrescriptionFormValues = {
  patientName: string;
  patientAge: string;
  diagnosis: string;
  medicines: {
    productId: string;
    productName: string;
    dosage: string;
    notes: string;
  }[];
  therapies: {
    name: string;
    notes: string;
  }[];
};

interface Consultation extends DocumentData {
  patient: { name: string; age?: string; };
  healthIssue: string;
}

export default function PrescriptionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const consultationId = params.consultationId as string;
  const userId = searchParams.get('userId');
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PrescriptionFormValues>({
    defaultValues: {
      medicines: [],
      therapies: [],
    },
  });

  const { fields: medicineFields, append: appendMedicine, remove: removeMedicine } = useFieldArray({
    control: form.control,
    name: 'medicines',
  });

  const { fields: therapyFields, append: appendTherapy, remove: removeTherapy } = useFieldArray({
    control: form.control,
    name: 'therapies',
  });

  const consultationRef = useMemo(() => {
      if (!firestore || !consultationId || !userId) return null;
      return doc(firestore, `users/${userId}/consultations`, consultationId);
  }, [firestore, consultationId, userId]);

  const { data: consultationData, isLoading: isConsultationLoading } = useDoc<Consultation>(consultationRef);

  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'));
  }, [firestore]);
  
  const { data: allProducts, isLoading: areProductsLoading } = useCollection<Product>(productsQuery);

  const onSubmit = async (data: PrescriptionFormValues) => {
    if (!consultationRef) return;
    setIsSubmitting(true);
    try {
        await updateDoc(consultationRef, {
            prescription: data,
            status: 'Completed', // Mark consultation as completed
            prescriptionGeneratedAt: new Date().toISOString(),
        });
        toast({ title: 'Success', description: 'Prescription saved and consultation marked as complete.' });
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to save prescription.' });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isConsultationLoading) {
      return <div className="flex justify-center items-center h-screen"><Loader2 className="h-16 w-16 animate-spin"/></div>
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Create Prescription</CardTitle>
          <CardDescription>
            For Patient: <span className="font-semibold">{consultationData?.patient.name}</span> | Health Issue: {consultationData?.healthIssue}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Patient Details */}
              <div className="grid md:grid-cols-3 gap-4">
                 <FormField control={form.control} name="patientName" render={({ field }) => (<FormItem><FormLabel>Patient Name</FormLabel><FormControl><Input {...field} defaultValue={consultationData?.patient.name} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="patientAge" render={({ field }) => (<FormItem><FormLabel>Patient Age</FormLabel><FormControl><Input type="number" {...field} defaultValue={consultationData?.patient.age} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="diagnosis" render={({ field }) => (<FormItem><FormLabel>Diagnosis</FormLabel><FormControl><Input {...field} placeholder="e.g., Vata Imbalance" /></FormControl><FormMessage /></FormItem>)} />
              </div>
              
              <Separator />

              {/* Medicines Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Medicines</h3>
                <div className="space-y-4">
                  {medicineFields.map((field, index) => (
                    <Card key={field.id} className="p-4 bg-muted/50">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="font-semibold">{form.watch(`medicines.${index}.productName`)}</h4>
                            <Button variant="ghost" size="icon" onClick={() => removeMedicine(index)}><X className="h-4 w-4"/></Button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField control={form.control} name={`medicines.${index}.dosage`} render={({ field }) => (<FormItem><FormLabel>Dosage</FormLabel><FormControl><Input {...field} placeholder="e.g., 1 tablet twice a day" /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name={`medicines.${index}.notes`} render={({ field }) => (<FormItem><FormLabel>Notes</FormLabel><FormControl><Input {...field} placeholder="e.g., After food" /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    </Card>
                  ))}
                </div>
                <ProductSearch onProductSelect={(product) => appendMedicine({ productId: product.id, productName: product.name, dosage: '', notes: '' })} allProducts={allProducts} isLoading={areProductsLoading} />
              </div>

               <Separator />

              {/* Therapies Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Therapies / Lifestyle Advice</h3>
                 <div className="space-y-4">
                  {therapyFields.map((field, index) => (
                    <Card key={field.id} className="p-4 bg-muted/50">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="font-semibold">{form.watch(`therapies.${index}.name`)}</h4>
                            <Button variant="ghost" size="icon" onClick={() => removeTherapy(index)}><X className="h-4 w-4"/></Button>
                        </div>
                        <FormField control={form.control} name={`therapies.${index}.notes`} render={({ field }) => (<FormItem><FormLabel>Notes / Instructions</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </Card>
                  ))}
                </div>
                <Button type="button" variant="outline" className="mt-4" onClick={() => appendTherapy({ name: 'New Therapy', notes: '' })}><PlusCircle className="mr-2"/>Add Therapy/Advice</Button>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="animate-spin mr-2"/>}
                Save Prescription
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}


function ProductSearch({ onProductSelect, allProducts, isLoading }: { onProductSelect: (product: Product) => void, allProducts: Product[] | null, isLoading: boolean }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredProducts = useMemo(() => {
        if (!allProducts) return [];
        if (!search) return allProducts;
        return allProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }, [allProducts, search]);
    
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverAnchor asChild>
                <Button type="button" variant="outline" className="mt-4"><PlusCircle className="mr-2"/>Add Medicine</Button>
            </PopoverAnchor>
            <PopoverContent className="p-0 w-[300px]" align="start">
                <Command>
                    <CommandInput value={search} onValueChange={setSearch} placeholder="Search product..." />
                    <CommandList>
                        {isLoading && <div className="p-4 text-center text-sm">Loading products...</div>}
                        <CommandEmpty>{!isLoading && "No product found."}</CommandEmpty>
                        {filteredProducts.slice(0, 50).map(product => (
                            <CommandItem
                                key={(product as any).__docId}
                                onSelect={() => {
                                    onProductSelect({...product, id: (product as any).__docId});
                                    setSearch('');
                                    setOpen(false);
                                }}
                                className="cursor-pointer"
                            >
                                {product.name}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
