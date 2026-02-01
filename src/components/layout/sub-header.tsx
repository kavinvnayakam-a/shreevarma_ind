
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/organisation', label: 'Organisation' },
  { href: '/consultation', label: 'Find Doctor' },
  { href: '/clinics', label: 'Clinics' },
  { href: '/therapy', label: 'Therapy' },
  { href: '/diseases', label: 'Disease' },
  { href: '/products', label: 'Buy Products' },
  { href: '/about', label: 'About Us' },
];

export function SubHeader() {
    const pathname = usePathname();
    // This component is no longer used in favor of the main header navigation.
    // It is kept for potential future use or reference.
    return null;
}
