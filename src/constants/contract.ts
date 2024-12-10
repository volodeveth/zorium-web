export const ZORIUM_CONTRACT_ADDRESS = "0x538D6F4fb9598dC74e15e6974049B109ae0AbC6a";

export const ZORIUM_ABI = [
  // ERC20 базові функції
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  
  // Staking функції
  "function totalStaked() view returns (uint256)",
  "function rewardPool() view returns (uint256)",
  "function totalBurned() view returns (uint256)",
  "function createStake(uint256 amount, uint256 periodIndex) external",
  "function calculateReward(address user) public view returns (uint256)",
  
  // Level система
  "function getUserLevel(address) view returns (uint8)",
  
  // Referral система
  "function getReferralInfo(address) view returns (uint256 referralCount, uint256)",
  "function registerReferral(address referrer) external"
] as const;