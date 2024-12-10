'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

const config = createConfig(
  getDefaultConfig({
    appName: 'Zorium DApp',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '', // Потрібно отримати на https://cloud.walletconnect.com/
    chains: [bsc],
    transports: {
      [bsc.id]: http()
    },
  })
);

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}