// src/app/nft-rewards/page.tsx
import type { Metadata } from 'next';
import NFTRewardsClient from './nft-rewards-client';

export const metadata: Metadata = {
  title: 'NFT Rewards | ZORIUM',
  description: 'Claim exclusive rewards and special benefits for holding ZORIUM NFTs. Access unique features and boost your earnings through our NFT rewards program.',
  keywords: [
    'ZORIUM NFT',
    'NFT rewards',
    'crypto NFT',
    'DeFi NFT',
    'NFT benefits',
    'NFT staking',
    'exclusive rewards'
  ],
  openGraph: {
    title: 'ZORIUM NFT Rewards - Exclusive Benefits',
    description: 'Access exclusive benefits and boost your earnings with ZORIUM NFTs.',
    images: [{
      url: '/nft-rewards-og.png',
      width: 1200,
      height: 630,
      alt: 'ZORIUM NFT Rewards'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZORIUM NFT Rewards',
    description: 'Access exclusive benefits and boost your earnings with ZORIUM NFTs.',
    images: ['/nft-rewards-og.png']
  }
};

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function NFTRewardsPage() {
  return <NFTRewardsClient />;
}