'use client';

import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useProfileStore } from '@/store/useProfileStore';

export function useWalletProfile() {
  const { address, isConnected } = useAccount();
  const {
    setWallet,
    setProfile,
    setDimensions,
    setShowOnboardingModal,
    setLoading,
    reset,
  } = useProfileStore();

  useEffect(() => {
    if (!isConnected || !address) {
      reset();
      return;
    }

    async function loadProfile() {
      setLoading(true);
      setWallet(address!);

      const res = await fetch(`/api/user/profile?address=${address}`);
      const data = await res.json();

      if (data.dimensions) setDimensions(data.dimensions);

      if (data.user) {
        setProfile(data.user.demographics);
      } else {
        // New wallet — trigger onboarding
        setShowOnboardingModal(true);
      }

      setLoading(false);
    }

    loadProfile();
  }, [address, isConnected, reset, setDimensions, setLoading, setProfile, setShowOnboardingModal, setWallet]);
}
