import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Proposal, UserVote } from '@/types';

interface MockStore {
  proposals: Proposal[];
  votes: Record<string, UserVote[]>; // Updated to support multiple votes per proposal
  addProposal: (proposal: Proposal) => void;
  setVote: (proposalId: string, voteData: UserVote) => void;
  resetStore: () => void;
}

const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'prop-1',
    title: 'Precision Municipal Tax Rebalancing',
    category: 'Economic',
    abstract: {
      technical: 'Lowering the municipal tax on services (ISS) by 2.2% while compensating through a tiered product levy increase for high-luxury retail.',
      eli5: 'Lower the tax on daily services like haircuts, but pay for it by slightly higher taxes on expensive luxury items.'
    },
    content: '## Executive Summary\n\nThis proposal focuses on tax rebalancing. By shifting the burden from services to products, we aim to stimulate the service-based innovation economy in Floripa.',
    impactMatrix: {
      beneficiaries: [
        { tag: 'Small Businesses', estimate: 1250 },
        { tag: 'Digital Nomads', estimate: 8000 }
      ],
      negativeImpacts: [
        { tag: 'Luxury Retail', risk: 'Moderate' },
        { tag: 'Importers', risk: 'Low' }
      ],
      financials: {
        totalCost: 0,
        currency: 'BRL',
        roiConfidence: 85
      }
    },
    customMetrics: [
      { id: 'approval', label: 'Global Approval', description: 'Overall sentiment towards the tax shift.' },
      { id: 'equality', label: 'Economic Equality', description: 'Will this help bridge the community gap?' },
      { id: 'simplicity', label: 'Admin Simplicity', description: 'How hard is this to implement?' }
    ],
    allowComments: true,
    createdAt: '2026-04-10T10:00:00Z'
  },
  {
    id: 'prop-2',
    title: 'Bioclimatic Urban Corridor Phase 1',
    category: 'Environmental',
    abstract: {
      technical: 'Implementation of mandatory green roofing and natural cooling ventilation shafts for commercial buildings > 1000sqm.',
      eli5: 'New buildings must have gardens on top and use wind instead of AC to stay cool.'
    },
    content: '## Sustainability Framework\n\nIntegrating biological cooling systems into vertical architecture. This reduces the heat island effect and municipal power load.',
    impactMatrix: {
      beneficiaries: [
        { tag: 'Downtown Residents', estimate: 45000 },
        { tag: 'Energy Grid', estimate: 1 }
      ],
      negativeImpacts: [
        { tag: 'Real Estate Devs', risk: 'Severe' }
      ],
      financials: {
        totalCost: 15000000,
        currency: 'BRL',
        roiConfidence: 92
      }
    },
    customMetrics: [
      { id: 'approval', label: 'Global Approval', description: 'Support for mandatory green requirements.' },
      { id: 'impact', label: 'Climate Impact', description: 'Projected reduction in heat island effect.' }
    ],
    allowComments: true,
    createdAt: '2026-04-11T14:30:00Z'
  }
];

const INITIAL_VOTES: Record<string, UserVote[]> = {
  'prop-1': [
    {
      proposalId: 'prop-1',
      voterId: '0xMockDemoVoter',
      demographics: { age: 30, location: 'Centro' },
      responses: {}, // Mock responses
      sentiment: 'up'
    }
  ],
  'prop-2': [
    {
      proposalId: 'prop-2',
      voterId: '0xMockDemoVoter2',
      demographics: { age: 45, location: 'Trindade' },
      responses: {},
      sentiment: 'down'
    }
  ]
};

export const useMockStore = create<MockStore>()(
  persist(
    (set) => ({
      proposals: INITIAL_PROPOSALS,
      votes: INITIAL_VOTES,
      addProposal: (proposal) => 
        set((state) => ({ 
          proposals: [proposal, ...state.proposals],
          votes: { ...state.votes, [proposal.id]: [] }
        })),
      setVote: (proposalId, voteData) => 
        set((state) => ({
          votes: {
            ...state.votes,
            [proposalId]: [...(state.votes[proposalId] || []), voteData]
          }
        })),
      resetStore: () => set({ proposals: INITIAL_PROPOSALS, votes: INITIAL_VOTES })
    }),
    {
      name: 'civic-intelligence-storage-v5', // Updated version to trigger mock votes cascade
    }
  )
);
