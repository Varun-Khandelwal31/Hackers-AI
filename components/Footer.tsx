import React from 'react';
import Link from 'next/link';
import { Sparkles, Github, Shield, Users, Lightbulb, Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white text-sm">HackOps AI</span>
            </div>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed">
              Devfolio tells you who registered. HackOps AI tells you who should team up, who needs help right now, and who's actually worth hiring.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Core Engines</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/judge" className="hover:text-brand-300 flex items-center space-x-1.5 transition-colors">
                  <Shield className="w-3 h-3 text-brand-400" />
                  <span>AI Project Evaluation (Judge)</span>
                </Link>
              </li>
              <li>
                <Link href="/participant/mentor-assistant" className="hover:text-brand-300 flex items-center space-x-1.5 transition-colors">
                  <Lightbulb className="w-3 h-3 text-cyan-400" />
                  <span>AI Mentor Assistant (Participant)</span>
                </Link>
              </li>
              <li>
                <Link href="/participant/team-matching" className="hover:text-brand-300 flex items-center space-x-1.5 transition-colors">
                  <Users className="w-3 h-3 text-emerald-400" />
                  <span>AI Team Complementarity</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/roadmap" className="hover:text-amber-300 flex items-center space-x-1.5 transition-colors">
                  <Compass className="w-3 h-3 text-amber-400" />
                  <span>Tier 1 & 2 Feature Roadmap</span>
                </Link>
              </li>
              <li className="text-slate-500 flex items-center space-x-1.5">
                <Github className="w-3 h-3" />
                <span>Next.js 14 + Supabase + LLM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
          <p>© 2026 HackOps AI. Built for high-velocity hackathon operations.</p>
          <p className="mt-2 sm:mt-0 font-mono">Production Tier 0 Build</p>
        </div>
      </div>
    </footer>
  );
}
