'use client';

import React from 'react';
import { useAccount } from 'wagmi';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { parseEther, formatEther } from 'viem';
import { useZorium } from '@/hooks/useZorium';
import { Lock, Timer, Coins, ArrowRight, Clock, TrendingUp } from 'lucide-react';

const STAKING_PERIODS = [
  { days: 30, multiplier: 100 },
  { days: 90, multiplier: 150 },
  { days: 180, multiplier: 200 },
  { days: 365, multiplier: 300 },
];

const PeriodCard = ({ 
  days, 
  multiplier, 
  selected, 
  onClick 
}: { 
  days: number; 
  multiplier: number; 
  selected: boolean;
  onClick: () => void;
}) => (
  <Card 
    className={`cursor-pointer transition-all duration-300 ${
      selected 
        ? 'border-primary ring-1 ring-primary/50' 
        : 'hover:border-primary/30'
    }`}
    onClick={onClick}
  >
    <div className="p-4">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <span className="text-xs font-medium px-2 py-1 bg-primary/10 rounded-full text-primary">
          {multiplier/100}x Rewards
        </span>
      </div>
      <p className="text-2xl font-bold mb-1">{days} Days</p>
      <p className="text-sm text-gray-400">Lock Period</p>
    </div>
  </Card>
);

export default function Staking() {
  const { address } = useAccount();
  const { userStats } = useZorium();
  const [amount, setAmount] = React.useState('');
  const [selectedPeriod, setSelectedPeriod] = React.useState<number>(0);
  const [isStaking, setIsStaking] = React.useState(false);

  if (!address) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-24">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-2xl font-bold mb-4">Connect your wallet to continue</h1>
            <p className="text-gray-400 text-center mb-8">
              You need to connect your wallet to access staking features
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Staking</h1>
            <p className="text-gray-400">
              Lock your ZORIUM tokens to earn rewards and increase your level
            </p>
          </div>

          {/* Current Stake Info */}
          {userStats?.stakedAmount !== '0' ? (
            <Card className="mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Active Stake</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Staked Amount</p>
                    <p className="text-2xl font-bold">{userStats.stakedAmount} ZRM</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Lock Period</p>
                    <p className="text-2xl font-bold">{userStats.lockPeriod} Days</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Pending Rewards</p>
                    <p className="text-2xl font-bold">{userStats.pendingRewards} ZRM</p>
                  </div>
                </div>
              </div>
            </Card>
          ) : null}

          {/* New Stake Form */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Create New Stake</h2>
              
              {/* Amount Input */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Amount to Stake
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-background border border-gray-800 rounded-lg px-4 py-3 
                             focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                             transition-colors"
                    placeholder="Enter amount..."
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 
                               text-xs font-medium text-primary hover:text-primary-hover
                               transition-colors"
                    onClick={() => setAmount('')}
                  >
                    MAX
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Minimum stake: 100 ZRM
                </p>
              </div>

              {/* Period Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-400 mb-4">
                  Select Lock Period
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {STAKING_PERIODS.map((period, index) => (
                    <PeriodCard
                      key={period.days}
                      days={period.days}
                      multiplier={period.multiplier}
                      selected={selectedPeriod === index}
                      onClick={() => setSelectedPeriod(index)}
                    />
                  ))}
                </div>
              </div>

              {/* Rewards Estimate */}
              <Card className="mb-8 bg-background/50">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Estimated Rewards</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Base APR</p>
                      <p className="font-medium">5.00%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Period Bonus</p>
                      <p className="font-medium">
                        +{STAKING_PERIODS[selectedPeriod].multiplier - 100}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Level Bonus</p>
                      <p className="font-medium">
                        +{userStats?.level === 'BRONZE' ? '0' : 
                           userStats?.level === 'SILVER' ? '10' :
                           userStats?.level === 'GOLD' ? '25' : '50'}%
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Button 
                className="w-full"
                disabled={!amount || Number(amount) < 100 || isStaking}
                onClick={() => {
                  setIsStaking(true);
                  // TODO: Implement staking logic
                  setTimeout(() => setIsStaking(false), 2000);
                }}
              >
                {isStaking ? 'Staking...' : 'Stake ZORIUM'}
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}