'use client';

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Or a generic loading spinner
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-10 rounded-xl space-y-6 max-w-md w-full relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ipe-yellow via-ipe-magenta to-ipe-green" />
          <h2 className="font-heading text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Civic Participation Required
          </h2>
          <p className="text-muted-foreground">
            Please connect your wallet to access this area. Your on-chain identity forms the foundation of our democratic consensus.
          </p>
          <div className="flex justify-center pt-4">
            <ConnectButton />
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
