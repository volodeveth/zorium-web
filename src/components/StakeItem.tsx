import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Clock } from 'lucide-react';
import type { StakeInfo } from '@/types/staking';

interface StakeItemProps {
  stake: StakeInfo;
  onClaim: (stakeId: number) => void;
  onUnstake: (stakeId: number) => void;
  showFullInfo?: boolean;
}

export const StakeItem = ({ stake, onClaim, onUnstake, showFullInfo = true }: StakeItemProps) => {
  const formatTimeLeft = (timeRemaining: number): string => {
    const days = Math.floor(timeRemaining / (24 * 3600));
    const hours = Math.floor((timeRemaining % (24 * 3600)) / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <Card className="mb-4">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Staked Amount</p>
            <p className="text-xl font-bold">{stake.amount} ZRM</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Lock Period</p>
            <p className="text-xl font-bold">{Math.floor(stake.lockPeriod / 86400)} Days</p>
            <p className="text-sm text-primary">x{stake.multiplier/100} Rewards</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Stake Time</p>
            <p className="text-sm">{formatDate(stake.startTime)}</p>
            {stake.isLocked && (
              <p className="text-sm text-red-500">{formatTimeLeft(stake.timeRemaining)}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Pending Rewards</p>
            <p className="text-xl font-bold">{stake.pendingRewards} ZRM</p>
          </div>
        </div>

        {showFullInfo && (
          <>
            <div className="flex gap-4">
              {Number(stake.pendingRewards) > 0 && (
                <Button 
                  onClick={() => onClaim(stake.id)}
                  disabled={stake.isLocked}
                >
                  {stake.isLocked 
                    ? `Claim available in ${formatTimeLeft(stake.timeRemaining)}`
                    : 'Claim Rewards'
                  }
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => onUnstake(stake.id)}
                disabled={stake.isLocked}
              >
                {stake.isLocked 
                  ? `Unstake available in ${formatTimeLeft(stake.timeRemaining)}`
                  : 'Unstake Tokens'
                }
              </Button>
            </div>

            {stake.isLocked && (
              <div className="mt-4 p-3 bg-red-500/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-red-400" />
                  <p className="text-sm text-red-400">
                    Unlocks at {formatDate(stake.unlockTime)}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};