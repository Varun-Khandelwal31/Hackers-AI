import React from 'react';

export function ProjectSkeleton() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-800 rounded w-1/3"></div>
        <div className="h-4 bg-slate-800 rounded w-16"></div>
      </div>
      <div className="h-5 bg-slate-800 rounded w-2/3"></div>
      <div className="h-3 bg-slate-800/80 rounded w-full"></div>
      <div className="h-3 bg-slate-800/80 rounded w-4/5"></div>
      <div className="flex space-x-2 pt-2">
        <div className="h-5 bg-slate-800 rounded w-14"></div>
        <div className="h-5 bg-slate-800 rounded w-14"></div>
      </div>
    </div>
  );
}

export function EvaluationSkeleton() {
  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 animate-pulse space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-brand-500/20 rounded-lg"></div>
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-slate-800 rounded w-48"></div>
          <div className="h-3 bg-slate-800/60 rounded w-32"></div>
        </div>
      </div>

      {/* Animated Radar placeholder circle */}
      <div className="w-full h-64 bg-slate-950/60 rounded-xl border border-slate-800/50 flex items-center justify-center relative overflow-hidden">
        <div className="w-44 h-44 rounded-full border-2 border-dashed border-brand-500/30 animate-spin" style={{ animationDuration: '6s' }}></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-ping"></div>
          <p className="text-xs font-mono text-brand-300">Evaluating Rubric Prompt...</p>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <div className="h-4 bg-slate-800 rounded w-full"></div>
        <div className="h-4 bg-slate-800 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function MentorSkeleton() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 animate-pulse space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-slate-800"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-800 rounded w-36"></div>
          <div className="h-3 bg-slate-800/60 rounded w-24"></div>
        </div>
      </div>
      <div className="h-3 bg-slate-800/80 rounded w-full"></div>
      <div className="h-3 bg-slate-800/80 rounded w-3/4"></div>
    </div>
  );
}

export function TeamRosterSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 animate-pulse space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-800"></div>
            <div className="space-y-1.5 flex-1">
              <div className="h-4 bg-slate-800 rounded w-28"></div>
              <div className="h-3 bg-slate-800/60 rounded w-20"></div>
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-slate-800/80 rounded w-full"></div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <div className="h-4 bg-slate-800 rounded w-12"></div>
              <div className="h-4 bg-slate-800 rounded w-16"></div>
              <div className="h-4 bg-slate-800 rounded w-14"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
