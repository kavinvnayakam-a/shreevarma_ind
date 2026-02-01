
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import AdminClientLayout from './AdminClientLayout';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
