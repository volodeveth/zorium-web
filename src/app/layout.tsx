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
});

export const metadata: Metadata = {
  title: 'ZORIUM - Next Generation DeFi Platform',
  description: 'Stake, earn rewards, and build your referral network with ZORIUM',
  themeColor: '#0A0B0D',
  icons: {
    icon: '/favicon.ico',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zorium.network',
    title: 'ZORIUM - Next Generation DeFi Platform',
    description: 'Stake, earn rewards, and build your referral network with ZORIUM',
    siteName: 'ZORIUM',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-white antialiased flex flex-col`}>
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