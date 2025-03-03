import { useContractRead, useContractWrite, useAccount, useWaitForTransaction } from 'wagmi';
import { readContract } from '@wagmi/core';
import { ZORIUM_CONTRACT_ADDRESS, ZORIUM_ABI } from '@/constants/contract';
import { parseEther, formatEther, isAddress, Address } from 'viem';
import { useState, useCallback, useEffect } from 'react';
import { useToast } from './useToast';
import { useSearchParams } from 'next/navigation';

// Enums
export enum UserLevel {
  BRONZE,
  SILVER,
  GOLD,
  PLATINUM
}

// Interfaces
export interface StakeInfo {
  totalAmount: string;
  startTime: number;
  lockPeriod: number;
  unlockTime: number;
  isLocked: boolean;
  timeRemaining: number;
  pendingRewards: string;
  multiplier: number;
  level: string;
  levelProgress: number;
  levelBonus: number;
  isActive: boolean;
  referralBonus: string;
  totalHistoricalStake?: string;
}

export interface ReferralInfo {
  address: Address;
  isActive: boolean;
  amount: string;
  since: number;
  level: string;
  rewards?: {
    pending: string;
    total: string;
    lastUpdate: number;
  };
}

export interface ReferralLevelInfo {
  level: number;
  count: number;
  activeCount: number;
  totalEarned: string;
  pendingRewards: string;
  commission: number;
}

export interface UserStats {
  totalStaked: string;
  level: string;
  levelProgress: number;
  nextLevelThreshold: string;
  isActive: boolean;
  referrer: Address;
  referralCount: number;
  referrals: ReferralInfo[];
  stakeInfo: StakeInfo | null;
  referralLevels?: ReferralLevelInfo[];
  totalHistoricalStake?: string;
}

// Constants
const LEVEL_THRESHOLDS = {
  BRONZE: 0,
  SILVER: 1_000_000,
  GOLD: 10_000_000,
  PLATINUM: 100_000_000
} as const;

const LEVEL_BONUSES = {
  BRONZE: 0,
  SILVER: 10,
  GOLD: 25,
  PLATINUM: 50
} as const;

const REFERRAL_COMMISSIONS = [15, 8, 5] as const;

export function useZorium() {
  // Base hooks
  const { address } = useAccount();
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  // States
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(false);
  const [referralsData, setReferralsData] = useState<ReferralInfo[]>([]);
  const [referralLevels, setReferralLevels] = useState<ReferralLevelInfo[]>([]);
  const [referrer, setReferrer] = useState<Address | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref && isAddress(ref)) {
      setReferrer(ref as Address);
    }
  }, [searchParams]);

  // Helper functions
  const formatValue = (value: bigint | undefined): string => {
    if (!value) return '0';
    try {
      return Number(formatEther(value)).toFixed(2);
    } catch (error) {
      console.error('[ZORIUM] Error formatting value:', error);
      return '0';
    }
  };

  const calculateLevel = (amount: number): { 
    level: string; 
    progress: number; 
    next: number 
  } => {
    if (amount >= LEVEL_THRESHOLDS.PLATINUM) {
      return { 
        level: 'PLATINUM', 
        progress: 100, 
        next: LEVEL_THRESHOLDS.PLATINUM 
      };
    }

    if (amount >= LEVEL_THRESHOLDS.GOLD) {
      const progress = (
        (amount - LEVEL_THRESHOLDS.GOLD) / 
        (LEVEL_THRESHOLDS.PLATINUM - LEVEL_THRESHOLDS.GOLD)
      ) * 100;
      return { 
        level: 'GOLD', 
        progress, 
        next: LEVEL_THRESHOLDS.PLATINUM 
      };
    }
    if (amount >= LEVEL_THRESHOLDS.SILVER) {
      const progress = (
        (amount - LEVEL_THRESHOLDS.SILVER) / 
        (LEVEL_THRESHOLDS.GOLD - LEVEL_THRESHOLDS.SILVER)
      ) * 100;
      return { 
        level: 'SILVER', 
        progress, 
        next: LEVEL_THRESHOLDS.GOLD 
      };
    }
    const progress = (amount / LEVEL_THRESHOLDS.SILVER) * 100;
    return { 
      level: 'BRONZE', 
      progress, 
      next: LEVEL_THRESHOLDS.SILVER 
    };
  };

  const processStakeInfo = (info: any): StakeInfo | null => {
    if (!info) {
      console.log('[ZORIUM] No staker info available');
      return null;
    }

    try {
      const amount = info[0] as bigint;
      const startTime = Number(info[1]);
      const lockPeriod = Number(info[2]);
      const multiplier = Number(info[3]);
      const lastRewardCalculation = Number(info[4]);
      const totalHistoricalStake = info[10] as bigint;
      const isActive = info[12] as boolean;

      if (amount <= BigInt(0)) return null;

      const now = Math.floor(Date.now() / 1000);
      const unlockTime = startTime + lockPeriod;
      const timeRemaining = unlockTime - now;

      const amountNumber = Number(formatValue(amount));
      const levelInfo = calculateLevel(amountNumber);
      const levelBonus = LEVEL_BONUSES[levelInfo.level as keyof typeof LEVEL_BONUSES] || 0;

      const baseAnnualReward = amountNumber * 0.05;
      const periodMultiplier = multiplier / 100;
      const withPeriodBonus = baseAnnualReward * periodMultiplier;
      const withLevelBonus = withPeriodBonus * (1 + levelBonus / 100);

      const yearInDays = 365;
      const daysSinceLastCalculation = (now - lastRewardCalculation) / (24 * 60 * 60);
      const proRatedRewards = withLevelBonus * (daysSinceLastCalculation / yearInDays);

      const referralBonus = formatValue(info[9] as bigint);

return {
        totalAmount: formatValue(amount),
        startTime,
        lockPeriod,
        multiplier,
        unlockTime,
        isLocked: timeRemaining > 0,
        timeRemaining: timeRemaining > 0 ? timeRemaining : 0,
        pendingRewards: proRatedRewards.toFixed(2),
        level: levelInfo.level,
        levelProgress: levelInfo.progress,
        levelBonus,
        isActive: true,
        referralBonus,
        totalHistoricalStake: formatValue(totalHistoricalStake)
      };
    } catch (error) {
      console.error('[ZORIUM] Error processing stake info:', error);
      return null;
    }
  };

  const checkCooldown = async (): Promise<boolean> => {
    try {
      const now = Math.floor(Date.now() / 1000);
      const lastAction = Number(lastActionTime || 0);
      const cooldownTime = 3600;

      if (lastAction + cooldownTime > now) {
        const waitTime = lastAction + cooldownTime - now;
        const minutes = Math.ceil(waitTime / 60);
        showToast(`Please wait ${minutes} minutes before next action`, 'error');
        return false;
      }
      return true;
    } catch (error) {
      console.error('[ZORIUM] Cooldown check error:', error);
      return false;
    }
  };

  // Contract reads
  const { data: lastActionTime, error: lastActionError } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'lastActionTime',
    args: address ? [address as Address] : undefined,
    enabled: !!address,
    watch: true,
    onError: (error) => {
      console.error('[ZORIUM] Error fetching last action time:', error);
    }
  });

  const { 
    data: totalStaked, 
    refetch: refetchTotalStaked,
    error: totalStakedError 
  } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'totalStaked',
    watch: true,
    onSuccess: (data) => {
      console.log('[ZORIUM] Total staked:', formatValue(data as bigint));
    },
    onError: (error) => {
      console.error('[ZORIUM] Error fetching total staked:', error);
    }
  });

  const { data: rewardPool, error: rewardPoolError } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'rewardPool',
    watch: true,
    onSuccess: (data) => {
      console.log('[ZORIUM] Reward pool:', formatValue(data as bigint));
    },
    onError: (error) => {
      console.error('[ZORIUM] Error fetching reward pool:', error);
    }
  });

  const { 
    data: stakerInfo, 
    refetch: refetchStakerInfo,
    error: stakerInfoError 
  } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'stakers',
    args: address ? [address as Address] : undefined,
    enabled: !!address,
    watch: true,
    onSuccess: (data) => {
      console.log('[ZORIUM] Raw staker info:', data);
    },
    onError: (error) => {
      console.error('[ZORIUM] Error fetching staker info:', error);
    }
  });

  const { 
    data: pendingRewards, 
    refetch: refetchRewards,
    error: pendingRewardsError 
  } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'calculateReward',
    args: address ? [address as Address] : undefined,
    enabled: !!address,
    watch: true,
    onError: (error) => {
      console.error('[ZORIUM] Error fetching pending rewards:', error);
    }
  });

  const { data: totalBurned, error: totalBurnedError } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'totalBurned',
    watch: true,
    onSuccess: (data) => {
      console.log('[ZORIUM] Total burned:', formatValue(data as bigint));
    },
    onError: (error) => {
      console.error('[ZORIUM] Error fetching total burned:', error);
    }
  });

  const processUserStats = useCallback((): UserStats | undefined => {
    if (!stakerInfo) {
      console.log('[ZORIUM] No staker info available');
      return undefined;
    }

    try {
      const amount = Number(formatValue(stakerInfo[0] as bigint));
      const totalHistoricalStake = formatValue(stakerInfo[10] as bigint);
      const levelInfo = calculateLevel(amount);
      const stakeInfo = processStakeInfo(stakerInfo);

      return {
        totalStaked: amount.toString(),
        level: levelInfo.level,
        levelProgress: levelInfo.progress,
        nextLevelThreshold: levelInfo.next.toLocaleString(),
        isActive: stakerInfo[12] as boolean,
        referrer: stakerInfo[7] as Address,
        referralCount: Number(stakerInfo[8]),
        referrals: referralsData,
        stakeInfo,
        referralLevels,
        totalHistoricalStake
      };
    } catch (error) {
      console.error('[ZORIUM] Error processing user stats:', error);
      return undefined;
    }
  }, [stakerInfo, referralsData, referralLevels]);

  // Contract writes
  const { writeAsync: stake, data: stakeTx } = useContractWrite({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'createStake',
    onError: (error) => {
      console.error('[ZORIUM] Stake write error:', error);
    }
  });

  const { writeAsync: unstake, data: unstakeTx } = useContractWrite({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'unstake',
    onError: (error) => {
      console.error('[ZORIUM] Unstake write error:', error);
    }
  });

  const { writeAsync: claimReward, data: claimTx } = useContractWrite({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'claimReward',
    onError: (error) => {
      console.error('[ZORIUM] Claim write error:', error);
    }
  });

// Додаємо контрактний виклик для реєстрації реферера
  const { writeAsync: registerReferrer, data: referrerTx } = useContractWrite({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'registerReferrer',
    onError: (error) => {
      console.error('[ZORIUM] Register referrer write error:', error);
    }
  });

  // Transaction watchers
  useWaitForTransaction({
    hash: stakeTx?.hash,
    onSuccess: async () => {
      showToast('Successfully staked tokens!', 'success');
      if (referrer && !stakerInfo?.[7]) {
        try {
          await registerReferrer({ args: [referrer] });
          showToast('Referral registered successfully', 'success');
        } catch (error) {
          console.error('[ZORIUM] Referral registration error:', error);
          showToast('Failed to register referral', 'error');
        }
      }
      refetchAll();
    },
    onError: (error) => {
      console.error('[ZORIUM] Stake transaction error:', error);
      showToast(`Failed to stake: ${error.message}`, 'error');
    },
  });

  useWaitForTransaction({
    hash: unstakeTx?.hash,
    onSuccess: () => {
      showToast('Successfully unstaked tokens!', 'success');
      refetchAll();
    },
    onError: (error) => {
      console.error('[ZORIUM] Unstake transaction error:', error);
      showToast(`Failed to unstake: ${error.message}`, 'error');
    },
  });

  useWaitForTransaction({
    hash: claimTx?.hash,
    onSuccess: () => {
      showToast('Successfully claimed rewards!', 'success');
      refetchAll();
    },
    onError: (error) => {
      console.error('[ZORIUM] Claim transaction error:', error);
      showToast(`Failed to claim: ${error.message}`, 'error');
    },
  });

  useWaitForTransaction({
    hash: referrerTx?.hash,
    onSuccess: () => {
      showToast('Successfully registered referrer!', 'success');
      refetchAll();
    },
    onError: (error) => {
      console.error('[ZORIUM] Referrer registration transaction error:', error);
      showToast(`Failed to register referrer: ${error.message}`, 'error');
    },
  });

  const refetchAll = useCallback(() => {
    refetchTotalStaked();
    refetchStakerInfo();
    refetchRewards();
  }, [refetchTotalStaked, refetchStakerInfo, refetchRewards]);

  // Функція для реєстрації реферера
  const registerNewReferrer = async (referrerAddress: string): Promise<boolean> => {
    try {
      console.log('[ZORIUM] Registering referrer:', referrerAddress);
      await registerReferrer({ args: [referrerAddress as `0x${string}`] });
      refetchAll();
      return true;
    } catch (error) {
      console.error('[ZORIUM] Register referrer error:', error);
      throw error;
    }
  };

const stakeTokens = async (amount: string, periodIndex: number): Promise<boolean> => {
    try {
      if (!(await checkCooldown())) return false;

      const stats = processUserStats();
      const currentPendingRewards = Number(stats?.stakeInfo?.pendingRewards || '0');
      const currentReferralRewards = Number(stats?.stakeInfo?.referralBonus || '0');
      const totalCurrentRewards = currentPendingRewards + currentReferralRewards;

      if (totalCurrentRewards > 0) {
        showToast(
          'You have unclaimed rewards. Please claim your rewards before creating a new stake.',
          'warning'
        );
        setShowWarningModal(true);
        return false;
      }

      showToast('Initiating staking transaction...', 'loading');
      console.log('[ZORIUM] Staking params:', {
        amount: parseEther(amount),
        periodIndex: BigInt(periodIndex)
      });

      await stake({ args: [parseEther(amount), BigInt(periodIndex)] });
      showToast('Please confirm the transaction', 'info');
      return true;
    } catch (error) {
      console.error('[ZORIUM] Staking error:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to stake tokens',
        'error'
      );
      return false;
    }
  };

  const unstakeTokens = async (): Promise<boolean> => {
    try {
      if (!(await checkCooldown())) return false;

      const stats = processUserStats();
      if (!stats?.stakeInfo?.isActive) {
        showToast('No active stake found', 'error');
        return false;
      }

      if (stats.stakeInfo.isLocked) {
        const days = Math.ceil(stats.stakeInfo.timeRemaining / 86400);
        showToast(`Stake is locked for ${days} more days`, 'error');
        return false;
      }

      showToast('Initiating unstaking transaction...', 'loading');
      await unstake();
      showToast('Please confirm the transaction', 'info');
      return true;
    } catch (error) {
      console.error('[ZORIUM] Unstaking error:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to unstake tokens',
        'error'
      );
      return false;
    }
  };

  const claimRewards = async (): Promise<boolean> => {
    try {
      if (!(await checkCooldown())) return false;

      const stats = processUserStats();
      if (!stats?.stakeInfo?.isActive) {
        showToast('No active stake found', 'error');
        return false;
      }

      const totalRewards = Number(stats.stakeInfo.pendingRewards) + 
                          Number(stats.stakeInfo.referralBonus);
      
      if (totalRewards === 0) {
        showToast('No rewards to claim', 'error');
        return false;
      }

      showToast('Claiming rewards...', 'loading');
      await claimReward();
      showToast('Please confirm the claim transaction', 'info');
      return true;
    } catch (error) {
      console.error('[ZORIUM] Claim error:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to claim rewards',
        'error'
      );
      return false;
    }
  };

  return {
    stats: {
      totalStaked: formatValue(totalStaked as bigint),
      rewardPool: formatValue(rewardPool as bigint),
      totalBurned: formatValue(totalBurned as bigint),
    },
    userStats: processUserStats(),
    actions: {
      stake: stakeTokens,
      unstake: unstakeTokens,
      claim: claimRewards,
      registerReferrer: registerNewReferrer,
    },
    stake,
    referralInfo: {
      currentReferrer: stakerInfo?.[7] as Address,
      referrals: referralsData,
      referralCount: Number(stakerInfo?.[8] || 0),
      isLoadingReferrals,
      levels: referralLevels
    },
    utils: {
      formatValue,
      calculateLevel,
      checkCooldown
    },
    modals: {
      showWarningModal,
      setShowWarningModal
    }
  };
}