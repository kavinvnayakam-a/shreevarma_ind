
// This file is simplified to just pass children through. 
// Metadata is now handled directly in the page.tsx file for this route.

export default function TherapyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

    