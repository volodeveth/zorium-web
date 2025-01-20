'use client';

export const dynamic = 'force-dynamic'
export const revalidate = 0

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, ExternalLink } from 'lucide-react';

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
    </section>
  );
}