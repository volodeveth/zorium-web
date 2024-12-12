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
  }
] as const;