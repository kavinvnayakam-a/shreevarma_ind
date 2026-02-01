
import Link from 'next/link';
import { Logo } from '../icons/logo';
import { Github, Twitter, Facebook, Youtube, Instagram } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export function Footer() {
  return (
    <footer className="bg-card border-t z-10">
      <div className="container mx-auto px-6 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Logo className="h-12 w-48" />
            </Link>
            <p className="text-muted-foreground mb-4">
              Get the latest updates and offers.
            </p>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="email" placeholder="Your email address" />
              <Button type="submit">Subscribe</Button>
            </div>
             <div className="flex space-x-4 mt-4">
              <Link href="https://www.facebook.com/shreevarmaindia/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Facebook />
              </Link>
               <Link href="https://x.com/shreevarmaindia" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Twitter />
              </Link>
              <Link href="https://www.instagram.com/shreevarma_tamil" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Instagram />
              </Link>
              <Link href="https://www.youtube.com/@SHREEVARMA_TV" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Youtube />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold tracking-wider uppercase mb-4 font-headline">
              Quick Links
            </h3>
            <ul>
              <li className="mb-2">
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/contact-us" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/consultation" className="text-muted-foreground hover:text-foreground">
                  Book an Appointment
                </Link>
              </li>
               <li className="mb-2">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold tracking-wider uppercase mb-4 font-headline">
              Our Policies
            </h3>
            <ul>
              <li className="mb-2">
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/terms-and-conditions" className="text-muted-foreground hover:text-foreground">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/refunds-and-cancellations" className="text-muted-foreground hover:text-foreground">
                  Refunds &amp; Cancellations
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/shipping-and-return-policy" className="text-muted-foreground hover:text-foreground">
                  Shipping &amp; Return Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold tracking-wider uppercase mb-4 font-headline">
              Contact Info
            </h3>
            <ul className="text-muted-foreground space-y-2">
                <li>No. 3/195, PRV Building, Parthasarathy Nagar, Poonamallee Mount High Road, Manapakkam, Chennai - 600 125</li>
                <li>+91 9500946631 / +91 9500946632</li>
                <li>mainadmin@shreevarma.org</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Shreevarma's Wellness. All
            Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
