'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Proposal } from '@/types';
import { useMockStore } from '@/store/useMockStore';
import { MotionBentoCard } from '@/components/motion/MotionBentoCard';
import { Activity, Leaf, Briefcase, Users, LayoutDashboard, ChevronUp, ChevronDown } from 'lucide-react';
import { useAccount } from 'wagmi';

const categoryConfig = {
  Infrastructure: { color: 'text-ipe-magenta', bg: 'bg-ipe-magenta/10', icon: Briefcase },
  Environmental: { color: 'text-ipe-green', bg: 'bg-ipe-green/10', icon: Leaf },
  Economic: { color: 'text-ipe-yellow', bg: 'bg-ipe-yellow/10', icon: Activity },
  Social: { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: Users },
};

export function ProposalCard({ proposal, index }: { proposal: Proposal, index: number }) {
  const router = useRouter();
  const { address } = useAccount();
  const localVote = useMockStore((state) => state.relevanceVotes[proposal.id]?.[address || ''] || null);
  const setLocalVote = useMockStore((state) => state.toggleRelevance);
  
  const [dbVotes, setDbVotes] = React.useState({
    up: proposal.upVotes || 0,
    down: proposal.downVotes || 0,
    score: proposal.netSentiment || 0
  });

  const handleVote = async (type: 'up' | 'down') => {
    if (!address) return alert('Please connect your wallet to vote.');
    
    // Toggle logic
    const newSentiment = localVote === type ? null : type;
    
    // 1. Optimistic UI in Store
    setLocalVote(proposal.id, address, type);
    
    // 2. Optimistic UI in Component
    setDbVotes(prev => {
      let up = prev.up;
      let down = prev.down;
      
      // Remove old vote
      if (localVote === 'up') up--;
      if (localVote === 'down') down--;
      
      // Add new vote
      if (newSentiment === 'up') up++;
      if (newSentiment === 'down') down++;
      
      return { up, down, score: up - down };
    });

    try {
      await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId: proposal.id,
          walletAddress: address,
          sentiment: newSentiment
        })
      });
    } catch (err) {
      console.error('Failed to sync vote to DB:', err);
    }
  };

  const score = dbVotes.score;
  const userVote = localVote;
  
  const catKey = (proposal.category in categoryConfig ? proposal.category : 'Social') as keyof typeof categoryConfig;
  const catConf = categoryConfig[catKey];
  const Icon = catConf.icon;

  const impactLevel = proposal.impact || 'Medium';

  const impactColors = {
    Low: 'text-blue-400',
    Medium: 'text-ipe-green',
    High: 'text-ipe-yellow',
  };

  return (
    <MotionBentoCard 
      delay={index * 0.1}
      className="group flex flex-row gap-4 h-full relative p-0 overflow-hidden"
    >
      {/* Relevance Sidebar */}
      <div className="flex flex-col items-center justify-start pt-6 pb-4 px-3 bg-white/5 border-r border-white/5 gap-2 min-w-[50px]">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (!address) return alert('Please connect your wallet to vote on relevance.');
            handleVote('up');
          }}
          className={`p-1 rounded-md transition-colors ${userVote === 'up' ? 'bg-ipe-green text-black' : 'text-muted-foreground hover:bg-white/10 hover:text-foreground'}`}
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        <span className={`text-sm font-mono font-bold ${score > 0 ? 'text-ipe-green' : score < 0 ? 'text-ipe-magenta' : 'text-muted-foreground'}`}>
          {score > 0 ? `+${score}` : score}
        </span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (!address) return alert('Please connect your wallet to vote on relevance.');
            handleVote('down');
          }}
          className={`p-1 rounded-md transition-colors ${userVote === 'down' ? 'bg-ipe-magenta text-black' : 'text-muted-foreground hover:bg-white/10 hover:text-foreground'}`}
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      <div 
        className="flex-1 flex flex-col justify-between py-6 pr-6 cursor-pointer"
        onClick={() => router.push(`/proposals/${proposal.id}`)}
      >
        <div>
          <div className="flex items-start justify-between mb-4">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${catConf.bg} ${catConf.color}`}>
              <Icon className="w-3.5 h-3.5" />
              {proposal.category}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${impactColors[impactLevel as keyof typeof impactColors] || impactColors.Medium}`}>
              {impactLevel} Impact
            </span>
          </div>
          
          <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-ipe-yellow transition-colors">
            {proposal.title}
          </h3>
          
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {proposal.abstract.eli5}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-[10px] uppercase tracking-wider font-bold">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">{proposal.customMetrics?.length || 0} Nuance Metrics</span>
          </div>
          <span className="text-muted-foreground/60" suppressHydrationWarning>
            {new Date(proposal.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </MotionBentoCard>
  );
}
