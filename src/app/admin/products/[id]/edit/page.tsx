
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebase, useDoc, useStorage, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Upload, X } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import type { Product } from '@/lib/placeholder-data';


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
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  brand: z.string().min(2, 'Brand is required.'),

  bannerImageUrl1: z.string().optional(),
  bannerImageUrl2: z.string().optional(),
  bannerImageUrl3: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const { firestore } = useFirebase();
  const storage = useStorage();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [bannerUrls, setBannerUrls] = useState({
      banner1: '',
      banner2: '',
      banner3: ''
  });

  const productRef = useMemo(() => firestore ? doc(firestore, 'products', productId) : null, [firestore, productId]);
  const { data: productData, isLoading: isProductLoading } = useDoc<Product>(productRef);

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
        continueSellingWhenOutOfStock: false,
        status: 'active',
        productType: '',
        category: '',
        tags: '',
        brand: '',
        bannerImageUrl1: '',
        bannerImageUrl2: '',
        bannerImageUrl3: '',
    }
  });

  // Effect to reset the form once product data is loaded
  useEffect(() => {
    if (productData) {
      const formData = {
        ...productData,
        tags: Array.isArray(productData.tags) ? productData.tags.join(', ') : productData.tags || '',
      };
      form.reset(formData);
      setImageUrls(productData.imageUrls || []);
      setBannerUrls({
          banner1: productData.bannerImageUrl1 || '',
          banner2: productData.bannerImageUrl2 || '',
          banner3: productData.bannerImageUrl3 || ''
      });
    }
  }, [productData, form]);

  const handleImageUpload = async (files: FileList | null) => {
    if (!storage || !files || files.length === 0 || !productRef) return;

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(file => {
        const storageRef = ref(storage, `product_media/${productId}/${uuidv4()}-${file.name}`);
        return uploadBytes(storageRef, file).then(() => getDownloadURL(storageRef));
      });

      const newUrls = await Promise.all(uploadPromises);
      
      const updatedImageUrls = [...imageUrls, ...newUrls];
      
      await setDoc(productRef, { imageUrls: updatedImageUrls }, { merge: true });

      setImageUrls(updatedImageUrls);
    } catch (error: any) {
        if (error.code === 'storage/unauthorized') {
            const contextualError = new FirestorePermissionError({
                path: `product_media/${productId}/`,
                operation: 'write',
                requestResourceData: { note: 'Attempted to upload files.' },
            });
            errorEmitter.emit('permission-error', contextualError);
        } else {
             toast({
                variant: 'destructive',
                title: 'Upload Failed',
                description: error.message || 'An unknown error occurred during upload.',
            });
        }
    } finally {
        setIsUploading(false);
    }
  };

  const removeImage = async (urlToRemove: string) => {
    if (!storage || !productRef) return;
    
    const newImageUrls = imageUrls.filter(url => url !== urlToRemove);

    try {
        const imageRef = ref(storage, urlToRemove);
        await deleteObject(imageRef);
        await setDoc(productRef, { imageUrls: newImageUrls }, { merge: true });
        setImageUrls(newImageUrls);
    } catch(error: any) {
         if (error.code === 'storage/unauthorized') {
            const contextualError = new FirestorePermissionError({
                path: urlToRemove.split(productRef.path)[1], // Attempt to get relative path
                operation: 'delete',
            });
            errorEmitter.emit('permission-error', contextualError);
        } else {
            toast({
                variant: "destructive",
                title: "Error removing image",
                description: error.message || "An unknown error occurred.",
            });
        }
    }
  };

  const handleBannerUpload = async (file: File | null, bannerKey: 'banner1' | 'banner2' | 'banner3') => {
    if (!storage || !file || !productRef) return;
    setIsUploading(true);

    const fieldName = `bannerImageUrl${bannerKey.slice(-1)}` as 'bannerImageUrl1' | 'bannerImageUrl2' | 'bannerImageUrl3';

    try {
        if (bannerUrls[bannerKey]) {
            const oldRef = ref(storage, bannerUrls[bannerKey]);
            await deleteObject(oldRef);
        }
        
        const storageRef = ref(storage, `product_banners/${productId}/${fieldName}-${file.name}`);
        await uploadBytes(storageRef, file);
        const newUrl = await getDownloadURL(storageRef);

        await setDoc(productRef, { [fieldName]: newUrl }, { merge: true });
        
        setBannerUrls(prev => ({...prev, [bannerKey]: newUrl}));
        form.setValue(fieldName, newUrl);

    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Banner Upload Failed', description: error.message });
    } finally {
        setIsUploading(false);
    }
  };

  const removeBanner = async (bannerKey: 'banner1' | 'banner2' | 'banner3') => {
      if (!storage || !productRef || !bannerUrls[bannerKey]) return;
      const fieldName = `bannerImageUrl${bannerKey.slice(-1)}` as 'bannerImageUrl1' | 'bannerImageUrl2' | 'bannerImageUrl3';
      try {
          const imageRef = ref(storage, bannerUrls[bannerKey]);
          await deleteObject(imageRef);
          await setDoc(productRef, { [fieldName]: '' }, { merge: true });
          setBannerUrls(prev => ({ ...prev, [bannerKey]: '' }));
          form.setValue(fieldName, '');
      } catch (error: any) {
          toast({ variant: 'destructive', title: 'Error Removing Banner', description: error.message });
      }
  };


  const onSubmit = async (data: ProductFormValues) => {
    if (!productRef) return;
    setIsSubmitting(true);

    const productData = {
      ...data,
      tags: typeof data.tags === 'string' ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      lastUpdated: new Date().toISOString()
    };
    
    // Clean up undefined values before sending to Firestore
    const cleanedData = Object.fromEntries(
        Object.entries(productData).filter(([_, v]) => v !== undefined && v !== '')
    );

    setDoc(productRef, cleanedData, { merge: true })
      .then(() => {
        router.push('/admin/products');
      })
      .catch((error: any) => {
        const contextualError = new FirestorePermissionError({
          path: productRef.path,
          operation: 'update',
          requestResourceData: cleanedData,
        });
        errorEmitter.emit('permission-error', contextualError);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  
  if (isProductLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-16 w-16 animate-spin"/></div>
  }
  
  if (!productData) {
      return <div className="flex items-center justify-center min-h-screen">Product not found.</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-4">
        <Button asChild variant="ghost">
          <Link href="/admin/products"><ArrowLeft className="mr-2 h-4 w-4" />Back to Products</Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <div className="w-24"></div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Title</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="ingredients" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ingredients</FormLabel>
                    <FormControl><Textarea {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="directionOfUse" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Direction of Use</FormLabel>
                    <FormControl><Textarea {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Media</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-center w-full mb-4">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8 mb-4 text-muted-foreground" />}
                      <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" onChange={(e) => handleImageUpload(e.target.files)} multiple accept="image/*" disabled={isUploading}/>
                  </label>
                </div>
                {imageUrls.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium mb-2">Current Images</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {imageUrls.map((url, index) => (
                            <div 
                                key={url} 
                                className="relative group aspect-square border p-1 rounded-md"
                            >
                                <Image src={url} alt={`Product image ${index + 1}`} fill className="object-cover rounded-md" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeImage(url)}>
                                    <X className="h-4 w-4" />
                                </Button>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                )}
              </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Product Banners</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {(['banner1', 'banner2', 'banner3'] as const).map((bannerKey, index) => {
                        const dimensions = index === 0 ? "4000x1044px" : "4000x1919px";
                        const currentUrl = bannerUrls[bannerKey];
                        return (
                            <div key={bannerKey}>
                                <FormLabel>Banner {index + 1} ({dimensions})</FormLabel>
                                {currentUrl ? (
                                    <div className="relative group mt-2">
                                        <Image src={currentUrl} alt={`Banner ${index + 1}`} width={400} height={150} className="rounded-md object-contain border bg-muted" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <Button type="button" variant="destructive" size="sm" onClick={() => removeBanner(bannerKey)}>
                                                <X className="mr-2 h-4 w-4" /> Remove
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center w-full mt-2">
                                        <label htmlFor={`banner-upload-${index}`} className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                                            <div className="flex flex-col items-center justify-center">
                                                {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6 text-muted-foreground" />}
                                                <p className="mt-2 text-xs text-muted-foreground">Click or drag to upload</p>
                                            </div>
                                            <input id={`banner-upload-${index}`} type="file" className="hidden" onChange={(e) => handleBannerUpload(e.target.files?.[0] || null, bannerKey)} accept="image/*" disabled={isUploading} />
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
                <FormField control={form.control} name="sellingPrice" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Price (₹)</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="comparedAtPrice" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compared At Price (₹)</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Inventory</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="sku" render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="gtin" render={({ field }) => (
                    <FormItem>
                      <FormLabel>GTIN (Barcode)</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="inventoryQuantity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </div>
                <FormField control={form.control} name="continueSellingWhenOutOfStock" render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Continue selling when out of stock</FormLabel>
                    </div>
                  </FormItem>
                )}/>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader><CardTitle>Status</CardTitle></CardHeader>
              <CardContent>
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}/>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Product Organization</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="productType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Type</FormLabel>
                    <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="brand" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <Separator />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="tags" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma-separated)</FormLabel>
                    <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
              </CardContent>
            </Card>
            
            <Button type="submit" disabled={isSubmitting || isUploading} className="w-full">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

    