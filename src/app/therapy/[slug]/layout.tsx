import React from 'react';
import { therapiesData } from '../therapy-data';

// This layout is now responsible for generating the static paths.
export async function generateStaticParams() {
  return therapiesData.map((therapy) => ({
    slug: therapy.slug,
  }));
}

export default function TherapySlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
