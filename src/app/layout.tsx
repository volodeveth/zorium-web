import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { PageTransition } from '@/components/transitions/page-transition';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ZORIUM - Next Generation DeFi Platform',
  description: 'Stake, earn rewards, and build your referral network with ZORIUM',
  themeColor: '#282c34',
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
      <body className={`${inter.className} min-h-screen bg-[#282c34] text-white antialiased`}>
        <Providers>
          <Header />
          <PageTransition>
            <main className="pt-16 min-h-screen">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </PageTransition>
        </Providers>
      </body>
    </html>
  );
}