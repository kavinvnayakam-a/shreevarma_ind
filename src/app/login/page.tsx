import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import LoginClientPage from './LoginClientPage';

function Loading() {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
}


export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginClientPage />
    </Suspense>
  );
}
