'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/firebase';
import { LoginForm } from '@/components/auth/login-form';
import { Loader2 } from 'lucide-react';

export default function LoginClientPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // If auth state is not loading and user is logged in
    if (!isUserLoading && user) {
      // Check for a redirect query parameter
      const redirectUrl = searchParams.get('redirect') || '/';
      router.push(redirectUrl);
    }
  }, [user, isUserLoading, router, searchParams]);

  // Show a loading indicator while checking auth state or during redirect
  if (isUserLoading || user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // If user is null (and not loading), show the login form
  return (
    <div className="w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-14rem)] bg-[#F9F5F1]">
      <LoginForm />
    </div>
  );
}
