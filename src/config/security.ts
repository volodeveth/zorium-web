// src/config/security.ts
export const cspConfig = {
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID || '1',
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
};