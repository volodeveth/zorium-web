// src/components/ui/referral-benefits.tsx
'use client';

import React from "react";
import { Card } from './card';
import { BadgePercent, TrendingUp, Users, Coins, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BenefitItemProps { 
  icon: any; 
  title: string; 
  description: string;
  delay: number;
}

const BenefitItem = React.memo(({ 
  icon: Icon, 
  title, 
  description,
  delay 
}: BenefitItemProps) => {
  console.log('[REFERRAL-BENEFITS] Rendering benefit item:', {
    title,
    description,
    delay
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-start gap-3"
      onAnimationStart={() => {
        console.log('[REFERRAL-BENEFITS] Starting animation for:', title);
      }}
      onAnimationComplete={() => {
        console.log('[REFERRAL-BENEFITS] Completed animation for:', title);
      }}
    >
      <div className="p-2 bg-primary/10 rounded-lg mt-1">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="font-medium text-white">{title}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </motion.div>
  );
});

BenefitItem.displayName = 'BenefitItem';

const ReferralBenefits = React.memo(() => {
  console.log('[REFERRAL-BENEFITS] Initializing ReferralBenefits component');

  const benefits = [
    {
      icon: Gift,
      title: '+10% Staking Bonus',
      description: 'Get additional rewards on all your staking earnings'
    },
    {
      icon: Coins,
      title: 'Lower Entry Barrier',
      description: 'Get special staking conditions from your referrer'
    },
    {
      icon: TrendingUp,
      title: 'Bonus Lock Period',
      description: 'Access to exclusive staking periods with higher multipliers'
    },
    {
      icon: Users,
      title: 'Community Benefits',
      description: 'Join an active staking community and get early access to features'
    }
  ];

  React.useEffect(() => {
    console.log('[REFERRAL-BENEFITS] Component mounted');
    console.log('[REFERRAL-BENEFITS] Benefits configuration:', benefits);

    return () => {
      console.log('[REFERRAL-BENEFITS] Component unmounting');
    };
  }, []);

  return (
    <Card className="overflow-hidden mb-6">
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
          onAnimationStart={() => {
            console.log('[REFERRAL-BENEFITS] Starting header animation');
          }}
          onAnimationComplete={() => {
            console.log('[REFERRAL-BENEFITS] Completed header animation');
          }}
        >
          <div className="p-2 bg-primary/10 rounded-lg">
            <BadgePercent className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Referral Benefits</h3>
            <p className="text-sm text-gray-400">
              Special advantages for referred users
            </p>
          </div>
        </motion.div>

        <AnimatePresence>
          <div className="grid gap-6">
            {benefits.map((benefit, index) => {
              console.log('[REFERRAL-BENEFITS] Rendering benefit:', {
                title: benefit.title,
                index
              });

              return (
                <BenefitItem
                  key={benefit.title}
                  icon={benefit.icon}
                  title={benefit.title}
                  description={benefit.description}
                  delay={index * 0.1}
                />
              );
            })}
          </div>
        </AnimatePresence>
      </div>
    </Card>
  );
});

ReferralBenefits.displayName = 'ReferralBenefits';

export { ReferralBenefits };