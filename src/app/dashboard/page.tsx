'use client';

import React from 'react';
import { useAccount } from 'wagmi';
import { useZorium } from '@/hooks/useZorium';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  Clock, 
  Users, 
  TrendingUp, 
  Gift, 
  ChevronRight 
} from 'lucide-react';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
  isLoading?: boolean;
}

const StatCard = ({ title, value, icon, description, isLoading }: StatCardProps) => (
  <Card className="relative overflow-hidden group">
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          {isLoading ? (
            <div className="h-8 w-32 bg-gray-800 animate-pulse rounded" />
          ) : (
            <p className="text-2xl font-bold">{value}</p>
          )}
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
    {/* Gradient border effect on hover */}
    <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="absolute inset-px rounded-xl bg-gradient-to-r from-primary to-primary-hover" />
    </div>
  </Card>
);

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const ActionCard = ({ title, description, icon, href }: ActionCardProps) => (
  <Link href={href}>
    <Card className="group cursor-pointer transition-all hover:scale-[1.02]">
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-primary to-primary-hover rounded-xl">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Card>
  </Link>
);

export default function Dashboard() {
  const { address, isConnecting } = useAccount();
  const { stats, userStats } = useZorium();

  if (!address) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-24">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-2xl font-bold mb-4">Connect your wallet to continue</h1>
            <p className="text-gray-400 text-center mb-8">
              You need to connect your wallet to access the dashboard and start earning rewards
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">
            Overview of your staking and referral performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title="Your Stake"
            value={`${userStats?.stakedAmount ?? '0'} ZRM`}
            icon={<Wallet className="w-6 h-6 text-primary" />}
            isLoading={isConnecting}
          />
          <StatCard 
            title="Lock Period"
            value={userStats?.lockPeriod ? `${userStats.lockPeriod} Days` : 'No Active Stake'}
            icon={<Clock className="w-6 h-6 text-primary" />}
            isLoading={isConnecting}
          />
          <StatCard 
            title="Referrals"
            value={`${userStats?.referralCount ?? '0'}`}
            icon={<Users className="w-6 h-6 text-primary" />}
            description="Active referrals"
            isLoading={isConnecting}
          />
          <StatCard 
            title="Pending Rewards"
            value={`${userStats?.pendingRewards ?? '0'} ZRM`}
            icon={<Gift className="w-6 h-6 text-primary" />}
            isLoading={isConnecting}
          />
        </div>

        {/* Level Progress */}
        <Card className="mb-12">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Your Level</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold mb-1">
                  {userStats?.level ?? 'Bronze'} Level
                </p>
                <p className="text-sm text-gray-400">
                  Stake more ZORIUM to unlock better rewards
                </p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary-hover"
                style={{ width: `${userStats?.levelProgress ?? 0}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <span>Current: {userStats?.stakedAmount ?? 0} ZRM</span>
              <span>Next Level: {userStats?.nextLevelThreshold ?? '1,000,000'} ZRM</span>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActionCard 
            title="Stake Tokens"
            description="Lock your tokens and earn rewards"
            icon={<Wallet className="w-6 h-6 text-white" />}
            href="/staking"
          />
          <ActionCard 
            title="Referral Program"
            description="Invite friends and earn additional rewards"
            icon={<Users className="w-6 h-6 text-white" />}
            href="/referral"
          />
        </div>
      </main>
    </div>
  );
}