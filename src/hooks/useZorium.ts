// src/hooks/useZorium.ts
import { useContractRead, useContractWrite, useAccount, useWaitForTransaction } from 'wagmi';
import { readContract } from '@wagmi/core';
import { ZORIUM_CONTRACT_ADDRESS, ZORIUM_ABI, UserLevel as ContractUserLevel, CONSTANTS } from '@/constants/contract';
import { parseEther, formatEther, isAddress, Address } from 'viem';
import { useState, useCallback, useEffect } from 'react';
import { useToast } from './useToast';
import { useSearchParams } from 'next/navigation';
import { useLocalStorage } from './useLocalStorage';
import _ from 'lodash';

// Debug logger configuration
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
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM'
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
  level: UserLevel;
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
  level: UserLevel;
  rewards: {
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
  level: UserLevel;
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
  [UserLevel.BRONZE]: CONSTANTS.SILVER_THRESHOLD,
  [UserLevel.SILVER]: CONSTANTS.GOLD_THRESHOLD,
  [UserLevel.GOLD]: CONSTANTS.PLATINUM_THRESHOLD,
  [UserLevel.PLATINUM]: CONSTANTS.PLATINUM_THRESHOLD,
} as const;

const LEVEL_BONUSES = {
  [UserLevel.BRONZE]: CONSTANTS.SILVER_BONUS,
  [UserLevel.SILVER]: CONSTANTS.GOLD_BONUS,
  [UserLevel.GOLD]: CONSTANTS.PLATINUM_BONUS,
  [UserLevel.PLATINUM]: CONSTANTS.PLATINUM_BONUS,
} as const;

const REFERRAL_COMMISSIONS = CONSTANTS.REFERRAL_COMMISSIONS;

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
          isActive: data[12],
          referrals: data[13] // Масив рефералів
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

  // Effect for handling referral parameters
  useEffect(() => {
    const ref = searchParams.get('ref');
    logger.debug('Referral parameter detected:', ref);
    
    // Перевіряємо, чи не обробляли ми вже цей реферальний код
    const processedRef = localStorage.getItem('processed_ref');
    
    if (ref && isAddress(ref) && processedRef !== ref) {
        logger.info('Setting valid referrer address:', ref);
        setReferrer(ref as Address);
        
        // Save to localStorage
        const newReferralData = {
            referrer: ref as Address,
            timestamp: Date.now()
        };
        setReferralData(newReferralData);
        
        // Зберігаємо оброблений реферальний код
        localStorage.setItem('processed_ref', ref);
        
        // Затримка очищення URL
        setTimeout(() => {
            if (typeof window !== 'undefined' && window.location.search.includes('ref=')) {
                const url = new URL(window.location.href);
                url.searchParams.delete('ref');
                window.history.replaceState({}, '', url.pathname + url.hash);
            }
        }, 1000);
        
        logger.info('Saved referral data:', newReferralData);
    } else if (ref) {
        if (!isAddress(ref)) {
            logger.warn('Invalid referrer address detected:', ref);
        } else if (processedRef === ref) {
            logger.debug('Referral code already processed:', ref);
        }
    }
}, [searchParams]);

    // Додайте ефект очищення обробленого рефа при розмонтуванні
    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('processed_ref');
            }
        };
    }, []);

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
    level: UserLevel; 
    progress: number; 
    next: number 
  } => {
    logger.debug('Calculating level for amount:', amount);

    if (amount >= Number(formatEther(CONSTANTS.PLATINUM_THRESHOLD))) {
      logger.debug('PLATINUM level achieved');
      return { 
        level: UserLevel.PLATINUM, 
        progress: 100, 
        next: Number(formatEther(CONSTANTS.PLATINUM_THRESHOLD))
      };
    }

    if (amount >= Number(formatEther(CONSTANTS.GOLD_THRESHOLD))) {
      const progress = (
        (amount - Number(formatEther(CONSTANTS.GOLD_THRESHOLD))) / 
        (Number(formatEther(CONSTANTS.PLATINUM_THRESHOLD)) - Number(formatEther(CONSTANTS.GOLD_THRESHOLD)))
      ) * 100;
      logger.debug('GOLD level calculated:', { progress });
      return { 
        level: UserLevel.GOLD, 
        progress, 
        next: Number(formatEther(CONSTANTS.PLATINUM_THRESHOLD))
      };
    }

    if (amount >= Number(formatEther(CONSTANTS.SILVER_THRESHOLD))) {
      const progress = (
        (amount - Number(formatEther(CONSTANTS.SILVER_THRESHOLD))) / 
        (Number(formatEther(CONSTANTS.GOLD_THRESHOLD)) - Number(formatEther(CONSTANTS.SILVER_THRESHOLD)))
      ) * 100;
      logger.debug('SILVER level calculated:', { progress });
      return { 
        level: UserLevel.SILVER, 
        progress, 
        next: Number(formatEther(CONSTANTS.GOLD_THRESHOLD))
      };
    }

    const progress = (amount / Number(formatEther(CONSTANTS.SILVER_THRESHOLD))) * 100;
    logger.debug('BRONZE level calculated:', { progress });
    return { 
      level: UserLevel.BRONZE, 
      progress, 
      next: Number(formatEther(CONSTANTS.SILVER_THRESHOLD))
    };
  };

  const getLevelNumber = (level: UserLevel): number => {
    switch(level) {
      case UserLevel.PLATINUM: return 3;
      case UserLevel.GOLD: return 2;
      case UserLevel.SILVER: return 1;
      case UserLevel.BRONZE:
      default: return 0;
    }
  };

  const getLevelFromNumber = (levelNumber: ContractUserLevel): UserLevel => {
    switch(levelNumber) {
      case ContractUserLevel.PLATINUM: return UserLevel.PLATINUM;
      case ContractUserLevel.GOLD: return UserLevel.GOLD;
      case ContractUserLevel.SILVER: return UserLevel.SILVER;
      case ContractUserLevel.BRONZE:
      default: return UserLevel.BRONZE;
    }
  };

  const processStakeInfo = async (info: any): Promise<StakeInfo | null> => {
  logger.debug('Processing stake info:', info);

  if (!info || !Array.isArray(info)) {
    logger.info('No valid staker info available');
    return null;
  }

  try {
    // Розпаковуємо значення з масиву з перевірками
    const [
      amount,
      startTime,
      lockPeriod,
      multiplier,
      lastRewardCalculation,
      level,
      levelUpdated,
      referrer,
      referralCount,
      referralBonus,
      totalHistoricalStake,
      totalHistoricalRewards,
      isActive,
      referrals
    ] = info;

    if (!amount || amount === BigInt(0)) {
      logger.info('Zero or invalid stake amount detected');
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    const startTimeNum = Number(startTime || 0);
    const lockPeriodNum = Number(lockPeriod || 0);
    const unlockTime = startTimeNum + lockPeriodNum;
    const timeRemaining = unlockTime - now;

    const amountNumber = Number(formatValue(amount as bigint));
    const levelInfo = calculateLevel(amountNumber);
    const levelBonus = LEVEL_BONUSES[levelInfo.level] || 0;

    // Оновлений розрахунок винагород
    const baseAnnualReward = amountNumber * 0.05;
    const periodMultiplier = Number(multiplier || 0) / 100;
    const withPeriodBonus = baseAnnualReward * periodMultiplier;
    const withLevelBonus = withPeriodBonus * (1 + levelBonus / 100);

    const daysSinceLastCalculation = (now - Number(lastRewardCalculation || 0)) / (24 * 60 * 60);
    const proRatedRewards = withLevelBonus * (daysSinceLastCalculation / 365);

    const processedStake: StakeInfo = {
      totalAmount: formatValue(amount as bigint),
      startTime: startTimeNum,
      lockPeriod: lockPeriodNum,
      multiplier: Number(multiplier || 0),
      unlockTime,
      isLocked: timeRemaining > 0,
      timeRemaining: Math.max(0, timeRemaining),
      pendingRewards: proRatedRewards.toFixed(2),
      level: levelInfo.level,
      levelProgress: levelInfo.progress,
      levelBonus,
      isActive: Boolean(isActive),
      referralBonus: formatValue(referralBonus as bigint),
      totalHistoricalStake: formatValue(totalHistoricalStake as bigint)
    };

    logger.debug('Processed stake info:', processedStake);
    return processedStake;

  } catch (error) {
    logger.error('Error processing stake info', error);
    return null;
  }
};

// Функції для обробки рефералів
  const fetchReferralData = async (referralAddress: string): Promise<ReferralInfo | null> => {
    logger.debug('Fetching referral data for:', referralAddress);
  
    try {
      const referralStakeInfo = await readContract({
        address: ZORIUM_CONTRACT_ADDRESS,
        abi: ZORIUM_ABI,
        functionName: 'stakers',
        args: [referralAddress as `0x${string}`]
      });

      if (referralStakeInfo && Array.isArray(referralStakeInfo)) {
        const [
          amount,
          since,
          _lockPeriod,
          _multiplier,
          lastRewardCalculation,
          level,
          _levelUpdated,
          _referrer,
          _referralCount,
          referralBonus,
          _totalHistoricalStake,
          totalHistoricalRewards,
          isActive
        ] = referralStakeInfo;

        const formattedAmount = formatValue(amount as bigint);
        const levelInfo = calculateLevel(Number(formattedAmount));

        const referralInfo: ReferralInfo = {
          address: referralAddress as Address,
          isActive: Boolean(isActive),
          amount: formattedAmount,
          since: Number(since),
          level: getLevelFromNumber(Number(level) as ContractUserLevel),
          rewards: {
            pending: formatValue(referralBonus as bigint),
            total: formatValue(totalHistoricalRewards as bigint),
            lastUpdate: Number(lastRewardCalculation)
          }
        };

        logger.debug('Processed referral info:', referralInfo);
        return referralInfo;
      }
      return null;
    } catch (error) {
      logger.error('Error fetching referral data for address:', {
        address: referralAddress,
        error
      });
      return null;
    }
  };

  const processReferralLevels = (referrals: ReferralInfo[]): ReferralLevelInfo[] => {
    logger.debug('Processing referral levels for', referrals.length, 'referrals');

    const levels = [0, 1, 2].map(levelNumber => {
      const levelReferrals = referrals.filter(r => getLevelNumber(r.level) === levelNumber);
      logger.debug(`Processing level ${levelNumber}:`, levelReferrals);

      return {
        level: levelNumber,
        count: levelReferrals.length,
        activeCount: levelReferrals.filter(r => r.isActive).length,
        totalEarned: levelReferrals
          .reduce((sum, ref) => sum + Number(ref.rewards.total), 0)
          .toFixed(2),
        pendingRewards: levelReferrals
          .reduce((sum, ref) => sum + Number(ref.rewards.pending), 0)
          .toFixed(2),
        commission: CONSTANTS.REFERRAL_COMMISSIONS[levelNumber] || 0
      };
    });

    logger.debug('Processed referral levels:', levels);
    return levels;
  };

  // Effect для завантаження даних рефералів
  useEffect(() => {
    const loadReferralData = async () => {
      if (!address || !stakerInfo) {
        logger.debug('No address or staker info, skipping referral data load');
        return;
      }
      
      logger.info('Loading referral data for address:', address);
      setIsLoadingReferrals(true);
      
      try {
        const referralCount = Number(stakerInfo[8] || 0);
        logger.debug('Referral count:', referralCount);

        // Отримуємо масив адрес рефералів з stakerInfo
        const referralAddresses = stakerInfo[13] as string[] || [];
        logger.debug('Raw referrals addresses:', referralAddresses);

        if (referralAddresses.length > 0) {
          // Завантажуємо дані для кожного реферала
          const referralDataPromises = referralAddresses.map(fetchReferralData);
          const referralDataResults = await Promise.all(referralDataPromises);
          const validReferralData = referralDataResults.filter((data): data is ReferralInfo => data !== null);

          logger.debug('Loaded referral data:', validReferralData);
          setReferralsData(validReferralData);

          // Обробляємо рівні рефералів
          const levels = processReferralLevels(validReferralData);
          setReferralLevels(levels);

        } else {
          logger.debug('No referrals found');
          setReferralsData([]);
          setReferralLevels([]);
        }
      } catch (error) {
        logger.error('Error loading referral data', error);
        setReferralsData([]);
        setReferralLevels([]);
      } finally {
        setIsLoadingReferrals(false);
      }
    };

    loadReferralData();
  }, [address, stakerInfo]);

  // Effect для оновлення при зміні даних рефералів
  useEffect(() => {
    const updateReferralStats = () => {
      if (referralsData.length > 0) {
        logger.debug('Updating referral stats for', referralsData.length, 'referrals');
        const newLevels = processReferralLevels(referralsData);
        setReferralLevels(newLevels);
      }
    };

    updateReferralStats();
  }, [referralsData]);

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

      // Реєстрація реферера після успішного стейку
      if (referrer && !stakerInfo?.[7]) {
        logger.info('Attempting to register referrer after stake', { referrer });
        try {
          const tx = await registerReferrer({ args: [referrer] });
          logger.debug('Referral registration transaction:', tx);
          logger.info('Referral registration successful', { referrer });
          showToast('Referral registered successfully', 'success');
          
          // Очищаємо дані реферала після успішної реєстрації
          setReferrer(null);
          setReferralData(null);
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
      
      await refetchAll();
    },
    onError: (error) => {
      logger.error('Stake transaction error', error);
      showToast(`Failed to stake: ${error.message}`, 'error');
    },
  });

  useWaitForTransaction({
    hash: unstakeTx?.hash,
    onSuccess: async () => {
      logger.info('Unstake transaction successful', { hash: unstakeTx?.hash });
      showToast('Successfully unstaked tokens!', 'success');
      await refetchAll();
    },
    onError: (error) => {
      logger.error('Unstake transaction error', error);
      showToast(`Failed to unstake: ${error.message}`, 'error');
    },
  });

  useWaitForTransaction({
    hash: claimTx?.hash,
    onSuccess: async () => {
      logger.info('Claim transaction successful', { hash: claimTx?.hash });
      showToast('Successfully claimed rewards!', 'success');
      await refetchAll();
    },
    onError: (error) => {
      logger.error('Claim transaction error', error);
      showToast(`Failed to claim: ${error.message}`, 'error');
    },
  });

  useWaitForTransaction({
    hash: referrerTx?.hash,
    onSuccess: async () => {
      logger.info('Referrer registration transaction successful', { 
        hash: referrerTx?.hash,
        referrer 
      });
      showToast('Successfully registered referrer!', 'success');
      
      // Очищаємо дані реферала після успішної реєстрації
      setReferrer(null);
      setReferralData(null);
      
      await refetchAll();
    },
    onError: (error) => {
      logger.error('Referrer registration transaction error', error);
      showToast(`Failed to register referrer: ${error.message}`, 'error');
    },
  });

  const refetchAll = async () => {
    logger.debug('Refetching all data');
    try {
      await Promise.all([
        refetchTotalStaked(),
        refetchStakerInfo(),
        refetchRewards()
      ]);
      logger.debug('All data refetched successfully');
    } catch (error) {
      logger.error('Error refetching data', error);
    }
  };

// Action functions
  const stakeTokens = async (amount: string, periodIndex: number): Promise<boolean> => {
      logger.info('Starting stake process', { amount, periodIndex });
    
      try {
        // Перевірка кулдауна
        if (!(await checkCooldown())) {
          logger.warn('Stake blocked by cooldown');
          return false;
        }

        // Перевірка мінімальної суми
        if (Number(amount) < Number(formatEther(CONSTANTS.MINIMUM_STAKE))) {
          logger.warn('Amount below minimum stake', {
            amount,
            minimum: formatEther(CONSTANTS.MINIMUM_STAKE)
          });
          showToast(`Minimum stake amount is ${formatEther(CONSTANTS.MINIMUM_STAKE)} ZRM`, 'error');
          return false;
        }

        // Отримання поточної статистики
        const stats = await processUserStats();
        logger.debug('Current user stats for stake', { stats });

        if (!stats) {
          logger.warn('Failed to get user stats');
          showToast('Failed to get user stats', 'error');
          return false;
        }

        // Перевірка невиплачених винагород
        const currentPendingRewards = Number(stats.stakeInfo?.pendingRewards || '0');
        const currentReferralRewards = Number(stats.stakeInfo?.referralBonus || '0');
        const totalCurrentRewards = currentPendingRewards + currentReferralRewards;

      logger.debug('Pending rewards check', {
        currentPendingRewards,
        currentReferralRewards,
        totalCurrentRewards
      });

      if (totalCurrentRewards > 0) {
        logger.warn('Unclaimed rewards detected', { totalCurrentRewards });
        showToast(
          'You have unclaimed rewards. Please claim your rewards before creating a new stake.',
          'warning'
        );
        setShowWarningModal(true);
        return false;
      }

      // Підготовка транзакції стейкінгу
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

      const stats = await processUserStats();
      logger.debug('Current user stats for unstake', { stats });

      if (!stats) {
        logger.warn('Failed to get user stats');
        showToast('Failed to get user stats', 'error');
        return false;
      }

      if (!stats.stakeInfo?.isActive) {
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

      const stats = await processUserStats();
      logger.debug('Current user stats for claim', { stats });

      if (!stats) {
        logger.warn('Failed to get user stats');
        showToast('Failed to get user stats', 'error');
        return false;
      }

      if (!stats.stakeInfo?.isActive) {
        logger.warn('No active stake found for claim');
        showToast('No active stake found', 'error');
        return false;
      }

      if (stats.stakeInfo.isLocked) {
        logger.warn('Cannot claim while stake is locked');
        showToast('Cannot claim rewards while stake is locked', 'error');
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

  const checkCooldown = async (): Promise<boolean> => {
    logger.debug('Checking cooldown');
    try {
      const now = Math.floor(Date.now() / 1000);
      const lastAction = Number(lastActionTime || 0);
      const cooldownTime = 3600; // 1 година

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

  const processUserStats = useCallback(async (): Promise<UserStats | undefined> => {
      logger.debug('Processing user stats');
    
      if (!stakerInfo) {
        logger.info('No staker info available for stats processing');
        return undefined;
      }

      try {
        const amount = Number(formatValue(stakerInfo[0] as bigint));
        const totalHistoricalStake = formatValue(stakerInfo[10] as bigint);
        const levelInfo = calculateLevel(amount);
        const stakeInfoResult = await processStakeInfo(stakerInfo);

        if (!stakeInfoResult) {
          logger.warn('Failed to process stake info');
          return undefined;
        }

        const stats: UserStats = {
          totalStaked: amount.toString(),
          level: levelInfo.level,
          levelProgress: levelInfo.progress,
          nextLevelThreshold: levelInfo.next.toLocaleString(),
          isActive: stakerInfo[12] as boolean,
          referrer: stakerInfo[7] as Address,
          referralCount: Number(stakerInfo[8]),
          referrals: referralsData,
          stakeInfo: stakeInfoResult,
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

  const [userStatsData, setUserStatsData] = useState<UserStats | undefined>(undefined);

  useEffect(() => {
    const loadUserStats = async () => {
      const stats = await processUserStats();
      setUserStatsData(stats);
    };
    loadUserStats();
  }, [processUserStats]);
  
  // Return hook data
  return {
    // Global statistics
    stats: {
      totalStaked: formatValue(totalStaked as bigint),
      rewardPool: formatValue(rewardPool as bigint),
      totalBurned: formatValue(totalBurned as bigint),
    },
    
    // User specific data
    userStats: userStatsData,
    
    // Actions
    actions: {
      stake: stakeTokens,
      unstake: unstakeTokens,
      claim: claimRewards,
      registerReferrer: async (referrerAddress: string) => {
        try {
          await registerReferrer({ args: [referrerAddress as `0x${string}`] });
          return true;
        } catch (error) {
          logger.error('Register referrer error', error);
          throw error;
        }
      },
    },
    
    // Direct contract interaction
    stake,
    
    // Referral information
    referralInfo: {
      currentReferrer: stakerInfo?.[7] as Address,
      referrals: referralsData,
      referralCount: Number(stakerInfo?.[8] || 0),
      isLoadingReferrals,
      levels: referralLevels
    },
    
    // Utility functions
    utils: {
      formatValue,
      calculateLevel,
      checkCooldown
    },
    
    // Modal states
    modals: {
      showWarningModal,
      setShowWarningModal
    },

    // Loading states
    isLoading: {
      referrals: isLoadingReferrals
    },

    // Error states
    errors: {
      staker: stakerInfoError,
      rewards: pendingRewardsError,
      totals: totalStakedError
    }
  };
}