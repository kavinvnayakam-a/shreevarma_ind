
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { Loader2 } from 'lucide-react';

import { useAuth, useUser } from '@/firebase'; 

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
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const GoogleLogo = () => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 mr-2">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
  </svg>
);

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const auth = useAuth();
  const { userError } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  
  useEffect(() => {
    if (userError?.code === 'auth/unauthorized-domain') {
        toast({
          variant: 'destructive',
          title: 'Domain Not Authorized',
          description: `Please add '${window.location.hostname}' to the authorized domains list in your Firebase Authentication settings.`,
          duration: 10000,
        });
    }
  }, [userError, toast]);

  const handleGoogleLogin = async () => {
    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Auth Error',
        description: 'Authentication is not yet initialized. Please wait a moment.',
      });
      return;
    }
    
    setIsGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      const redirectUrl = searchParams.get('redirect') || '/';
      router.push(redirectUrl);

    } catch (error: any) {
      console.error("Google Sign-In Error:", error); // Enhanced logging
      let title = 'Login Failed';
      let description = 'An unexpected error occurred. Please try again.';

      switch (error.code) {
        case 'auth/popup-blocked':
          description = 'The sign-in popup was blocked by your browser. Please allow popups for this site and try again.';
          break;
        case 'auth/popup-closed-by-user':
          description = 'The sign-in window was closed before completing. Please try again.';
          break;
        case 'auth/unauthorized-domain':
          title = 'Domain Not Authorized';
          description = `This domain is not authorized for sign-in. Please add 'app.shreevarma.org' to the authorized domains in your Firebase project's Authentication settings.`;
          break;
        default:
          title = error.code;
          description = error.message;
      }
      
      toast({ variant: 'destructive', title, description, duration: 10000 });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleEmailLogin = async (values: z.infer<typeof loginSchema>) => {
    if (!auth) return;
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      const redirectUrl = searchParams.get('redirect') || '/';
      router.push(redirectUrl);
    } catch (error: any) {
      let description = 'An unexpected error occurred.';
      if (
        error.code === 'auth/user-not-found' || 
        error.code === 'auth/wrong-password' || 
        error.code === 'auth/invalid-credential'
      ) {
        description = 'Invalid email or password. Please try again.';
      }
      toast({ variant: 'destructive', title: 'Login Failed', description });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const email = form.getValues('email');
    if (!auth || !email) {
      toast({
        variant: 'destructive', 
        title: 'Email required', 
        description: 'Please enter your email address to reset your password.'
      });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ 
        title: 'Email Sent', 
        description: 'Check your inbox for a link to reset your password.' 
      });
    } catch (error) {
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'Could not send password reset email.' 
      });
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md shadow-xl border-t-4 border-t-primary">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-3xl font-bold font-headline">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to access your account and continue your wellness journey.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Button 
          onClick={handleGoogleLogin} 
          variant="outline" 
          className="w-full h-12 text-base transition-all hover:bg-slate-50" 
          disabled={isGoogleLoading || isLoading}
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <GoogleLogo />
          )}
          Sign in with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground font-medium">
              Or continue with email
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEmailLogin)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="name@example.com" 
                      className="h-11"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Button 
                      type="button" 
                      variant="link" 
                      className="h-auto p-0 text-xs font-semibold" 
                      onClick={handlePasswordReset}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <FormControl>
                    <Input 
                      type="password" 
                      className="h-11"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full h-12 text-base mt-2" 
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Sign In
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="p-6 pt-0 text-center text-sm text-muted-foreground">
        New to Shree Varma?{' '}
        <Link href="/signup" className="underline font-bold text-primary hover:text-primary/80">
          Create an account
        </Link>
      </div>
    </Card>
  );
}
