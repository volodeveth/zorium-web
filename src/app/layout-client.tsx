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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500); // Даємо час на обробку реферального параметра
      return () => {
        clearTimeout(timer);
        setIsLoading(false);
      };
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  // Додатковий ефект для відстеження зміни pathname
  useEffect(() => {
    if (pathname && isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Обробка монтування компонента
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <PageTransition>{children}</PageTransition>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}