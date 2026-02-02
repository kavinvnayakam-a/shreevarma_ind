'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { 
  Menu, User, Search, ChevronDown, Wrench, LogOut, 
  Image as ImageIcon, BriefcaseMedical, Users, ListOrdered, Palette, X 
} from 'lucide-react';
import { Logo } from '../icons/logo';
import SearchOverlay from './search-overlay';
import { useState, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { CartDrawer } from '../cart/cart-drawer';
import { CartIcon } from '../cart/cart-icon';
import { useUser, useAuth } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import { DesktopSearch } from './desktop-search';
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Separator } from '../ui/separator';

const navLinks = [
  { href: '/consultation', label: 'Find Doctor' },
  { href: '/clinics', label: 'Clinics' },
  { href: '/therapy', label: 'Therapy' },
  { href: '/diseases', label: 'Disease' },
  { href: '/products', label: 'Buy Products' },
];

const aboutLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/organisation', label: 'Organisation' },
];

const superAdminEmails = ['kavinvnayakam@gmail.com', 'media@shreevarma.org'];
const healthcareAdminEmails = ['healthcare@shreevarma.org'];

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { isCartOpen, setCartOpen } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const userRole = useMemo(() => {
    if (!user || !user.email) return 'none';
    if (superAdminEmails.includes(user.email)) return 'super';
    if (healthcareAdminEmails.includes(user.email)) return 'healthcare';
    return 'none';
  }, [user]);

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Logout Failed' });
    }
  };

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-slate-50 bg-white/80 backdrop-blur-xl">
      <div className="container flex h-16 md:h-20 max-w-screen-2xl items-center px-4 md:px-8">
        
        {/* MOBILE MENU TRIGGER */}
        <div className="flex flex-1 items-center justify-start md:hidden">
            {isClient && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-primary">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                
                {/* Fix: Adding [&>button]:hidden to remove the default Shadcn close button.
                  We provide our own custom close logic in the header.
                */}
                <SheetContent side="left" className="w-[80%] p-0 bg-white border-r border-slate-50 [&>button]:hidden">
                  <SheetHeader className="p-0">
                    <VisuallyHidden.Root>
                      <SheetTitle>Navigation Menu</SheetTitle>
                      {/* Fix: Adding VisuallyHidden Description to resolve Console Warning */}
                      <SheetDescription>Explore our services, clinics, and wellness products.</SheetDescription>
                    </VisuallyHidden.Root>
                  </SheetHeader>
                  
                  <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                    <Logo className="h-8 w-auto" />
                    <SheetClose className="p-2 rounded-full hover:bg-slate-50 transition-colors">
                      <X className="h-5 w-5 text-primary"/>
                    </SheetClose>
                  </div>
                  
                  <nav className="flex flex-col p-8 space-y-6">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.href} 
                        href={link.href} 
                        className={cn(
                          "text-sm font-medium transition-colors",
                          pathname.startsWith(link.href) ? "text-primary" : "text-foreground/80"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Separator className="opacity-50" />
                    <p className="text-xs font-medium text-muted-foreground/40">About</p>
                    {aboutLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground/80">
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
        </div>
        
        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex flex-1 items-center gap-6">
             {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            isActive ? "text-primary" : "text-foreground/80"
                        )}
                    >
                        {link.label}
                    </Link>
                )
              })}
              {isClient && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-sm font-medium p-0 h-auto hover:bg-transparent text-foreground/80 hover:text-primary gap-1 focus-visible:ring-0">
                          About <ChevronDown className="h-4 w-4" />
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="rounded-xl border-slate-50 shadow-xl p-2 bg-white">
                      {aboutLinks.map(link => (
                          <DropdownMenuItem key={link.href} asChild className="font-medium text-sm p-2 cursor-pointer">
                              <Link href={link.href}>{link.label}</Link>
                          </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
        </div>

        {/* CENTER LOGO */}
        <div className="flex-initial justify-center items-center px-4">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Logo className="h-10 md:h-12 w-auto" />
            </Link>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex flex-1 items-center justify-end space-x-2">
             <div className='w-full max-w-[200px] hidden xl:block'>
                <DesktopSearch />
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              {!isUserLoading && user && isClient ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full focus-visible:ring-0">
                       <Avatar className="h-9 w-9">
                          <AvatarImage src={user.photoURL || ''} />
                          <AvatarFallback className="bg-primary text-white text-xs">
                            {user.displayName?.charAt(0) || user.email?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 rounded-xl shadow-xl border-slate-50 p-2 bg-white">
                    <DropdownMenuItem asChild className="rounded-lg p-2 font-medium text-sm cursor-pointer">
                      <Link href="/profile" className="flex items-center"><User className="mr-2 h-4 w-4" />Profile</Link>
                    </DropdownMenuItem>
                    
                    {userRole === 'super' && (
                      <div className="space-y-1 py-1">
                        <DropdownMenuSeparator className="opacity-50" />
                        <DropdownMenuItem asChild className="rounded-lg p-2 font-medium text-sm cursor-pointer"><Link href="/admin/orders" className="flex items-center"><ListOrdered className="mr-2 h-4 w-4" />Orders</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-lg p-2 font-medium text-sm cursor-pointer"><Link href="/admin/products" className="flex items-center"><Wrench className="mr-2 h-4 w-4" />Products</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-lg p-2 font-medium text-sm cursor-pointer"><Link href="/admin/doctors" className="flex items-center"><BriefcaseMedical className="mr-2 h-4 w-4" />Doctors</Link></DropdownMenuItem>
                      </div>
                    )}
                    
                    <DropdownMenuSeparator className="opacity-50" />
                    <DropdownMenuItem onClick={handleLogout} className="rounded-lg p-2 font-medium text-sm text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="ghost" size="icon" className="text-primary hover:bg-primary/5 rounded-full">
                  <Link href="/login"><User className="h-5 w-5" /></Link>
                </Button>
              )}

              {isClient && (
                <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative hover:bg-primary/5 rounded-full focus-visible:ring-0">
                      <CartIcon />
                    </Button>
                  </SheetTrigger>
                  <CartDrawer />
                </Sheet>
              )}
            </div>

            <Button asChild className="hidden md:flex rounded-full px-6 font-medium shadow-sm bg-primary text-white hover:opacity-90">
                <Link href="/consultation">Book Now</Link>
            </Button>

            <Button variant="ghost" size="icon" className='md:hidden text-primary' onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
        </div>
      </div>
    </header>
    {isClient && <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}