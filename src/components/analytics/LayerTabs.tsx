'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  layerInsights,
  originDistribution,
  professionDistribution,
  housingDistribution,
  capitalDistribution,
  timeDistribution,
  riskDistribution,
  governanceDistribution,
  expertiseDistribution,
  archetypeDistribution,
} from '@/lib/communityMockData';
import { Layers, Coins, Brain, BookOpen, Activity } from 'lucide-react';

type LayerKey = keyof typeof layerInsights;

const layers: { key: LayerKey; label: string; icon: React.ComponentType<any>; accent: string }[] = [
  { key: 'structural', label: 'Structural', icon: Layers, accent: '#00FF66' },
  { key: 'economic', label: 'Economic', icon: Coins, accent: '#E0FF00' },
  { key: 'psychographic', label: 'Psychographic', icon: Brain, accent: '#FF00FF' },
  { key: 'epistemic', label: 'Epistemic', icon: BookOpen, accent: '#E0FF00' },
  { key: 'behavioral', label: 'Behavioral', icon: Activity, accent: '#00FF66' },
];

function DistributionBar({ label, value, max, accent }: { label: string; value: number; max: number; accent: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-500">{value}</span>
          <span className="text-[10px] font-mono text-zinc-600">{pct}%</span>
        </div>
      </div>
      <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: accent }}
        />
      </div>
    </div>
  );
}

function getDistributionData(layerKey: LayerKey): { distributions: Record<string, number>[]; labels: string[] } {
  switch (layerKey) {
    case 'structural':
      return {
        distributions: [originDistribution, professionDistribution, housingDistribution],
        labels: ['Origin', 'Profession', 'Housing'],
      };
    case 'economic':
      return {
        distributions: [capitalDistribution, timeDistribution],
        labels: ['Capital Velocity', 'Time Availability'],
      };
    case 'psychographic':
      return {
        distributions: [riskDistribution, governanceDistribution],
        labels: ['Risk Tolerance', 'Governance Preference'],
      };
    case 'epistemic':
      return {
        distributions: [expertiseDistribution],
        labels: ['Domain Expertise'],
      };
    case 'behavioral':
      return {
        distributions: [archetypeDistribution],
        labels: ['Engagement Archetype'],
      };
  }
}

export function LayerTabs() {
  const [active, setActive] = useState<LayerKey>('structural');
  const insight = layerInsights[active];
  const { distributions, labels } = getDistributionData(active);
  const activeLayer = layers.find(l => l.key === active)!;
  const max = 500;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden"
    >
      {/* Tab Bar */}
      <div className="flex border-b border-white/[0.06] overflow-x-auto">
        {layers.map((layer) => {
          const Icon = layer.icon;
          const isActive = active === layer.key;
          return (
            <button
              key={layer.key}
              onClick={() => setActive(layer.key)}
              className={`relative flex items-center gap-2 px-5 py-4 text-xs font-medium uppercase tracking-widest transition-all whitespace-nowrap ${
                isActive
                  ? 'text-zinc-100'
                  : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: isActive ? layer.accent : undefined }} />
              {layer.label}
              {isActive && (
                <motion.div
                  layoutId="layer-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ backgroundColor: layer.accent }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="p-6"
        >
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-xl font-heading font-bold text-zinc-100 mb-1">{insight.title}</h3>
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">{insight.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Distribution Bars */}
            <div className="space-y-6">
              {distributions.map((dist, i) => (
                <div key={labels[i]}>
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-3 pb-1 border-b border-white/[0.04]">
                    {labels[i]}
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(dist)
                      .sort(([, a], [, b]) => b - a)
                      .map(([key, value]) => (
                        <DistributionBar key={key} label={key} value={value} max={max} accent={activeLayer.accent} />
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Insight + Actionable */}
            <div className="space-y-4">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-3">Analysis</h4>
                <p className="text-sm text-zinc-300 leading-relaxed">{insight.insight}</p>
              </div>
              <div className="rounded-xl border p-5" style={{ borderColor: `${activeLayer.accent}20`, backgroundColor: `${activeLayer.accent}05` }}>
                <h4 className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: activeLayer.accent }}>
                  Actionable Intelligence
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed">{insight.actionable}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
