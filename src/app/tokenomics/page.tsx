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
};

export default function TokenomicsPage() {
  return <TokenomicsClient />;
}