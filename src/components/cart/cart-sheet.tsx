
'use client';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export function SheetPanel({ children }: { children: React.ReactNode }) {
  return (
    <SheetContent className="w-full sm:max-w-sm flex flex-col p-0">
      {children}
    </SheetContent>
  );
}

export function SheetBody({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex-1 overflow-y-auto">
            {children}
        </div>
    );
}

export function SheetFooter({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-4 border-t mt-auto space-y-4 bg-card">
            {children}
        </div>
    );
}
