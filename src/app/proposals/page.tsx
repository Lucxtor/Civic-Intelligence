'use client';

import React from 'react';
import { useMockStore } from '@/store/useMockStore';
import { ProposalCard } from '@/components/proposals/ProposalCard';
import { motion } from 'framer-motion';

export default function ProposalsPage() {
  const proposals = useMockStore((state) => state.proposals);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-heading font-bold mb-4">Civic Proposals</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Discover, analyze, and shape the policies affecting the future of our digital and physical spaces.
        </p>
      </motion.div>

      {proposals.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-xl">
          <h3 className="text-2xl font-heading text-muted-foreground mb-2">The Forge remains quiet.</h3>
          <p className="text-muted-foreground">No proposals have been broadcasted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
          {proposals.map((prop, idx) => (
            <ProposalCard key={prop.id} proposal={prop} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
