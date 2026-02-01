
'use client';

import { Suspense } from 'react';
import ProfileClient from '@/components/profile/ProfileClient';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto flex justify-center items-center min-h-[calc(100vh-14rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    }>
      <ProfileClient />
    </Suspense>
  );
}
