'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfileStore } from '@/store/useProfileStore';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Fingerprint, ShieldCheck } from 'lucide-react';
import { useAccount } from 'wagmi';

export function OnboardingModal() {
  const { address } = useAccount();
  const { showOnboardingModal, dimensions, setProfile } = useProfileStore();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showOnboardingModal) return null;

  const isFormComplete = dimensions.every((dim) => formData[dim.key]);

  const handleSubmit = async () => {
    if (!isFormComplete || !address) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address, demographics: formData }),
      });

      if (res.ok) {
        setProfile(formData);
      }
    } catch (error) {
      console.error('Failed to submit profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.1 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#121212] p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#00FF66]/10 text-[#00FF66]">
              <Fingerprint className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Civic Context Required
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              To participate in governance, we need your demographic inputs. This ensures proposal analytics are diverse while maintaining your anonymity.
            </p>
          </div>

          <div className="mb-6 rounded-xl border border-[#00FF66]/20 bg-[#00FF66]/5 p-4 text-xs text-[#00FF66] flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <p>
              <strong>Privacy Guarantee:</strong> Your wallet address is linked to this context for spam prevention only. When you vote, the wallet is stripped, and only these demographic tags are recorded.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {dimensions.map((dim) => (
              <div key={dim.key} className="space-y-2">
                <label className="text-sm font-medium text-gray-200">
                  {dim.label}
                </label>
                <Select
                  value={formData[dim.key] || ''}
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, [dim.key]: val as string }))
                  }
                >
                  <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-[#00FF66]">
                    <SelectValue placeholder={`Select ${dim.label}`} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                    {dim.options.map((opt) => (
                      <SelectItem
                        key={opt}
                        value={opt}
                        className="hover:bg-white/10 focus:bg-white/10 focus:text-white"
                      >
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {/* Action */}
          <div className="mt-8">
            <Button
              className="w-full h-12 bg-[#00FF66] text-black hover:bg-[#00CC55] text-base font-semibold transition-colors"
              onClick={handleSubmit}
              disabled={!isFormComplete || isSubmitting}
            >
              {isSubmitting ? 'Saving Context...' : 'Enter Platform'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
