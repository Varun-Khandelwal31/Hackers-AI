'use client';

import React from 'react';
import AppShell from '@/components/AppShell';
import { Compass, Clock, Lock, Sparkles } from 'lucide-react';
import { MOCK_ROADMAP_FEATURES } from '@/lib/seed-data';

export default function RoadmapPage() {
  const tier1Features = MOCK_ROADMAP_FEATURES.filter((f) => f.tier === 1);
  const tier2Features = MOCK_ROADMAP_FEATURES.filter((f) => f.tier === 2);

  return (
    <AppShell activeRole="organizer">
      <div className="max-w-7xl mx-auto space-y-10 animate-fade-in">
        
        {/* Header */}
        <div className="max-w-3xl border-b border-slate-800/80 pb-6">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4" />
            <span>Product Roadmap & Platform Expansion Scope</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            HackOps AI Architectural Vision
          </h1>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            All core operational features (Main Dashboard, AI Project Evaluation Radar, Team Complementarity Matching, AI Mentor Assistant, and Settings) are 100% live in this production release. Below is our upcoming module expansion roadmap.
          </p>
        </div>

        {/* TIER 1 SECTION */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs">
                T1
              </span>
              <div>
                <h2 className="text-lg font-bold text-white">Tier 1 Modules — Next Operations Build</h2>
                <p className="text-xs text-slate-400">Near-term operational enhancements for Organizers, Judges, and Sponsors.</p>
              </div>
            </div>
            <span className="text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-semibold">
              Planned • Q4 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tier1Features.map((feat) => (
              <div
                key={feat.id}
                className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3 relative hover:border-amber-500/30 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {feat.category}
                  </span>
                  <span className="inline-flex items-center space-x-1 text-[10px] font-semibold bg-slate-800 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>In Pipeline</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {feat.name}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* TIER 2 SECTION */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-xs">
                T2
              </span>
              <div>
                <h2 className="text-lg font-bold text-white">Tier 2 Modules — Advanced Scale & Analytics</h2>
                <p className="text-xs text-slate-400">Automated sponsor prize matching, plagiarism prevention, and live telemetry.</p>
              </div>
            </div>
            <span className="text-xs font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full font-semibold">
              Planned • Q1 2027
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tier2Features.map((feat) => (
              <div
                key={feat.id}
                className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3 relative hover:border-purple-500/30 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {feat.category}
                  </span>
                  <span className="inline-flex items-center space-x-1 text-[10px] font-semibold bg-slate-800 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>R&D Phase</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                  {feat.name}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
