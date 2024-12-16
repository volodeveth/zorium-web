'use client';

import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
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

const { chains, publicClient } = configureChains(
  [zora],
  [publicProvider()]
);

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

const { connectors } = getDefaultWallets({
  appName: 'Zorium DApp',
  projectId,
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider 
        chains={chains} 
        theme={darkTheme({
          accentColor: '#B31701',
          borderRadius: 'large',
        })}
        coolMode
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}