export const ZORIUM_CONTRACT_ADDRESS = "0x538D6F4fb9598dC74e15e6974049B109ae0AbC6a";

export const ZORIUM_ABI = [
  {
    inputs: [],
    name: "name",
    outputs: [{ type: "string", name: "" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ type: "string", name: "" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalStaked",
    outputs: [{ type: "uint256", name: "" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "rewardPool",
    outputs: [{ type: "uint256", name: "" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalBurned",
    outputs: [{ type: "uint256", name: "" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "periodIndex", type: "uint256" }
    ],
    name: "createStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "_claimReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "referrer", type: "address" }],
    name: "registerReferral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserStakeInfo",
    outputs: [
      { name: "amount", type: "uint256" },
      { name: "since", type: "uint256" },
      { name: "lockPeriod", type: "uint256" },
      { name: "level", type: "uint8" }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;