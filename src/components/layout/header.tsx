
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, Search, ChevronDown, Wrench, LogOut, Image as ImageIcon, BriefcaseMedical, Users, ListOrdered, Palette } from 'lucide-react';
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
      console.error('Logout failed:', error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'Could not log you out. Please try again.',
      });
    }
  };


  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-6">
        <div className="flex flex-1 items-center justify-start md:hidden">
            {isClient && <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <SheetHeader>
                  <SheetTitle className="sr-only">Main Menu</SheetTitle>
                </SheetHeader>
                <Link href="/" className="mr-6 flex items-center space-x-2">
                  <Logo className="h-10 w-40" />
                </Link>
                <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                  <div className="flex flex-col space-y-3">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href + link.label}
                        href={link.href}
                        className="text-foreground"
                      >
                        {link.label}
                      </Link>
                    ))}
                     <span className="font-medium">About</span>
                      {aboutLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="pl-4 text-foreground/80"
                        >
                          {link.label}
                        </Link>
                      ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>}
        </div>
        
        <div className="hidden md:flex flex-1 items-center space-x-4">
             {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                    <Link
                        key={link.href + link.label}
                        href={link.href}
                        className={cn("transition-colors hover:text-primary text-foreground/80 text-sm font-medium", {
                            "text-primary": isActive,
                        })}
                    >
                        {link.label}
                    </Link>
                )
              })}
              {isClient && <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1 transition-colors hover:text-primary text-foreground/80 text-sm font-medium p-0 h-auto hover:bg-transparent">
                        About
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    {aboutLinks.map(link => (
                        <DropdownMenuItem key={link.href} asChild>
                            <Link href={link.href}>{link.label}</Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>}
        </div>

        <div className="flex-initial justify-center items-center px-4 md:px-0">
            <Link href="/" className="flex items-center">
              <Logo className="h-12 w-auto" />
            </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-1">
             <div className='w-full max-w-xs hidden md:block'>
                <DesktopSearch />
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              {!isUserLoading && user && isClient ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                       <Avatar className="h-8 w-8">
                          <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                          <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile"><User className="mr-2" />Profile</Link>
                    </DropdownMenuItem>
                    
                    {userRole === 'super' && (
                      <>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/orders"><ListOrdered className="mr-2" />Orders</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/products"><Wrench className="mr-2" />Products</Link>
                        </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                            <Link href="/admin/theme-editor"><Palette className="mr-2" />Theme Editor</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/doctor-dashboard"><BriefcaseMedical className="mr-2" />Doctor Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/doctors"><BriefcaseMedical className="mr-2" />Doctors</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/media"><ImageIcon className="mr-2" />Media</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/contacts"><Users className="mr-2" />Contacts</Link>
                        </DropdownMenuItem>
                      </>
                    )}

                     {userRole === 'healthcare' && (
                       <>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/orders"><ListOrdered className="mr-2" />Orders</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/products"><Wrench className="mr-2" />Products</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                      <LogOut className="mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="ghost" size="icon">
                  <Link href="/login">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Login</span>
                  </Link>
                </Button>
              )}
            </div>

            <div className="hidden md:block">
              {isClient && <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <CartIcon />
                  </Button>
                </SheetTrigger>
                <CartDrawer />
              </Sheet>}
            </div>
            <Button asChild className="hidden md:flex ml-2">
                <Link href="/consultation">Book Now</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className='md:hidden'
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
        </div>
      </div>
    </header>
    {isClient && <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}
