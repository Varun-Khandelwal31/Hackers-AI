'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import { useApp } from '@/lib/AppContext';
import { useToast } from '@/components/Toast';
import {
  Award,
  Users,
  Search,
  Sparkles,
  ExternalLink,
  Github,
  Mail,
  CheckCircle2,
  SlidersHorizontal,
  Download,
  Flame,
  Zap,
  Star,
  UserCheck,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface CandidateProfile {
  id: string;
  name: string;
  role: string;
  email: string;
  github: string;
  avatar: string;
  topSkills: string[];
  hiringRankScore: number; // 0 - 100
  badge: string;
  commitsCount: number;
  projectContributed: string;
  codeQualityRating: string;
  hiringRecommendation: string;
}

export default function RecruiterHiringPage() {
  const { showToast } = useToast();
  const { activeRole } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);

  const candidates: CandidateProfile[] = [
    {
      id: 'dev-1',
      name: 'Aarav Sharma',
      role: 'Full-Stack & AI Engineer',
      email: 'aarav.sharma@gmail.com',
      github: 'https://github.com/aaravsharma-dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      topSkills: ['Python', 'PyTorch', 'Next.js', 'FastAPI', 'PostgreSQL'],
      hiringRankScore: 98,
      badge: 'Top 1% AI Architect 🧠',
      commitsCount: 42,
      projectContributed: 'EcoVerse AI',
      codeQualityRating: 'A+ (Clean modular architecture, 92% test coverage)',
      hiringRecommendation: 'Strong candidate for Senior AI / Full-Stack Engineer roles. Demonstrates rapid prototyping capabilities.',
    },
    {
      id: 'dev-2',
      name: 'Priya Sundaram',
      role: 'Backend & Distributed Systems',
      email: 'priya.sundaram@tech.io',
      github: 'https://github.com/priyasun-tech',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
      topSkills: ['Go', 'Rust', 'Docker', 'Kubernetes', 'Supabase'],
      hiringRankScore: 95,
      badge: 'Systems Specialist ⚡',
      commitsCount: 38,
      projectContributed: 'MedBot Pro',
      codeQualityRating: 'A (High throughput socket concurrency & data pipeline)',
      hiringRecommendation: 'Excellent candidate for Backend / Infrastructure Engineering teams.',
    },
    {
      id: 'dev-3',
      name: 'Marcus Chen',
      role: 'UI/UX & Frontend Lead',
      email: 'marcus.chen@design.dev',
      github: 'https://github.com/marcuschen-ui',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      topSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Figma', 'Framer Motion'],
      hiringRankScore: 93,
      badge: 'Design Systems Lead 🎨',
      commitsCount: 35,
      projectContributed: 'LearnLoop',
      codeQualityRating: 'A (Flawless responsive micro-interactions & accessibility)',
      hiringRecommendation: 'Top tier Product Designer & Frontend Architect.',
    },
    {
      id: 'dev-4',
      name: 'Elena Rostova',
      role: 'Machine Learning Researcher',
      email: 'elena.rostova@ai-labs.org',
      github: 'https://github.com/elenarostova-ml',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
      topSkills: ['PyTorch', 'TensorFlow', 'Computer Vision', 'LangChain'],
      hiringRankScore: 91,
      badge: 'Computer Vision Master 👁️',
      commitsCount: 29,
      projectContributed: 'AgriSense',
      codeQualityRating: 'A- (Edge ML model optimization & ONNX runtime)',
      hiringRecommendation: 'Great fit for Computer Vision & Applied AI Research positions.',
    },
  ];

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.projectContributed.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = skillFilter === 'all' || c.topSkills.includes(skillFilter);
    return matchesSearch && matchesSkill;
  });

  const handleContactCandidate = (c: CandidateProfile) => {
    showToast('Recruiter Invitation Sent! 📩', `Sent hiring interest email to ${c.name} (${c.email}).`, 'success');
  };

  const handleExportTalentCSV = () => {
    const csvContent =
      'Name,Role,Email,GitHub,HiringRankScore,Badge,TopSkills\n' +
      candidates
        .map((c) => `"${c.name}","${c.role}","${c.email}","${c.github}",${c.hiringRankScore},"${c.badge}","${c.topSkills.join(';')}"`)
        .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hackops-talent-recruiting-report-${Date.now()}.csv`;
    a.click();
    showToast('Talent CSV Exported! 📥', 'Downloaded recruiter talent report.', 'success');
  };

  return (
    <AppShell activeRole={activeRole}>
      <div className="max-w-7xl mx-auto space-y-8 font-sans pb-16 animate-fade-in">
        
        {/* HEADER SECTION */}
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>SPONSOR & RECRUITER TALENT INTELLIGENCE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center space-x-3">
              <span>Who Is Actually Worth Hiring</span>
              <Zap className="w-8 h-8 text-amber-400 animate-bounce" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              AI code fingerprinting & commit analytics evaluate participant technical depth, problem-solving speed, and repository architecture quality to match recruiters with top hackathon talent.
            </p>
          </div>

          <div className="flex items-center space-x-3 relative z-10 shrink-0">
            <button
              onClick={handleExportTalentCSV}
              className="px-4 py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white text-xs font-bold shadow-lg flex items-center space-x-2 transition-all"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Talent CSV</span>
            </button>
          </div>
        </div>

        {/* CONTROLS & SEARCH */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate by name, role, or project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-900/80 text-white rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500/50"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Filter Skill:</span>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 text-xs text-white border border-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Tech Stacks</option>
              <option value="Python">Python</option>
              <option value="PyTorch">PyTorch</option>
              <option value="Next.js">Next.js</option>
              <option value="Go">Go</option>
              <option value="TypeScript">TypeScript</option>
            </select>
          </div>
        </div>

        {/* CANDIDATES ROSTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-5 flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-500/40"
                    />
                    <div>
                      <h3 className="text-base font-extrabold text-white">{candidate.name}</h3>
                      <p className="text-xs text-slate-400 font-medium">{candidate.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-400 font-mono block">
                      {candidate.hiringRankScore} <span className="text-xs text-slate-500">/ 100</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono uppercase">AI Talent Index</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                    {candidate.badge}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-slate-800 text-[10px] font-mono">
                    {candidate.commitsCount} Commits in Hackathon
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Project Contributed:</span>
                    <span className="font-bold text-white">{candidate.projectContributed}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">Code Quality Rating:</strong> {candidate.codeQualityRating}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Top Mastered Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.topSkills.map((sk) => (
                      <span key={sk} className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono bg-slate-950 text-slate-300 border border-slate-800">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={candidate.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Profile</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>

                <button
                  onClick={() => handleContactCandidate(candidate)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Candidate</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </AppShell>
  );
}
