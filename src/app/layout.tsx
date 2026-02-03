
import type { Metadata, ResolvingMetadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import AppContent from './AppContent';
import { Montserrat } from 'next/font/google';
import { cn } from '@/lib/utils';
import {notFound} from 'next/navigation';
import Script from 'next/script';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const faviconUrl = 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Icons%20%26%20Logos%2FLOGO.png?alt=media&token=7193bfde-a319-49ee-8a77-2bcf1af97553';
const socialImageUrl = 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Social%20Sharing%2FSocail%20Sharing%20image%202.png?alt=media&token=75b2183a-2769-4473-926b-f83948dd356d';

export const metadata: Metadata = {
  title: {
    default: "Shreevarma's Wellness | Authentic Ayurvedic Products & Online Doctor Consultation",
    template: "%s | Shreevarma's Wellness",
  },
  description: 'Discover a world of natural wellness with Shreevarma\'s Wellness. Shop premium Ayurvedic products for health, hair, and skin. Get expert online doctor consultations with certified practitioners.',
  keywords: ['Ayurveda', 'Ayurvedic products', 'online doctor consultation', 'herbal medicine', 'natural wellness', 'Shreevarma'],
  openGraph: {
    title: "Shreevarma's Wellness | Authentic Ayurvedic Products & Online Doctor Consultation",
    description: 'Shop premium Ayurvedic products and get expert online doctor consultations for holistic health and wellness.',
    images: [
      {
        url: socialImageUrl,
        width: 1200,
        height: 630,
        alt: "Shreevarma's Wellness",
      },
    ],
    type: 'website',
    url: 'https://app.shreevarma.org',
    siteName: "Shreevarma's Wellness",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Shreevarma's Wellness | Authentic Ayurvedic Products & Online Doctor Consultation",
    description: 'Shop premium Ayurvedic products and get expert online doctor consultations for holistic health and wellness.',
    images: [socialImageUrl],
  },
};

declare global {
    interface Window {
        cashfreeSDKLoaded?: boolean;
        Cashfree: any;
        dataLayer: any[];
    }
}

const GA_MEASUREMENT_ID = 'G-P76CQCWZBP'; // IMPORTANT: Replace with your actual Google Analytics Measurement ID

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(montserrat.variable)}>
      <head>
        <link rel="icon" href={faviconUrl} type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href={faviconUrl} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#703a2f" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#703a2f" />
        
        {/* Google Analytics & Google Tag Manager */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className="font-body antialiased flex min-h-dvh flex-col pb-20 md:pb-0">
        <FirebaseClientProvider>
          <AppContent>{children}</AppContent>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
