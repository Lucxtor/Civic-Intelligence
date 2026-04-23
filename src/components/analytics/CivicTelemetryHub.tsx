'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TopMetrics } from './TopMetrics';
import { EpistemicRadarChart } from './EpistemicRadarChart';
import { PsychographicBar } from './PsychographicBar';
import { LayerTabs } from './LayerTabs';
import { ActionPlanCard } from './ActionPlanCard';
import { Radar, Shield } from 'lucide-react';

export function CivicTelemetryHub() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-[#00FF66]/10 border border-[#00FF66]/10">
              <Radar className="w-5 h-5 text-[#00FF66]" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600 border border-white/[0.06] rounded-full px-3 py-1">
              admin / telemetry
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-zinc-100 tracking-tight">
            Civic Telemetry Hub
          </h1>
          <p className="text-sm text-zinc-500 mt-1 max-w-lg">
            White-hat community intelligence across 5 civic layers. All data collection must use ZK proofs and verifiable credentials.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-600 border border-white/[0.06] rounded-full px-4 py-2 bg-white/[0.02]">
          <Shield className="w-3 h-3 text-amber-500" />
          <span>mock data — no PII</span>
        </div>
      </motion.div>

      {/* Top Metrics Row */}
      <TopMetrics />

      {/* Charts Row: Radar + Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EpistemicRadarChart />
        <PsychographicBar />
      </div>

      {/* Layer Deep-Dive Tabs */}
      <LayerTabs />

      {/* Strategic Privacy Guide */}
      <ActionPlanCard />
    </div>
  );
}
