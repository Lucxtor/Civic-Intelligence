'use client';

import React from 'react';
import { topMetrics } from '@/lib/communityMockData';
import { motion } from 'framer-motion';
import { Users, Clock, Zap, BarChart3 } from 'lucide-react';

const metrics = [
  {
    label: 'Active Passports',
    value: topMetrics.activePassports.toLocaleString(),
    subtext: `of ${topMetrics.totalPassports} total`,
    icon: Users,
    accent: '#00FF66',
    percentage: Math.round((topMetrics.activePassports / topMetrics.totalPassports) * 100),
  },
  {
    label: 'Avg. Time Bandwidth',
    value: topMetrics.avgTimeAvailability,
    subtext: 'community average',
    icon: Clock,
    accent: '#E0FF00',
    percentage: topMetrics.avgTimeAvailability === 'High' ? 85 : topMetrics.avgTimeAvailability === 'Medium' ? 55 : 25,
  },
  {
    label: 'Dominant Archetype',
    value: topMetrics.dominantArchetype,
    subtext: `${topMetrics.dominantArchetypeCount} members`,
    icon: Zap,
    accent: '#FF00FF',
    percentage: Math.round((topMetrics.dominantArchetypeCount / topMetrics.totalPassports) * 100),
  },
  {
    label: 'Avg. Proposals Voted',
    value: topMetrics.avgProposalsVoted.toString(),
    subtext: 'per passport',
    icon: BarChart3,
    accent: '#00FF66',
    percentage: Math.round((topMetrics.avgProposalsVoted / 35) * 100),
  },
];

export function TopMetrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map((metric, i) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-5 group hover:border-white/[0.12] transition-all duration-300"
          >
            {/* Glow accent */}
            <div
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-[0.06] blur-3xl group-hover:opacity-[0.12] transition-opacity duration-500"
              style={{ backgroundColor: metric.accent }}
            />

            <div className="flex items-start justify-between mb-4">
              <div
                className="p-2.5 rounded-xl border border-white/[0.06]"
                style={{ backgroundColor: `${metric.accent}10` }}
              >
                <Icon className="w-4 h-4" style={{ color: metric.accent }} />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                {metric.percentage}%
              </span>
            </div>

            <p className="text-2xl font-heading font-bold tracking-tight mb-1" style={{ color: metric.accent }}>
              {metric.value}
            </p>
            <p className="text-xs font-medium text-zinc-400 mb-0.5">{metric.label}</p>
            <p className="text-[10px] text-zinc-600">{metric.subtext}</p>

            {/* Micro progress bar */}
            <div className="mt-4 w-full h-1 rounded-full bg-white/[0.04] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.percentage}%` }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: metric.accent }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
