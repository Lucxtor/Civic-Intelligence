'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMockStore } from '@/store/useMockStore';
import { 
  ChevronRight, 
  Shield, 
  BarChart3, 
  Users, 
  Zap, 
  ArrowRight 
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
};

const pillars = [
  {
    icon: Shield,
    title: 'Nuance Voting',
    description: 'Beyond yes/no. Multi-dimensional Likert scales capture the full spectrum of civic sentiment.',
    accent: 'text-ipe-green',
    glow: 'group-hover:shadow-ipe-green/20',
  },
  {
    icon: BarChart3,
    title: 'Civic Pulse Dashboard',
    description: 'Real-time demographic consensus mapping. See how every community segment responds.',
    accent: 'text-ipe-yellow',
    glow: 'group-hover:shadow-ipe-yellow/20',
  },
  {
    icon: Users,
    title: 'Wallet Demographics',
    description: 'On-chain identity forms the basis for privacy-preserving social stratification.',
    accent: 'text-ipe-magenta',
    glow: 'group-hover:shadow-ipe-magenta/20',
  },
  {
    icon: Zap,
    title: 'Impact Matrix',
    description: 'Structured beneficiary/risk analysis with financial ROI confidence gauges.',
    accent: 'text-blue-400',
    glow: 'group-hover:shadow-blue-400/20',
  },
];

export default function Home() {
  const proposals = useMockStore((state) => state.proposals);
  const activeCount = proposals.length;

  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ipe-green/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-ipe-magenta/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-ipe-yellow/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="relative z-10 container mx-auto px-4 text-center max-w-4xl"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-ipe-green/10 text-ipe-green border border-ipe-green/20">
              <span className="w-2 h-2 rounded-full bg-ipe-green animate-pulse" />
              {activeCount} Active Proposals
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold tracking-tight leading-[1.1] mb-6"
          >
            Governance through{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-ipe-green via-ipe-yellow to-ipe-magenta">
              Collective Intelligence
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Every citizen gets the opportunity to speak their mind and be heard through 
            a nuanced, data-driven, and entirely anonymous process — removing the noise 
            of unstructured feedback to find true consensus.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/proposals"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-ipe-green text-black font-bold rounded-xl hover:bg-ipe-green/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-ipe-green/20"
            >
              Explore Proposals
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 glass-panel rounded-xl font-bold hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Launch Proposal Forge
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-border/50 flex items-start justify-center p-1.5"
          >
            <div className="w-1.5 h-2.5 rounded-full bg-muted-foreground/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Pillars Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
              The Four Pillars of{' '}
              <span className="text-ipe-yellow">Civic Intelligence</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A multi-dimensional governance framework designed for transparency, nuance, and democratic precision.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1 }}
                className={`group glass-panel p-6 rounded-2xl hover:shadow-lg ${pillar.glow} transition-all duration-300 cursor-default`}
              >
                <div className={`w-12 h-12 rounded-xl bg-background/50 border border-border/50 flex items-center justify-center mb-5 ${pillar.accent}`}>
                  <pillar.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Activity Strip */}
      {activeCount > 0 && (
        <section className="py-16 border-y border-border/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center justify-between gap-8"
            >
              <div>
                <h3 className="text-2xl font-heading font-bold mb-2">Community Activity</h3>
                <p className="text-muted-foreground">The Forge is active. Join the civic discourse.</p>
              </div>
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold font-mono text-ipe-green">{activeCount}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Active Proposals</div>
                </div>
                <div className="w-px bg-border/50" />
                <div className="text-center">
                  <div className="text-3xl font-bold font-mono text-ipe-yellow">∞</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Facets Analyzed</div>
                </div>
                <div className="w-px bg-border/50" />
                <div className="text-center">
                  <div className="text-3xl font-bold font-mono text-ipe-magenta">0x</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">On-Chain Votes</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel rounded-3xl p-12 md:p-16 relative overflow-hidden max-w-3xl mx-auto"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ipe-green via-ipe-yellow to-ipe-magenta" />
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
              Ready to Shape the Future?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Connect your wallet, explore active proposals, and make your voice count with nuanced, multi-dimensional feedback.
            </p>
            <Link
              href="/proposals"
              className="inline-flex items-center gap-2 px-8 py-4 bg-ipe-green text-black font-bold rounded-xl hover:bg-ipe-green/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-ipe-green/20"
            >
              Enter the Platform
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
