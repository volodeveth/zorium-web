import type { Metadata } from 'next';
import TokenomicsClient from './tokenomics-client';

export const metadata: Metadata = {
  title: 'Tokenomics | ZORIUM',
  description: 'Explore ZORIUM tokenomics - distribution, deflationary mechanism, and allocation schedule.',
  keywords: [
    'ZORIUM tokenomics',
    'ZRM token',
    'token distribution',
    'deflationary token',
    'token allocation',
    'Zora Network token'
  ],
  openGraph: {
    title: 'ZORIUM Tokenomics - Explore ZORIUM token distribution and mechanics',
    description: 'Explore ZORIUM tokenomics - distribution, deflationary mechanism, and allocation schedule.',
    images: [{
      url: '/tokenomics-og.png',
      width: 1200,
      height: 630,
      alt: 'ZORIUM Tokenomics'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZORIUM Tokenomics - Explore ZORIUM token distribution and mechanics',
    description: 'Explore ZORIUM tokenomics - distribution, deflationary mechanism, and allocation schedule.',
    images: ['/tokenomics-og.png']
  }
};

export default function TokenomicsPage() {
  return <TokenomicsClient />;
}