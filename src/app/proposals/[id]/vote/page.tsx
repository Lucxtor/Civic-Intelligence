'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useMockStore } from '@/store/useMockStore';
import { AuthGuard } from '@/components/auth/AuthGuard';

import { ThumbsUp, ThumbsDown } from 'lucide-react';

const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' }
];

export default function NuanceVotePage() {
  const params = useParams();
  const router = useRouter();
  const { address } = useAccount();
  const setVote = useMockStore((state) => state.setVote);
  const proposals = useMockStore((state) => state.proposals);
  
  const id = params.id as string;
  const proposal = proposals.find(p => p.id === id);

  const [sentiment, setSentiment] = useState<'up' | 'down' | null>(null);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!proposal) return null;

  const handleLikertChange = (metricId: string, value: number) => {
    setResponses(prev => ({ ...prev, [metricId]: value }));
  };

  const handleVoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sentiment) {
      alert("Please select a general sentiment (Up or Down) first.");
      return;
    }
    setIsSubmitting(true);
    
    // Ensure all metrics have been answered
    const allAnswered = proposal.customMetrics.every(m => responses[m.id] !== undefined);
    if (!allAnswered) {
      alert("Please provide feedback on all the dimensions.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          proposalId: proposal.id,
          responses,
          sentiment,
        })
      });

      if (!res.ok) {
        throw new Error('Failed to submit vote. Ensure your civic context is registered.');
      }

      // Sync to mock store for backwards compatibility with front-end dashboards in Phase 1
      setVote(proposal.id, {
        proposalId: proposal.id,
        voterId: 'anonymous_voter', // Privacy
        demographics: { age: 32, location: 'Centro' }, // Fallback mock structure
        responses,
        sentiment,
        comment: comment.trim() !== '' ? comment : undefined
      });

      router.push(`/proposals/${proposal.id}/dashboard`);
    } catch (error: any) {
      alert(error.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-10 text-center">
          <span className="text-ipe-green text-sm font-bold uppercase tracking-widest">{proposal.category}</span>
          <h1 className="text-4xl font-heading font-bold mt-2 mb-4">Nuance Vote</h1>
          <p className="text-muted-foreground">Your authenticated demographic profile helps shape the civic intelligence dashboard. Please evaluate the following facets for: <strong className="text-foreground">{proposal.title}</strong></p>
        </div>

        <form onSubmit={handleVoteSubmit} className="space-y-10">
          
          <div className="glass-panel p-8 rounded-xl border-ipe-green/20 border text-center">
            <h3 className="text-xl font-heading font-bold mb-6">In principle, do you support this proposal?</h3>
            <div className="flex justify-center gap-6">
              <button
                type="button"
                onClick={() => setSentiment('up')}
                className={`flex flex-col items-center gap-3 px-10 py-6 rounded-2xl transition-all ${sentiment === 'up' ? 'bg-ipe-green text-black scale-105 shadow-lg shadow-ipe-green/20' : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground'}`}
              >
                <ThumbsUp className="w-8 h-8" />
                <span className="font-bold">UPVOTE</span>
              </button>
              <button
                type="button"
                onClick={() => setSentiment('down')}
                className={`flex flex-col items-center gap-3 px-10 py-6 rounded-2xl transition-all ${sentiment === 'down' ? 'bg-ipe-magenta text-black scale-105 shadow-lg shadow-ipe-magenta/20' : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground'}`}
              >
                <ThumbsDown className="w-8 h-8" />
                <span className="font-bold">DOWNVOTE</span>
              </button>
            </div>
          </div>
          {proposal.customMetrics.map((metric) => (
            <div key={metric.id} className="glass-panel p-8 rounded-xl space-y-6">
              <div>
                <h3 className="text-xl font-heading font-bold">{metric.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{metric.description}</p>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {LIKERT_OPTIONS.map((option) => {
                  const isSelected = responses[metric.id] === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleLikertChange(metric.id, option.value)}
                      className={`flex-1 w-full py-4 px-2 rounded-lg text-sm font-medium transition-all ${
                        isSelected 
                          ? 'bg-ipe-green text-black scale-105 shadow-lg shadow-ipe-green/20' 
                          : 'bg-background/50 border border-border/50 text-muted-foreground hover:bg-background hover:text-foreground'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {proposal.allowComments && (
            <div className="glass-panel p-8 rounded-xl space-y-4">
              <h3 className="text-xl font-heading font-bold">Constructive Feedback</h3>
              <p className="text-sm text-muted-foreground">Optional: Add context to your vote.</p>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full h-32 bg-background/50 border border-border rounded-lg p-4 focus:outline-none focus:ring-1 focus:ring-ipe-green resize-none"
                placeholder="I strongly agree with this because..."
              />
            </div>
          )}

          <div className="flex justify-end gap-4 pb-12">
            <button 
              type="button" 
              onClick={() => router.push(`/proposals/${proposal.id}`)}
              className="px-6 py-3 border border-border rounded-lg text-foreground hover:bg-background/50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-8 py-3 bg-ipe-green text-black font-bold rounded-lg hover:bg-ipe-green/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Signing Vote...' : 'Submit Civic Vote'}
            </button>
          </div>

        </form>
      </div>
    </AuthGuard>
  );
}
