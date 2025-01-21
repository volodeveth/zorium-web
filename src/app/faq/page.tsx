// src/app/faq/page.tsx
import type { Metadata } from 'next';
import FAQClient from './faq-client';

export const metadata: Metadata = {
  title: 'FAQ | ZORIUM',
  description: 'Find answers to common questions about ZORIUM platform, including staking mechanics, reward calculations, referral system, and platform features.',
  keywords: [
    'ZORIUM FAQ',
    'DeFi help',
    'staking guide',
    'crypto help',
    'ZORIUM help',
    'referral guide',
    'staking FAQ'
  ],
  openGraph: {
    title: 'ZORIUM FAQ - Complete Platform Guide',
    description: 'Find answers to common questions about ZORIUM platform features and mechanics.',
    images: [{
      url: '/faq-og.png',
      width: 1200,
      height: 630,
      alt: 'ZORIUM FAQ Guide'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZORIUM FAQ - Complete Platform Guide',
    description: 'Find answers to common questions about ZORIUM platform features and mechanics.',
    images: ['/faq-og.png']
  }
};

export default function FAQPage() {
  return <FAQClient />;
}