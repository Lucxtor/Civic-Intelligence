'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMockStore } from '@/store/useMockStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ExternalLink, BarChart3, ShieldCheck } from 'lucide-react';
import { Proposal } from '@/types';

export default function ProposalDetailView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  
  const [proposal, setProposal] = React.useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'eli5' | 'tech'>('eli5');

  React.useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await fetch(`/api/proposals/${id}`);
        if (res.ok) setProposal(await res.json());
      } catch (err) {
        console.error('Failed to load proposal:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProposal();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ipe-green"></div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-heading text-destructive mb-4">404: Proposal Not Found</h1>
        <button onClick={() => router.push('/proposals')} className="text-ipe-green underline transition-opacity hover:opacity-80">
          Return to Discovery
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb Navigation Placeholder */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <button onClick={() => router.push('/proposals')} className="hover:text-foreground transition-colors">Home</button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium truncate">{proposal.title}</span>
      </div>

      {/* Header Panel */}
      <div className="glass-panel p-8 rounded-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-ipe-green/10 rounded-bl-[100px]" />
        
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-ipe-magenta/10 text-ipe-magenta rounded-full text-xs font-bold uppercase tracking-widest">
            {proposal.category}
          </span>
          <span className="text-sm text-muted-foreground font-mono">ID: {proposal.id.split('-')[1] || proposal.id}</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-heading font-bold max-w-3xl mb-6">
          {proposal.title}
        </h1>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-border/50">
          <button 
            onClick={() => router.push(`/proposals/${proposal.id}/vote`)}
            className="flex items-center gap-2 px-6 py-3 bg-ipe-green text-black font-bold rounded-lg hover:bg-ipe-green/90 transition-colors"
          >
            <ShieldCheck className="w-5 h-5" />
            Nuance Vote
          </button>
          
          <button 
            onClick={() => router.push(`/proposals/${proposal.id}/dashboard`)}
            className="flex items-center gap-2 px-6 py-3 bg-background/50 border border-border text-foreground font-bold rounded-lg hover:bg-background/80 transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            Civic Pulse
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Summary Toggle Box */}
          <div className="border border-border/50 rounded-xl overflow-hidden bg-background/30">
            <div className="flex border-b border-border/50">
              <button 
                onClick={() => setActiveTab('eli5')}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'eli5' ? 'bg-ipe-green/10 text-ipe-green' : 'text-muted-foreground hover:bg-background/50'}`}
              >
                ELI5 Summary
              </button>
              <button 
                onClick={() => setActiveTab('tech')}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'tech' ? 'bg-ipe-yellow/10 text-ipe-yellow' : 'text-muted-foreground hover:bg-background/50'}`}
              >
                Technical Abstract
              </button>
            </div>
            <div className="p-6 relative min-h-[150px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-lg leading-relaxed absolute inset-6"
                >
                  {activeTab === 'eli5' ? proposal.abstract.eli5 : proposal.abstract.technical}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Full Markdown Content */}
          <div className="glass-panel p-8 rounded-xl prose prose-invert max-w-none">
            {/* Super basic markdown rendering for scaffold. A real parser goes here later. */}
            {proposal.content.split('\n').map((line, i) => {
              if (line.startsWith('##')) return <h2 key={i} className="font-heading text-ipe-magenta mt-8">{line.replace('##', '')}</h2>;
              if (line.startsWith('#')) return <h1 key={i} className="font-heading text-ipe-yellow">{line.replace('#', '')}</h1>;
              if (line.trim() === '') return <br key={i} />;
              return <p key={i}>{line}</p>;
            })}
          </div>

        </div>

        {/* Right Sidebar - Impact Static Summary */}
        <div className="space-y-6">
           <div className="glass-panel p-6 rounded-xl">
             <h3 className="font-heading font-bold text-ipe-green mb-4">Beneficiaries</h3>
             <ul className="space-y-3">
               {proposal.impactMatrix?.beneficiaries.map((b, i) => (
                 <li key={i} className="flex justify-between items-center text-sm border-b border-border/40 pb-2">
                   <span>{b.tag}</span>
                   <span className="font-mono text-ipe-green">~{b.estimate.toLocaleString()}</span>
                 </li>
               ))}
               {(!proposal.impactMatrix?.beneficiaries || proposal.impactMatrix.beneficiaries.length === 0) && (
                 <p className="text-sm text-muted-foreground italic">No primary beneficiaries registered.</p>
               )}
             </ul>
           </div>

           <div className="glass-panel p-6 rounded-xl">
             <h3 className="font-heading font-bold text-ipe-magenta mb-4">Risk Profile</h3>
             <ul className="space-y-3">
               {proposal.impactMatrix?.negativeImpacts.map((r, i) => (
                 <li key={i} className="flex justify-between items-center text-sm border-b border-border/40 pb-2">
                   <span>{r.tag}</span>
                   <span className={`px-2 py-0.5 rounded text-xs font-bold ${r.risk === 'Severe' ? 'bg-ipe-magenta text-black' : r.risk === 'Moderate' ? 'bg-orange-500/20 text-orange-400' : 'bg-ipe-green/20 text-ipe-green'}`}>{r.risk}</span>
                 </li>
               ))}
               {(!proposal.impactMatrix?.negativeImpacts || proposal.impactMatrix.negativeImpacts.length === 0) && (
                 <p className="text-sm text-muted-foreground italic">No specific risk groups identified.</p>
               )}
             </ul>
           </div>
        </div>

      </div>
    </div>
  );
}
