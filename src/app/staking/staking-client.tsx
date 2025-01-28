'use client';

import React, { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useZorium } from '@/hooks/useZorium';
import { Lock, Clock, TrendingUp, AlertCircle, History } from 'lucide-react';
import { LevelProgress } from '@/components/ui/level-progress';
import { UnlockTimer } from '@/components/ui/unlock-timer';
import { StakeStats } from '@/components/ui/stake-stats';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/hooks/useToast';
import { parseEther } from 'viem';

const STAKING_PERIODS = [
  { days: 30, multiplier: 100 },
  { days: 90, multiplier: 150 },
  { days: 180, multiplier: 200 },
  { days: 365, multiplier: 300 },
];

interface PeriodCardProps {
  days: number;
  multiplier: number;
  selected: boolean;
  onClick: () => void;
}

interface EstimatedRewardsProps {
  baseAmount: string;
  periodMultiplier: number;
  levelBonus: number;
  hasReferralBonus?: boolean;
}

const PeriodCard = ({ days, multiplier, selected, onClick }: PeriodCardProps) => (
  <Card
    className={`cursor-pointer transition-all duration-300 ${
      selected
        ? 'border-primary ring-1 ring-primary/50 shadow-lg shadow-primary/10'
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
          {multiplier / 100}x Rewards
        </span>
      </div>
      <p className="text-2xl font-bold mb-1">{days} Days</p>
      <p className="text-sm text-gray-400">Lock Period</p>
    </div>
  </Card>
);

const StakeHistory = ({ totalHistoricalStake }: { totalHistoricalStake?: string }) => {
  if (!totalHistoricalStake || Number(totalHistoricalStake) === 0) return null;

  return (
    <Card className="mb-4 p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <History className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-400">Total Historical Stake</h3>
          <p className="text-lg font-bold">{totalHistoricalStake} ZRM</p>
        </div>
      </div>
    </Card>
  );
};

const EstimatedRewards = ({
  baseAmount,
  periodMultiplier,
  levelBonus,
  hasReferralBonus,
}: EstimatedRewardsProps) => {
  const baseRewards = Number(baseAmount) * 0.05;
  const withPeriodBonus = baseRewards * (periodMultiplier / 100);
  const withLevelBonus = withPeriodBonus * (1 + levelBonus / 100);
  const withReferralBonus = hasReferralBonus
    ? withLevelBonus * 1.1
    : withLevelBonus;

  const referralBonusAmount = withReferralBonus - withLevelBonus;
  const effectiveAPY = (withReferralBonus / Number(baseAmount)) * 100;

  return (
    <Card className="bg-background/50">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">Estimated Annual Rewards</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Base APR (5%)</p>
            <p className="font-medium">{baseRewards.toFixed(2)} ZRM</p>
          </div>
          <div>
            <p className="text-gray-400">Period Bonus</p>
            <p className="font-medium">
              +{periodMultiplier - 100}% (
              {(withPeriodBonus - baseRewards).toFixed(2)} ZRM)
            </p>
          </div>
          <div>
            <p className="text-gray-400">Level Bonus</p>
            <p className="font-medium">
              +{levelBonus}% (
              {(withLevelBonus - withPeriodBonus).toFixed(2)} ZRM)
            </p>
          </div>
          <div>
            <p className="text-gray-400">Referral Bonus</p>
            <p className="font-medium">
              {hasReferralBonus ? (
                <>+10% ({referralBonusAmount.toFixed(2)} ZRM)</>
              ) : (
                <span className="text-gray-500">No bonus</span>
              )}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-400">Total Estimated Annual Rewards</p>
              <p className="text-xl font-bold text-primary">
                {withReferralBonus.toFixed(2)} ZRM
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-400">Effective APY</p>
              <p className="text-xl font-bold text-green-500">
                {effectiveAPY.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default function StakingClient() {
  const { address } = useAccount();
  const { userStats, actions, modals, stake } = useZorium();
  const { showToast } = useToast();
  
  const [amount, setAmount] = React.useState('');
  const [modalAmount, setModalAmount] = React.useState('');
  const [selectedPeriod, setSelectedPeriod] = React.useState<number>(0);
  const [isStaking, setIsStaking] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Додаємо ефект для відстеження modalAmount
  React.useEffect(() => {
    console.log('[DEBUG] Modal amount updated:', modalAmount);
  }, [modalAmount]);

  const handleStake = async () => {
    const stakeAmount = amount.trim();
    console.log('[DEBUG] Stake amount:', stakeAmount);

    if (!stakeAmount || Number(stakeAmount) < 100 || isStaking) {
      console.log('[DEBUG] Invalid stake amount or currently staking');
      showToast('Minimum stake amount is 100 ZRM', 'error');
      return;
    }

    setModalAmount(stakeAmount); // Встановлюємо modalAmount перед стейкінгом
    
    setIsStaking(true);
    try {
      console.log('[DEBUG] Initiating stake with amount:', stakeAmount);
      await actions.stake(stakeAmount, selectedPeriod);
      console.log('[DEBUG] Stake successful');
      setAmount('');
      // НЕ очищаємо modalAmount тут
    } catch (error) {
      console.error('[DEBUG] Stake error:', error);
      showToast(error instanceof Error ? error.message : 'Failed to stake', 'error');
      setModalAmount(''); // Очищаємо тільки при помилці
    } finally {
      setIsStaking(false);
    }
  };

  const handleClaimAndStake = async () => {
    console.log('[DEBUG] Claiming rewards and preparing to stake...');
    try {
      await actions.claim();
      modals.setShowWarningModal(false);
    } catch (error) {
      console.error('[DEBUG] Claim error:', error);
      showToast(error instanceof Error ? error.message : 'Failed to claim rewards', 'error');
    } finally {
      setModalAmount(''); // Очищаємо modalAmount після завершення
    }
  };

  const handleForceStake = async () => {
    const stakeAmount = modalAmount;
    console.log('[DEBUG] Force stake amount:', stakeAmount);

    if (!stakeAmount || Number(stakeAmount) < 100) {
      console.log('[DEBUG] Error: Minimum stake amount not met');
      showToast('Minimum stake amount is 100 ZRM', 'error');
      return;
    }

    setIsStaking(true);
    try {
      console.log('[DEBUG] Executing force stake...');
      await stake({
        args: [parseEther(stakeAmount), BigInt(selectedPeriod)]
      });
      console.log('[DEBUG] Force stake successful');
      setAmount('');
      modals.setShowWarningModal(false);
    } catch (error) {
      console.error('[DEBUG] Force stake error:', error);
      showToast(error instanceof Error ? error.message : 'Failed to stake', 'error');
    } finally {
      setIsStaking(false);
      setModalAmount(''); // Очищаємо modalAmount після завершення
    }
  };

const totalPendingRewards = userStats?.stakeInfo
    ? (
        Number(userStats.stakeInfo.pendingRewards) +
        Number(userStats.stakeInfo.referralBonus)
      ).toFixed(2)
    : '0';

  const hasStakeHistory =
    userStats?.totalHistoricalStake &&
    Number(userStats.totalHistoricalStake) > 0;
  const hasActiveStake =
    userStats?.stakeInfo && Number(userStats.stakeInfo.totalAmount) > 0;
  const isStakeLocked = hasActiveStake && userStats?.stakeInfo?.isLocked;

  // Додаємо розширене логування
  console.log('Component render state:');
  console.log('Amount:', amount);
  console.log('Modal amount:', modalAmount);
  console.log('Selected period:', selectedPeriod);
  console.log('User stats:', userStats);
  console.log('Total pending rewards:', totalPendingRewards);

  if (!mounted) return null;

  if (!address) {
    return (
      <section className="container mx-auto px-4 pt-24">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">Connect your wallet to continue</h1>
          <p className="text-gray-400 text-center mb-8">
            You need to connect your wallet to access staking features.
          </p>
        </div>
      </section>
    );
  }

return (
    <>
      {console.log('Rendering modal with amount:', modalAmount)}

      <Modal
        isOpen={modals.showWarningModal}
        onClose={() => {
          modals.setShowWarningModal(false);
          setModalAmount(''); // Очищаємо при закритті
        }}
        title="Unclaimed Rewards"
      >
        <div className="space-y-4 p-4">
          <div className="flex items-center gap-3 text-yellow-500">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">Warning</p>
          </div>
          <p className="text-gray-400">
            You are attempting to stake <strong>{Number(modalAmount).toLocaleString()}</strong> ZRM 
            while having {totalPendingRewards} ZRM in unclaimed rewards. 
            These rewards will be lost if you create a new stake now.
          </p>
          {isStakeLocked && userStats?.stakeInfo && (
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <UnlockTimer
                timeRemaining={userStats.stakeInfo.timeRemaining}
                unlockTime={userStats.stakeInfo.unlockTime}
                className="justify-center text-yellow-500"
              />
            </div>
          )}
          <div className="flex justify-end gap-4 mt-6">
            <Button 
              variant="outline" 
              onClick={() => {
                modals.setShowWarningModal(false);
                setModalAmount('');
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleClaimAndStake}
              disabled={isStakeLocked === true}
            >
              Claim Rewards
            </Button>
            <Button 
              variant="outline"
              onClick={handleForceStake}
              className="border-yellow-500 hover:bg-yellow-500/10"
            >
              Stake {Number(modalAmount).toLocaleString()} ZRM Anyway
            </Button>
          </div>
        </div>
      </Modal>

<section className="container mx-auto px-4 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Staking</h1>
          <p className="text-gray-400">
            Lock your ZORIUM tokens to earn rewards and increase your level.
          </p>
        </div>

        {hasStakeHistory && (
          <StakeHistory totalHistoricalStake={userStats?.totalHistoricalStake} />
        )}

        {hasActiveStake && userStats?.stakeInfo ? (
          <div className="space-y-6 mb-8">
            <StakeStats
              amount={userStats.stakeInfo.totalAmount || '0'}
              multiplier={userStats.stakeInfo.multiplier}
              periodDays={Math.floor(userStats.stakeInfo.lockPeriod / 86400)}
              pendingRewards={userStats.stakeInfo.pendingRewards}
              levelBonus={userStats.stakeInfo.levelBonus}
              referralBonus={userStats.stakeInfo.referralBonus}
              hasReferralBonus={
                userStats.referrer !== undefined &&
                userStats.referrer !== '0x0000000000000000000000000000000000000000'
              }
            />

            <Card className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {Number(totalPendingRewards) > 0 && !isStakeLocked && (
                  <Button onClick={() => actions.claim()} className="flex-1">
                    Claim {totalPendingRewards} ZRM
                  </Button>
                )}
                {!isStakeLocked && (
                  <Button
                    variant="outline"
                    onClick={() => actions.unstake()}
                    className="flex-1"
                  >
                    Unstake {userStats.stakeInfo.totalAmount} ZRM
                  </Button>
                )}
              </div>

              {isStakeLocked && userStats.stakeInfo && (
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
          <Card className="mb-8 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">No Active Stake</h3>
                <p className="text-sm text-gray-400">
                  Start staking to earn rewards and increase your level.
                </p>
              </div>
            </div>
          </Card>
        )}

{userStats && (
          <div className="mb-8">
            <LevelProgress
              level={userStats.level}
              progress={userStats.levelProgress}
              currentAmount={userStats.totalStaked}
              nextThreshold={userStats.nextLevelThreshold}
              bonus={userStats.stakeInfo?.levelBonus ?? 0}
            />
          </div>
        )}

        {Number(amount) >= 100 && (
          <EstimatedRewards
            baseAmount={amount}
            periodMultiplier={STAKING_PERIODS[selectedPeriod].multiplier}
            levelBonus={userStats?.stakeInfo?.levelBonus ?? 0}
            hasReferralBonus={
              userStats?.referrer !== undefined &&
              userStats.referrer !== '0x0000000000000000000000000000000000000000'
            }
          />
        )}

        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Create New Stake</h2>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Amount to Stake
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    console.log('[DEBUG] Input changed:', inputValue);

                    if (Number(inputValue) >= 0) {
                      setAmount(inputValue);
                    } else {
                      console.warn('[DEBUG] Invalid input for amount:', inputValue);
                    }
                  }}
                  className="w-full bg-background border border-gray-800 rounded-lg px-4 py-3 
                           focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                           transition-colors"
                  placeholder="Enter amount..."
                  min="0"
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 
                            text-xs font-medium text-primary hover:text-primary-hover
                            transition-colors"
                  onClick={() => {
                    console.log('[DEBUG] MAX button clicked, resetting amount');
                    setAmount('');
                    setModalAmount('');
                  }}
                >
                  MAX
                </button>
              </div>

              {Number(amount) > 0 && Number(amount) < 100 && (
                <div className="flex items-center gap-2 mt-2 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm">Minimum stake amount is 100 ZRM</p>
                </div>
              )}
            </div>

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
                    onClick={() => {
                      console.log('[DEBUG] Selected lock period:', period.days);
                      setSelectedPeriod(index);
                    }}
                  />
                ))}
              </div>
            </div>

            <Button
              className="w-full"
              disabled={!amount || Number(amount) < 100 || isStaking}
              onClick={handleStake}
            >
              {isStaking ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Staking...</span>
                </div>
              ) : (
                'Stake ZORIUM'
              )}
            </Button>
          </div>
        </Card>
      </section>
    </>
  );
}