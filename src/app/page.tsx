// src/app/page.tsx
import type { Metadata } from 'next';
import HomeClient from './home-client';

export const metadata: Metadata = {
  title: 'ZORIUM - Next Generation DeFi Platform',
  description: 'Stake tokens, earn up to 300% APY, and build your referral network with ZORIUM - the revolutionary DeFi platform on Zora Network.',
  openGraph: {
    title: 'ZORIUM - Revolutionary DeFi Platform',
    description: 'Stake tokens, earn up to 300% APY, and build your referral network with ZORIUM.',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'ZORIUM DeFi Platform'
    }]
  }
};

export default function HomePage() {
  return <HomeClient />;
}