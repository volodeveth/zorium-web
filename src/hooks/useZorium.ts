import { useContractRead, useContractWrite, useAccount, useWaitForTransaction } from 'wagmi';
import { ZORIUM_CONTRACT_ADDRESS, ZORIUM_ABI } from '@/constants/contract';
import { parseEther, formatEther } from 'viem';
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/useToast';

export interface ReferralInfo {
  address: string;
  pendingRewards: string;
  claimedRewards: string;
  lastUpdate: string;
}

export interface UserStats {
  stakedAmount: string;
  lockPeriod: number;
  referralCount: number;
  pendingRewards: string;
  level: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  levelProgress: number;
  nextLevelThreshold: string;
  totalReferralRewards: string;
}

export interface StakeInfo {
  amount: string;
  periodIndex: number;
  multiplier: number;
  lockPeriod: number;
  since: Date;
}

export function useZorium() {
  const { address } = useAccount();
  const { showToast } = useToast();
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(false);

  // Базові читання з контракту
  const { data: totalStaked } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'totalStaked',
  }) as { data: bigint | undefined };

  const { data: rewardPool } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'rewardPool',
  }) as { data: bigint | undefined };

  const { data: totalBurned } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'totalBurned',
  }) as { data: bigint | undefined };

  // Стейкінг
  const { write: createStake, data: stakeTx } = useContractWrite({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'createStake',
  });

  const { isLoading: isStakeLoading, isSuccess: isStakeSuccess } = useWaitForTransaction({
    hash: stakeTx?.hash,
  });

  // Claim rewards
  const { data: claimTx, write: claimRewards } = useContractWrite({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: '_claimReward',
  });

  const { isLoading: isClaimLoading, isSuccess: isClaimSuccess } = useWaitForTransaction({
    hash: claimTx?.hash,
  });

  // Реферальна система
  const { write: registerReferral, data: referralTx } = useContractWrite({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'registerReferral',
  });

  const { isLoading: isReferralLoading, isSuccess: isReferralSuccess } = useWaitForTransaction({
    hash: referralTx?.hash,
  });

  // Отримання інформації про стейк користувача
  const { data: userStakeInfo } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'getUserStakeInfo',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  // Стейкінг функції
  const stakeTokens = async (amount: string, periodIndex: number) => {
    try {
      showToast('Initiating staking transaction...', 'loading');
      
      await createStake({ 
        args: [parseEther(amount), BigInt(periodIndex)],
      });
      
      showToast('Please confirm the transaction in your wallet', 'info');
      
      if (isStakeSuccess) {
        showToast('Tokens staked successfully!', 'success');
        return true;
      }
      
      return false;
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to stake tokens',
        'error'
      );
      return false;
    }
  };

  // Claim rewards функція
  const claimStakingRewards = async () => {
    try {
      showToast('Claiming rewards...', 'loading');
      
      await claimRewards();
      
      showToast('Please confirm the claim transaction', 'info');
      
      if (isClaimSuccess) {
        showToast('Rewards claimed successfully!', 'success');
        return true;
      }
      
      return false;
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to claim rewards',
        'error'
      );
      return false;
    }
  };

  // Реферальні функції
  const referralActions = {
    register: async (referrerAddress: string) => {
      try {
        showToast('Registering referral...', 'loading');
        
        await registerReferral({ 
          args: [referrerAddress] 
        });
        
        showToast('Please confirm the referral registration', 'info');
        
        if (isReferralSuccess) {
          showToast('Referral registered successfully!', 'success');
          return true;
        }
        
        return false;
      } catch (error) {
        showToast(
          error instanceof Error ? error.message : 'Failed to register referral',
          'error'
        );
        return false;
      }
    },

    getReferralsInfo: useCallback(async () => {
      if (!address) return [];
      
      setIsLoadingReferrals(true);
      showToast('Loading referrals...', 'loading');
      
      try {
        // Логіка отримання інформації про рефералів
        // ... (залишається без змін)
        
        return [];
      } catch (error) {
        showToast('Failed to load referrals', 'error');
        return [];
      } finally {
        setIsLoadingReferrals(false);
      }
    }, [address, showToast]),

    generateReferralLink: (baseUrl: string) => {
      if (!address) return '';
      return `${baseUrl}/ref/${address}`;
    },
  };

  // Форматування та розрахунки
  const formatValue = (value: bigint | undefined) => {
    if (!value) return '0';
    return formatEther(value);
  };

  // Розрахунок рівня користувача
  const calculateUserLevel = (stakedAmount: string): UserStats['level'] => {
    const amount = parseFloat(stakedAmount);
    if (amount >= 100_000_000) return 'PLATINUM';
    if (amount >= 10_000_000) return 'GOLD';
    if (amount >= 1_000_000) return 'SILVER';
    return 'BRONZE';
  };

  return {
    // Базова статистика
    stats: {
      totalStaked: formatValue(totalStaked),
      rewardPool: formatValue(rewardPool),
      totalBurned: formatValue(totalBurned),
    },
    
    // Стейкінг функції
    staking: {
      stakeTokens,
      claimStakingRewards,
      isStakeLoading,
      isStakeSuccess,
      isClaimLoading,
      isClaimSuccess,
    },
    
    // Реферальна система
    referral: {
      isLoadingReferrals,
      isReferralLoading,
      isReferralSuccess,
      ...referralActions,
    },
    
    // Інформація про користувача
    userStats,
    
    // Помилки
    errors: {
      hasError: false,
      errorMessage: '',
    },
  };
}