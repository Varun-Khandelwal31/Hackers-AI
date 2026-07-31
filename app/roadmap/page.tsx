'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import { useApp } from '@/lib/AppContext';
import { useToast } from '@/components/Toast';
import {
  Compass,
  CheckCircle2,
  Zap,
  Clock,
  Sparkles,
  Plus,
  ThumbsUp,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Layers,
  Award,
  Filter,
  X,
  MessageSquare,
} from 'lucide-react';

interface RoadmapItem {
  id: string;
  title: string;
  category: 'AI Core' | 'Matchmaking' | 'Evaluation' | 'Recruiting' | 'DevOps';
  description: string;
  status: 'shipped' | 'in_progress' | 'planned' | 'under_review';
  quarter: 'Q1 2026' | 'Q2 2026' | 'Q3 2026' | 'Q4 2026';
  upvotes: number;
  progressPercent: number;
  tags: string[];
}

export default function RoadmapPage() {
  const { showToast } = useToast();
  const { activeRole } = useApp();

  const [activeQuarterFilter, setActiveQuarterFilter] = useState<string>('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
  const [upvotesState, setUpvotesState] = useState<Record<string, number>>({});
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // New Feature Request Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'AI Core' | 'Matchmaking' | 'Evaluation' | 'Recruiting' | 'DevOps'>('AI Core');
  const [newDescription, setNewDescription] = useState('');

  const initialItems: RoadmapItem[] = [
    // SHIPPED & LIVE 🟢
    {
      id: 'road-1',
      title: 'Multimodal Gemini 1.5 Flash Vision Screen Inspection',
      category: 'AI Core',
      description: 'Real-time 1 FPS screen frame capture with direct code line & terminal stack trace inspection.',
      status: 'shipped',
      quarter: 'Q1 2026',
      upvotes: 142,
      progressPercent: 100,
      tags: ['Gemini 1.5', 'Vision API', 'WebSpeech'],
    },
    {
      id: 'road-2',
      title: 'ElevenLabs Low-Latency Voice Persona Locking',
      category: 'AI Core',
      description: 'High-fidelity human voice synthesis for 4 mentor personas (Alex, Priya, Marcus, Elena) with locked pitch.',
      status: 'shipped',
      quarter: 'Q1 2026',
      upvotes: 118,
      progressPercent: 100,
      tags: ['ElevenLabs', 'Voice TTS', 'Persona Lock'],
    },
    {
      id: 'road-3',
      title: 'Dedicated Judge Rubric Portal & AI Pre-Fill',
      category: 'Evaluation',
      description: 'Custom 4-criteria rubric sliders with 1-click AI score pre-fill and instant leaderboard recalculation.',
      status: 'shipped',
      quarter: 'Q2 2026',
      upvotes: 96,
      progressPercent: 100,
      tags: ['Rubric Sliders', 'Judge QA', 'Supabase Realtime'],
    },
    {
      id: 'road-4',
      title: 'Public Projects Showcase & Live Deployed Demo URLs',
      category: 'Evaluation',
      description: 'Directory for browsing submitted repositories with 1-click live Vercel/Render demo URL previews.',
      status: 'shipped',
      quarter: 'Q2 2026',
      upvotes: 84,
      progressPercent: 100,
      tags: ['Project Showcase', 'Live Demo', 'Upvote'],
    },

    // IN PROGRESS ⚡
    {
      id: 'road-5',
      title: 'Autonomous Synthetic AI Teammate Agents',
      category: 'Matchmaking',
      description: 'Autonomous AI subagents spawned to fill solo hacker team slots and auto-generate test suites & pitch decks.',
      status: 'in_progress',
      quarter: 'Q2 2026',
      upvotes: 189,
      progressPercent: 75,
      tags: ['AI Agents', 'Auto Testing', 'Team Matcher'],
    },
    {
      id: 'road-6',
      title: 'Sponsor Prize Track Auto-Classifier',
      category: 'Recruiting',
      description: 'Automatic ML categorizer matching submitted code bases against sponsor prize track requirements.',
      status: 'in_progress',
      quarter: 'Q2 2026',
      upvotes: 124,
      progressPercent: 60,
      tags: ['Sponsor Bounty', 'Auto Tagging', 'ML Classifier'],
    },

    // PLANNED 🚀
    {
      id: 'road-7',
      title: 'Real-Time Git Commit Plagiarism & Timeline Analyzer',
      category: 'Evaluation',
      description: 'Static AST commit velocity analyzer detecting pre-existing codebases and template plagiarism.',
      status: 'planned',
      quarter: 'Q3 2026',
      upvotes: 210,
      progressPercent: 20,
      tags: ['Plagiarism Check', 'AST Inspector', 'Git Velocity'],
    },
    {
      id: 'road-8',
      title: 'Sponsor Recruiter Talent Index & Hiring Export',
      category: 'Recruiting',
      description: 'Recruiter scoring dashboard ranking participants by code quality, commit depth, and test coverage.',
      status: 'planned',
      quarter: 'Q3 2026',
      upvotes: 165,
      progressPercent: 15,
      tags: ['Hiring Index', 'CSV Export', 'Recruiter View'],
    },
    {
      id: 'road-9',
      title: 'Multi-Region WebRTC Low-Latency Voice Relay',
      category: 'DevOps',
      description: 'Edge-rendered WebRTC audio relay for ultra-low latency sub-200ms voice response times globally.',
      status: 'under_review',
      quarter: 'Q4 2026',
      upvotes: 94,
      progressPercent: 5,
      tags: ['WebRTC', 'Edge Workers', 'Low Latency'],
    },
  ];

  const [items, setItems] = useState<RoadmapItem[]>(initialItems);

  const handleUpvote = (id: string) => {
    const current = upvotesState[id] || 0;
    setUpvotesState({ ...upvotesState, [id]: current + 1 });
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item))
    );
    showToast('Upvote Recorded! ⭐', 'Thank you for shaping the HackOps AI product roadmap.', 'success');
  };

  const handleCreateFeatureRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      showToast('Validation Error', 'Title and description are required', 'error');
      return;
    }

    const newItem: RoadmapItem = {
      id: `request-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim(),
      status: 'under_review',
      quarter: 'Q4 2026',
      upvotes: 1,
      progressPercent: 0,
      tags: ['Community Idea', 'Backlog'],
    };

    setItems([newItem, ...items]);
    setIsSubmitModalOpen(false);
    showToast('Feature Submitted! 🚀', `"${newItem.title}" added to community review queue.`, 'success');
    setNewTitle('');
    setNewDescription('');
  };

  const filteredItems = items.filter((item) => {
    const matchesQuarter = activeQuarterFilter === 'all' || item.quarter === activeQuarterFilter;
    const matchesStatus = activeStatusFilter === 'all' || item.status === activeStatusFilter;
    return matchesQuarter && matchesStatus;
  });

  const getStatusBadge = (status: RoadmapItem['status']) => {
    switch (status) {
      case 'shipped':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Shipped & Live 🟢</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/40 text-[10px] font-bold flex items-center space-x-1 animate-pulse">
            <Zap className="w-3 h-3 text-brand-400" />
            <span>In Active Build ⚡</span>
          </span>
        );
      case 'planned':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Scheduled Release 🚀</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Under Consideration 💡</span>
          </span>
        );
    }
  };

  return (
    <AppShell activeRole={activeRole}>
      <div className="max-w-7xl mx-auto space-y-8 font-sans pb-16 animate-fade-in">
        
        {/* HEADER SECTION */}
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold">
              <Compass className="w-3.5 h-3.5 text-brand-400" />
              <span>INTERACTIVE PRODUCT ROADMAP & BACKLOG</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center space-x-3">
              <span>HackOps AI Product Roadmap</span>
              <Sparkles className="w-8 h-8 text-brand-400" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Track live feature releases, active engineering sprints, and vote on upcoming module expansions for the hackathon operational layer.
            </p>
          </div>

          <div className="flex items-center space-x-3 relative z-10 shrink-0">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center space-x-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Suggest Feature Idea</span>
            </button>
          </div>
        </div>

        {/* TIMELINE STATS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase">Shipped & Live</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {items.filter((i) => i.status === 'shipped').length} Modules
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase">Active Sprints</span>
            <div className="text-2xl font-black text-brand-300 font-mono">
              {items.filter((i) => i.status === 'in_progress').length} In Build
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase">Scheduled Q3/Q4</span>
            <div className="text-2xl font-black text-purple-400 font-mono">
              {items.filter((i) => i.status === 'planned').length} Planned
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase">Community Votes</span>
            <div className="text-2xl font-black text-amber-400 font-mono">
              {items.reduce((acc, i) => acc + i.upvotes, 0)} Votes
            </div>
          </div>
        </div>

        {/* FILTER BAR STRIP */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Statuses' },
              { id: 'shipped', label: 'Shipped 🟢' },
              { id: 'in_progress', label: 'In Build ⚡' },
              { id: 'planned', label: 'Scheduled 🚀' },
              { id: 'under_review', label: 'Backlog 💡' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeStatusFilter === tab.id
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quarter Dropdown */}
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">Quarter:</span>
            <select
              value={activeQuarterFilter}
              onChange={(e) => setActiveQuarterFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 text-xs font-semibold text-white border border-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Quarters</option>
              <option value="Q1 2026">Q1 2026</option>
              <option value="Q2 2026">Q2 2026</option>
              <option value="Q3 2026">Q3 2026</option>
              <option value="Q4 2026">Q4 2026</option>
            </select>
          </div>
        </div>

        {/* KANBAN / TIMELINE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between shadow-xl group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                    {item.category}
                  </span>
                  {getStatusBadge(item.status)}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{item.quarter}</span>
                    <span className="text-[10px] font-mono text-brand-300 font-bold">{item.progressPercent}% Complete</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                {/* Progress Bar */}
                <div className="h-1.5 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      item.status === 'shipped'
                        ? 'bg-emerald-500'
                        : item.status === 'in_progress'
                        ? 'bg-brand-500'
                        : 'bg-purple-500'
                    }`}
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {item.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-slate-400 border border-slate-800">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Upvote & Action Bar */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleUpvote(item.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all flex items-center space-x-1.5"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-purple-400" />
                  <span>Upvote ({item.upvotes})</span>
                </button>

                <span className="text-[10px] text-slate-500 font-mono">Backlog ID: #{item.id}</span>
              </div>

            </div>
          ))}
        </div>

        {/* MODAL: SUBMIT NEW FEATURE REQUEST */}
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl relative">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/30">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Suggest Product Feature</h3>
                  <p className="text-xs text-slate-400">Submit a feature request directly to the HackOps AI product queue.</p>
                </div>
              </div>

              <form onSubmit={handleCreateFeatureRequest} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Feature Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Automated Figma Design token comparator"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 text-white rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Module Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 text-white rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500/50"
                  >
                    <option value="AI Core">AI Core</option>
                    <option value="Matchmaking">Matchmaking</option>
                    <option value="Evaluation">Evaluation</option>
                    <option value="Recruiting">Recruiting</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Description & Operational Benefit *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe how this module helps hackathon organizers, judges, or participants..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 text-white rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500/50"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-950 text-xs font-semibold text-slate-400 hover:text-white border border-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Feature Request</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
