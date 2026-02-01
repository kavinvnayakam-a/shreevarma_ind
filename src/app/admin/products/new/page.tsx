
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useFirebase, useStorage, errorEmitter, FirestorePermissionError } from '@/firebase';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Upload, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

const productSchema = z.object({
  name: z.string().min(2, 'Product name is required.'),
  description: z.string().optional(),
  ingredients: z.string().optional(),
  directionOfUse: z.string().optional(),
  
  sellingPrice: z.coerce.number().min(0, 'Selling price must be positive.'),
  comparedAtPrice: z.coerce.number().optional(),

  sku: z.string().optional(),
  gtin: z.string().optional(),
  inventoryQuantity: z.coerce.number().min(0, "Quantity can't be negative.").optional(),
  continueSellingWhenOutOfStock: z.boolean().default(false),
  
  status: z.enum(['active', 'draft']).default('active'),
  productType: z.string().optional(),
  category: z.string().min(2, 'Category is required.'),
  tags: z.string().optional(),
  brand: z.string().min(2, 'Brand is required.'),

  bannerImageUrl1: z.string().optional(),
  bannerImageUrl2: z.string().optional(),
  bannerImageUrl3: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const { firestore } = useFirebase();
  const storage = useStorage();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [bannerFiles, setBannerFiles] = useState<{banner1?: File, banner2?: File, banner3?: File}>({});

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      ingredients: '',
      directionOfUse: '',
      sellingPrice: 0,
      comparedAtPrice: undefined,
      sku: '',
      gtin: '',
      inventoryQuantity: undefined,
      tags: '',
      status: 'active',
      continueSellingWhenOutOfStock: false,
      productType: '',
      category: '',
      brand: '',
    },
  });
  
  const uploadFile = async (storagePath: string, file: File) => {
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
  };
  
  const onSubmit = async (data: ProductFormValues) => {
    if (!firestore || !storage) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firebase is not ready. Please try again.',
      });
      return;
    }
    setIsLoading(true);

    const productsCollection = collection(firestore, 'products');
    const newProductRef = doc(productsCollection); 

    try {
        const imageUrls = await Promise.all(
            filesToUpload.map(async (file) => 
              uploadFile(`product_media/${newProductRef.id}/${uuidv4()}-${file.name}`, file)
            )
        );

        const bannerImageUrl1 = bannerFiles.banner1 ? await uploadFile(`product_banners/${newProductRef.id}/bannerImageUrl1-${bannerFiles.banner1.name}`, bannerFiles.banner1) : '';
        const bannerImageUrl2 = bannerFiles.banner2 ? await uploadFile(`product_banners/${newProductRef.id}/bannerImageUrl2-${bannerFiles.banner2.name}`, bannerFiles.banner2) : '';
        const bannerImageUrl3 = bannerFiles.banner3 ? await uploadFile(`product_banners/${newProductRef.id}/bannerImageUrl3-${bannerFiles.banner3.name}`, bannerFiles.banner3) : '';

        const productData = {
            ...data,
            tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
            createdAt: new Date().toISOString(),
            imageUrls: imageUrls,
            bannerImageUrl1,
            bannerImageUrl2,
            bannerImageUrl3,
        };
        
        // Clean up undefined values before sending to Firestore
        const cleanedData = Object.fromEntries(
            Object.entries(productData).filter(([_, v]) => v !== undefined && v !== '')
        );

        await setDoc(newProductRef, cleanedData);
        
        router.push('/admin/products');

    } catch (error: any) {
        if (error.code === 'storage/unauthorized') {
            const contextualError = new FirestorePermissionError({
                path: `product_media/${newProductRef.id}/`,
                operation: 'write',
                requestResourceData: { note: `Attempted to upload ${filesToUpload.length} files.` },
            });
            errorEmitter.emit('permission-error', contextualError);
        } else {
            toast({
                variant: 'destructive',
                title: 'Operation Failed',
                description: error.message || 'An unknown error occurred during save.',
            });
        }
    } finally {
        setIsLoading(false);
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFilesToUpload(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };
  
  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>, bannerKey: 'banner1' | 'banner2' | 'banner3') => {
      if (e.target.files?.[0]) {
          setBannerFiles(prev => ({...prev, [bannerKey]: e.target.files?.[0]}));
      }
  };
  
  const removeFile = (index: number) => {
    setFilesToUpload(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeBannerFile = (bannerKey: 'banner1' | 'banner2' | 'banner3') => {
      setBannerFiles(prev => {
          const newFiles = {...prev};
          delete newFiles[bannerKey];
          return newFiles;
      });
  };

  return (
    <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-4">
            <Button asChild variant="ghost">
                <Link href="/admin/products"><ArrowLeft className="mr-2 h-4 w-4" />Back to Products</Link>
            </Button>
            <h1 className="text-2xl font-bold">Create Product</h1>
            <div className="w-24"></div>
        </div>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Title</FormLabel>
                                    <FormControl>
                                    <Input placeholder="e.g., Triphala Churna" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                    <Textarea placeholder="Describe the product..." {...field} value={field.value ?? ''}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="ingredients"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ingredients</FormLabel>
                                    <FormControl>
                                    <Textarea placeholder="List the ingredients..." {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="directionOfUse"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Direction of Use</FormLabel>
                                    <FormControl>
                                    <Textarea placeholder="How to use the product..." {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Media</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-muted-foreground">Any image size is accepted</p>
                                    </div>
                                    <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} multiple accept="image/*" />
                                </label>
                            </div>
                            {filesToUpload.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {filesToUpload.map((file, index) => (
                                        <div key={index} className="relative group aspect-square border p-1 rounded-md">
                                            <Image src={URL.createObjectURL(file)} alt={file.name} fill className="object-cover rounded-md" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <Button type="button" variant="destructive" size="icon" onClick={() => removeFile(index)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Product Banners</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             {(['banner1', 'banner2', 'banner3'] as const).map((bannerKey, index) => {
                                const dimensions = index === 0 ? "4000x1044px" : "4000x1919px";
                                const file = bannerFiles[bannerKey];
                                return (
                                    <div key={bannerKey}>
                                        <FormLabel>Banner {index + 1} ({dimensions})</FormLabel>
                                        {file ? (
                                            <div className="relative group mt-2">
                                                <Image src={URL.createObjectURL(file)} alt={`Banner ${index + 1}`} width={400} height={150} className="rounded-md object-contain border bg-muted" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <Button type="button" variant="destructive" size="sm" onClick={() => removeBannerFile(bannerKey)}>
                                                        <X className="mr-2 h-4 w-4" /> Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center w-full mt-2">
                                                <label htmlFor={`banner-upload-${index}`} className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Upload className="w-6 h-6 text-muted-foreground" />
                                                        <p className="mt-2 text-xs text-muted-foreground">Click or drag to upload</p>
                                                    </div>
                                                    <input id={`banner-upload-${index}`} type="file" className="hidden" onChange={(e) => handleBannerFileChange(e, bannerKey)} accept="image/*" />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                           <FormField
                                control={form.control}
                                name="sellingPrice"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Selling Price (₹)</FormLabel>
                                    <FormControl>
                                    <Input type="number" step="0.01" placeholder="e.g., 12.99" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="comparedAtPrice"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Compared At Price (₹)</FormLabel>
                                    <FormControl>
                                    <Input type="number" step="0.01" placeholder="e.g., 15.99" {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Inventory</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="sku"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
                                            <FormControl><Input placeholder="SKU-123" {...field} value={field.value ?? ''} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="gtin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>GTIN (Barcode)</FormLabel>
                                            <FormControl><Input placeholder="e.g., 9780123456789" {...field} value={field.value ?? ''} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="inventoryQuantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl><Input type="number" placeholder="100" {...field} value={field.value ?? ''} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="continueSellingWhenOutOfStock"
                                render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Continue selling when out of stock
                                    </FormLabel>
                                    <FormDescription>
                                        This will allow customers to purchase the product even when it's out of stock.
                                    </FormDescription>
                                    </div>
                                </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                </div>

                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Status</CardTitle></CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select product status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormDescription>
                                    Active products are visible on your store. Draft products are hidden.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Product Organization</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <FormField
                                control={form.control}
                                name="productType"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Type</FormLabel>
                                    <FormControl><Input placeholder="e.g. Supplement" {...field} value={field.value ?? ''} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="brand"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Brand</FormLabel>
                                    <FormControl>
                                    <Input placeholder="e.g., Himalayan Organics" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <Separator />
                             <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Collection / Category</FormLabel>
                                    <FormControl>
                                    <Input placeholder="e.g., Digestion" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags (comma-separated)</FormLabel>
                                    <FormControl>
                                    <Input placeholder="e.g., detox, digestion, wellness" {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                    
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Product'}
                    </Button>
                </div>

            </form>
        </Form>
    </div>
  );
}

    