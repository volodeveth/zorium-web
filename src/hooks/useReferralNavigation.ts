// src/hooks/useReferralNavigation.ts
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

export function useReferralNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isProcessingRef, setIsProcessingRef] = useState(false);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref && !isProcessingRef) {
      setIsProcessingRef(true);
      // Зберігаємо реферальний параметр в localStorage
      localStorage.setItem('pendingRef', ref);
      
      // Даємо час для обробки
      setTimeout(() => {
        setIsProcessingRef(false);
        localStorage.removeItem('pendingRef');
      }, 500);
    }
  }, [searchParams, pathname]);

  return { isProcessingRef };
}