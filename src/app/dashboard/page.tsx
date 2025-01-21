// src/app/dashboard/page.tsx
import type { Metadata } from 'next';
import DashboardClient from './dashboard-client';

export const metadata: Metadata = {
  title: 'Dashboard | ZORIUM',
  description: 'Monitor your ZORIUM staking performance, track rewards, manage stakes and check referral earnings in real-time.',
  openGraph: {
    title: 'ZORIUM Dashboard - Track Your Performance',
    description: 'Monitor your ZORIUM investments and rewards in real-time.',
    images: [{
      url: '/dashboard-og.png',
      width: 1200,
      height: 630,
      alt: 'ZORIUM Dashboard'
    }]
  }
};

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function DashboardPage() {
  return <DashboardClient />;
}