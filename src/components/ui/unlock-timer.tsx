import React from 'react';
import { Clock } from 'lucide-react';

interface UnlockTimerProps {
  timeRemaining: number;
  unlockTime: number;
  className?: string;
}

export function UnlockTimer({ timeRemaining, unlockTime, className = '' }: UnlockTimerProps) {
  const [remainingTime, setRemainingTime] = React.useState(timeRemaining);

  React.useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = unlockTime - now;
      setRemainingTime(remaining > 0 ? remaining : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [unlockTime, timeRemaining]);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "Unlocked";

    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getStatusColor = (remaining: number) => {
    if (remaining <= 0) return 'text-green-500';
    if (remaining <= 24 * 3600) return 'text-yellow-500'; // last 24 hours
    return 'text-primary';
  };

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <Clock className={`w-4 h-4 ${getStatusColor(remainingTime)}`} />
      <span className={getStatusColor(remainingTime)}>
        {formatTime(remainingTime)}
      </span>
      {remainingTime > 0 && (
        <span className="text-gray-400">
          until {new Date(unlockTime * 1000).toLocaleString()}
        </span>
      )}
    </div>
  );
}