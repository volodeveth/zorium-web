'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/transitions/page-transition';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setIsTransitioning(true);
      // Даємо час для обробки реферального параметра
      setTimeout(() => {
        setIsTransitioning(false);
      }, 200);
    }
  }, [searchParams]);

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {!isTransitioning && (
            <PageTransition>{children}</PageTransition>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}