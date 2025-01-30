// src/app/staking/staking-client.tsx
'use client';

import React from 'react';
import { useAccount } from 'wagmi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useZorium } from '@/hooks/useZorium';
import { Lock, Clock, Users, Gift, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { LevelProgress } from '@/components/ui/level-progress';
import { UnlockTimer } from '@/components/ui/unlock-timer';
import { StakeStats } from '@/components/ui/stake-stats';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/hooks/useToast';
import { parseEther } from 'viem';
import { useReferralHandler } from '@/hooks/useReferralHandler';
import { ReferralBanner } from '@/components/ui/referral-banner';
import { ReferralBenefits } from '@/components/ui/referral-benefits';

// Logger configuration
const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`[STAKING INFO] ${message}`, ...args);
  },
  error: (message: string, error: any) => {
    console.error(`[STAKING ERROR] ${message}:`, error);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[STAKING WARN] ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    console.debug(`[STAKING DEBUG] ${message}`, ...args);
  }
};

// Constants
const STAKING_PERIODS = [
  { days: 30, multiplier: 100 },
  { days: 90, multiplier: 150 },
  { days: 180, multiplier: 200 },
  { days: 365, multiplier: 300 },
];

// Types and Interfaces
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

interface ZoriumActions {
  stake: (amount: string, periodIndex: number) => Promise<boolean>;
  unstake: () => Promise<boolean>;
  claim: () => Promise<boolean>;
  registerReferrer: (referrer: string) => Promise<boolean>;
}

const PeriodCard = ({ days, multiplier, selected, onClick }: PeriodCardProps) => {
  logger.debug('Rendering PeriodCard', { days, multiplier, selected });
  
  return (
    <Card
      className={`cursor-pointer transition-all duration-300 ${
        selected
          ? 'border-primary ring-1 ring-primary/50 shadow-lg shadow-primary/10'
          : 'hover:border-primary/30'
      }`}
      onClick={() => {
        logger.debug('Period selected', { days, multiplier });
        onClick();
      }}
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
};

const EstimatedRewards = ({
  baseAmount,
  periodMultiplier,
  levelBonus,
  hasReferralBonus,
}: EstimatedRewardsProps) => {
  logger.debug('Calculating estimated rewards', {
    baseAmount,
    periodMultiplier,
    levelBonus,
    hasReferralBonus
  });

  const baseRewards = Number(baseAmount) * 0.05;
  const withPeriodBonus = baseRewards * (periodMultiplier / 100);
  const withLevelBonus = withPeriodBonus * (1 + levelBonus / 100);
  const withReferralBonus = hasReferralBonus
    ? withLevelBonus * 1.1
    : withLevelBonus;

  const referralBonusAmount = withReferralBonus - withLevelBonus;
  const effectiveAPY = (withReferralBonus / Number(baseAmount)) * 100;

  logger.debug('Reward calculations results', {
    baseRewards,
    withPeriodBonus,
    withLevelBonus,
    withReferralBonus,
    referralBonusAmount,
    effectiveAPY
  });

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

const StakeHistory = ({ totalHistoricalStake }: { totalHistoricalStake?: string }) => {
  logger.debug('Rendering StakeHistory component', { totalHistoricalStake });

  if (!totalHistoricalStake || Number(totalHistoricalStake) === 0) {
    logger.debug('No stake history to display');
    return null;
  }

  return (
    <Card className="mb-4 p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-400">Total Historical Stake</h3>
          <p className="text-lg font-bold">{totalHistoricalStake} ZRM</p>
        </div>
      </div>
    </Card>
  );
};

export default function StakingClient() {
  logger.info('Initializing StakingClient component');

  // Base hooks
  const { address } = useAccount();
  const { userStats, actions, modals, stake } = useZorium();
  const { showToast } = useToast();
  const { referrer, timeRemaining, hasActiveReferral, clearReferral } = useReferralHandler();
  
  // Component states
  const [amount, setAmount] = React.useState('');
  const [modalAmount, setModalAmount] = React.useState('');
  const [selectedPeriod, setSelectedPeriod] = React.useState<number>(0);
  const [isStaking, setIsStaking] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [showReferralBanner, setShowReferralBanner] = React.useState(true);

  // Lifecycle and state tracking effects
  React.useEffect(() => {
    logger.info('StakingClient mounted', {
      address,
      hasActiveReferral,
      referrer,
      timeRemaining
    });
    setMounted(true);

    return () => {
      logger.info('StakingClient unmounting');
    };
  }, []);

  // Monitor referral state changes
  React.useEffect(() => {
    if (hasActiveReferral && referrer && showReferralBanner) {
      logger.debug('Referral section state changed:', {
        hasActiveReferral,
        referrer,
        showReferralBanner,
        timeRemaining
      });
    }
  }, [hasActiveReferral, referrer, showReferralBanner, timeRemaining]);

  // Track stake info updates
  React.useEffect(() => {
    if (userStats?.stakeInfo) {
      logger.debug('Stake info updated:', {
        amount: userStats.stakeInfo.totalAmount,
        isLocked: userStats.stakeInfo.isLocked,
        timeRemaining: userStats.stakeInfo.timeRemaining,
        pendingRewards: userStats.stakeInfo.pendingRewards
      });
    }
  }, [userStats?.stakeInfo]);

  // Handlers
  const handleStake = async () => {
    const stakeAmount = amount.trim();
    logger.info('Starting stake process', { stakeAmount, selectedPeriod });

    if (!stakeAmount || Number(stakeAmount) < 100 || isStaking) {
      logger.warn('Invalid stake attempt', {
        amount: stakeAmount,
        isStaking,
        minimumRequired: 100
      });
      showToast('Minimum stake amount is 100 ZRM', 'error');
      return;
    }

    setModalAmount(stakeAmount);
    setIsStaking(true);
    
    try {
      logger.debug('Initiating stake transaction', {
        amount: stakeAmount,
        periodIndex: selectedPeriod
      });

      await actions.stake(stakeAmount, selectedPeriod);
      logger.info('Stake transaction submitted successfully');

      // Referral registration
      if (hasActiveReferral && referrer) {
        logger.info('Processing referral registration', {
          referrer,
          timeRemaining
        });

        try {
          await actions.registerReferrer(referrer);
          logger.info('Referral registration successful');
          showToast('Referral bonus activated', 'success');
          clearReferral();
        } catch (error) {
          logger.error('Referral registration failed', error);
          showToast('Failed to activate referral bonus', 'error');
        }
      } else {
        logger.debug('No referral to process', { hasActiveReferral, referrer });
      }

      setAmount('');
    } catch (error) {
      logger.error('Stake transaction failed', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to stake',
        'error'
      );
      setModalAmount('');
    } finally {
      setIsStaking(false);
    }
  };

// Handlers for claiming and staking
  const handleClaimAndStake = async () => {
    logger.info('Starting claim and stake process');
    try {
      logger.debug('Attempting to claim rewards');
      await actions.claim();
      logger.info('Rewards claimed successfully');
      modals.setShowWarningModal(false);
    } catch (error) {
      logger.error('Claim and stake process failed', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to claim rewards',
        'error'
      );
    } finally {
      setModalAmount('');
    }
  };

  const handleForceStake = async () => {
    const stakeAmount = modalAmount;
    logger.info('Starting force stake process', { stakeAmount });

    if (!stakeAmount || Number(stakeAmount) < 100) {
      logger.warn('Invalid force stake amount', { stakeAmount });
      showToast('Minimum stake amount is 100 ZRM', 'error');
      return;
    }

    setIsStaking(true);
    try {
      logger.debug('Executing force stake transaction', {
        amount: stakeAmount,
        periodIndex: selectedPeriod
      });

      await stake({
        args: [parseEther(stakeAmount), BigInt(selectedPeriod)]
      });
      logger.info('Force stake transaction successful');

      // Process referral for force stake
      if (hasActiveReferral && referrer) {
        logger.info('Processing referral for force stake', {
          referrer,
          timeRemaining
        });

        try {
          await actions.registerReferrer(referrer);
          logger.info('Referral registration successful for force stake');
          showToast('Referral bonus activated', 'success');
          clearReferral();
        } catch (error) {
          logger.error('Force stake referral registration failed', error);
          showToast('Failed to activate referral bonus', 'error');
        }
      }

      setAmount('');
      modals.setShowWarningModal(false);
    } catch (error) {
      logger.error('Force stake failed', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to stake',
        'error'
      );
    } finally {
      setIsStaking(false);
      setModalAmount('');
    }
  };

  // Calculate state values
  const totalPendingRewards = userStats?.stakeInfo
    ? (
        Number(userStats.stakeInfo.pendingRewards) +
        Number(userStats.stakeInfo.referralBonus)
      ).toFixed(2)
    : '0';

  // State checks
  const hasStakeHistory =
    userStats?.totalHistoricalStake &&
    Number(userStats.totalHistoricalStake) > 0;
  const hasActiveStake =
    userStats?.stakeInfo && Number(userStats.stakeInfo.totalAmount) > 0;
  const isStakeLocked = hasActiveStake && userStats?.stakeInfo?.isLocked;

  logger.debug('Current staking state', {
    totalPendingRewards,
    hasStakeHistory,
    hasActiveStake,
    isStakeLocked,
    userStats: {
      level: userStats?.level,
      totalStaked: userStats?.totalStaked,
      isActive: userStats?.isActive
    }
  });

  if (!mounted) {
    logger.debug('Component not mounted yet');
    return null;
  }

  if (!address) {
    logger.info('No wallet connected, showing connect prompt');
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
    {/* Warning Modal */}
    <Modal
      isOpen={modals.showWarningModal}
      onClose={() => {
        logger.debug('Closing warning modal');
        modals.setShowWarningModal(false);
        setModalAmount('');
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
              logger.debug('Canceling stake warning');
              modals.setShowWarningModal(false);
              setModalAmount('');
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              logger.debug('Initiating claim and stake');
              handleClaimAndStake();
            }}
            disabled={isStakeLocked === true}
          >
            Claim Rewards
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              logger.debug('Initiating force stake');
              handleForceStake();
            }}
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

      {/* Referral Banner and Benefits */}
      {hasActiveReferral && referrer && showReferralBanner && (
        <div>
          <ReferralBanner 
            referrer={referrer}
            timeRemaining={timeRemaining}
            onClose={() => {
              logger.debug('Closing referral banner');
              setShowReferralBanner(false);
            }}
          />
          <ReferralBenefits />
        </div>
      )}

      {/* Stake History */}
      {hasStakeHistory && (
        <div>
          <StakeHistory totalHistoricalStake={userStats?.totalHistoricalStake} />
        </div>
      )}

{/* Current Stake Info */}
      {hasActiveStake && userStats?.stakeInfo && (
        <div className="space-y-6 mb-8">
          <StakeStats
            amount={userStats.stakeInfo.totalAmount}
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
      )}

      {/* Level Progress */}
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

      {/* No Active Stake Message */}
      {!hasActiveStake && (
        <Card className="mb-12 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Lock className="w-6 h-6 text-primary" />
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

{/* New Stake Form */}
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
                  logger.debug('Amount input changed', { inputValue });
                  if (Number(inputValue) >= 0) {
                    setAmount(inputValue);
                  } else {
                    logger.warn('Invalid amount input', { inputValue });
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
                  logger.debug('MAX button clicked');
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

          {/* Lock Period Selection */}
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
                    logger.debug('Lock period selected', { days: period.days, index });
                    setSelectedPeriod(index);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Estimated Rewards */}
          {Number(amount) >= 100 && (
            <div className="mb-8">
              <EstimatedRewards
                baseAmount={amount}
                periodMultiplier={STAKING_PERIODS[selectedPeriod].multiplier}
                levelBonus={userStats?.stakeInfo?.levelBonus || 0}
                hasReferralBonus={hasActiveReferral && !!referrer}
              />
            </div>
          )}

          {/* Stake Button */}
          <Button
            className="w-full"
            disabled={!amount || Number(amount) < 100 || isStaking}
            onClick={() => {
              logger.debug('Stake button clicked', { amount, selectedPeriod });
              handleStake();
            }}
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

{/* Actions Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Info Cards */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Gift className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Staking Rewards</h3>
              <p className="text-sm text-gray-400">
                Lock your tokens longer for higher multipliers
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Referral Program</h3>
              <p className="text-sm text-gray-400">
                Invite friends to earn additional rewards
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Important Information */}
      <Card className="mb-8">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Important Information</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              Minimum stake amount is 100 ZRM
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              Tokens are locked for the selected period
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              Rewards can be claimed after the lock period ends
            </li>
            {hasActiveReferral && (
              <li className="flex items-center gap-2 text-primary">
                <Gift className="w-4 h-4" />
                You have an active referral bonus
              </li>
            )}
          </ul>
        </div>
      </Card>
    </section>
  </>
);
}