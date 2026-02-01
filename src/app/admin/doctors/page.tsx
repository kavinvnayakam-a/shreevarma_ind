
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, orderBy, DocumentData, doc, setDoc } from 'firebase/firestore';
import { Loader2, PlusCircle, UserPlus, Mail, Briefcase } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

interface Doctor extends DocumentData {
    id: string;
    name: string;
    specialty: string;
    email: string;
}

const doctorSchema = z.object({
    name: z.string().min(2, "Name is required."),
    specialty: z.string().min(3, "Specialty is required."),
    email: z.string().email("A valid email is required."),
});

type DoctorFormValues = z.infer<typeof doctorSchema>;

export default function AdminDoctorsPage() {
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const doctorsQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, "doctors"), orderBy("name"));
    }, [firestore]);

    const { data: doctors, isLoading } = useCollection<Doctor>(doctorsQuery);

    const form = useForm<DoctorFormValues>({
        resolver: zodResolver(doctorSchema),
        defaultValues: { name: '', specialty: '', email: '' }
    });

    const handleEnrollDoctor = async (values: DoctorFormValues) => {
        if (!firestore) return;

        setIsSubmitting(true);
        try {
            const newDoctorRef = doc(collection(firestore, 'doctors'));
            await setDoc(newDoctorRef, {
                id: newDoctorRef.id,
                ...values
            });
            toast({ title: "Doctor Enrolled", description: `${values.name} has been added.` });
            form.reset();
            setIsDialogOpen(false);
        } catch (error: any) {
            const contextualError = new FirestorePermissionError({
                path: 'doctors',
                operation: 'create',
                requestResourceData: values,
            });
            errorEmitter.emit('permission-error', contextualError);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="container mx-auto">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start flex-wrap gap-4">
                            <div>
                                <CardTitle>Doctor Enrollment</CardTitle>
                                <CardDescription>Manage doctors available for consultation.</CardDescription>
                            </div>
                            <DialogTrigger asChild>
                                <Button><UserPlus className="mr-2 h-4 w-4" />Enroll New Doctor</Button>
                            </DialogTrigger>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <>
                                {doctors && doctors.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Specialty</TableHead>
                                                <TableHead>Email</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {doctors.map((doctor) => (
                                                <TableRow key={doctor.id}>
                                                    <TableCell className="font-medium">{doctor.name}</TableCell>
                                                    <TableCell>{doctor.specialty}</TableCell>
                                                    <TableCell>{doctor.email}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-10 text-muted-foreground">
                                        <p>No doctors enrolled yet. Get started by adding one.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Enroll a New Doctor</DialogTitle>
                        <DialogDescription>
                            Add a new practitioner to the platform. This will make them available for consultations.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(handleEnrollDoctor)} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...form.register('name')} />
                            {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="specialty">Specialty</Label>
                            <Input id="specialty" {...form.register('specialty')} placeholder="e.g., Ayurveda, Siddha" />
                             {form.formState.errors.specialty && <p className="text-sm text-destructive">{form.formState.errors.specialty.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" {...form.register('email')} placeholder="doctor@example.com" />
                             {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                                Save Doctor
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
