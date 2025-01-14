'use client';

import React from 'react';
import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import '@rainbow-me/rainbowkit/styles.css';
import { ToastProvider } from '@/hooks/useToast';

const zora = {
  id: 7777777,
  name: 'Zora',
  network: 'zora',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://rpc.zora.energy'] },
    default: { http: ['https://rpc.zora.energy'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.zora.energy' },
  },
  testnet: false,
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [zora],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.zora.energy',
      }),
    }),
    publicProvider(),
  ]
);

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!projectId) {
  console.error('Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID');
}

const { connectors } = getDefaultWallets({
  appName: 'Zorium DApp',
  projectId: projectId || '',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
  logger: {
    warn: (message) => console.warn(message),
    error: (message) => console.error(message),
    debug: (message) => console.log(message),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider 
        chains={chains} 
        theme={darkTheme({
          accentColor: '#B31701',
          borderRadius: 'large',
        })}
        coolMode
        showRecentTransactions={true}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}