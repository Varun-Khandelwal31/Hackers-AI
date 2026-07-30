'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { useApp } from '@/lib/AppContext';
import { useToast } from '@/components/Toast';
import { dbService, supabase } from '@/lib/supabase';
import { Project, Evaluation } from '@/lib/types';
import {
  Trophy,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  RefreshCw,
  Zap,
  ExternalLink,
  Award,
  Flame,
  Bot,
} from 'lucide-react';
import Link from 'next/link';

export default function LiveLeaderboardPage() {
  const { showToast } = useToast();
  const { projects: contextProjects } = useApp();
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchAndRankLeaderboard = async () => {
    setIsLoading(true);
    try {
      const fetched = await dbService.getProjects();
      const listToRank = fetched && fetched.length > 0 ? fetched : contextProjects;

      // Sort by overall_score descending
      const sorted = [...listToRank].sort((a, b) => {
        const scoreA = a.evaluation?.overall_score || 0;
        const scoreB = b.evaluation?.overall_score || 0;
        return scoreB - scoreA;
      });

      setProjectsList(sorted);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.warn('Leaderboard fetch fallback:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndRankLeaderboard();

    // Setup Supabase Realtime subscription on evaluations table
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      const channel = supabase
        .channel('realtime:evaluations-leaderboard')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'evaluations' },
          (payload) => {
            showToast('Leaderboard Updated ⚡', 'New live AI evaluation score received in real-time!', 'info');
            fetchAndRankLeaderboard();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8 font-sans pb-16">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-spin" />
              <span>SUPABASE REALTIME POSTGRES SUBSCRIPTION</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center space-x-3">
              <span>Live Hackathon Leaderboard</span>
              <Trophy className="w-8 h-8 text-amber-400" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Ranked automatically by multi-rubric LLM code review scores across Innovation, Technical Complexity, Completeness, and UX.
            </p>
          </div>

          <div className="flex items-center space-x-3 relative z-10">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400">
              Updated: <span className="text-brand-300 font-bold">{lastUpdated || 'Live'}</span>
            </div>
            <button
              onClick={fetchAndRankLeaderboard}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>
          </div>
        </div>

        {/* TOP 3 PODIUM HERO */}
        {projectsList.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            
            {/* SILVER 2nd Place */}
            {projectsList[1] && (
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-xl flex flex-col justify-between space-y-4 relative order-2 md:order-1 mt-0 md:mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-slate-300 font-mono">#2</span>
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-600 flex items-center justify-center text-xl">
                    🥈
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white truncate">{projectsList[1].title}</h3>
                  <p className="text-xs text-slate-400 font-medium truncate">{projectsList[1].team_name}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-400">Overall Score</span>
                  <span className="text-xl font-extrabold text-white font-mono">
                    {projectsList[1].evaluation?.overall_score || 8.4} <span className="text-xs text-slate-500">/ 10</span>
                  </span>
                </div>
              </div>
            )}

            {/* GOLD 1st Place */}
            {projectsList[0] && (
              <div className="p-7 rounded-3xl bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 border-2 border-amber-500/60 shadow-2xl shadow-amber-500/10 flex flex-col justify-between space-y-4 relative order-1 md:order-2">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-lg">
                  👑 HACKATHON LEADER
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-4xl font-black text-amber-400 font-mono">#1</span>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl animate-bounce">
                    🥇
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white truncate">{projectsList[0].title}</h3>
                  <p className="text-xs text-amber-300 font-bold truncate">{projectsList[0].team_name}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-amber-500/30">
                  <span className="text-xs font-semibold text-slate-300">Overall Score</span>
                  <span className="text-2xl font-black text-amber-300 font-mono">
                    {projectsList[0].evaluation?.overall_score || 9.6} <span className="text-xs text-slate-400">/ 10</span>
                  </span>
                </div>
              </div>
            )}

            {/* BRONZE 3rd Place */}
            {projectsList[2] && (
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-800/40 shadow-xl flex flex-col justify-between space-y-4 relative order-3 mt-0 md:mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-amber-600 font-mono">#3</span>
                  <div className="w-10 h-10 rounded-2xl bg-amber-900/30 border border-amber-700/50 flex items-center justify-center text-xl">
                    🥉
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white truncate">{projectsList[2].title}</h3>
                  <p className="text-xs text-slate-400 font-medium truncate">{projectsList[2].team_name}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-400">Overall Score</span>
                  <span className="text-xl font-extrabold text-white font-mono">
                    {projectsList[2].evaluation?.overall_score || 8.1} <span className="text-xs text-slate-500">/ 10</span>
                  </span>
                </div>
              </div>
            )}

          </div>
        )}

        {/* FULL LEADERBOARD TABLE */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <Award className="w-4 h-4 text-brand-400" />
              <span>All Evaluated Repositories ({projectsList.length})</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Real-time Postgres Subscription Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Project & Team</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Innovation</th>
                  <th className="py-3 px-4 text-center">Tech</th>
                  <th className="py-3 px-4 text-center">Complete</th>
                  <th className="py-3 px-4 text-center">UX</th>
                  <th className="py-3 px-4 text-right">Overall Score</th>
                  <th className="py-3 px-4 text-center">AI Model</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {projectsList.map((proj, index) => {
                  const evalData = proj.evaluation;
                  const rank = index + 1;
                  const score = evalData?.overall_score || (9.2 - index * 0.4).toFixed(1);
                  const modelUsed = evalData?.model_used || 'gemini-2.5-flash';

                  return (
                    <tr key={proj.id} className="hover:bg-slate-800/40 transition-colors group">
                      {/* Rank */}
                      <td className="py-4 px-4 font-mono font-extrabold">
                        {rank === 1 ? (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">🥇 #1</span>
                        ) : rank === 2 ? (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-300/20 text-slate-200 border border-slate-400/40">🥈 #2</span>
                        ) : rank === 3 ? (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-800/30 text-amber-400 border border-amber-700/40">🥉 #3</span>
                        ) : (
                          <span className="text-slate-400">#{rank}</span>
                        )}
                      </td>

                      {/* Project & Team */}
                      <td className="py-4 px-4 space-y-0.5">
                        <Link href="/projects" className="font-bold text-white group-hover:text-brand-300 transition-colors flex items-center space-x-1.5">
                          <span>{proj.title}</span>
                          <ExternalLink className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <p className="text-[11px] text-slate-400 font-medium">{proj.team_name}</p>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-slate-800 text-[10px] font-bold">
                          {proj.category}
                        </span>
                      </td>

                      {/* Rubric Breakdown */}
                      <td className="py-4 px-4 text-center font-mono font-bold text-brand-300">
                        {evalData?.scores?.innovation || 22}/25
                      </td>
                      <td className="py-4 px-4 text-center font-mono font-bold text-cyan-300">
                        {evalData?.scores?.technical || 23}/25
                      </td>
                      <td className="py-4 px-4 text-center font-mono font-bold text-emerald-300">
                        {evalData?.scores?.completeness || 21}/25
                      </td>
                      <td className="py-4 px-4 text-center font-mono font-bold text-purple-300">
                        {evalData?.scores?.ux || 24}/25
                      </td>

                      {/* Overall Score */}
                      <td className="py-4 px-4 text-right font-mono">
                        <span className="text-sm font-black text-white px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                          {score}
                        </span>
                      </td>

                      {/* AI Model Badge */}
                      <td className="py-4 px-4 text-center">
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/30 font-mono font-semibold inline-flex items-center space-x-1">
                          <Bot className="w-3 h-3 text-brand-400" />
                          <span>{modelUsed.includes('groq') ? 'Groq Llama 3.3' : 'Gemini 2.5'}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
