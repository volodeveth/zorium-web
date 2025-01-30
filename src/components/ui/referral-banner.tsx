// src/components/ui/referral-banner.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Gift, X, Copy, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from './card';
import { motion, AnimatePresence } from 'framer-motion';

interface ReferralBannerProps {
  referrer: string;
  timeRemaining: number;
  onClose: () => void;
}

export const ReferralBanner = ({ referrer, timeRemaining, onClose }: ReferralBannerProps) => {
  console.log('[REFERRAL-BANNER] Rendering with props:', {
    referrer,
    timeRemaining
  });

  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('[REFERRAL-BANNER] Component mounted');
    setMounted(true);

    return () => {
      console.log('[REFERRAL-BANNER] Component unmounting');
    };
  }, []);

  useEffect(() => {
    console.log('[REFERRAL-BANNER] Time remaining updated:', timeRemaining);
  }, [timeRemaining]);

  const shortenAddress = (address: string) => {
    const shortened = `${address.slice(0, 6)}...${address.slice(-4)}`;
    console.log('[REFERRAL-BANNER] Shortened address:', {
      original: address,
      shortened
    });
    return shortened;
  };

  const formatTimeLeft = (ms: number) => {
    console.log('[REFERRAL-BANNER] Formatting time:', ms);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const formatted = `${hours}h ${minutes}m`;
    console.log('[REFERRAL-BANNER] Formatted time:', formatted);
    return formatted;
  };

  const handleCopy = async () => {
    console.log('[REFERRAL-BANNER] Copying address to clipboard:', referrer);
    try {
      await navigator.clipboard.writeText(referrer);
      console.log('[REFERRAL-BANNER] Address copied successfully');
      setCopied(true);
      setTimeout(() => {
        console.log('[REFERRAL-BANNER] Resetting copy state');
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('[REFERRAL-BANNER] Failed to copy:', err);
    }
  };

  const handleClose = () => {
    console.log('[REFERRAL-BANNER] Closing banner');
    onClose();
  };

  if (!mounted) {
    console.log('[REFERRAL-BANNER] Not mounted yet, returning null');
    return null;
  }

  console.log('[REFERRAL-BANNER] Rendering banner with state:', {
    copied,
    timeRemaining,
    formattedTime: formatTimeLeft(timeRemaining)
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-primary/5 border-primary/20 mb-6">
          <div className="p-6 relative">
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-primary/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-primary" />
            </button>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Gift className="w-6 h-6 text-primary" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-primary mb-1">
                  Active Referral Invitation
                </h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-gray-400">Invited by:</p>
                  <div 
                    className="flex items-center gap-2 px-3 py-1 bg-background/50 rounded-lg cursor-pointer"
                    onClick={handleCopy}
                  >
                    <span className="font-medium">{shortenAddress(referrer)}</span>
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </div>

                {timeRemaining > 0 && (
                  <div className="flex items-center gap-2 text-sm text-primary/80">
                    <Clock className="w-4 h-4" />
                    <span>Expires in {formatTimeLeft(timeRemaining)}</span>
                  </div>
                )}

                <p className="text-sm text-primary mt-2">
                  🎉 You will receive +10% bonus on your staking rewards!
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};