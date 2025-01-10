import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocalStorage } from './useLocalStorage';

export function useReferralHandler() {
  const searchParams = useSearchParams();
  const [referrer, setReferrer] = useLocalStorage('referrer', '');

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref && !referrer) {
      setReferrer(ref);
    }
  }, [searchParams, referrer, setReferrer]);

  return { referrer };
}