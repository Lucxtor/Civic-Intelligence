'use client';

import React from 'react';
import { riskByCapital } from '@/lib/communityMockData';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-white/10 bg-zinc-900/95 backdrop-blur-xl px-4 py-3 shadow-2xl">
        <p className="text-xs font-heading font-bold text-zinc-300 mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-zinc-400">{entry.name}:</span>
            <span className="font-mono font-bold" style={{ color: entry.color }}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => (
  <div className="flex items-center justify-center gap-6 mt-4">
    {payload?.map((entry: any) => (
      <div key={entry.value} className="flex items-center gap-2 text-xs">
        <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
        <span className="text-zinc-400 font-medium">{entry.value}</span>
      </div>
    ))}
  </div>
);

export function PsychographicBar() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-6 h-full"
    >
      {/* Decorative glow */}
      <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-[#FF00FF] opacity-[0.03] blur-[80px]" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading text-lg font-bold text-zinc-100">Risk × Capital</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Risk tolerance mapped against capital velocity</p>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 border border-white/[0.06] rounded-full px-3 py-1">
          psychographic
        </span>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={riskByCapital} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="capital"
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
              stroke="rgba(255,255,255,0.06)"
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#52525b', fontSize: 10 }}
              stroke="rgba(255,255,255,0.06)"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Legend content={<CustomLegend />} />
            <Bar dataKey="High Risk" fill="#FF00FF" radius={[4, 4, 0, 0]} barSize={32} />
            <Bar dataKey="Low Risk" fill="#00FF66" radius={[4, 4, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
