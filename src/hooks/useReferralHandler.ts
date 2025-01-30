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
      console.log('[REFERRAL] Starting referral handler effect');
      // Спочатку виводимо всі search параметри
      console.log('[REFERRAL] Search params:', searchParams?.toString());

      const currentUrl = window.location.href;
      console.log('[REFERRAL] Current URL:', currentUrl);

      const ref = searchParams?.get('ref');
      console.log('[REFERRAL] Raw ref parameter:', ref);

      const now = Date.now();
      const REFERRAL_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

      console.log('[REFERRAL] Current state:', {
        referralData,
        now,
        REFERRAL_EXPIRY
      });

      // Перевірка і очищення застарілих реферальних даних
      if (referralData) {
        console.log('[REFERRAL] Checking existing referral:', {
          referrer: referralData.referrer,
          timestamp: referralData.timestamp,
          age: now - referralData.timestamp
        });

        if (now - referralData.timestamp > REFERRAL_EXPIRY) {
          console.log('[REFERRAL] Clearing expired referral');
          setReferralData(null);
          return;
        }
      }

      // Збереження нового реферера
      if (ref) {
        console.log('[REFERRAL] Processing new referral:', ref);
        
        const isValidAddress = ref.length === 42 && ref.startsWith('0x');
        console.log('[REFERRAL] Address validation:', {
          isValid: isValidAddress,
          length: ref.length,
          startsWithHex: ref.startsWith('0x')
        });

        if (isValidAddress && !referralData) {
          const newReferralData = {
            referrer: ref as Address,
            timestamp: now
          };
          console.log('[REFERRAL] Saving new referral:', newReferralData);
          
          setReferralData(newReferralData);

          // Очищаємо URL
          const url = new URL(window.location.href);
          url.searchParams.delete('ref');
          window.history.replaceState({}, '', url.toString());
          console.log('[REFERRAL] URL cleaned:', url.toString());
        } else {
          console.log('[REFERRAL] Skipping referral save:', {
            isValidAddress,
            hasExistingData: !!referralData
          });
        }
      }
    } catch (error) {
      console.error('[REFERRAL] Error in referral handler:', error);
      console.error('[REFERRAL] Error details:', {
        searchParams: searchParams?.toString(),
        currentData: referralData
      });
    }
  }, [searchParams, referralData, setReferralData]);

  // Розрахунок часу, що залишився
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