'use client';

import React from 'react';
import { useAccount } from 'wagmi';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useZorium } from '@/hooks/useZorium';
import { 
  Users, 
  Link as LinkIcon, 
  Copy, 
  Gift, 
  ArrowRight,
  CheckCircle2,
  User
} from 'lucide-react';

interface ReferralCardProps {
  address: string;
  pendingRewards: string;
  totalRewards: string;
  lastUpdate: string;
}

const ReferralCard = ({ address, pendingRewards, totalRewards, lastUpdate }: ReferralCardProps) => (
  <Card className="overflow-hidden">
    <div className="p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">
              {`${address.slice(0, 6)}...${address.slice(-4)}`}
            </span>
            <span className="text-sm text-gray-400">Referred User</span>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Claim
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-400 mb-1">Pending</p>
          <p className="font-medium">{pendingRewards} ZRM</p>
        </div>
        <div>
          <p className="text-gray-400 mb-1">Total Earned</p>
          <p className="font-medium">{totalRewards} ZRM</p>
        </div>
      </div>
    </div>
  </Card>
);

const ReferralLevelCard = ({ level, percent, icon: Icon }: { 
  level: string;
  percent: number;
  icon: React.ElementType;
}) => (
  <Card className="relative overflow-hidden">
    <div className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="font-medium">{level}</span>
      </div>
      <p className="text-2xl font-bold mb-1">{percent}%</p>
      <p className="text-sm text-gray-400">Commission Rate</p>
    </div>
  </Card>
);

export default function Referral() {
  const { address } = useAccount();
  const [copied, setCopied] = React.useState(false);
  const referralLink = `https://zorium.network/ref/${address}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-24">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-2xl font-bold mb-4">Connect your wallet to continue</h1>
            <p className="text-gray-400 text-center mb-8">
              You need to connect your wallet to access the referral program
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Referral Program</h1>
            <p className="text-gray-400">
              Invite friends to ZORIUM and earn rewards from their staking activities
            </p>
          </div>

          {/* Referral Link Card */}
          <Card className="mb-8">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <LinkIcon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Your Referral Link</h2>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-background p-3 rounded-lg border border-gray-800">
                  <p className="text-gray-400 font-mono text-sm break-all">
                    {referralLink}
                  </p>
                </div>
                <Button 
                  variant="outline"
                  onClick={copyToClipboard}
                  className="min-w-[120px]"
                >
                  {copied ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Copy className="w-4 h-4" />
                      Copy
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Commission Rates */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Commission Rates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ReferralLevelCard 
                level="Level 1 Referrals" 
                percent={15} 
                icon={Users}
              />
              <ReferralLevelCard 
                level="Level 2 Referrals" 
                percent={8} 
                icon={Users}
              />
              <ReferralLevelCard 
                level="Level 3 Referrals" 
                percent={5} 
                icon={Users}
              />
            </div>
          </div>

          {/* Stats Overview */}
          <Card className="mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Stats Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Referrals</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Pending Rewards</p>
                  <p className="text-2xl font-bold">1,234 ZRM</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Earned</p>
                  <p className="text-2xl font-bold">5,678 ZRM</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Referrals List */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Referrals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReferralCard 
                address="0x1234...5678"
                pendingRewards="123.45"
                totalRewards="456.78"
                lastUpdate="2024-01-01"
              />
              <ReferralCard 
                address="0x8765...4321"
                pendingRewards="98.76"
                totalRewards="234.56"
                lastUpdate="2024-01-02"
              />
              {/* Add more ReferralCards as needed */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}