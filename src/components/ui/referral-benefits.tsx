// src/components/ui/referral-benefits.tsx
'use client';

import React from 'react';
import { Card } from './card';
import { motion } from 'framer-motion';
import { BadgePercent, TrendingUp, Users, Coins, Gift } from 'lucide-react';

interface BenefitItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}

const BenefitItem = ({ 
  icon: Icon, 
  title, 
  description,
  delay 
}: BenefitItemProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="flex items-start gap-3"
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

export function ReferralBenefits() {
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

  return (
    <Card className="overflow-hidden mb-6">
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
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

        <div className="grid gap-6">
          {benefits.map((benefit, index) => (
            <BenefitItem
              key={benefit.title}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}