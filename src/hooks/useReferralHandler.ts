import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useLocalStorage } from './useLocalStorage';
import { Address } from 'viem';

interface ReferralData {
  referrer: string;
  timestamp: number;
}

export function useReferralHandler() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [referralData, setReferralData] = useLocalStorage<ReferralData | null>('zorium_referral', null);
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    if (initialized) return;
    
    try {
      console.log('[REFERRAL] Starting referral handler effect');
      
      // Отримуємо всі параметри URL
      const params = new URLSearchParams(window.location.search);
      console.log('[REFERRAL] Full URL params:', params.toString());
      
      const ref = params.get('ref') || searchParams?.get('ref');
      console.log('[REFERRAL] Raw ref parameter:', ref);

      const now = Date.now();
      const REFERRAL_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

      // Перевірка існуючих даних
      if (referralData) {
        console.log('[REFERRAL] Existing referral data:', referralData);
        if (now - referralData.timestamp > REFERRAL_EXPIRY) {
          console.log('[REFERRAL] Clearing expired referral data');
          setReferralData(null);
        } else {
          console.log('[REFERRAL] Using existing valid referral data');
          return;
        }
      }

      // Обробка нового реферального параметру
      if (ref) {
        console.log('[REFERRAL] Processing new referral:', ref);
        
        const isValidAddress = ref.length === 42 && ref.startsWith('0x');
        console.log('[REFERRAL] Address validation:', { isValid: isValidAddress, address: ref });

        if (isValidAddress) {
          const newReferralData = {
            referrer: ref as Address,
            timestamp: now
          };
          console.log('[REFERRAL] Saving new referral data:', newReferralData);
          setReferralData(newReferralData);

          // Очищаємо URL від параметра ref
          const newParams = new URLSearchParams(params);
          newParams.delete('ref');
          const newUrl = `${pathname}${newParams.toString() ? `?${newParams.toString()}` : ''}`;
          router.replace(newUrl, { scroll: false });
          
          console.log('[REFERRAL] Updated URL:', newUrl);
          setInitialized(true);
        }
      }
    } catch (error) {
      console.error('[REFERRAL] Error processing referral:', error);
    }
  }, [searchParams, pathname, referralData, initialized]);

  const getTimeRemaining = () => {
    if (!referralData) {
      return 0;
    }

    const REFERRAL_EXPIRY = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const timeLeft = (referralData.timestamp + REFERRAL_EXPIRY) - now;
    
    console.log('[REFERRAL] Time remaining:', {
      expiryTime: new Date(referralData.timestamp + REFERRAL_EXPIRY).toISOString(),
      timeLeft: Math.max(0, timeLeft)
    });

    return Math.max(0, timeLeft);
  };

  const clearReferral = () => {
    console.log('[REFERRAL] Clearing referral data');
    setReferralData(null);
    setInitialized(false);
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