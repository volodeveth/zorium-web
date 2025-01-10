import React from 'react';
import { Wallet, Clock, Gift, TrendingUp } from 'lucide-react';
import { Card } from './card';

interface StatItemProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description?: string;
  valueColor?: string;
}

const StatItem = ({
  icon,
  title,
  value,
  description,
  valueColor = 'text-white'
}: StatItemProps) => (
  <div className="flex items-start justify-between">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-primary/10 rounded-lg mt-1">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
        {description && (
          <p className="text-sm text-primary">{description}</p>
        )}
      </div>
    </div>
  </div>
);

interface StakeStatsProps {
  amount: string;
  multiplier: number;
  periodDays: number;
  pendingRewards: string;
  levelBonus?: number;
  referralBonus?: string;
  hasReferralBonus?: boolean;
}

export function StakeStats({ 
  amount, 
  multiplier, 
  periodDays,
  pendingRewards,
  levelBonus = 0,
  referralBonus = '0',
  hasReferralBonus = false
}: StakeStatsProps) {
  const totalPending = (Number(pendingRewards) + Number(referralBonus)).toFixed(2);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Stake Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatItem
          icon={<Wallet className="w-5 h-5 text-primary" />}
          title="Staked Amount"
          value={`${amount} ZRM`}
        />
        
        <div>
          <StatItem
            icon={<Clock className="w-5 h-5 text-primary" />}
            title="Lock Period"
            value={`${periodDays} Days`}
            description={`${multiplier/100}x Base Rate`}
          />
          {hasReferralBonus && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Gift className="w-4 h-4 text-primary" />
              <span className="text-primary">+10% Referral Bonus Active</span>
            </div>
          )}
        </div>

        <StatItem
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
          title="Level Bonus"
          value={`+${levelBonus}%`}
          valueColor="text-primary"
        />

        <StatItem
          icon={<Gift className="w-5 h-5 text-primary" />}
          title="Pending Rewards"
          value={`${totalPending} ZRM`}
          description={Number(referralBonus) > 0 
            ? `Including ${referralBonus} ZRM Referral Bonus` 
            : undefined}
          valueColor="text-green-500"
        />
      </div>
    </Card>
  );
}