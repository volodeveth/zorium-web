'use client';

import React from 'react';
import { useAccount } from 'wagmi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useZorium } from '@/hooks/useZorium';
import { 
  Users, 
  Link as LinkIcon, 
  Copy, 
  Gift, 
  User, 
  CheckCircle2, 
  BadgePercent, 
  Shield,
  Clock, 
  Loader2,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { LevelProgress } from '@/components/ui/level-progress';
import { type ReferralInfo } from '@/hooks/useZorium';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Referral Program | ZORIUM - Earn From Your Network',
  description: 'Join ZORIUM's three-level referral program. Earn up to 15% from direct referrals and additional rewards from your entire referral network.'
};


interface ReferralStats {
  level: number;
  count: number;
  activeCount: number;
  totalEarned: string;
  pendingRewards: string;
}

interface ReferralCardProps {
  info: ReferralInfo;
  isLoading?: boolean;
}

const ReferralCard = ({ info, isLoading }: ReferralCardProps) => {
  const formatDate = (timestamp: number) => new Date(timestamp * 1000).toLocaleString();

  if (isLoading) {
    return (
      <Card className="overflow-hidden animate-pulse">
        <div className="p-4 space-y-4">
          <div className="h-8 w-48 bg-gray-800 rounded"></div>
          <div className="h-6 w-32 bg-gray-800 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:border-primary/30 transition-colors">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                {`${info.address.slice(0, 6)}...${info.address.slice(-4)}`}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${info.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-gray-400">{info.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{info.level} Level</p>
            <p className="text-xs text-gray-400">{info.amount} ZRM Staked</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Staking since {formatDate(info.since)}</span>
        </div>
      </div>
    </Card>
  );
};

const ReferralLevelStats = ({ 
  title,
  stats,
  isActive = true
}: { 
  title: string;
  stats: ReferralStats;
  isActive?: boolean;
}) => (
  <Card className="relative overflow-hidden">
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <BadgePercent className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-lg">{title}</h3>
          <p className="text-sm text-gray-400">
            {isActive ? `${stats.activeCount} active out of ${stats.count} total` : 'Coming Soon'}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-2xl font-bold text-primary">
            {isActive ? `${stats.pendingRewards} ZRM` : '0'}
          </p>
          <p className="text-sm text-gray-400">Pending Rewards</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">
            {isActive ? `${stats.totalEarned} ZRM` : '0'}
          </p>
          <p className="text-sm text-gray-400">Total Earned</p>
        </div>
      </div>
      
      {isActive && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Commission Rate</span>
            <span className="font-medium">{15 - (stats.level * 7)}%</span>
          </div>
        </div>
      )}
    </div>
  </Card>
);

const ClaimInfoCard = ({ isLocked, timeRemaining, totalRewards }: { 
  isLocked: boolean; 
  timeRemaining: number;
  totalRewards: string;
}) => (
  <Card className="mb-8">
    <div className="p-6">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-lg mt-1">
          <AlertCircle className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Rewards Claim Information</h3>
          <p className="text-gray-400 mb-4">
            Referral rewards are claimed together with staking rewards. You can claim your rewards:
          </p>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              After your stake lock period ends
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              Both staking and referral rewards are claimed in a single transaction
            </li>
            {isLocked && (
              <li className="flex items-center gap-2 text-primary">
                <Clock className="w-4 h-4" />
                {`Unlock in ${Math.ceil(timeRemaining / 86400)} days`}
              </li>
            )}
          </ul>
          
          {Number(totalRewards) > 0 && (
            <div className="mt-4 flex items-center gap-4">
              <Link href="/staking" passHref>
                <Button className="w-full sm:w-auto">
                  Go to Staking Page to Claim
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <p className="text-sm text-gray-400">
                Total Available: {totalRewards} ZRM
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </Card>
);

export default function Page() {
  const { address } = useAccount();
  const { userStats, referralInfo } = useZorium();
  const [copied, setCopied] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const referralLink = `https://zorium.xyz?ref=${address}`;
  const activeReferrals = referralInfo.referrals?.filter(r => r.isActive) || [];
  
  // Calculate total referral bonus
  const totalPendingRewards = userStats?.stakeInfo
    ? Number(userStats.stakeInfo.referralBonus)
    : 0;

  // Example referral stats (you'll need to implement actual data collection)
  const referralStats: ReferralStats[] = [
    {
      level: 0,
      count: activeReferrals.length,
      activeCount: activeReferrals.length,
      totalEarned: '0',
      pendingRewards: userStats?.stakeInfo?.referralBonus || '0'
    },
    {
      level: 1,
      count: 0,
      activeCount: 0,
      totalEarned: '0',
      pendingRewards: '0'
    },
    {
      level: 2,
      count: 0,
      activeCount: 0,
      totalEarned: '0',
      pendingRewards: '0'
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) return null;

  if (!address) {
    return (
      <section className="container mx-auto px-4 pt-24">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">Connect your wallet to continue</h1>
          <p className="text-gray-400 text-center mb-8">
            You need to connect your wallet to access the referral program
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Referral Program</h1>
        <p className="text-gray-400">
          Invite friends to ZORIUM and earn rewards from their staking activities
        </p>
      </div>

      {/* Claim Information */}
      {userStats?.stakeInfo && (
        <ClaimInfoCard 
          isLocked={userStats.stakeInfo.isLocked}
          timeRemaining={userStats.stakeInfo.timeRemaining}
          totalRewards={userStats.stakeInfo.referralBonus}
        />
      )}

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

          {totalPendingRewards > 0 && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Gift className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Total Pending Rewards</p>
                    <p className="text-sm text-gray-400">
                      Claim available after stake unlock
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">
                    {userStats?.stakeInfo?.referralBonus} ZRM
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Level Stats */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Referral Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {referralStats.map((stats, index) => (
            <ReferralLevelStats
              key={index}
              title={`Level ${index + 1} Referrals`}
              stats={stats}
              isActive={index === 0} // Only level 1 is currently active
            />
          ))}
        </div>
      </div>

      {/* Your Level */}
      {userStats && (
        <div className="mb-8">
          <LevelProgress
            level={userStats.level}
            progress={userStats.levelProgress}
            currentAmount={userStats.totalStaked}
            nextThreshold={userStats.nextLevelThreshold}
            bonus={userStats.stakeInfo?.levelBonus}
          />
        </div>
      )}

      {/* Your Referrals */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Referrals</h2>
        {userStats?.isActive ? (
          referralInfo.isLoadingReferrals ? (
            <div className="flex justify-center py-12">
              <div className="flex items-center gap-2 text-primary">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Loading referrals...</span>
              </div>
            </div>
          ) : referralInfo.referrals && referralInfo.referrals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {referralInfo.referrals.map((referral) => (
                <ReferralCard 
                  key={referral.address} 
                  info={referral}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Gift className="w-12 h-12 text-primary/50 mx-auto mb-4" />
              <p className="text-gray-400">
                Share your referral link to start earning rewards
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Earn up to 15% from your referrals' rewards
              </p>
            </Card>
          )
        ) : (
          <Card className="p-12 text-center">
            <Shield className="w-12 h-12 text-primary/50 mx-auto mb-4" />
            <p className="text-gray-400">
              Stake at least 100 ZRM to activate referral program
            </p>
            <Link href="/staking" passHref>
              <Button className="mt-4">
                Go to Staking
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Requirements */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Requirements & Benefits</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg mt-1">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Minimum Stake Required</p>
                  <p className="text-sm text-gray-400">
                    Need at least 100 ZRM staked to become a referrer
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg mt-1">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Active Stake</p>
                  <p className="text-sm text-gray-400">
                    Must maintain an active stake to earn referral rewards
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg mt-1">
                  <Gift className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Referral Bonus</p>
                  <p className="text-sm text-gray-400">
                    Your referrals get 10% extra rewards on their stakes
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg mt-1">
                  <BadgePercent className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Commission Rates</p>
                  <p className="text-sm text-gray-400">
                    Earn 15% from direct referrals, 8% from level 2, and 5% from level 3
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}