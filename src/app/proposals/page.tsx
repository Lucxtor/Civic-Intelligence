'use client';

import React from 'react';
import { useMockStore } from '@/store/useMockStore';
import { ProposalCard } from '@/components/proposals/ProposalCard';
import { motion } from 'framer-motion';

export default function ProposalsPage() {
  const proposals = useMockStore((state) => state.proposals);
  const [search, setSearch] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

  const categories = ['Infrastructure', 'Environmental', 'Economic', 'Social'];

  const filteredProposals = proposals.filter((prop) => {
    const matchesSearch = prop.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory ? prop.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold mb-4">Civic Proposals</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Discover, analyze, and shape the policies affecting the future of our digital and physical spaces.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block font-bold">Search Proposals</label>
            <input 
              type="text"
              placeholder="Filter by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ipe-green/50 text-foreground transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block font-bold">Category</label>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!activeCategory ? 'bg-ipe-green text-black' : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground'}`}
              >
                All
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === cat ? 'bg-ipe-green text-black' : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {filteredProposals.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-xl">
          <h3 className="text-2xl font-heading text-muted-foreground mb-2">The Forge remains quiet.</h3>
          <p className="text-muted-foreground">No proposals match your current filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
          {filteredProposals.map((prop, idx) => (
            <ProposalCard key={prop.id} proposal={prop} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
