import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Proposal, UserVote, RelevanceVote } from '@/types';

interface MockStore {
  proposals: Proposal[];
  votes: Record<string, UserVote[]>;
  relevanceVotes: Record<string, Record<string, 'up' | 'down'>>; // proposalId -> voterId -> type
  addProposal: (proposal: Proposal) => void;
  setVote: (proposalId: string, voteData: UserVote) => void;
  toggleRelevance: (proposalId: string, voterId: string, type: 'up' | 'down') => void;
  resetStore: () => void;
}

const INITIAL_PROPOSALS: Proposal[] = [];
const INITIAL_VOTES: Record<string, UserVote[]> = {};
const INITIAL_RELEVANCE: Record<string, Record<string, 'up' | 'down'>> = {};

export const useMockStore = create<MockStore>()(
  persist(
    (set) => ({
      proposals: INITIAL_PROPOSALS,
      votes: INITIAL_VOTES,
      relevanceVotes: INITIAL_RELEVANCE,
      addProposal: (proposal) => 
        set((state) => ({ 
          proposals: [proposal, ...state.proposals],
          votes: { ...state.votes, [proposal.id]: [] },
          relevanceVotes: { ...state.relevanceVotes, [proposal.id]: {} }
        })),
      setVote: (proposalId, voteData) => 
        set((state) => ({
          votes: {
            ...state.votes,
            [proposalId]: [...(state.votes[proposalId] || []), voteData]
          }
        })),
      toggleRelevance: (proposalId, voterId, type) =>
        set((state) => {
          const currentVotes = { ...(state.relevanceVotes[proposalId] || {}) };
          
          if (currentVotes[voterId] === type) {
            // Remove vote if clicking same arrow
            delete currentVotes[voterId];
          } else {
            // Set or Toggle vote
            currentVotes[voterId] = type;
          }

          return {
            relevanceVotes: {
              ...state.relevanceVotes,
              [proposalId]: currentVotes
            }
          };
        }),
      resetStore: () => set({ proposals: INITIAL_PROPOSALS, votes: INITIAL_VOTES, relevanceVotes: INITIAL_RELEVANCE })
    }),
    {
      name: 'civic-intelligence-storage-v6', // Updated version for relevance structure
    }
  )
);
