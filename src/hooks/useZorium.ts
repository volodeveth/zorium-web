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

const REFERRAL_COMMISSIONS = [15, 8, 5] as const; // Percentage for each level
export function useZorium() {
  // Base hooks and states
  const { address } = useAccount();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  
  // States
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(false);
  const [referralsData, setReferralsData] = useState<ReferralInfo[]>([]);
  const [referralLevels, setReferralLevels] = useState<ReferralLevelInfo[]>([]);
  const [referrer, setReferrer] = useState<Address | null>(null);

  // Referrer from URL effect
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref && isAddress(ref)) {
      setReferrer(ref as Address);
    }
  }, [searchParams]);

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
          await registerReferrer({ 
            args: [referrer]
          });
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

  // Helper function to refetch all data
  const refetchAll = useCallback(() => {
    refetchTotalStaked();
    refetchStakerInfo();
    refetchRewards();
  }, [refetchTotalStaked, refetchStakerInfo, refetchRewards]);
  // Helper functions
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

  const formatValue = (value: bigint | undefined): string => {
    if (!value) return '0';
    try {
      return Number(formatEther(value)).toFixed(2);
    } catch (error) {
      console.error('[ZORIUM] Error formatting value:', error);
      return '0';
    }
  };

  const getReferralInfo = useCallback(async (
    referralAddress: Address
  ): Promise<ReferralInfo | null> => {
    try {
      const referralStaker = await readContract({
        address: ZORIUM_CONTRACT_ADDRESS,
        abi: ZORIUM_ABI,
        functionName: 'stakers',
        args: [referralAddress],
      });

      if (!referralStaker) return null;

      const amount = Number(formatValue(referralStaker[0] as bigint));
      const levelInfo = calculateLevel(amount);
      const referralBonus = formatValue(referralStaker[9] as bigint);

      return {
        address: referralAddress,
        isActive: referralStaker[12] as boolean,
        amount: amount.toString(),
        since: Number(referralStaker[1]),
        level: levelInfo.level,
        rewards: {
          pending: referralBonus,
          total: formatValue(referralStaker[11] as bigint),
          lastUpdate: Number(referralStaker[4])
        }
      };
    } catch (error) {
      console.error('[ZORIUM] Error fetching referral info:', error);
      return null;
    }
  }, []);

  const processReferralLevels = useCallback((
    referrals: ReferralInfo[]
  ): ReferralLevelInfo[] => {
    try {
      return REFERRAL_COMMISSIONS.map((commission, index) => {
        const levelReferrals = referrals.filter(
          ref => ref.level === index.toString()
        );
        const activeReferrals = levelReferrals.filter(
          ref => ref.isActive
        );
        
        return {
          level: index,
          count: levelReferrals.length,
          activeCount: activeReferrals.length,
          totalEarned: levelReferrals.reduce(
            (acc, ref) => acc + Number(ref.rewards?.total || 0), 
            0
          ).toFixed(2),
          pendingRewards: levelReferrals.reduce(
            (acc, ref) => acc + Number(ref.rewards?.pending || 0), 
            0
          ).toFixed(2),
          commission
        };
      });
    } catch (error) {
      console.error('[ZORIUM] Error processing referral levels:', error);
      return [];
    }
  }, []);
  // Load referrals data
  useEffect(() => {
    const loadReferralsData = async () => {
      if (!stakerInfo?.[9]) return;
      
      // Перетворюємо та перевіряємо кожну адресу
      if (!Array.isArray(stakerInfo[9])) {
        console.error('[ZORIUM] Invalid referrals data format');
        return;
      }

      const referrals = (stakerInfo[9] as unknown[])
        .filter((addr): addr is string => 
          typeof addr === 'string' && isAddress(addr)
        )
        .map(addr => addr as Address);

      if (!referrals.length) return;

      setIsLoadingReferrals(true);
      try {
        const data = await Promise.all(
          referrals.map(address => getReferralInfo(address))
        );
        const validReferrals = data.filter((info): info is ReferralInfo => info !== null);
        setReferralsData(validReferrals);
        setReferralLevels(processReferralLevels(validReferrals));
      } catch (error) {
        console.error('[ZORIUM] Error loading referrals data:', error);
      } finally {
        setIsLoadingReferrals(false);
      }
    };

    loadReferralsData();
  }, [stakerInfo, getReferralInfo, processReferralLevels]);

  const calculatePotentialRewards = (amount: string, periodIndex: number) => {
    const baseAmount = Number(amount);
    if (!baseAmount) return { 
      baseReward: '0', 
      withMultiplier: '0', 
      withLevelBonus: '0', 
      apy: 0 
    };

    try {
      // Base annual reward is 5% of stake amount
      const baseAnnualReward = baseAmount * 0.05;
      
      // Get period multiplier (1.5x for 90 days, etc)
      const periodMultiplier = [1, 1.5, 2, 3][periodIndex] || 1;
      const withPeriodBonus = baseAnnualReward * periodMultiplier;
      
      // Get level bonus
      const stats = processUserStats();
      const currentLevel = stats?.level || 'BRONZE';
      const levelBonus = LEVEL_BONUSES[currentLevel as keyof typeof LEVEL_BONUSES] || 0;
      const withLevelBonus = withPeriodBonus * (1 + levelBonus / 100);

      // Calculate APY
      const periodDays = [30, 90, 180, 365][periodIndex] || 30;
      const periodFraction = periodDays / 365;
      const periodReward = withLevelBonus * periodFraction;
      const apy = (periodReward / baseAmount) * (365 / periodDays) * 100;

      console.log('[ZORIUM] Potential rewards calculation:', {
        baseAmount,
        baseAnnualReward,
        periodMultiplier,
        withPeriodBonus,
        levelBonus,
        withLevelBonus,
        apy
      });

      return {
        baseReward: baseAnnualReward.toFixed(2),
        withMultiplier: withPeriodBonus.toFixed(2),
        withLevelBonus: withLevelBonus.toFixed(2),
        apy: Number(apy.toFixed(2))
      };
    } catch (error) {
      console.error('[ZORIUM] Error calculating potential rewards:', error);
      return {
        baseReward: '0',
        withMultiplier: '0',
        withLevelBonus: '0',
        apy: 0
      };
    }
  };
  // Security and validation functions
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

  // Action functions
  const stakeTokens = async (
    amount: string, 
    periodIndex: number
  ): Promise<boolean> => {
    try {
      if (!(await checkCooldown())) return false;

      showToast('Initiating staking transaction...', 'loading');
      console.log('[ZORIUM] Staking params:', {
        amount: parseEther(amount),
        periodIndex: BigInt(periodIndex)
      });

      const tx = await stake({ 
        args: [parseEther(amount), BigInt(periodIndex)] 
      });
      
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

      if (stats.stakeInfo.isLocked) {
        const days = Math.ceil(stats.stakeInfo.timeRemaining / 86400);
        showToast(`Stake is locked for ${days} more days`, 'error');
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

  // Return hook data and functions
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
    },
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
      checkCooldown,
      calculatePotentialRewards
    },
  };
}
