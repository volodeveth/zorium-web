import React from 'react';
import { Medal, Trophy, Crown } from 'lucide-react';
import { Card } from './card';

interface LevelProgressProps {
  level: string;
  progress: number;
  currentAmount: string;
  nextThreshold: string;
  bonus?: number;
}

export function LevelProgress({ 
  level, 
  progress, 
  currentAmount, 
  nextThreshold,
  bonus = 0
}: LevelProgressProps) {
  const getLevelIcon = (level: string) => {
    switch (level.toUpperCase()) {
      case 'BRONZE':
        return <Medal className="w-6 h-6 text-orange-600/80" />;
      case 'SILVER':
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 'GOLD':
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 'PLATINUM':
        return <Crown className="w-6 h-6 text-blue-400" />;
      default:
        return <Medal className="w-6 h-6 text-orange-600/80" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'BRONZE':
        return 'from-orange-600/20 to-orange-600/40';
      case 'SILVER':
        return 'from-gray-400/20 to-gray-400/40';
      case 'GOLD':
        return 'from-yellow-500/20 to-yellow-500/40';
      case 'PLATINUM':
        return 'from-blue-400/20 to-blue-400/40';
      default:
        return 'from-orange-600/20 to-orange-600/40';
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              {getLevelIcon(level)}
            </div>
            <div>
              <p className="text-2xl font-bold mb-1">{level} Level</p>
              {bonus > 0 && (
                <p className="text-sm text-primary">+{bonus}% Rewards Bonus</p>
              )}
            </div>
          </div>
          <span className="text-sm text-gray-400">{progress.toFixed(1)}%</span>
        </div>

        <div className="space-y-4">
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getLevelColor(level)} transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between text-sm">
            <div>
              <p className="text-gray-400">Current</p>
              <p className="font-medium">{currentAmount} ZRM</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400">Next Level</p>
              <p className="font-medium">{nextThreshold} ZRM</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}