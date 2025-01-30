// Import required types if needed
import { Address } from 'viem';

// Custom types for better type safety
export enum UserLevel {
  BRONZE = 0,
  SILVER = 1,
  GOLD = 2,
  PLATINUM = 3
}

export interface StakeInfo {
  amount: bigint;
  since: bigint;
  lockPeriod: bigint;
  multiplier: bigint;
  lastRewardCalculation: bigint;
  level: UserLevel;
  levelUpdated: bigint;
  referrer: Address;
  referralCount: bigint;
  referralBonus: bigint;
  totalHistoricalStake: bigint;
  totalHistoricalRewards: bigint;
  isActive: boolean;
  referrals: Address[];
}

// Contract address with proper typing for wagmi/viem
export const ZORIUM_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

// Contract ABI with proper typing
export const ZORIUM_ABI = [
  {
    "inputs": [],
    "name": "totalStaked",
    "outputs": [{ "type": "uint256", "name": "" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardPool",
    "outputs": [{ "type": "uint256", "name": "" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalBurned",
    "outputs": [{ "type": "uint256", "name": "" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "user", "type": "address" }],
    "name": "stakers",
    "outputs": [
      { "name": "amount", "type": "uint256" },
      { "name": "since", "type": "uint256" },
      { "name": "lockPeriod", "type": "uint256" },
      { "name": "multiplier", "type": "uint256" },
      { "name": "lastRewardCalculation", "type": "uint256" },
      { "name": "level", "type": "uint8" },
      { "name": "levelUpdated", "type": "uint256" },
      { "name": "referrer", "type": "address" },
      { "name": "referralCount", "type": "uint256" },
      { "name": "referralBonus", "type": "uint256" },
      { "name": "totalHistoricalStake", "type": "uint256" },
      { "name": "totalHistoricalRewards", "type": "uint256" },
      { "name": "isActive", "type": "bool" },
      { "name": "referrals", "type": "address[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "user", "type": "address" }],
    "name": "getUserStakes",
    "outputs": [
      {
        "components": [
          { "name": "amount", "type": "uint256" },
          { "name": "since", "type": "uint256" },
          { "name": "lockPeriod", "type": "uint256" },
          { "name": "multiplier", "type": "uint256" },
          { "name": "pendingRewards", "type": "uint256" },
          { "name": "isActive", "type": "bool" }
        ],
        "name": "stakes",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "amount", "type": "uint256" },
      { "name": "periodIndex", "type": "uint256" }
    ],
    "name": "createStake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unstake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "stakeId", "type": "uint256" }],
    "name": "unstakeById",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "user", "type": "address" }],
    "name": "calculateReward",
    "outputs": [{ "type": "uint256", "name": "" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "user", "type": "address" },
      { "name": "stakeId", "type": "uint256" }
    ],
    "name": "calculateStakeReward",
    "outputs": [{ "type": "uint256", "name": "" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "stakeId", "type": "uint256" }],
    "name": "claimStakeReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "referrer", "type": "address" }],
    "name": "registerReferrer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "user", "type": "address" }],
    "name": "lastActionTime",
    "outputs": [{ "type": "uint256", "name": "" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "referrer",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "referee",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "referrerStake",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "depth",
        "type": "uint256"
      }
    ],
    "name": "ReferralRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "referrer",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "referee",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "totalHistorical",
        "type": "uint256"
      }
    ],
    "name": "ReferralRewardUpdated",
    "type": "event"
  }
] as const;

// Constants from contract
const TEN_18 = BigInt('1000000000000000000'); // 10^18

export const CONSTANTS = {
  MINIMUM_STAKE: BigInt(100) * TEN_18,
  SILVER_THRESHOLD: BigInt(1_000_000) * TEN_18,
  GOLD_THRESHOLD: BigInt(10_000_000) * TEN_18,
  PLATINUM_THRESHOLD: BigInt(100_000_000) * TEN_18,
  SILVER_BONUS: 10,
  GOLD_BONUS: 25,
  PLATINUM_BONUS: 50,
  REFERRAL_COMMISSIONS: [15, 8, 5] as const
} as const;

// Optional: Export contract types for better type safety
export type ZoriumContract = typeof ZORIUM_ABI;

// Helper types for events
export interface ReferralRegisteredEvent {
  referrer: Address;
  referee: Address;
  referrerStake: bigint;
  depth: bigint;
}

export interface ReferralRewardUpdatedEvent {
  referrer: Address;
  referee: Address;
  amount: bigint;
  totalHistorical: bigint;
}