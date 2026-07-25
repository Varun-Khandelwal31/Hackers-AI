'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThreeCanvas from '@/components/ThreeCanvas';
import { useApp } from '@/lib/AppContext';
import { useToast } from '@/components/Toast';
import { UserRole } from '@/lib/types';
import {
  Sparkles,
  Shield,
  Users,
  MessageSquare,
  FolderGit2,
  ArrowRight,
  CheckCircle2,
  Lock,
  User,
  Mail,
  Zap,
  Star,
  Play,
  X,
  Compass,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { login, isAuthenticated } = useApp();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authName, setAuthName] = useState('Varun Khandelwal');
  const [authEmail, setAuthEmail] = useState('varun@hackops.ai');
  const [authRole, setAuthRole] = useState<UserRole>('judge');

  const handleLaunchApp = () => {
    login(authName, authEmail, authRole);
    showToast('Authenticated! 🚀', `Welcome to HackOps AI Dashboard as ${authRole.toUpperCase()}`, 'success');
    router.push('/dashboard');
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) {
      showToast('Validation Error', 'Email is required', 'error');
      return;
    }

    login(authName.trim() || 'Hackathon Member', authEmail.trim(), authRole);
    setIsAuthModalOpen(false);
    showToast(
      authMode === 'signin' ? 'Signed In Successfully! 🎉' : 'Account Created! 🎉',
      `Redirecting to your HackOps AI Dashboard as ${authRole.toUpperCase()}`,
      'success'
    );
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-brand-500 selection:text-white">
      
      {/* 3D LIVE THREE.JS CANVAS BACKGROUND */}
      <ThreeCanvas />

      {/* GRADIENT GLOW OVERLAYS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* TOP NAVIGATION BAR */}
      <header className="relative z-20 border-b border-slate-800/80 backdrop-blur-md bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/landing" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 p-0.5 shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-400 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl text-white tracking-tight group-hover:text-brand-300 transition-colors">
                HackOps <span className="text-brand-400">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">
                Hackathon AI Operations Layer
              </span>
            </div>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-300">
            <Link href="/projects" className="hover:text-white transition-colors">Projects Directory</Link>
            <Link href="/evaluation" className="hover:text-white transition-colors">AI Evaluation Radar</Link>
            <Link href="/participant/team-matching" className="hover:text-white transition-colors">Team Matching</Link>
            <Link href="/participant/mentor-assistant" className="hover:text-white transition-colors">AI Mentor</Link>
            <Link href="/roadmap" className="hover:text-white transition-colors">Roadmap</Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setAuthMode('signin');
                setIsAuthModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-all"
            >
              Sign In
            </button>

            <button
              onClick={() => {
                setAuthMode('signup');
                setIsAuthModalOpen(true);
              }}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-lg shadow-brand-600/30 transition-all flex items-center space-x-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center space-y-8">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold shadow-inner">
          <Sparkles className="w-4 h-4 text-brand-400 animate-spin" />
          <span>HACKOPS AI — THE OPERATIONS LAYER FOR HACKATHONS</span>
        </div>

        {/* Main Headline */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Devfolio tells you who registered.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-cyan-400 to-purple-400">
              HackOps AI tells you who should team up, who needs help right now, and who is actually worth hiring.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Automate code reviews with multi-rubric LLM radar charts, calculate real-time skill complementarity matrix distance, and dispatch AI mentor triage in real-time.
          </p>
        </div>

        {/* Hero CTA Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={handleLaunchApp}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-extrabold text-sm shadow-xl shadow-brand-600/30 flex items-center justify-center space-x-3 transition-all hover:scale-105"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Dashboard (Demo)</span>
          </button>

          <button
            onClick={() => {
              setAuthMode('signup');
              setIsAuthModalOpen(true);
            }}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-bold flex items-center justify-center space-x-2 transition-all"
          >
            <User className="w-4 h-4 text-cyan-400" />
            <span>Create Free Account</span>
          </button>
        </div>

        {/* Trust Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12 text-left">
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
            <span className="text-2xl font-black text-white font-mono">128+</span>
            <span className="text-xs text-slate-400 block font-medium">Evaluated Repositories</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
            <span className="text-2xl font-black text-brand-300 font-mono">92%</span>
            <span className="text-xs text-slate-400 block font-medium">Team Complementarity</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
            <span className="text-2xl font-black text-cyan-300 font-mono">&lt; 2s</span>
            <span className="text-xs text-slate-400 block font-medium">AI Triage Latency</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
            <span className="text-2xl font-black text-emerald-300 font-mono">100%</span>
            <span className="text-xs text-slate-400 block font-medium">Gemini 1.5 Flash Powered</span>
          </div>
        </div>

        {/* FEATURE HIGHLIGHT CARDS GRID */}
        <div className="pt-16 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Built for Hackathon Organizers, Judges & Participants</h2>
            <p className="text-xs text-slate-400">Everything you need to turn raw registrations into production-ready teams and winning submissions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            
            {/* Card 1: AI Radar Evaluation */}
            <Link
              href="/evaluation"
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 backdrop-blur-md transition-all space-y-4 group hover:shadow-xl hover:shadow-brand-500/10"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                  AI Evaluation Radar
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Multi-rubric scoring across Innovation, Technical Complexity, Completeness, and UX with Recharts visual radar charts.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-brand-400 space-x-1 pt-2">
                <span>Explore Radar Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Card 2: Skill Complementarity */}
            <Link
              href="/participant/team-matching"
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 backdrop-blur-md transition-all space-y-4 group hover:shadow-xl hover:shadow-emerald-500/10"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Team Complementarity Matrix
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Match participants based on vector skill distance and skill deficit alerts to form well-rounded team rosters.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-emerald-400 space-x-1 pt-2">
                <span>Find Matches</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Card 3: AI Mentor Triage */}
            <Link
              href="/participant/mentor-assistant"
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 backdrop-blur-md transition-all space-y-4 group hover:shadow-xl hover:shadow-cyan-500/10"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  AI Mentor Triage
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Instant technical troubleshooting assistant paired with real-time video session scheduling with domain experts.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-cyan-400 space-x-1 pt-2">
                <span>Chat with AI Mentor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Card 4: Projects Directory */}
            <Link
              href="/projects"
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 backdrop-blur-md transition-all space-y-4 group hover:shadow-xl hover:shadow-purple-500/10"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  Projects Directory
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Browse, filter by category/tech stack, inspect GitHub repository file trees, and lock official judge evaluations.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-purple-400 space-x-1 pt-2">
                <span>View Repositories</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

          </div>
        </div>

      </main>

      {/* FOOTER BAR */}
      <footer className="relative z-20 border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span className="font-bold text-white">HackOps AI</span>
            <span>— Production-grade AI operations layer.</span>
          </div>
          <p>© 2026 HackOps AI. Built for Devfolio, ETHGlobal & global hackathon ecosystems.</p>
        </div>
      </footer>

      {/* SIGN IN / SIGN UP 3D AUTH MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            
            {/* Close Button */}
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Tabs */}
            <div className="flex items-center justify-center space-x-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
              <button
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  authMode === 'signin'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  authMode === 'signup'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Title */}
            <div className="text-center space-y-1">
              <h3 className="text-xl font-extrabold text-white">
                {authMode === 'signin' ? 'Welcome Back to HackOps AI' : 'Join HackOps AI Operations'}
              </h3>
              <p className="text-xs text-slate-400">
                {authMode === 'signin'
                  ? 'Access your judge workbench and team matching layer.'
                  : 'Get started with instant LLM code evaluations and mentor triage.'}
              </p>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {authMode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Varun Khandelwal"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 text-xs text-white border border-slate-800 focus:outline-none focus:border-brand-500/50"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="varun@hackops.ai"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 text-xs text-white border border-slate-800 focus:outline-none focus:border-brand-500/50"
                  />
                </div>
              </div>

              {/* Role Persona Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Select Persona Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['judge', 'participant', 'mentor'] as UserRole[]).map((r) => {
                    const isSelected = authRole === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setAuthRole(r)}
                        className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                          isSelected
                            ? 'bg-brand-600/20 text-brand-300 border-brand-500/50 shadow-sm'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-extrabold text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2 transition-all pt-3"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{authMode === 'signin' ? 'Sign In & Launch Dashboard' : 'Create Account & Continue'}</span>
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
