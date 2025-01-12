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
  themeColor: '#0A0B0D',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
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
    images: ['/og-image.png'],
    creator: '@zoriumtoken',
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0A0B0D" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body 
        className={`${inter.className} min-h-screen bg-background text-white antialiased flex flex-col`}
        suppressHydrationWarning
      >
        <Providers>
          <Header />
          <PageTransition>
            <main className="flex-grow animate-fade-in pt-16 min-h-[calc(100vh-64px)]">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </PageTransition>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}