// src/hooks/useReferralHandler.ts

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLocalStorage } from './useLocalStorage';
import { Address } from 'viem';

interface ReferralData {
  referrer: string;
  timestamp: number;
}

export function useReferralHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [referralData, setReferralData] = useLocalStorage<ReferralData | null>('zorium_referral', null);
  
  useEffect(() => {
    try {
      // Логуємо початок обробки реферальних даних
      console.log('[REFERRAL] Starting referral data processing');
      console.log('[REFERRAL] Current localStorage data:', referralData);

      const ref = searchParams?.get('ref');
      console.log('[REFERRAL] URL ref parameter:', ref);

      const now = Date.now();
      const REFERRAL_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
      console.log('[REFERRAL] Current timestamp:', now);

      // Перевірка і очищення застарілих реферальних даних
      if (referralData) {
        console.log('[REFERRAL] Checking data expiration');
        console.log('[REFERRAL] Data age:', now - referralData.timestamp);
        console.log('[REFERRAL] Expiry limit:', REFERRAL_EXPIRY);

        if (now - referralData.timestamp > REFERRAL_EXPIRY) {
          console.log('[REFERRAL] Clearing expired referral data');
          setReferralData(null);
          return;
        } else {
          console.log('[REFERRAL] Existing referral data is still valid');
        }
      }

      // Зберігаємо нового реферера, якщо він є і валідний
      if (ref) {
        console.log('[REFERRAL] Processing new referral:', ref);
        console.log('[REFERRAL] Validating referral address');
        
        const isValidAddress = ref.length === 42 && ref.startsWith('0x');
        console.log('[REFERRAL] Address validation result:', isValidAddress);

        if (isValidAddress && !referralData) {
          console.log('[REFERRAL] Saving new referral data');
          const newReferralData = {
            referrer: ref as Address,
            timestamp: now
          };
          console.log('[REFERRAL] New referral data:', newReferralData);
          
          setReferralData(newReferralData);

          // Видаляємо параметр з URL
          console.log('[REFERRAL] Cleaning URL parameters');
          const url = new URL(window.location.href);
          url.searchParams.delete('ref');
          window.history.replaceState({}, '', url.toString());
          console.log('[REFERRAL] URL cleaned:', url.toString());
        } else {
          console.log('[REFERRAL] Skipping referral save:', {
            hasExistingData: !!referralData,
            isValidAddress
          });
        }
      }
    } catch (error) {
      console.error('[REFERRAL] Error in referral handler:', error);
      console.error('[REFERRAL] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        searchParams: searchParams?.toString(),
        currentData: referralData
      });
    }
  }, [searchParams, referralData, setReferralData]);

  // Розраховуємо час, що залишився
  const getTimeRemaining = () => {
    if (!referralData) {
      console.log('[REFERRAL] No active referral data for time calculation');
      return 0;
    }

    const REFERRAL_EXPIRY = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const timeLeft = (referralData.timestamp + REFERRAL_EXPIRY) - now;
    
    console.log('[REFERRAL] Time remaining calculation:', {
      expiryTime: referralData.timestamp + REFERRAL_EXPIRY,
      currentTime: now,
      timeLeft: Math.max(0, timeLeft)
    });

    return Math.max(0, timeLeft);
  };

  const clearReferral = () => {
    console.log('[REFERRAL] Clearing referral data');
    setReferralData(null);
  };

  const returnData = {
    referrer: referralData?.referrer || null,
    timeRemaining: getTimeRemaining(),
    hasActiveReferral: Boolean(referralData?.referrer),
    expiryTimestamp: referralData ? referralData.timestamp + (24 * 60 * 60 * 1000) : null,
    clearReferral
  };

  console.log('[REFERRAL] Hook return data:', returnData);
  return returnData;
}