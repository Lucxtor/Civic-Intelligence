'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Proposal } from '@/types';
import { useMockStore } from '@/store/useMockStore';
import { MotionBentoCard } from '@/components/motion/MotionBentoCard';
import { Activity, Leaf, Briefcase, Users, LayoutDashboard, ThumbsUp, ThumbsDown } from 'lucide-react';

const categoryConfig = {
  Infrastructure: { color: 'text-ipe-magenta', bg: 'bg-ipe-magenta/10', icon: Briefcase },
  Environmental: { color: 'text-ipe-green', bg: 'bg-ipe-green/10', icon: Leaf },
  Economic: { color: 'text-ipe-yellow', bg: 'bg-ipe-yellow/10', icon: Activity },
  Social: { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: Users },
};

export function ProposalCard({ proposal, index }: { proposal: Proposal, index: number }) {
  const router = useRouter();
  const votes = useMockStore((state) => state.votes[proposal.id] || []);
  
  const upVotes = votes.filter(v => v.sentiment === 'up').length;
  const downVotes = votes.filter(v => v.sentiment === 'down').length;
  
  const catConf = categoryConfig[proposal.category || 'Social'];
  const Icon = catConf?.icon || Users;

  // Derive simple impact level metric for the card
  const severeRisks = proposal.impactMatrix?.negativeImpacts.filter(r => r.risk === 'Severe').length || 0;
  const impactLevel = severeRisks > 0 ? 'High Risk' : 'Standard';

  return (
    <MotionBentoCard 
      delay={index * 0.1}
      className="group cursor-pointer flex flex-col justify-between h-full relative"
      onClick={() => router.push(`/proposals/${proposal.id}`)}
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
         <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
           <LayoutDashboard className="w-3 h-3" />
           Click to Deep Dive
         </span>
      </div>

      <div>
        <div className="flex items-start justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${catConf.bg} ${catConf.color}`}>
            <Icon className="w-3.5 h-3.5" />
            {proposal.category}
          </span>
          <span className={`text-xs font-bold uppercase tracking-widest ${impactLevel === 'High Risk' ? 'text-ipe-magenta' : 'text-ipe-green'}`}>
            {impactLevel}
          </span>
        </div>
        
        <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-ipe-yellow transition-colors">
          {proposal.title}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
          {proposal.abstract.eli5}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-[10px] uppercase tracking-wider font-bold">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-ipe-green">
            <ThumbsUp className="w-3 h-3" />
            <span>{upVotes}</span>
          </div>
          <div className="flex items-center gap-1 text-ipe-magenta">
            <ThumbsDown className="w-3 h-3" />
            <span>{downVotes}</span>
          </div>
          <div className="h-3 w-[1px] bg-border/50 mx-1" />
          <span className="text-muted-foreground">{proposal.customMetrics?.length || 0} Nuance Metrics</span>
        </div>
        <span className="text-muted-foreground/60">{new Date(proposal.createdAt).toLocaleDateString()}</span>
      </div>
    </MotionBentoCard>
  );
}
