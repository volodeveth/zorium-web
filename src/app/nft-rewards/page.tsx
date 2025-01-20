'use client';

import type { Metadata } from 'next';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'NFT Rewards | ZORIUM - Claim Your NFT Benefits',
  description: 'Claim exclusive rewards for holding ZORIUM NFTs. Access special benefits and boost your earnings through our NFT rewards program.',
  openGraph: {
    title: 'NFT Rewards | ZORIUM',
    description: 'Claim exclusive rewards for holding ZORIUM NFTs',
    images: ['/nft-rewards-og.png'],
  }
};

export default function Page() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="container mx-auto px-4 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">NFT Rewards</h1>
        <p className="text-gray-400">
          Claim rewards for your Zorium NFTs
        </p>
      </div>

      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-6">
          <Gift className="w-16 h-16 text-primary" />
          <div>
            <h2 className="text-2xl font-bold mb-2">NFT Rewards Available</h2>
            <p className="text-gray-400 mb-6">
              You can now claim your rewards for holding Zorium NFTs on our dedicated rewards platform.
            </p>
            <Button 
              onClick={() => window.open('https://www.stack.so/leaderboard/zoriumairdropr5leaderboard', '_blank')}
              size="lg"
              className="inline-flex items-center gap-2"
            >
              Claim Rewards
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Coming Soon Section */}
      <Card className="mt-8 p-8">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Coming Soon</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* NFT Staking */}
            <div className="p-6 rounded-lg bg-primary/5">
              <Gift className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">NFT Staking</h3>
              <p className="text-sm text-gray-400">
                Stake your Zorium NFTs to earn additional rewards and exclusive benefits
              </p>
            </div>

            {/* Reward Multipliers */}
            <div className="p-6 rounded-lg bg-primary/5">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Reward Multipliers</h3>
              <p className="text-sm text-gray-400">
                Get increased staking rewards based on your NFT rarity level
              </p>
            </div>

            {/* Exclusive Access */}
            <div className="p-6 rounded-lg bg-primary/5">
              <Lock className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Exclusive Access</h3>
              <p className="text-sm text-gray-400">
                Get early access to new features and special events
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Notification Section */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400">
          Want to stay updated about new NFT rewards?{' '}
          <a 
            href="https://t.me/zoriumtoken" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-hover transition-colors"
          >
            Join our Telegram
          </a>
        </p>
      </div>
    </section>
  );
}