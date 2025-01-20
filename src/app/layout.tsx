import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@/styles/animations.css';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/transitions/page-transition';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://zorium.xyz'),
  title: {
    template: '%s',
    default: 'ZORIUM - Next Generation DeFi Platform'
  },
  description: 'Stake, earn rewards, and build your referral network with ZORIUM',
  applicationName: 'ZORIUM',
  keywords: ['DeFi', 'Staking', 'Cryptocurrency', 'Blockchain', 'Rewards', 'Referral'],
  authors: [{ name: 'ZORIUM Team' }],
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0B0D' },
    { media: '(prefers-color-scheme: light)', color: '#0A0B0D' }
  ],
  colorScheme: 'dark',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icons/zoriumlogo.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/zoriumlogo.svg',
      },
    ],
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  verification: {
    google: 'google-site-verification',
    other: {
      me: ['@zoriumtoken'],
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zorium.xyz',
    siteName: 'ZORIUM',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ZORIUM DeFi Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@zoriumtoken',
    creator: '@zoriumtoken',
    images: '/og-image.png',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://zorium.xyz',
  },
  assets: [
    'https://zorium.xyz/assets'
  ],
  category: 'finance',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={`${inter.variable}`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover" 
        />
        <meta 
          name="theme-color" 
          content="#0A0B0D" 
          media="(prefers-color-scheme: dark)" 
        />
        <meta 
          name="theme-color" 
          content="#0A0B0D" 
          media="(prefers-color-scheme: light)" 
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta 
          name="apple-mobile-web-app-status-bar-style" 
          content="black-translucent" 
        />
        <meta name="apple-mobile-web-app-title" content="ZORIUM" />
        <meta name="application-name" content="ZORIUM" />
        <meta name="msapplication-TileColor" content="#0A0B0D" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="format-detection" content="telephone=no" />

        {/* Preconnect to Important Origins */}
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/zoriumlogo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link 
          rel="manifest" 
          href="/manifest.json" 
          crossOrigin="use-credentials" 
        />

        {/* Preload Critical Assets */}
        <link
          rel="preload"
          as="image"
          href="/icons/zoriumlogo.svg"
          type="image/svg+xml"
        />
      </head>
      <body 
        className={`${inter.className} min-h-screen bg-background text-white antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            
            <main className="flex-1 mt-16">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <PageTransition>
                  {children}
                </PageTransition>
              </div>
            </main>
            
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}