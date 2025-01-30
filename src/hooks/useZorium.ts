import { useContractRead, useContractWrite, useAccount, useWaitForTransaction } from 'wagmi';
import { readContract } from '@wagmi/core';
import { ZORIUM_CONTRACT_ADDRESS, ZORIUM_ABI } from '@/constants/contract';
import { parseEther, formatEther, isAddress, Address } from 'viem';
import { useState, useCallback, useEffect } from 'react';
import { useToast } from './useToast';
import { useSearchParams } from 'next/navigation';
import { useLocalStorage } from './useLocalStorage';

// Debug logger
const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`[ZORIUM INFO] ${message}`, ...args);
  },
  error: (message: string, error: any) => {
    console.error(`[ZORIUM ERROR] ${message}:`, error);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[ZORIUM WARN] ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    console.debug(`[ZORIUM DEBUG] ${message}`, ...args);
  }
};

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

export interface ReferralData {
  referrer: string;
  timestamp: number;
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
  logger.info('Initializing useZorium hook');

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
  const [referralData, setReferralData] = useLocalStorage<ReferralData | null>('zorium_referral', null);


  useEffect(() => {
  const ref = searchParams.get('ref');
  logger.debug('Referral parameter detected:', ref);
  
  if (ref && isAddress(ref)) {
    logger.info('Setting valid referrer address:', ref);
    setReferrer(ref as Address);
    
    // Зберігаємо в localStorage
    const newReferralData = {
      referrer: ref as Address,
      timestamp: Date.now()
    };
    setReferralData(newReferralData);

    // Очищаємо URL
    const url = new URL(window.location.href);
    url.searchParams.delete('ref');
    window.history.replaceState({}, '', url.pathname);
    
    logger.info('Saved referral data:', newReferralData);
  } else if (ref) {
    logger.warn('Invalid referrer address detected:', ref);
  }
}, [searchParams]);

  // Helper functions
  const formatValue = (value: bigint | undefined): string => {
    if (!value) {
      logger.debug('Formatting empty value to 0');
      return '0';
    }
    try {
      const formatted = Number(formatEther(value)).toFixed(2);
      logger.debug('Formatted value:', { raw: value.toString(), formatted });
      return formatted;
    } catch (error) {
      logger.error('Error formatting value', error);
      return '0';
    }
  };

  const calculateLevel = (amount: number): { 
    level: string; 
    progress: number; 
    next: number 
  } => {
    logger.debug('Calculating level for amount:', amount);

    if (amount >= LEVEL_THRESHOLDS.PLATINUM) {
      logger.debug('PLATINUM level achieved');
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
      logger.debug('GOLD level calculated:', { progress });
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
      logger.debug('SILVER level calculated:', { progress });
      return { 
        level: 'SILVER', 
        progress, 
        next: LEVEL_THRESHOLDS.GOLD 
      };
    }

    const progress = (amount / LEVEL_THRESHOLDS.SILVER) * 100;
    logger.debug('BRONZE level calculated:', { progress });
    return { 
      level: 'BRONZE', 
      progress, 
      next: LEVEL_THRESHOLDS.SILVER 
    };
  };

const processStakeInfo = (info: any): StakeInfo | null => {
    logger.debug('Processing stake info:', info);

    if (!info) {
      logger.info('No staker info available');
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

      logger.debug('Raw stake values:', {
        amount: amount.toString(),
        startTime,
        lockPeriod,
        multiplier,
        lastRewardCalculation,
        totalHistoricalStake: totalHistoricalStake.toString(),
        isActive
      });

      if (amount <= BigInt(0)) {
        logger.info('Zero or negative stake amount detected');
        return null;
      }

      const now = Math.floor(Date.now() / 1000);
      const unlockTime = startTime + lockPeriod;
      const timeRemaining = unlockTime - now;

      logger.debug('Time calculations:', {
        now,
        unlockTime,
        timeRemaining
      });

      const amountNumber = Number(formatValue(amount));
      const levelInfo = calculateLevel(amountNumber);
      const levelBonus = LEVEL_BONUSES[levelInfo.level as keyof typeof LEVEL_BONUSES] || 0;

      logger.debug('Level calculations:', {
        amountNumber,
        level: levelInfo.level,
        levelBonus
      });

      // Reward calculations
      const baseAnnualReward = amountNumber * 0.05;
      const periodMultiplier = multiplier / 100;
      const withPeriodBonus = baseAnnualReward * periodMultiplier;
      const withLevelBonus = withPeriodBonus * (1 + levelBonus / 100);

      logger.debug('Reward calculations:', {
        baseAnnualReward,
        periodMultiplier,
        withPeriodBonus,
        withLevelBonus
      });

      const yearInDays = 365;
      const daysSinceLastCalculation = (now - lastRewardCalculation) / (24 * 60 * 60);
      const proRatedRewards = withLevelBonus * (daysSinceLastCalculation / yearInDays);

      logger.debug('Pro-rated rewards:', {
        daysSinceLastCalculation,
        proRatedRewards
      });

      const referralBonus = formatValue(info[9] as bigint);
      logger.debug('Referral bonus:', referralBonus);

      const processedStake = {
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

      logger.debug('Processed stake info:', processedStake);
      return processedStake;

    } catch (error) {
      logger.error('Error processing stake info', error);
      return null;
    }
  };

  const checkCooldown = async (): Promise<boolean> => {
    logger.debug('Checking cooldown');
    try {
      const now = Math.floor(Date.now() / 1000);
      const lastAction = Number(lastActionTime || 0);
      const cooldownTime = 3600;

      logger.debug('Cooldown check values:', {
        now,
        lastAction,
        cooldownTime,
        timeSinceLastAction: now - lastAction
      });

      if (lastAction + cooldownTime > now) {
        const waitTime = lastAction + cooldownTime - now;
        const minutes = Math.ceil(waitTime / 60);
        logger.warn('Cooldown active:', { waitTime, minutes });
        showToast(`Please wait ${minutes} minutes before next action`, 'error');
        return false;
      }

      logger.debug('Cooldown check passed');
      return true;
    } catch (error) {
      logger.error('Cooldown check error', error);
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
      logger.error('Error fetching last action time', error);
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
      logger.info('Total staked updated:', formatValue(data as bigint));
    },
    onError: (error) => {
      logger.error('Error fetching total staked', error);
    }
  });

  const { data: rewardPool, error: rewardPoolError } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'rewardPool',
    watch: true,
    onSuccess: (data) => {
      logger.info('Reward pool updated:', formatValue(data as bigint));
    },
    onError: (error) => {
      logger.error('Error fetching reward pool', error);
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
      logger.info('Staker info updated:', {
        address,
        data: {
          amount: formatValue(data[0] as bigint),
          startTime: Number(data[1]),
          lockPeriod: Number(data[2]),
          referrer: data[7],
          referralCount: Number(data[8]),
          isActive: data[12]
        }
      });
    },
    onError: (error) => {
      logger.error('Error fetching staker info', error);
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
      logger.error('Error fetching pending rewards', error);
    }
  });

  const { data: totalBurned, error: totalBurnedError } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'totalBurned',
    watch: true,
    onSuccess: (data) => {
      logger.info('Total burned updated:', formatValue(data as bigint));
    },
    onError: (error) => {
      logger.error('Error fetching total burned', error);
    }
  });

  const processUserStats = useCallback((): UserStats | undefined => {
    logger.debug('Processing user stats');
    
    if (!stakerInfo) {
      logger.info('No staker info available for stats processing');
      return undefined;
    }

    try {
      const amount = Number(formatValue(stakerInfo[0] as bigint));
      const totalHistoricalStake = formatValue(stakerInfo[10] as bigint);
      const levelInfo = calculateLevel(amount);
      const stakeInfo = processStakeInfo(stakerInfo);

      const stats = {
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

      logger.debug('Processed user stats:', stats);
      return stats;
    } catch (error) {
      logger.error('Error processing user stats', error);
      return undefined;
    }
  }, [stakerInfo, referralsData, referralLevels]);

  // Contract writes
  const { writeAsync: stake, data: stakeTx } = useContractWrite({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'createStake',
    onError: (error) => {
      logger.error('Stake write error', error);
    }
  });

  const { writeAsync: unstake, data: unstakeTx } = useContractWrite({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'unstake',
    onError: (error) => {
      logger.error('Unstake write error', error);
    }
  });

  const { writeAsync: claimReward, data: claimTx } = useContractWrite({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'claimReward',
    onError: (error) => {
      logger.error('Claim write error', error);
    }
  });

  // Referral registration
  const { writeAsync: registerReferrer, data: referrerTx } = useContractWrite({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'registerReferrer',
    onError: (error) => {
      logger.error('Register referrer write error', error);
    }
  });

  // Transaction watchers
  useWaitForTransaction({
    hash: stakeTx?.hash,
    onSuccess: async () => {
      logger.info('Stake transaction successful', { hash: stakeTx?.hash });
      showToast('Successfully staked tokens!', 'success');

      // Referral registration after successful stake
      if (referrer && !stakerInfo?.[7]) {
        logger.info('Attempting to register referrer after stake', { referrer });
        try {
          await registerReferrer({ args: [referrer] });
          logger.info('Referral registration successful', { referrer });
          showToast('Referral registered successfully', 'success');
        } catch (error) {
          logger.error('Referral registration error after stake', error);
          showToast('Failed to register referral', 'error');
        }
      } else {
        logger.debug('No referrer to register or referrer already set', {
          referrer,
          existingReferrer: stakerInfo?.[7]
        });
      }
      
      refetchAll();
    },
    onError: (error) => {
      logger.error('Stake transaction error', error);
      showToast(`Failed to stake: ${error.message}`, 'error');
    },
  });

  useWaitForTransaction({
    hash: unstakeTx?.hash,
    onSuccess: () => {
      logger.info('Unstake transaction successful', { hash: unstakeTx?.hash });
      showToast('Successfully unstaked tokens!', 'success');
      refetchAll();
    },
    onError: (error) => {
      logger.error('Unstake transaction error', error);
      showToast(`Failed to unstake: ${error.message}`, 'error');
    },
  });

  useWaitForTransaction({
    hash: claimTx?.hash,
    onSuccess: () => {
      logger.info('Claim transaction successful', { hash: claimTx?.hash });
      showToast('Successfully claimed rewards!', 'success');
      refetchAll();
    },
    onError: (error) => {
      logger.error('Claim transaction error', error);
      showToast(`Failed to claim: ${error.message}`, 'error');
    },
  });

  useWaitForTransaction({
    hash: referrerTx?.hash,
    onSuccess: () => {
      logger.info('Referrer registration transaction successful', { 
        hash: referrerTx?.hash,
        referrer 
      });
      showToast('Successfully registered referrer!', 'success');
      refetchAll();
    },
    onError: (error) => {
      logger.error('Referrer registration transaction error', error);
      showToast(`Failed to register referrer: ${error.message}`, 'error');
    },
  });

const refetchAll = useCallback(() => {
    logger.debug('Refetching all data');
    refetchTotalStaked();
    refetchStakerInfo();
    refetchRewards();
  }, [refetchTotalStaked, refetchStakerInfo, refetchRewards]);

  // Функція для реєстрації реферера
  const registerNewReferrer = async (referrerAddress: string): Promise<boolean> => {
    logger.info('Starting referrer registration process', { referrerAddress });
    
    try {
      if (!isAddress(referrerAddress)) {
        logger.error('Invalid referrer address format', { referrerAddress });
        throw new Error('Invalid referrer address format');
      }

      logger.debug('Registering referrer', { referrerAddress });
      await registerReferrer({ args: [referrerAddress as `0x${string}`] });
      
      logger.info('Referrer registration transaction submitted', { referrerAddress });
      refetchAll();
      return true;
    } catch (error) {
      logger.error('Register referrer error', error);
      throw error;
    }
  };

  const stakeTokens = async (amount: string, periodIndex: number): Promise<boolean> => {
    logger.info('Starting stake process', { amount, periodIndex });
    
    try {
      // Check cooldown
      if (!(await checkCooldown())) {
        logger.warn('Stake blocked by cooldown');
        return false;
      }

      // Get current stats
      const stats = processUserStats();
      logger.debug('Current user stats for stake', { stats });

      // Calculate total pending rewards
      const currentPendingRewards = Number(stats?.stakeInfo?.pendingRewards || '0');
      const currentReferralRewards = Number(stats?.stakeInfo?.referralBonus || '0');
      const totalCurrentRewards = currentPendingRewards + currentReferralRewards;

      logger.debug('Pending rewards check', {
        currentPendingRewards,
        currentReferralRewards,
        totalCurrentRewards
      });

      // Check for unclaimed rewards
      if (totalCurrentRewards > 0) {
        logger.warn('Unclaimed rewards detected', { totalCurrentRewards });
        showToast(
          'You have unclaimed rewards. Please claim your rewards before creating a new stake.',
          'warning'
        );
        setShowWarningModal(true);
        return false;
      }

      // Prepare stake transaction
      logger.info('Preparing stake transaction', {
        parsedAmount: parseEther(amount),
        periodIndex: BigInt(periodIndex)
      });

      showToast('Initiating staking transaction...', 'loading');
      await stake({ args: [parseEther(amount), BigInt(periodIndex)] });
      
      logger.info('Stake transaction submitted successfully');
      showToast('Please confirm the transaction', 'info');
      return true;
    } catch (error) {
      logger.error('Staking error', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to stake tokens',
        'error'
      );
      return false;
    }
  };

  const unstakeTokens = async (): Promise<boolean> => {
    logger.info('Starting unstake process');
    
    try {
      if (!(await checkCooldown())) {
        logger.warn('Unstake blocked by cooldown');
        return false;
      }

      const stats = processUserStats();
      logger.debug('Current user stats for unstake', { stats });

      if (!stats?.stakeInfo?.isActive) {
        logger.warn('No active stake found for unstake');
        showToast('No active stake found', 'error');
        return false;
      }

      if (stats.stakeInfo.isLocked) {
        const days = Math.ceil(stats.stakeInfo.timeRemaining / 86400);
        logger.warn('Stake is still locked', { daysRemaining: days });
        showToast(`Stake is locked for ${days} more days`, 'error');
        return false;
      }

      logger.info('Initiating unstake transaction');
      showToast('Initiating unstaking transaction...', 'loading');
      await unstake();
      
      logger.info('Unstake transaction submitted successfully');
      showToast('Please confirm the transaction', 'info');
      return true;
    } catch (error) {
      logger.error('Unstaking error', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to unstake tokens',
        'error'
      );
      return false;
    }
  };

  const claimRewards = async (): Promise<boolean> => {
    logger.info('Starting claim rewards process');
    
    try {
      if (!(await checkCooldown())) {
        logger.warn('Claim blocked by cooldown');
        return false;
      }

      const stats = processUserStats();
      logger.debug('Current user stats for claim', { stats });

      if (!stats?.stakeInfo?.isActive) {
        logger.warn('No active stake found for claim');
        showToast('No active stake found', 'error');
        return false;
      }

      const totalRewards = Number(stats.stakeInfo.pendingRewards) + 
                          Number(stats.stakeInfo.referralBonus);
      
      logger.debug('Total rewards to claim', { totalRewards });
      
      if (totalRewards === 0) {
        logger.warn('No rewards available to claim');
        showToast('No rewards to claim', 'error');
        return false;
      }

      logger.info('Initiating claim transaction');
      showToast('Claiming rewards...', 'loading');
      await claimReward();
      
      logger.info('Claim transaction submitted successfully');
      showToast('Please confirm the claim transaction', 'info');
      return true;
    } catch (error) {
      logger.error('Claim error', error);
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