'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { 
  connectorsForWallets,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import '@rainbow-me/rainbowkit/styles.css';

const { chains, publicClient } = configureChains(
  [bsc],
  [publicProvider()]
);

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          chains={chains}
          theme={darkTheme()}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}