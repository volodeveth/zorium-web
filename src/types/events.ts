export interface ReferralRegisteredEvent {
  referrer: string;
  referee: string;
}

export interface ReferralRewardUpdatedEvent {
  referrer: string;
  referee: string;
  amount: bigint;
}

export interface ReferralRewardClaimedEvent {
  referrer: string;
  referee: string;
  amount: bigint;
}

export type ZoriumEvent = 
  | { type: 'ReferralRegistered'; data: ReferralRegisteredEvent }
  | { type: 'ReferralRewardUpdated'; data: ReferralRewardUpdatedEvent }
  | { type: 'ReferralRewardClaimed'; data: ReferralRewardClaimedEvent };