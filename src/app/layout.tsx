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
  metadataBase: new URL('https://zorium.xyz'),
  title: 'ZORIUM - Next Generation DeFi Platform',
  description: 'Stake, earn rewards, and build your referral network with ZORIUM',
  applicationName: 'ZORIUM',
  keywords: ['DeFi', 'Staking', 'Cryptocurrency', 'Blockchain', 'Rewards', 'Referral'],
  authors: [{ name: 'ZORIUM Team' }],
  themeColor: '#0A0B0D',
  icons: {
    icon: '/icons/zoriumlogo.svg',
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
    title: 'ZORIUM - Next Generation DeFi Platform',
    description: 'Stake, earn rewards, and build your referral network with ZORIUM',
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
    title: 'ZORIUM - Next Generation DeFi Platform',
    description: 'Stake, earn rewards, and build your referral network with ZORIUM',
    site: '@zoriumtoken',
    creator: '@zoriumtoken',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  category: 'finance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={`${inter.variable}`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0A0B0D" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#0A0B0D" media="(prefers-color-scheme: light)" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ZORIUM" />
        <meta name="application-name" content="ZORIUM" />
        <meta name="msapplication-TileColor" content="#0A0B0D" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="format-detection" content="telephone=no" />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/zoriumlogo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />
      </head>
      <body 
        className={`${inter.className} min-h-screen bg-background text-white antialiased flex flex-col`}
        suppressHydrationWarning
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <PageTransition>
              <main className="flex-grow animate-fade-in pt-16 min-h-[calc(100vh-64px)]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
            </PageTransition>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}