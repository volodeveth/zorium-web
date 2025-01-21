// src/app/staking/page.tsx
import type { Metadata } from 'next';
import StakingClient from './staking-client';

export const metadata: Metadata = {
  title: 'Staking | ZORIUM',
  description: 'Stake your ZORIUM tokens and earn rewards with multipliers up to 300%. Choose flexible lock periods from 30 to 365 days and boost your earnings with level bonuses.',
  openGraph: {
    title: 'ZORIUM Staking - Earn Up To 300% APY',
    description: 'Stake ZORIUM tokens with flexible lock periods and earn up to 300% APY.',
    images: [{
      url: '/staking-og.png',
      width: 1200,
      height: 630,
      alt: 'ZORIUM Staking Platform'
    }]
  },
  keywords: [
    'ZORIUM staking',
    'crypto staking',
    'DeFi rewards',
    'yield farming',
    'staking rewards',
    'APY boost'
  ],
};

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function StakingPage() {
  return <StakingClient />;
}