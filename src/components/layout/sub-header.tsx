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

  return (
    <div className="w-full bg-white border-b border-slate-50 hidden md:block">
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-center gap-8 py-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-primary pb-1",
                  isActive 
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary" 
                    : "text-muted-foreground/60"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}