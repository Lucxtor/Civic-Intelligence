'use client';

import React from 'react';
import { useMockStore } from '@/store/useMockStore';
import { ProposalCard } from '@/components/proposals/ProposalCard';
import { motion } from 'framer-motion';

export default function ProposalsPage() {
  const [proposals, setProposals] = React.useState<Proposal[]>([]);
  const [total, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const [search, setSearch] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [activeImpact, setActiveImpact] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<'recent' | 'voted' | 'relevance'>('recent');
  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 12; // Reduced for better grid view

  const [categories, setCategories] = React.useState<string[]>([]);
  const impacts = ['Low', 'Medium', 'High'];

  // Fetch categories
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) setCategories(await res.json());
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch proposals (Server-side pagination)
  React.useEffect(() => {
    const fetchProposals = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: ITEMS_PER_PAGE.toString(),
          sortBy,
          ...(search && { search }),
          ...(activeCategory && { category: activeCategory }),
          ...(activeImpact && { impact: activeImpact }),
        });

        const res = await fetch(`/api/proposals?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProposals(data.proposals);
          setTotal(data.total);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        console.error('Failed to load proposals:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, [currentPage, search, activeCategory, activeImpact, sortBy]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, activeCategory, activeImpact, sortBy]);

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* Search and Sort */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block font-bold">Search Proposals</label>
              <input 
                type="text"
                placeholder="Filter by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ipe-green/50 text-foreground transition-all"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block font-bold">Order By</label>
              <div className="flex gap-2">
                {[
                  { id: 'recent', label: 'Recent' },
                  { id: 'voted', label: 'Most Voted' },
                  { id: 'relevance', label: 'Relevance' }
                ].map((option) => (
                  <button 
                    key={option.id}
                    onClick={() => setSortBy(option.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === option.id ? 'bg-ipe-yellow text-black' : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="md:col-span-2 space-y-6">
            <div>
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

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block font-bold">Impact Level</label>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setActiveImpact(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!activeImpact ? 'bg-blue-400 text-black' : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground'}`}
                >
                  All
                </button>
                {impacts.map(imp => (
                  <button 
                    key={imp}
                    onClick={() => setActiveImpact(imp)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeImpact === imp ? 'bg-blue-400 text-black' : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground'}`}
                  >
                    {imp}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center py-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ipe-green"></div>
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-xl">
          <h3 className="text-2xl font-heading text-muted-foreground mb-2">The Forge remains quiet.</h3>
          <p className="text-muted-foreground">No proposals match your current filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
            {proposals.map((prop, idx) => (
              <ProposalCard key={prop.id} proposal={prop} index={idx} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                onClick={() => {
                  setCurrentPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-50 hover:bg-white/10 transition-all font-medium"
              >
                Prev
              </button>
              
              <div className="flex gap-2 mx-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => {
                      setCurrentPage(num);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all font-medium ${currentPage === num ? 'bg-ipe-green text-black' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setCurrentPage(p => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-50 hover:bg-white/10 transition-all font-medium"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
