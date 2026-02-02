
'use client';

import Link from 'next/link';
import { Logo } from '../icons/logo';
import { Facebook, Youtube, Instagram, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#6f3a2f] text-white overflow-hidden">
      {/* Decorative Top Border (Optional - adds a premium touch) */}
      <div className="h-1 w-full bg-white/10" />

      <div className="container mx-auto px-6 pt-20 pb-28 md:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Mission - 4 Columns */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="inline-block brightness-0 invert opacity-90 hover:opacity-100 transition-opacity">
              <Logo className="h-14 w-auto" />
            </Link>
            <p className="text-base text-white/70 leading-relaxed max-w-sm italic font-light">
              "Healing humanity through the timeless wisdom of Ayurveda, bringing balance to mind, body, and spirit."
            </p>
            <div className="flex gap-5">
              {[
                { icon: Facebook, href: "https://www.facebook.com/shreevarmaindia/" },
                { icon: Instagram, href: "https://www.instagram.com/shreevarma_tamil" },
                { icon: Youtube, href: "https://www.youtube.com/@SHREEVARMA_TV" }
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  className="p-3 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 transition-all hover:-translate-y-1"
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Links - 5 Columns Combined */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-8">
                Quick Links
              </h3>
              <ul className="space-y-4">
                {[
                  { label: 'About Us', href: '/about' },
                  { label: 'Contact Us', href: '/contact-us' },
                  { label: 'Book an Appointment', href: '/consultation' },
                  { label: 'Organisation', href: '/organisation' }
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-8">
                Our Policies
              </h3>
              <ul className="space-y-4">
                {['Privacy Policy', 'Terms & Conditions', 'Refunds & Cancellations', 'Shipping & Returns'].map((item) => (
                  <li key={item}>
                    <Link href={`/${item.toLowerCase().replace(/ & /g, '').replace(/ /g, '-')}`} className="text-sm text-white/60 hover:text-white hover:translate-x-1 inline-block transition-all">
                      {item.replace(' & ', ' and ')}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact "Glass" Card - 3 Columns */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10 backdrop-blur-sm">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-8">
                Contact Info
              </h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <MapPin className="h-5 w-5 text-white/40 shrink-0" />
                  <span className="text-sm text-white/80 leading-snug">
                    No. 3/195, PRV Building, Parthasarathy Nagar, Manapakkam, Chennai - 125
                  </span>
                </li>
                <li className="flex gap-4">
                  <Phone className="h-5 w-5 text-white/40 shrink-0" />
                  <span className="text-sm font-bold text-white/90">+91 95009 46631</span>
                </li>
                <li className="flex gap-4">
                  <Mail className="h-5 w-5 text-white/40 shrink-0" />
                  <a href="mailto:mainadmin@shreevarma.org" className="text-sm text-white/80 hover:text-white transition-colors break-all">
                    mainadmin@shreevarma.org
                  </a>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/20">
            &copy; {new Date().getFullYear()} Shreevarma's Wellness. All Rights Reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-white/20">
            <span>Ayurveda</span>
            <span>Yoga</span>
            <span>Naturopathy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
