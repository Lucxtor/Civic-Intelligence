'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useMockStore } from '@/store/useMockStore';
import { ProposalCategory, RiskLevel, ImpactMatrix } from '@/types';

// Define the shape of our form, loosely aligned to the Proposal type
interface ForgeFormValues {
  title: string;
  category: ProposalCategory;
  technicalAbstract: string;
  eli5Abstract: string;
  content: string;
  allowComments: boolean;
  impact: 'Low' | 'Medium' | 'High';
  beneficiaries: { tag: string; estimate: number }[];
  negativeImpacts: { tag: string; risk: string }[];
  financials: { totalCost: number; currency: string; roiConfidence: number };
  customMetrics: { label: string; description: string }[];
}

export function AdminForge() {
  const addProposal = useMockStore((state) => state.addProposal);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, watch, reset } = useForm<ForgeFormValues>({
    defaultValues: {
      category: 'Social',
      impact: 'Medium',
      allowComments: true,
      beneficiaries: [{ tag: 'General Public', estimate: 100 }],
      negativeImpacts: [],
      financials: { totalCost: 0, currency: 'BRL', roiConfidence: 50 },
      customMetrics: [{ label: 'Global Approval', description: 'Mandatory standard approval rating.' }]
    }
  });

  const { fields: beneFields, append: appendBene, remove: removeBene } = useFieldArray({ control, name: 'beneficiaries' });
  const { fields: riskFields, append: appendRisk, remove: removeRisk } = useFieldArray({ control, name: 'negativeImpacts' });
  const { fields: metricFields, append: appendMetric, remove: removeMetric } = useFieldArray({ control, name: 'customMetrics' });

  const [categories, setCategories] = React.useState<string[]>([]);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const watchData = watch();

  const onSubmit = async (data: ForgeFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        title: data.title,
        category: data.category,
        abstract: {
          technical: data.technicalAbstract,
          eli5: data.eli5Abstract
        },
        content: data.content,
        impactMatrix: {
          beneficiaries: data.beneficiaries,
          negativeImpacts: data.negativeImpacts,
          financials: data.financials
        },
        impact: data.impact,
        customMetrics: data.customMetrics,
        allowComments: data.allowComments
      };

      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const newProposal = await res.json();
        // Clear local storage for consistency so they don't see double content if using mixed sources
        addProposal(newProposal); 
        alert('Proposal forged successfully!');
        reset();
      } else {
        throw new Error('Failed to forge proposal');
      }
    } catch (err) {
      console.error(err);
      alert('Error forging proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Derive radar data from form state
  const benefitsScore = Math.min((watchData.beneficiaries?.reduce((sum, b) => sum + (Number(b.estimate) || 0), 0) || 0) / 1000, 100) || 10;
  const risksCount = watchData.negativeImpacts?.length || 0;
  const riskScore = 100 - (risksCount * 20); // simplistic derivation
  const roiScore = watchData.financials?.roiConfidence || 50;

  const radarData = [
    { subject: 'Social Output', A: benefitsScore, fullMark: 100 },
    { subject: 'Innovation', A: 70, fullMark: 100 }, // static for demo
    { subject: 'Risk Management', A: riskScore, fullMark: 100 },
    { subject: 'Financial ROI', A: roiScore, fullMark: 100 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT: Single Scrolling Form */}
      <div className="lg:col-span-2 space-y-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          
          {/* Metadata Section */}
          <div className="glass-panel p-6 rounded-xl space-y-6">
            <h2 className="text-xl font-heading font-bold text-ipe-yellow">Core Registry</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input {...register("title", { required: true })} className="w-full bg-background/50 border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ipe-yellow" placeholder="e.g. Precision Municipal Tax Rebalancing" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select {...register("category")} className="w-full bg-background/50 border border-border rounded-md px-3 py-2 text-foreground">
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Impact Level</label>
                <select {...register("impact")} className="w-full bg-background/50 border border-border rounded-md px-3 py-2 text-foreground">
                  <option value="Low">Low Impact</option>
                  <option value="Medium">Medium Impact</option>
                  <option value="High">High Impact</option>
                </select>
              </div>
            </div>
          </div>

          {/* Abstracts Section */}
          <div className="glass-panel p-6 rounded-xl space-y-6">
            <h2 className="text-xl font-heading font-bold text-ipe-yellow">Abstracts & Translations</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">ELI5 Abstract (Community Facing)</label>
                <textarea {...register("eli5Abstract", { required: true })} rows={2} className="w-full bg-background/50 border border-border rounded-md px-3 py-2 text-foreground" placeholder="Explain it like I am 5..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Technical Abstract (High-fidelity)</label>
                <textarea {...register("technicalAbstract", { required: true })} rows={3} className="w-full bg-background/50 border border-border rounded-md px-3 py-2 text-foreground" placeholder="Rigorous synopsis..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Content (Markdown)</label>
                <textarea {...register("content")} rows={6} className="w-full bg-background/50 border border-border rounded-md px-3 py-2 text-foreground font-mono text-sm" placeholder="## Background\n\nWe propose..." />
              </div>
            </div>
          </div>

          {/* Impact Matrix Section */}
          <div className="glass-panel p-6 rounded-xl space-y-6 relative overflow-hidden">
             {/* Neon accent top border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ipe-green via-ipe-yellow to-transparent" />
            
            <h2 className="text-xl font-heading font-bold text-ipe-green">Impact Matrix Editor</h2>
            
            {/* Beneficiaries Array */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Beneficiaries (Green Zones)</h3>
              {beneFields.map((field, idx) => (
                <div key={field.id} className="flex items-center gap-4">
                  <input {...register(`beneficiaries.${idx}.tag`)} placeholder="e.g. Remote Workers" className="flex-1 bg-background/50 border border-border rounded-md px-3 py-2 text-foreground" />
                  <input {...register(`beneficiaries.${idx}.estimate`)} type="number" placeholder="Est. Reach" className="w-32 bg-background/50 border border-border rounded-md px-3 py-2 text-foreground" />
                  <button type="button" onClick={() => removeBene(idx)} className="text-destructive hover:text-red-400">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => appendBene({ tag: '', estimate: 0 })} className="text-sm text-ipe-green hover:underline">+ Add Beneficiary</button>
            </div>

            {/* Negative Impacts Array */}
            <div className="space-y-2 pt-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Negative Impacts (Red Zones)</h3>
              {riskFields.map((field, idx) => (
                <div key={field.id} className="flex items-center gap-4">
                  <input {...register(`negativeImpacts.${idx}.tag`)} placeholder="e.g. Real Estate Devs" className="flex-1 bg-background/50 border border-border rounded-md px-3 py-2 text-foreground" />
                  <select {...register(`negativeImpacts.${idx}.risk`)} className="bg-background/50 border border-border rounded-md px-3 py-2 text-foreground">
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                  <button type="button" onClick={() => removeRisk(idx)} className="text-destructive hover:text-red-400">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => appendRisk({ tag: '', risk: 'Low' })} className="text-sm text-ipe-magenta hover:underline">+ Add Risk Profile</button>
            </div>

            {/* Financials Radial Estimate */}
            <div className="space-y-2 pt-4">
               <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Financial Projections</h3>
               <div className="flex gap-4">
                  <input {...register("financials.currency")} className="w-20 bg-background/50 border border-border rounded-md px-3 py-2 text-foreground uppercase" placeholder="BRL" />
                  <input {...register("financials.totalCost")} type="number" className="flex-1 bg-background/50 border border-border rounded-md px-3 py-2 text-foreground" placeholder="Total Cost" />
               </div>
               <div className="flex items-center gap-4">
                 <label className="text-sm">ROI Precision Confidence ({watchData.financials?.roiConfidence}%)</label>
                 <input type="range" {...register("financials.roiConfidence")} min="0" max="100" className="flex-1 accent-ipe-yellow" />
               </div>
            </div>

          </div>

          {/* Metric Forge (Question Builder) */}
          <div className="glass-panel p-6 rounded-xl space-y-6">
            <h2 className="text-xl font-heading font-bold text-ipe-magenta">Metric Forge (Likert Scales)</h2>
            <p className="text-sm text-muted-foreground mb-4">Define the specific discussion facets for community voting. Standard Approval is mandatory.</p>
            
            {metricFields.map((field, idx) => (
              <div key={field.id} className="p-4 bg-background/30 border border-border/50 rounded-lg space-y-2">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Scale {idx + 1}</span>
                    {idx !== 0 && (<button type="button" onClick={() => removeMetric(idx)} className="text-xs text-destructive hover:underline">Remove Facet</button>)}
                 </div>
                 <input {...register(`customMetrics.${idx}.label`)} placeholder="Scale Name (e.g. Sustainability Index)" disabled={idx === 0} className="w-full font-bold bg-background/50 border border-border rounded-md px-3 py-2 text-foreground disabled:opacity-50" />
                 <input {...register(`customMetrics.${idx}.description`)} placeholder="Helper description text..." disabled={idx === 0} className="w-full text-sm bg-background/50 border border-border rounded-md px-3 py-2 text-foreground disabled:opacity-50" />
              </div>
            ))}
            <button type="button" onClick={() => appendMetric({ label: '', description: '' })} className="text-sm text-ipe-magenta hover:underline mt-4">+ Add Custom Facet</button>
          </div>

          <div className="flex justify-end gap-4 pb-12">
            <button type="submit" disabled={isSubmitting} className="glass-panel px-8 py-3 rounded-md font-bold text-black bg-ipe-green hover:bg-ipe-green/90 transition-colors disabled:opacity-50">
              {isSubmitting ? 'Forging...' : 'Broadcast Proposal'}
            </button>
          </div>

        </form>
      </div>

      {/* RIGHT: Sticky Live Radar Preview */}
      <div className="relative">
        <div className="sticky top-24 glass-panel p-6 rounded-xl overflow-hidden aspect-square flex flex-col items-center justify-center">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-ipe-yellow to-transparent" />
          <h3 className="font-heading font-bold mb-4 z-10 relative">Live Governance Radar</h3>
          
          <div className="w-full h-full absolute inset-0 pt-10">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="60%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                <Radar name="Impact Profile" dataKey="A" stroke="#E1FF00" fill="#E1FF00" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stats Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs font-mono text-muted-foreground bg-background/80 p-2 rounded-lg backdrop-blur-sm border border-border/50">
            <span>ROI CF: {watchData.financials?.roiConfidence}%</span>
            <span>Risks: {risksCount}</span>
            <span>Bens: {watchData.beneficiaries?.length}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
