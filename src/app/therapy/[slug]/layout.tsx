import React from 'react';

// This layout simply passes children through.
// The generateStaticParams and generateMetadata functions have been moved to page.tsx
// to resolve the build conflict.
export default function TherapySlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
