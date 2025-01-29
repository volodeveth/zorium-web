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
      const ref = searchParams?.get('ref');
      const now = Date.now();
      const REFERRAL_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

      // Перевірка і очищення застарілих реферальних даних
      if (referralData && (now - referralData.timestamp > REFERRAL_EXPIRY)) {
        setReferralData(null);
        return;
      }

      // Зберігаємо нового реферера, якщо він є і валідний
      if (ref && !referralData && ref.length === 42 && ref.startsWith('0x')) {
        setReferralData({
          referrer: ref as Address,
          timestamp: now
        });

        // Опціонально: видаляємо параметр з URL
        const url = new URL(window.location.href);
        url.searchParams.delete('ref');
        window.history.replaceState({}, '', url.toString());
      }
    } catch (error) {
      console.error('[ZORIUM] Error in referral handler:', error);
    }
  }, [searchParams, referralData, setReferralData]);

  // Розраховуємо час, що залишився
  const getTimeRemaining = () => {
    if (!referralData) return 0;
    const REFERRAL_EXPIRY = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const timeLeft = (referralData.timestamp + REFERRAL_EXPIRY) - now;
    return Math.max(0, timeLeft);
  };

  const clearReferral = () => {
    setReferralData(null);
  };

  return {
    referrer: referralData?.referrer || null,
    timeRemaining: getTimeRemaining(),
    hasActiveReferral: Boolean(referralData?.referrer),
    expiryTimestamp: referralData ? referralData.timestamp + (24 * 60 * 60 * 1000) : null,
    clearReferral
  };
}