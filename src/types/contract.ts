export enum UserLevel {
  BRONZE,
  SILVER,
  GOLD,
  PLATINUM
}

export interface StakeInfo {
  amount: bigint;
  since: bigint;
  lockPeriod: bigint;
  multiplier: bigint;
  lastRewardCalculation: bigint;
  level: UserLevel;
  levelUpdated: bigint;
  referrer: string;
  referralCount: bigint;
  referralBonus: bigint;
}

export interface ReferralRewards {
  pendingRewards: bigint;
  claimedRewards: bigint;
  lastCalculation: bigint;
}