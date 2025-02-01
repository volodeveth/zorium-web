// Import required types if needed
import { Address } from 'viem';

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
      { "name": "isActive", "type": "bool" }
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
  }
] as const;

// Optional: Export contract types for better type safety
export type ZoriumContract = typeof ZORIUM_ABI;