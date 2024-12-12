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

  // Base contract reads
  const { data: totalStaked } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'totalStaked' as const,
  });

  const { data: rewardPool } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'rewardPool' as const,
  });

  const { data: totalBurned } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'totalBurned' as const,
  });

  // Staking
  const { writeAsync: createStake, data: stakeTx } = useContractWrite({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'createStake' as const,
  });

  const { isLoading: isStakeLoading, isSuccess: isStakeSuccess } = useWaitForTransaction({
    hash: stakeTx?.hash,
  });

  // Claim rewards
  const { data: claimTx, writeAsync: claimRewards } = useContractWrite({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: '_claimReward' as const,
  });

  const { isLoading: isClaimLoading, isSuccess: isClaimSuccess } = useWaitForTransaction({
    hash: claimTx?.hash,
  });

  // Referral system
  const { writeAsync: registerReferral, data: referralTx } = useContractWrite({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'registerReferral' as const,
  });

  const { isLoading: isReferralLoading, isSuccess: isReferralSuccess } = useWaitForTransaction({
    hash: referralTx?.hash,
  });

  // Get user stake info
  const { data: userStakeInfo } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'getUserStakeInfo' as const,
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  // Staking functions
  const stakeTokens = async (amount: string, periodIndex: number): Promise<boolean> => {
    try {
      showToast('Initiating staking transaction...', 'loading');
      
      const tx = await createStake?.({ 
        args: [parseEther(amount), BigInt(periodIndex)],
      });
      
      if (!tx) throw new Error('Failed to create stake transaction');
      
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

  // Claim rewards function
  const claimStakingRewards = async (): Promise<boolean> => {
    try {
      showToast('Claiming rewards...', 'loading');
      
      const tx = await claimRewards?.();
      if (!tx) throw new Error('Failed to create claim transaction');
      
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

  // Referral functions
  const referralActions = {
    register: async (referrerAddress: string): Promise<boolean> => {
      try {
        showToast('Registering referral...', 'loading');
        
        const tx = await registerReferral?.({ 
          args: [referrerAddress] 
        });
        
        if (!tx) throw new Error('Failed to create referral transaction');
        
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

    getReferralsInfo: useCallback(async (): Promise<ReferralInfo[]> => {
      if (!address) return [];
      
      setIsLoadingReferrals(true);
      showToast('Loading referrals...', 'loading');
      
      try {
        // Implement referral info fetching logic here
        return [];
      } catch (error) {
        showToast('Failed to load referrals', 'error');
        return [];
      } finally {
        setIsLoadingReferrals(false);
      }
    }, [address, showToast]),

    generateReferralLink: (baseUrl: string): string => {
      if (!address) return '';
      return `${baseUrl}/ref/${address}`;
    },
  };

  // Formatting and calculations
  const formatValue = (value: bigint | undefined): string => {
    if (!value) return '0';
    return formatEther(value);
  };

  // Calculate user level
  const calculateUserLevel = (stakedAmount: string): UserStats['level'] => {
    const amount = parseFloat(stakedAmount);
    if (amount >= 100_000_000) return 'PLATINUM';
    if (amount >= 10_000_000) return 'GOLD';
    if (amount >= 1_000_000) return 'SILVER';
    return 'BRONZE';
  };

  // Process user stats
  const userStats: UserStats | undefined = userStakeInfo ? {
    stakedAmount: formatValue(userStakeInfo[0] as bigint),
    lockPeriod: Number(userStakeInfo[2]),
    referralCount: 0, // Implement proper referral count
    pendingRewards: '0', // Implement pending rewards calculation
    level: calculateUserLevel(formatValue(userStakeInfo[0] as bigint)),
    levelProgress: 0, // Implement level progress calculation
    nextLevelThreshold: '1000000', // Implement next level threshold
    totalReferralRewards: '0', // Implement total referral rewards
  } : undefined;

  return {
    // Base statistics
    stats: {
      totalStaked: formatValue(totalStaked as bigint),
      rewardPool: formatValue(rewardPool as bigint),
      totalBurned: formatValue(totalBurned as bigint),
    },
    
    // Staking functions
    staking: {
      stakeTokens,
      claimStakingRewards,
      isStakeLoading,
      isStakeSuccess,
      isClaimLoading,
      isClaimSuccess,
    },
    
    // Referral system
    referral: {
      isLoadingReferrals,
      isReferralLoading,
      isReferralSuccess,
      ...referralActions,
    },
    
    // User information
    userStats,
    
    // Errors
    errors: {
      hasError: false,
      errorMessage: '',
    },
  };
}