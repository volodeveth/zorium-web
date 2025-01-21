// src/app/referral/page.tsx
import type { Metadata } from 'next';
import ReferralClient from './referral-client';

export const metadata: Metadata = {
  title: 'Referral Program | ZORIUM',
  description: 'Join ZORIUM\'s three-level referral program. Earn up to 15% from direct referrals, 8% from level 2, and 5% from level 3 referrals. Build your network and maximize your earnings.',
  keywords: [
    'ZORIUM referral',
    'crypto referral',
    'DeFi referrals',
    'referral rewards',
    'passive income',
    'referral network',
    'multi-level rewards'
  ],
  openGraph: {
    title: 'ZORIUM Referral Program - Multiply Your Earnings',
    description: 'Build your network and earn up to 15% from referrals with our multi-level system.',
    images: [{
      url: '/referral-og.png',
      width: 1200,
      height: 630,
      alt: 'ZORIUM Referral Program'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZORIUM Referral Program',
    description: 'Build your network and earn additional rewards with our multi-level referral system.',
    images: ['/referral-og.png']
  }
};

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function ReferralPage() {
  return <ReferralClient />;
}