'use client';

import React from 'react';
import { epistemicRadarData } from '@/lib/communityMockData';
import { motion } from 'framer-motion';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-white/10 bg-zinc-900/95 backdrop-blur-xl px-4 py-3 shadow-2xl">
        <p className="text-xs font-heading font-bold text-zinc-200 mb-1">{payload[0].payload.subject}</p>
        <p className="text-sm font-mono" style={{ color: '#E0FF00' }}>
          {payload[0].value} members
        </p>
      </div>
    );
  }
  return null;
};

export function EpistemicRadarChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-6 h-full"
    >
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-[#E0FF00] opacity-[0.03] blur-[80px]" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading text-lg font-bold text-zinc-100">Epistemic Radar</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Domain expertise distribution across community</p>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 border border-white/[0.06] rounded-full px-3 py-1">
          knowledge graph
        </span>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={epistemicRadarData}>
            <PolarGrid stroke="rgba(255,255,255,0.06)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'var(--font-sans)' }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 300]}
              tick={{ fill: '#52525b', fontSize: 10 }}
              axisLine={false}
            />
            <Radar
              name="Expertise"
              dataKey="count"
              stroke="#E0FF00"
              fill="#E0FF00"
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
