'use client';
import { SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export function SheetPanel({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string 
}) {
  return (
    <SheetContent 
      /* 'hideClose' isn't a standard prop, so we target the button via CSS 
         or simply ensure our custom Drawer UI handles the layout.
         We also pass through the className so w-[80%] works.
      */
      className={cn("flex flex-col p-0 [&>button]:hidden", className)}
    >
      {/* Fix for: "Missing Description" error. 
         We put these here so every sheet is automatically accessible.
      */}
      <VisuallyHidden.Root>
        <SheetTitle>Shopping Cart</SheetTitle>
        <SheetDescription>
          Manage your selected items and proceed to secure checkout.
        </SheetDescription>
      </VisuallyHidden.Root>
      
      {children}
    </SheetContent>
  );
}

export function SheetBody({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("flex-1 overflow-y-auto", className)}>
            {children}
        </div>
    );
}

export function SheetFooter({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-6 border-t mt-auto space-y-4 bg-white">
            {children}
        </div>
    );
}