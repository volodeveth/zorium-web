import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocalStorage } from './useLocalStorage';

export function useReferralHandler() {
  const searchParams = useSearchParams();
  // Додаємо типізацію для referrer
  const [referrer, setReferrer] = useLocalStorage<string>('referrer', '');

  useEffect(() => {
    try {
      const ref = searchParams?.get('ref');
      // Додаємо додаткову валідацію referrer
      if (ref && !referrer && ref.length > 0) {
        // Перевіряємо, чи ref є валідною Ethereum адресою
        if (ref.startsWith('0x') && ref.length === 42) {
          setReferrer(ref);
        }
      }
    } catch (error) {
      console.error('Error in referral handler:', error);
    }
  }, [searchParams, referrer, setReferrer]);

  const clearReferrer = () => {
    setReferrer('');
  };

  return { 
    referrer,
    clearReferrer, // Додаємо функцію для очищення referrer за потреби
    setReferrer   // Експортуємо setReferrer для можливості прямого встановлення
  };
}