
'use client';

import { ReactNode, useEffect, useMemo } from 'react';
import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const superAdminEmails = ['kavinvnayakam@gmail.com', 'media@shreevarma.org'];
const healthcareAdminEmails = ['healthcare@shreevarma.org'];

const allowedHealthcareRoutes = [
    '/admin/orders',
    '/admin/products',
];

export default function AdminClientLayout({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const userRole = useMemo(() => {
    if (!user || !user.email) return 'none';
    if (superAdminEmails.includes(user.email)) return 'super';
    if (healthcareAdminEmails.includes(user.email)) return 'healthcare';
    return 'none';
  }, [user]);

  useEffect(() => {
    if (isUserLoading) {
      return;
    }

    if (userRole === 'none') {
      router.push('/login');
      return;
    }
    
    // If the user is a super admin, they can access everything. No need to redirect.
    if (userRole === 'super') {
      return;
    }

    if (userRole === 'healthcare') {
        const isAllowed = allowedHealthcareRoutes.some(route => pathname.startsWith(route));
        if (!isAllowed) {
            router.push('/admin/orders');
        }
    }

  }, [user, isUserLoading, router, userRole, pathname]);

  if (isUserLoading || userRole === 'none') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  if (userRole === 'healthcare' && !allowedHealthcareRoutes.some(route => pathname.startsWith(route))) {
      return (
           <div className="flex items-center justify-center min-h-screen bg-muted/40">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="ml-4">Redirecting...</p>
            </div>
      )
  }


  return (
    <div className="bg-muted/40 min-h-screen">
      <div className="p-4 sm:p-6 md:p-8">{children}</div>
    </div>
  );
}
