export enum UserLevel {
  BRONZE,
  SILVER,
  GOLD,
  PLATINUM
}

export interface StakeInfo {
  id: number;
  amount: string;
  startTime: number;
  lockPeriod: number;
  unlockTime: number;
  isLocked: boolean;
  timeRemaining: number;
  pendingRewards: string;
  multiplier: number;
}

export interface UserStats {
  totalStaked: string;
  level: string;
  levelProgress: number;
  nextLevelThreshold: string;
  isActive: boolean;
  referrer: string;
  referralCount: number;
  stakes: StakeInfo[];
}