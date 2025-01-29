// src/components/ui/referral-banner.tsx
import React, { useState } from 'react';
import { Gift, X, Copy, Clock, CheckCircle } from 'lucide-react';
import { Card } from './card';
import { motion, AnimatePresence } from 'framer-motion';

interface ReferralBannerProps {
  referrer: string;
  timeRemaining: number;
  onClose: () => void;
}

export const ReferralBanner = ({ referrer, timeRemaining, onClose }: ReferralBannerProps) => {
  const [copied, setCopied] = useState(false);

  const shortenAddress = (address: string) => 
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const formatTimeLeft = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referrer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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
              onClick={onClose}
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
                      <CheckCircle className="w-4 h-4 text-green-500" />
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