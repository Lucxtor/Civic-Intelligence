import { create } from 'zustand';

export interface DemographicDimension {
  id: string;
  key: string;
  label: string;
  options: string[]; // parsed from JSON stored in DB
}

interface ProfileStore {
  walletAddress: string | null;
  demographics: Record<string, string>;
  isOnboarded: boolean;
  isLoading: boolean;
  showOnboardingModal: boolean;
  dimensions: DemographicDimension[];

  setWallet: (address: string | null) => void;
  setProfile: (demographics: Record<string, string>) => void;
  setDimensions: (dims: DemographicDimension[]) => void;
  setShowOnboardingModal: (show: boolean) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  walletAddress: null,
  demographics: {},
  isOnboarded: false,
  isLoading: false,
  showOnboardingModal: false,
  dimensions: [],

  setWallet: (address) => set({ walletAddress: address }),
  setProfile: (demographics) =>
    set({ demographics, isOnboarded: true, showOnboardingModal: false }),
  setDimensions: (dims) => set({ dimensions: dims }),
  setShowOnboardingModal: (show) => set({ showOnboardingModal: show }),
  setLoading: (loading) => set({ isLoading: loading }),
  reset: () =>
    set({
      walletAddress: null,
      demographics: {},
      isOnboarded: false,
      isLoading: false,
      showOnboardingModal: false,
    }),
}));
