'use client';

export const dynamic = 'force-dynamic'
export const revalidate = 0

import React from 'react';
import { useAccount } from 'wagmi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useZorium } from '@/hooks/useZorium';
import { Wallet, Clock, Users, Gift, TrendingUp, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { LevelProgress } from '@/components/ui/level-progress';
import { UnlockTimer } from '@/components/ui/unlock-timer';
import { StakeStats } from '@/components/ui/stake-stats';

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

export default function Page() {
  const { address } = useAccount();
  const { stats, userStats, actions, referralInfo } = useZorium();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!address) {
    return (
      <section className="container mx-auto px-4 pt-24">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">Connect your wallet to continue</h1>
          <p className="text-gray-400 text-center mb-8">
            You need to connect your wallet to access the dashboard
          </p>
        </div>
      </section>
    );
  }

  const totalPendingRewards = userStats?.stakeInfo
    ? (Number(userStats.stakeInfo.pendingRewards) + Number(userStats.stakeInfo.referralBonus)).toFixed(2)
    : '0';

  return (
    <section className="container mx-auto px-4 pt-24">
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
          value={`${userStats?.totalStaked ?? '0'} ZRM`}
          icon={<Wallet className="w-6 h-6 text-primary" />}
        />
        <StatCard 
          title="Lock Period"
          value={userStats?.stakeInfo ? `${Math.floor(userStats.stakeInfo.lockPeriod / 86400)} Days` : 'No Active Stake'}
          icon={<Clock className="w-6 h-6 text-primary" />}
        />
        <StatCard 
          title="Referrals"
          value={userStats?.referralCount?.toString() ?? '0'}
          description={`${referralInfo.referrals?.filter(r => r.isActive).length || 0} Active`}
          icon={<Users className="w-6 h-6 text-primary" />}
        />
        <StatCard 
          title="Pending Rewards"
          value={`${totalPendingRewards} ZRM`}
          icon={<Gift className="w-6 h-6 text-primary" />}
          description={userStats?.stakeInfo?.referralBonus && 
            Number(userStats.stakeInfo.referralBonus) > 0 
              ? `Including ${userStats.stakeInfo.referralBonus} ZRM from Referrals` 
              : undefined}
        />
      </div>

      {/* Level Progress */}
      {userStats && (
        <div className="mb-12">
          <LevelProgress
            level={userStats.level}
            progress={userStats.levelProgress}
            currentAmount={userStats.totalStaked}
            nextThreshold={userStats.nextLevelThreshold}
            bonus={userStats.stakeInfo?.levelBonus}
          />
        </div>
      )}

      {/* Active Stake Info */}
      {userStats?.stakeInfo ? (
        <div className="space-y-6 mb-12">
          <StakeStats
            amount={userStats.stakeInfo.totalAmount}
            multiplier={userStats.stakeInfo.multiplier}
            periodDays={Math.floor(userStats.stakeInfo.lockPeriod / 86400)}
            pendingRewards={userStats.stakeInfo.pendingRewards}
            levelBonus={userStats.stakeInfo.levelBonus}
            referralBonus={userStats.stakeInfo.referralBonus}
          />

          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {Number(totalPendingRewards) > 0 && !userStats.stakeInfo.isLocked && (
                <Button onClick={() => actions.claim()} className="flex-1">
                  Claim {totalPendingRewards} ZRM
                </Button>
              )}
              {!userStats.stakeInfo.isLocked && (
                <Button 
                  variant="outline" 
                  onClick={() => actions.unstake()}
                  className="flex-1"
                >
                  Unstake {userStats.stakeInfo.totalAmount} ZRM
                </Button>
              )}
            </div>

            {userStats.stakeInfo.isLocked && (
              <div className="mt-4">
                <UnlockTimer
                  timeRemaining={userStats.stakeInfo.timeRemaining}
                  unlockTime={userStats.stakeInfo.unlockTime}
                  className="justify-center"
                />
              </div>
            )}
          </Card>
        </div>
      ) : (
        <Card className="mb-12 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">No Active Stake</h3>
              <p className="text-sm text-gray-400">
                Start staking to earn rewards and increase your level
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Global Stats */}
      <Card className="mb-12">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Global Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Value Staked</p>
              <p className="text-2xl font-bold">{stats.totalStaked} ZRM</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Reward Pool</p>
              <p className="text-2xl font-bold">{stats.rewardPool} ZRM</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Burned</p>
              <p className="text-2xl font-bold">{stats.totalBurned} ZRM</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div>
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
      </div>
    </section>
  );
}