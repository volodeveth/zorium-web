// src/app/layout-client.tsx
'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/transitions/page-transition';

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
      <Footer />
    </div>
  );
}