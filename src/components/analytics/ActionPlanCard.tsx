'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ChevronDown, Fingerprint, KeyRound, Eye } from 'lucide-react';

const strategicSections = [
  {
    title: 'Zero-Knowledge Proofs for Data Collection',
    icon: Fingerprint,
    accent: '#00FF66',
    content: `All demographic data powering this dashboard MUST be collected via ZK-SNARKs or ZK-STARKs. Citizens prove properties about themselves (e.g., "I am a Local resident" or "My capital velocity is Salaried") without revealing their identity. The verifier contract accepts the proof and updates aggregate counters — no raw PII ever touches the server.`,
    implementation: [
      'Deploy a Circom/Noir circuit per demographic dimension',
      'Use Semaphore for group membership proofs',
      'Store only nullifier hashes to prevent double-counting',
      'Aggregate proofs on-chain via a BatchVerifier contract',
    ],
  },
  {
    title: 'Verifiable Credentials for Identity',
    icon: KeyRound,
    accent: '#E0FF00',
    content: `Each "Civic Passport" should be a W3C Verifiable Credential issued by the DAO resolver. The credential contains signed attestations (profession, housing type, etc.) that the holder can selectively disclose. No central database ever holds the full profile — the citizen's wallet IS the database.`,
    implementation: [
      'Issue VCs via EAS (Ethereum Attestation Service) schemas',
      'Support selective disclosure with BBS+ signatures',
      'Implement credential revocation via on-chain status lists',
      'Enable cross-community portability through DID:ethr',
    ],
  },
  {
    title: 'Differential Privacy for Analytics',
    icon: Eye,
    accent: '#FF00FF',
    content: `Even with ZK proofs, aggregate statistics can leak information about small subgroups. Apply differential privacy (ε-DP) noise to all displayed metrics. This ensures that the removal or addition of any single citizen's data does not meaningfully change the dashboard output — making re-identification attacks mathematically impossible.`,
    implementation: [
      'Add calibrated Laplace noise to all count queries',
      'Set privacy budget ε ≤ 1.0 for high-sensitivity dimensions',
      'Suppress cells with fewer than 5 members (k-anonymity floor)',
      'Publish quarterly privacy audit reports to the community',
    ],
  },
];

export function ActionPlanCard() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden"
    >
      {/* Decorative top border accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#00FF66] via-[#E0FF00] to-[#FF00FF]" />

      <div className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-[#00FF66]/10 border border-[#00FF66]/10">
            <ShieldCheck className="w-5 h-5 text-[#00FF66]" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-bold text-zinc-100">Strategic Privacy Guide</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              How to collect this data without compromising citizen anonymity
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 mb-6">
          <p className="text-xs text-amber-400/90 leading-relaxed">
            <strong>⚠ Ethical Imperative:</strong> The civic telemetry above is currently powered by mock data.
            Before connecting real citizen data, implement ALL three privacy layers below. 
            This dashboard is a <em>White-Hat</em> tool — its power requires commensurate responsibility.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-2">
          {strategicSections.map((section, i) => {
            const isOpen = openIndex === i;
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="rounded-xl border border-white/[0.06] overflow-hidden transition-colors"
                style={{ borderColor: isOpen ? `${section.accent}20` : undefined }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className="w-4 h-4 transition-colors"
                      style={{ color: isOpen ? section.accent : '#71717a' }}
                    />
                    <span className={`text-sm font-medium transition-colors ${isOpen ? 'text-zinc-100' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                      {section.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0">
                        <p className="text-sm text-zinc-400 leading-relaxed mb-4">{section.content}</p>
                        <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-4">
                          <h5
                            className="text-[10px] font-mono uppercase tracking-widest mb-3"
                            style={{ color: section.accent }}
                          >
                            Implementation Checklist
                          </h5>
                          <ul className="space-y-2">
                            {section.implementation.map((item, j) => (
                              <li key={j} className="flex items-start gap-2.5 text-xs text-zinc-400">
                                <div
                                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                  style={{ backgroundColor: section.accent }}
                                />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
