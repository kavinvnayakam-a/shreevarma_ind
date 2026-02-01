'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPrescriptionAction } from '@/app/actions';
import { Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const PrescriptionInputSchema = z.object({
  practitionerName: z.string().min(2, 'Practitioner name is required.'),
  patientName: z.string().min(2, 'Patient name is required.'),
  consultationDetails: z
    .string()
    .min(50, 'Consultation details must be at least 50 characters long.'),
  suggestedTreatment: z
    .string()
    .min(20, 'Suggested treatment must be at least 20 characters long.'),
});
type PrescriptionInput = z.infer<typeof PrescriptionInputSchema>;

export function PrescriptionForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const form = useForm<PrescriptionInput>({
    resolver: zodResolver(PrescriptionInputSchema),
    defaultValues: {
      practitionerName: 'Dr. Anjali Sharma',
      patientName: '',
      consultationDetails: '',
      suggestedTreatment: '',
    },
  });

  async function onSubmit(values: PrescriptionInput) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const response = await getPrescriptionAction(values);

    if (response.success) {
      setResult(response.data.prescriptionText);
      form.reset(); // Optionally reset form
    } else {
      setError(response.error);
    }

    setIsLoading(false);
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wand2 /> AI Prescription Generator</CardTitle>
                <CardDescription>
                Fill in the details from the consultation to generate an instant,
                patient-friendly prescription.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="practitionerName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Practitioner Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Dr. Anjali Sharma" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="patientName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Patient Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="consultationDetails"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Consultation Details</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Symptoms, observations, patient history..."
                            className="min-h-[150px]"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="suggestedTreatment"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Suggested Treatment</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Medicines, therapies, lifestyle changes..."
                            className="min-h-[100px]"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        'Generate Prescription'
                    )}
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
        
        <div className="md:sticky top-24">
            {isLoading && (
                 <Card className="flex flex-col items-center justify-center p-8 min-h-[300px]">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Generating prescription...</p>
                 </Card>
            )}
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {result && (
                <Card>
                    <CardHeader>
                        <CardTitle>Generated Prescription</CardTitle>
                        <CardDescription>Review the generated text below. You can copy it or request a new one.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm dark:prose-invert bg-muted p-4 rounded-md whitespace-pre-wrap max-w-none">
                            {result}
                        </div>
                    </CardContent>
                </Card>
            )}
            {!isLoading && !error && !result && (
                <Card className="flex flex-col items-center justify-center text-center p-8 min-h-[300px] border-dashed">
                    <Wand2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">The generated prescription will appear here.</p>
                </Card>
            )}
        </div>
    </div>
  );
}
