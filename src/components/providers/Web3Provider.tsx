'use client';

import React from 'react';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import '@rainbow-me/rainbowkit/styles.css';
import { useWalletProfile } from '@/hooks/useWalletProfile';

function ProfileWatcher() {
  useWalletProfile();
  return null;
}

const config = getDefaultConfig({
  appName: 'Ipê Civic Intelligence',
  projectId: '10a5257c04d1dcdacfacbc26b6e62ba6', // Public WalletConnect demo ID
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
  ssr: true,
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#00FF66', // Ipê Green
            accentColorForeground: '#121212',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          <ProfileWatcher />
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
