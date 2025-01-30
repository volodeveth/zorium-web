import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Address } from 'viem';

interface ReferralData {
  referrer: string;
  timestamp: number;
}

export function useReferralHandler() {
  const [referralData, setReferralData] = useLocalStorage<ReferralData | null>('zorium_referral', null);
  
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

  // Перевіряємо термін дії
  useEffect(() => {
    if (!referralData) return;

    const REFERRAL_EXPIRY = 24 * 60 * 60 * 1000;
    const now = Date.now();
    
    console.log('[REFERRAL] Checking expiry:', {
      referrer: referralData.referrer,
      timestamp: new Date(referralData.timestamp).toISOString(),
      age: now - referralData.timestamp,
      expiry: REFERRAL_EXPIRY
    });

    if (now - referralData.timestamp > REFERRAL_EXPIRY) {
      console.log('[REFERRAL] Clearing expired referral');
      setReferralData(null);
    }
  }, [referralData]);

  const clearReferral = () => {
    console.log('[REFERRAL] Manual clear');
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