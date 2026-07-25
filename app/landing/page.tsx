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
  User,
  Mail,
  Zap,
  Play,
  X,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  BarChart3,
  Globe,
  Star,
  Award,
  Layers,
  Clock,
  Terminal,
  Key,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { login } = useApp();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authName, setAuthName] = useState('Varun Khandelwal');
  const [authEmail, setAuthEmail] = useState('varun@hackops.ai');
  const [authRole, setAuthRole] = useState<UserRole>('judge');

  // Active Feature Preview Tab State
  const [activeTab, setActiveTab] = useState<'radar' | 'matching' | 'triage' | 'directory'>('radar');

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
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden font-sans selection:bg-brand-500 selection:text-white">
      
      {/* 3D LIVE THREE.JS CANVAS BACKGROUND */}
      <ThreeCanvas />

      {/* GRADIENT GLOW OVERLAYS */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[800px] right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[1800px] left-1/3 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* TOP NAVIGATION BAR */}
      <header className="relative z-30 border-b border-slate-800/80 backdrop-blur-md bg-slate-950/80 sticky top-0">
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
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#preview" className="hover:text-white transition-colors">Live Preview</a>
            <a href="#comparison" className="hover:text-white transition-colors">Why HackOps</a>
            <a href="#workflow" className="hover:text-white transition-colors">How It Works</a>
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

      {/* SECTION 1: HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 text-center space-y-10">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-4.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold shadow-inner">
          <Sparkles className="w-4 h-4 text-brand-400 animate-spin" />
          <span>HACKOPS AI — NEXT-GEN HACKATHON AI OPERATIONS LAYER</span>
        </div>

        {/* Main Headline */}
        <div className="max-w-5xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
            Devfolio tells you who registered.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-cyan-400 to-purple-400">
              HackOps AI tells you who should team up, who needs help right now, and who is actually worth hiring.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Automating repository code reviews with multi-rubric LLM radar charts, calculating real-time skill vector complementarity distance, and dispatching instant AI mentor triage.
          </p>
        </div>

        {/* Hero CTA Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={handleLaunchApp}
            className="w-full sm:w-auto px-9 py-4.5 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-extrabold text-sm shadow-2xl shadow-brand-600/40 flex items-center justify-center space-x-3 transition-all hover:scale-105"
          >
            <Play className="w-4.5 h-4.5 fill-white" />
            <span>Launch Dashboard (Demo)</span>
          </button>

          <button
            onClick={() => {
              setAuthMode('signup');
              setIsAuthModalOpen(true);
            }}
            className="w-full sm:w-auto px-8 py-4.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-bold flex items-center justify-center space-x-2 transition-all"
          >
            <User className="w-4.5 h-4.5 text-cyan-400" />
            <span>Create Free Account</span>
          </button>
        </div>

        {/* Trust Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-16 text-left">
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md hover:border-brand-500/40 transition-all">
            <span className="text-3xl font-black text-white font-mono">128+</span>
            <span className="text-xs text-slate-400 block font-semibold mt-1">Evaluated Repositories</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md hover:border-cyan-500/40 transition-all">
            <span className="text-3xl font-black text-brand-300 font-mono">92%</span>
            <span className="text-xs text-slate-400 block font-semibold mt-1">Team Complementarity</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md hover:border-emerald-500/40 transition-all">
            <span className="text-3xl font-black text-cyan-300 font-mono">&lt; 2s</span>
            <span className="text-xs text-slate-400 block font-semibold mt-1">AI Triage Latency</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md hover:border-purple-500/40 transition-all">
            <span className="text-3xl font-black text-emerald-300 font-mono">100%</span>
            <span className="text-xs text-slate-400 block font-semibold mt-1">Gemini 1.5 Flash Powered</span>
          </div>
        </div>

      </section>

      {/* SECTION 2: INTERACTIVE LIVE PREVIEW SHOWCASE */}
      <section id="preview" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-8">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>INTERACTIVE PLATFORM PREVIEW</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Experience HackOps AI Core Engines</h2>
            <p className="text-xs sm:text-sm text-slate-400">Select an engine module below to preview live operational capabilities.</p>
          </div>

          {/* Tab Selection */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('radar')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'radar'
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>1. AI Evaluation Radar Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('matching')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'matching'
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>2. Vector Skill Complementarity</span>
            </button>

            <button
              onClick={() => setActiveTab('triage')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'triage'
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>3. Gemini AI Mentor Triage</span>
            </button>

            <button
              onClick={() => setActiveTab('directory')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'directory'
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>4. Repositories Directory</span>
            </button>
          </div>

          {/* Interactive Tab Showcase Display */}
          <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 min-h-[340px] flex items-center justify-center">
            {activeTab === 'radar' && (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4 text-left">
                  <span className="text-xs px-2.5 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono font-bold">
                    MODULE 01: MULTI-RUBRIC LLM SCORING
                  </span>
                  <h3 className="text-2xl font-bold text-white">Automated Code Evaluation & Radar Charts</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Evaluates code repositories across Innovation, Technical Complexity, Completeness, and UX. Generates visual Recharts radar charts and executive judge feedback.
                  </p>
                  <Link href="/evaluation" className="inline-flex items-center space-x-2 text-xs font-bold text-brand-400 hover:text-brand-300">
                    <span>Open AI Evaluation Workbench</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                    <span>EcoVerse AI Radar Vector</span>
                    <span className="text-brand-400 font-mono">8.45 / 10</span>
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Innovation</span>
                      <span className="text-emerald-400">8.8 / 10</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full w-[88%]" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Technical Complexity</span>
                      <span className="text-cyan-400">8.3 / 10</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-cyan-400 h-full w-[83%]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'matching' && (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4 text-left">
                  <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    MODULE 02: VECTOR DISTANCE MATCHING
                  </span>
                  <h3 className="text-2xl font-bold text-white">Skill Matrix Complementarity Engine</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Evaluates participant skill vectors to form balanced teams. Highlights missing skill gaps (e.g. missing UI/UX Designer or ML Lead) and matches complementary candidates.
                  </p>
                  <Link href="/participant/team-matching" className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-400 hover:text-emerald-300">
                    <span>Open Team Matching Engine</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-left">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-white">Matched Roster #104</span>
                    <span className="text-emerald-400 font-mono">96% Complementary</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="p-2 rounded bg-slate-950 flex justify-between">
                      <span>Frontend: Next.js + Tailwind</span>
                      <span className="text-emerald-400 font-bold">Covered</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 flex justify-between">
                      <span>AI/ML: PyTorch + LangChain</span>
                      <span className="text-emerald-400 font-bold">Covered</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 flex justify-between">
                      <span>UI/UX Design: Figma</span>
                      <span className="text-emerald-400 font-bold">Covered</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'triage' && (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4 text-left">
                  <span className="text-xs px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                    MODULE 03: GEMINI AI MENTOR ASSISTANT
                  </span>
                  <h3 className="text-2xl font-bold text-white">Instant Triage & Video Escalation</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Provides participants with automated code diagnosis via Google Gemini AI, then matches them with specialized mentors for live video debugging.
                  </p>
                  <Link href="/participant/mentor-assistant" className="inline-flex items-center space-x-2 text-xs font-bold text-cyan-400 hover:text-cyan-300">
                    <span>Launch AI Mentor Assistant</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-left">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    <span className="font-bold text-cyan-400 block mb-1">AI Diagnosis (Frontend Layout):</span>
                    1. Ensure container includes relative overflow-hidden.<br />
                    2. Check if server component state leaks into client hooks.
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-brand-500/10 border border-brand-500/30 text-xs">
                    <span className="text-white font-bold">Matched Mentor: Dr. Marcus Vance</span>
                    <span className="text-brand-300 font-mono">Book Session</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'directory' && (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4 text-left">
                  <span className="text-xs px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
                    MODULE 04: REPOSITORIES BROWSER
                  </span>
                  <h3 className="text-2xl font-bold text-white">Live Repositories & Tech Stack Directory</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Browse hackathon projects with Grid & List views, filter by category tabs, inspect source code file trees, and lock official judge evaluations.
                  </p>
                  <Link href="/projects" className="inline-flex items-center space-x-2 text-xs font-bold text-purple-400 hover:text-purple-300">
                    <span>Browse Repositories</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-left">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white">EcoVerse AI (AIML)</span>
                    <span className="text-purple-400 font-mono">8 Repositories</span>
                  </div>
                  <pre className="text-[10px] font-mono text-slate-300 bg-slate-950 p-3 rounded-lg overflow-x-auto border border-slate-800">
{`src/
  app/page.tsx
  components/RadarChart.tsx
package.json`}
                  </pre>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* SECTION 3: THE PROBLEM VS SOLUTION COMPARISON */}
      <section id="comparison" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12 text-center">
          
          <div className="space-y-3 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Why Traditional Hackathon Tools Fail</h2>
            <p className="text-xs sm:text-sm text-slate-400">Existing registration platforms track RSVPs but leave code quality, team formation, and mentor triage unmanaged.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            
            {/* TRADITIONAL TOOLS */}
            <div className="p-8 rounded-3xl bg-slate-900/40 border border-rose-500/20 backdrop-blur-md space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <X className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Traditional Registration Tools</h3>
                  <span className="text-xs text-rose-400 font-mono">Devfolio, Eventbrite, Google Forms</span>
                </div>
              </div>

              <ul className="space-y-4 text-xs text-slate-300">
                <li className="flex items-start space-x-3">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Manual judge bottlenecks causing hours of evaluation delay.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Unbalanced teams formed by random Discord self-promotion.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Mentors overwhelmed with repetitive syntax/layout questions.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>No standardized multi-rubric LLM code AST analysis.</span>
                </li>
              </ul>
            </div>

            {/* HACKOPS AI */}
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-brand-500/40 backdrop-blur-md space-y-6 shadow-xl shadow-brand-500/5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">HackOps AI Operations Layer</h3>
                  <span className="text-xs text-brand-300 font-mono">Autonomous AI Agent Engine</span>
                </div>
              </div>

              <ul className="space-y-4 text-xs text-slate-200">
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span>Instant multi-rubric Gemini 1.5 Flash radar evaluation under 2s.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span>One-hot vector skill matrix for complementary team matching.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span>Automated AI mentor triage resolving 75% of basic code issues.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span>Exportable markdown evaluation reports for organizers & sponsors.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS (4-STEP WORKFLOW) */}
      <section id="workflow" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12 text-center">
          
          <div className="space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>4-STEP AUTOMATION WORKFLOW</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How HackOps AI Operates</h2>
            <p className="text-xs sm:text-sm text-slate-400">From registration to final leaderboard locking in 4 automated steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 relative group">
              <span className="text-3xl font-black text-brand-400 font-mono">01</span>
              <h3 className="text-base font-bold text-white">Skill Profiling</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Participants sign in and create skill vector profiles highlighting tech stacks and experience.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 relative group">
              <span className="text-3xl font-black text-cyan-400 font-mono">02</span>
              <h3 className="text-base font-bold text-white">Vector Matching</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complementarity matrix pairs solo developers into balanced, highly functional hackathon rosters.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 relative group">
              <span className="text-3xl font-black text-emerald-400 font-mono">03</span>
              <h3 className="text-base font-bold text-white">AI Code Review</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Google Gemini 1.5 Flash inspects GitHub repos, READMEs, and file trees to compute multi-rubric radar scores.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 relative group">
              <span className="text-3xl font-black text-purple-400 font-mono">04</span>
              <h3 className="text-base font-bold text-white">Lock & Export</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Judges review radar charts, lock final evaluation scores, and export markdown summaries for prize allocation.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: DETAILED FEATURE GRID (6 CARDS) */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12 text-center">
          
          <div className="space-y-3 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Complete AI Operations Suite</h2>
            <p className="text-xs sm:text-sm text-slate-400">Everything needed to run production-grade hackathon operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-brand-500/50 transition-all">
              <Shield className="w-7 h-7 text-brand-400" />
              <h3 className="text-base font-bold text-white">Multi-Rubric LLM Radar</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scores projects across Innovation, Technical Complexity, Completeness, and UX with Recharts visual radar charts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-emerald-500/50 transition-all">
              <Users className="w-7 h-7 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Vector Skill Distance Matrix</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Matches complementary participants based on tech stack vector distance and skill deficit alerts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-cyan-500/50 transition-all">
              <MessageSquare className="w-7 h-7 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Instant Gemini AI Triage</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Resolves technical questions instantly and schedules video sessions with specialized mentors.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-purple-500/50 transition-all">
              <FolderGit2 className="w-7 h-7 text-purple-400" />
              <h3 className="text-base font-bold text-white">Repositories Directory</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Browse submissions with Grid/List views, search filters, file tree inspectors, and live project additions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-amber-500/50 transition-all">
              <Award className="w-7 h-7 text-amber-400" />
              <h3 className="text-base font-bold text-white">One-Click Markdown Exporter</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Export clean, formatted markdown evaluation reports for organizers, judges, and sponsor track sponsors.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-brand-400/50 transition-all">
              <Key className="w-7 h-7 text-brand-300" />
              <h3 className="text-base font-bold text-white">Gemini API Key Configurator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Input your own Google Gemini API key under Settings to run unlimited custom LLM evaluations.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 6: FINAL CTA BANNER */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-brand-900/80 via-slate-900 to-slate-950 border border-brand-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Upgrade Your Hackathon Operations?
          </h2>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Experience real-time Gemini AI evaluations, vector complementarity team matching, and instant mentor triage right now.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleLaunchApp}
              className="px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-xl shadow-brand-600/30 flex items-center space-x-2 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Operations Dashboard</span>
            </button>

            <button
              onClick={() => {
                setAuthMode('signup');
                setIsAuthModalOpen(true);
              }}
              className="px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER BAR */}
      <footer className="relative z-20 border-t border-slate-800/80 py-10 text-center text-xs text-slate-500">
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
            
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

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
