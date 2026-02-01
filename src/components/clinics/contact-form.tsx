
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

const contactFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  age: z.string().min(1, "Age is required."),
  gender: z.enum(["Male", "Female", "Other"]),
  phone: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number."),
  email: z.string().email("Please enter a valid email address."),
  treatment: z.string(),
});

export function ContactForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      age: "",
      gender: "Male",
      phone: "",
      email: "",
      treatment: "Digestive Care"
    },
  });

  function onSubmit(values: z.infer<typeof contactFormSchema>) {
    console.log(values);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-card p-6 rounded-lg shadow-lg border">
        <p className="font-semibold text-center mb-4">Get a consultation when you sign up!</p>
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age*</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter your age" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Phone number*</FormLabel>
                    <FormControl>
                    <Input placeholder="Enter your phone" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Email Address*</FormLabel>
                    <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
         <FormField
          control={form.control}
          name="treatment"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Which treatment are you most interested in?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Digestive Care" />
                    </FormControl>
                    <FormLabel className="font-normal">Digestive Care</FormLabel>
                  </FormItem>
                   <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Bone and Joint" />
                    </FormControl>
                    <FormLabel className="font-normal">Bone and Joint</FormLabel>
                  </FormItem>
                   <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Skin and Hair" />
                    </FormControl>
                    <FormLabel className="font-normal">Skin and Hair</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Women Health" />
                    </FormControl>
                    <FormLabel className="font-normal">Women Health</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Book an Enquiry</Button>
      </form>
    </Form>
  );
}
