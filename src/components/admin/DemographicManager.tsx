'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import type { DemographicDimension } from '@/store/useProfileStore';

export function DemographicManager() {
  const queryClient = useQueryClient();
  const [newKey, setNewKey] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newOptions, setNewOptions] = useState('');

  const { data: dimensions, isLoading } = useQuery<DemographicDimension[]>({
    queryKey: ['admin-dimensions'],
    queryFn: async () => {
      const res = await fetch('/api/admin/dimensions');
      if (!res.ok) throw new Error('Failed to fetch dimensions');
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (dimension: Partial<DemographicDimension>) => {
      const res = await fetch('/api/admin/dimensions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dimension),
      });
      if (!res.ok) throw new Error('Failed to create dimension');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dimensions'] });
      setNewKey('');
      setNewLabel('');
      setNewOptions('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/dimensions?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete dimension');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dimensions'] });
    },
  });

  const handleCreate = () => {
    if (!newKey || !newLabel || !newOptions) return;
    const optionsArray = newOptions.split(',').map((o) => o.trim()).filter(Boolean);
    createMutation.mutate({ key: newKey, label: newLabel, options: optionsArray });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00FF66]" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* List Existing */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold tracking-tight">Active Dimensions</h3>
        {dimensions?.map((dim) => (
          <Card key={dim.id} className="bg-white/5 border-white/10 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{dim.label}</CardTitle>
                  <CardDescription className="font-mono text-xs text-[#00FF66]">
                    Key: {dim.key}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:bg-red-400/10 hover:text-red-300"
                  onClick={() => deleteMutation.mutate(dim.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {dim.options.map((opt) => (
                  <span
                    key={opt}
                    className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-gray-200"
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New */}
      <div>
        <Card className="bg-white/5 border border-[#00FF66]/30 shadow-[0_0_15px_rgba(0,255,102,0.05)] backdrop-blur sticky top-6">
          <CardHeader>
            <CardTitle>Create New Dimension</CardTitle>
            <CardDescription>
              Define demographic fields that users must select when onboarding.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>System Key</Label>
              <Input
                placeholder="e.g. incomeLevel"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                className="bg-black/50 border-white/20 font-mono text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Display Label</Label>
              <Input
                placeholder="e.g. Income Level"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="bg-black/50 border-white/20"
              />
            </div>

            <div className="space-y-2">
              <Label>Options (Comma Separated)</Label>
              <Input
                placeholder="Low, Medium, High"
                value={newOptions}
                onChange={(e) => setNewOptions(e.target.value)}
                className="bg-black/50 border-white/20"
              />
            </div>

            <Button
              className="w-full bg-[#00FF66] text-black hover:bg-[#00CC55] mt-4"
              onClick={handleCreate}
              disabled={!newKey || !newLabel || !newOptions || createMutation.isPending}
            >
              {createMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Add Dimension
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
