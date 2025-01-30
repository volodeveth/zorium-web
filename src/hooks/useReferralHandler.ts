// src/hooks/useReferralHandler.ts
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useLocalStorage } from './useLocalStorage';
import { Address } from 'viem';

interface ReferralData {
  referrer: string;
  timestamp: number;
}

export function useReferralHandler() {
  const [referralData, setReferralData] = useLocalStorage<ReferralData | null>('zorium_referral', null);
  const [initialized, setInitialized] = useState(false);

  // Ефект для перехоплення реферального параметру при першому завантаженні
  useEffect(() => {
    if (initialized) return;

    const initializeReferral = () => {
      try {
        // 1. Перевіряємо URL
        const url = new URL(window.location.href);
        const refFromUrl = url.searchParams.get('ref');

        console.log('[REFERRAL] Initialization check:', {
          fullUrl: url.toString(),
          refParam: refFromUrl,
          hasExistingData: !!referralData
        });

        // 2. Якщо є валідний параметр ref
        if (refFromUrl && refFromUrl.length === 42 && refFromUrl.startsWith('0x')) {
          console.log('[REFERRAL] Found valid referrer:', refFromUrl);

          // 3. Зберігаємо в localStorage
          const newReferralData = {
            referrer: refFromUrl as Address,
            timestamp: Date.now()
          };

          console.log('[REFERRAL] Saving referral data:', newReferralData);
          setReferralData(newReferralData);

          // 4. Очищаємо URL
          url.searchParams.delete('ref');
          window.history.replaceState({}, '', url.pathname);
        }

        // 5. Перевіряємо існуючі дані
        if (referralData) {
          const now = Date.now();
          const REFERRAL_EXPIRY = 24 * 60 * 60 * 1000;

          console.log('[REFERRAL] Checking existing data:', {
            referrer: referralData.referrer,
            age: now - referralData.timestamp,
            expired: (now - referralData.timestamp) > REFERRAL_EXPIRY
          });

          if (now - referralData.timestamp > REFERRAL_EXPIRY) {
            console.log('[REFERRAL] Clearing expired data');
            setReferralData(null);
          }
        }

        setInitialized(true);
      } catch (error) {
        console.error('[REFERRAL] Initialization error:', error);
      }
    };

    // Виконуємо ініціалізацію з невеликою затримкою, щоб дочекатися повного завантаження URL
    setTimeout(initializeReferral, 100);
  }, [initialized, referralData]);

  const getTimeRemaining = () => {
    if (!referralData) {
      console.log('[REFERRAL] No active referral');
      return 0;
    }

    const REFERRAL_EXPIRY = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const timeLeft = Math.max(0, (referralData.timestamp + REFERRAL_EXPIRY) - now);

    console.log('[REFERRAL] Time remaining:', {
      timeLeft,
      expiryDate: new Date(referralData.timestamp + REFERRAL_EXPIRY).toISOString()
    });

    return timeLeft;
  };

  const clearReferral = () => {
    console.log('[REFERRAL] Manual clear');
    setReferralData(null);
    setInitialized(false);
  };

  const data = {
    referrer: referralData?.referrer || null,
    timeRemaining: getTimeRemaining(),
    hasActiveReferral: Boolean(referralData?.referrer),
    expiryTimestamp: referralData ? referralData.timestamp + (24 * 60 * 60 * 1000) : null,
    clearReferral
  };

  console.log('[REFERRAL] Current state:', data);
  return data;
}