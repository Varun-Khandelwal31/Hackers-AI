'use client';

import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { Users, MessageSquare, ArrowRight } from 'lucide-react';

export default function ParticipantHome() {
  return (
    <AppShell activeRole="participant">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        {/* Page Header */}
        <div className="max-w-3xl border-b border-slate-800/80 pb-6">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            <Users className="w-4 h-4" />
            <span>Participant Operations Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Participant Suite & AI Operations
          </h1>
          <p className="text-xs text-slate-300 mt-2">
            Automate your team formation with skill complementarity and resolve technical blockers instantly with your AI mentor assistant.
          </p>
        </div>

        {/* Two Entry Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Team Complementarity Matcher */}
          <Link
            href="/participant/team-matching"
            className="group p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>

              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Screen 3</span>
              <h2 className="text-2xl font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
                AI Team Complementarity Matching
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed mt-3">
                Select your skill set (Frontend, Backend, AI/ML, UX) to run our one-hot vector matrix distance algorithm. Generates balanced team rosters explicitly preventing redundant skill overlap.
              </p>
            </div>

            <div className="pt-8 mt-8 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                <span>Launch Team Matcher</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-full font-mono">
                92% Match Score
              </span>
            </div>
          </Link>

          {/* Card 2: AI Mentor Assistant */}
          <Link
            href="/participant/mentor-assistant"
            className="group p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7" />
              </div>

              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Screen 5</span>
              <h2 className="text-2xl font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                AI Mentor Assistant & Live Session Booking
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed mt-3">
                Ask any technical question to get instant AI guidance, or connect directly with recommended domain mentors like Dr. Neha Verma for live 1-on-1 sessions.
              </p>
            </div>

            <div className="pt-8 mt-8 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 flex items-center space-x-1.5">
                <span>Open Mentor Assistant</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-full font-mono">
                Live AI Triage
              </span>
            </div>
          </Link>

        </div>
      </div>
    </AppShell>
  );
}
