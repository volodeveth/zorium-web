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
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [referralData, setReferralData] = useLocalStorage<ReferralData | null>('zorium_referral', null);
  const [initialized, setInitialized] = useState(false);
  
  // Ефект для першого завантаження
  useEffect(() => {
    const checkAndSetReferral = () => {
      try {
        console.log('[REFERRAL] Checking URL on initial load');
        
        // Отримуємо ref з URLSearchParams
        const urlParams = new URLSearchParams(window.location.search);
        const refFromUrl = urlParams.get('ref');
        
        console.log('[REFERRAL] Initial URL check:', { 
          fullUrl: window.location.href,
          search: window.location.search,
          refFromUrl
        });

        if (refFromUrl) {
          const isValidAddress = refFromUrl.length === 42 && refFromUrl.startsWith('0x');
          console.log('[REFERRAL] Found ref parameter:', {
            ref: refFromUrl,
            isValid: isValidAddress
          });

          if (isValidAddress && !referralData) {
            const newReferralData = {
              referrer: refFromUrl as Address,
              timestamp: Date.now()
            };
            console.log('[REFERRAL] Setting new referral data:', newReferralData);
            setReferralData(newReferralData);
            
            // Очищаємо URL
            const cleanUrl = window.location.pathname;
            console.log('[REFERRAL] Cleaning URL to:', cleanUrl);
            window.history.replaceState({}, '', cleanUrl);
          }
        } else {
          console.log('[REFERRAL] No ref parameter found in URL');
        }
      } catch (error) {
        console.error('[REFERRAL] Error during initial URL check:', error);
      }
    };

    // Виконуємо перевірку тільки один раз при першому завантаженні
    if (!initialized) {
      console.log('[REFERRAL] Running initial check');
      checkAndSetReferral();
      setInitialized(true);
    }
  }, [initialized]);

  // Ефект для перевірки терміну дії
  useEffect(() => {
    if (!referralData) return;

    const REFERRAL_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
    const now = Date.now();
    
    console.log('[REFERRAL] Checking expiry for:', {
      referrer: referralData.referrer,
      timestamp: new Date(referralData.timestamp).toISOString(),
      age: now - referralData.timestamp,
      expiry: REFERRAL_EXPIRY
    });

    if (now - referralData.timestamp > REFERRAL_EXPIRY) {
      console.log('[REFERRAL] Clearing expired referral data');
      setReferralData(null);
    }
  }, [referralData]);

  const getTimeRemaining = () => {
    if (!referralData) {
      console.log('[REFERRAL] No active referral for time calculation');
      return 0;
    }

    const REFERRAL_EXPIRY = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const timeLeft = Math.max(0, (referralData.timestamp + REFERRAL_EXPIRY) - now);

    console.log('[REFERRAL] Time remaining calculation:', {
      expiryTime: new Date(referralData.timestamp + REFERRAL_EXPIRY).toISOString(),
      timeLeft
    });

    return timeLeft;
  };

  const clearReferral = () => {
    console.log('[REFERRAL] Manually clearing referral data');
    setReferralData(null);
  };

  const returnData = {
    referrer: referralData?.referrer || null,
    timeRemaining: getTimeRemaining(),
    hasActiveReferral: Boolean(referralData?.referrer),
    expiryTimestamp: referralData ? referralData.timestamp + (24 * 60 * 60 * 1000) : null,
    clearReferral
  };

  console.log('[REFERRAL] Current state:', returnData);
  return returnData;
}