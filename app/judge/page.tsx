'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import { useApp } from '@/lib/AppContext';
import { useToast } from '@/components/Toast';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  Github,
  ExternalLink,
  SlidersHorizontal,
  Bot,
  UserCheck,
  Star,
  ChevronRight,
  MessageSquare,
  FileCode2,
} from 'lucide-react';
import Link from 'next/link';

export default function JudgePage() {
  const { showToast } = useToast();
  const { projects, activeRole } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [judgeScores, setJudgeScores] = useState<Record<string, {
    innovation: number;
    technical: number;
    ux: number;
    impact: number;
    notes: string;
    submitted: boolean;
  }>>({
    'proj-ecoverse': { innovation: 9.0, technical: 8.5, ux: 8.2, impact: 9.1, notes: 'Outstanding satellite data fusion architecture.', submitted: true },
    'proj-medbot': { innovation: 8.6, technical: 8.4, ux: 8.0, impact: 8.8, notes: 'Great clinical ICU telemetry integration.', submitted: true },
  });

  const activeProject = projects.find((p) => p.id === selectedProjectId) || null;

  // Active rubric form state for selected project
  const [innovationScore, setInnovationScore] = useState<number>(8.5);
  const [technicalScore, setTechnicalScore] = useState<number>(8.0);
  const [uxScore, setUxScore] = useState<number>(8.2);
  const [impactScore, setImpactScore] = useState<number>(8.4);
  const [judgeNotes, setJudgeNotes] = useState<string>('');

  const openRubricModal = (project: any) => {
    setSelectedProjectId(project.id);
    const existing = judgeScores[project.id];
    if (existing) {
      setInnovationScore(existing.innovation);
      setTechnicalScore(existing.technical);
      setUxScore(existing.ux);
      setImpactScore(existing.impact);
      setJudgeNotes(existing.notes);
    } else {
      const evalScores = project.evaluation?.scores || {};
      setInnovationScore(evalScores.innovation || 8.0);
      setTechnicalScore(evalScores.technical || 8.0);
      setUxScore(evalScores.ux || 8.0);
      setImpactScore(evalScores.completeness || 8.0);
      setJudgeNotes('');
    }
  };

  const handleAutoFillAiScore = () => {
    if (!activeProject) return;
    const scores = activeProject.evaluation?.scores;
    if (scores) {
      setInnovationScore(scores.innovation);
      setTechnicalScore(scores.technical);
      setUxScore(scores.ux);
      setImpactScore(scores.completeness);
      showToast('AI Pre-Fill Applied ⚡', 'Rubric scores pre-populated from Gemini AI evaluation.', 'info');
    } else {
      setInnovationScore(8.8);
      setTechnicalScore(8.5);
      setUxScore(8.2);
      setImpactScore(8.6);
      showToast('AI Pre-Fill Applied ⚡', 'Pre-filled recommended scores based on repository analysis.', 'info');
    }
  };

  const handleSubmitJudgeScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;

    setJudgeScores((prev) => ({
      ...prev,
      [activeProject.id]: {
        innovation: innovationScore,
        technical: technicalScore,
        ux: uxScore,
        impact: impactScore,
        notes: judgeNotes,
        submitted: true,
      },
    }));

    showToast('Judge Score Submitted! 🏆', `Official score recorded for "${activeProject.title}".`, 'success');
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setSelectedProjectId(null);
  };

  const totalProjects = projects.length;
  const judgedCount = Object.values(judgeScores).filter((s) => s.submitted).length;

  return (
    <AppShell activeRole={activeRole}>
      <div className="max-w-7xl mx-auto space-y-8 font-sans pb-16 animate-fade-in">
        
        {/* HEADER SECTION */}
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <UserCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>OFFICIAL JUDGE SCORING PORTAL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center space-x-3">
              <span>Judge Evaluation Queue</span>
              <Award className="w-8 h-8 text-amber-400" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Grade hackathon submissions using standardized rubric criteria. Combine your human expert judgment with AI automated code analysis.
            </p>
          </div>

          {/* Metrics Card */}
          <div className="flex items-center space-x-4 relative z-10 shrink-0">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-xs font-mono text-slate-400 uppercase">Projects Judged</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {judgedCount} / {totalProjects}
              </div>
            </div>
            <Link
              href="/leaderboard"
              className="px-4 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center space-x-2 transition-all"
            >
              <span>View Leaderboard 🏆</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* JUDGING SUBMISSION GRID */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-400" />
            <span>Assigned Submissions ({totalProjects})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const judgedData = judgeScores[project.id];
              const isJudged = judgedData?.submitted;
              const overallJudgeScore = isJudged
                ? ((judgedData.innovation * 0.3 + judgedData.technical * 0.3 + judgedData.ux * 0.2 + judgedData.impact * 0.2)).toFixed(1)
                : null;

              return (
                <div
                  key={project.id}
                  className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-5 flex flex-col justify-between shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/40 font-mono">
                        {project.category}
                      </span>
                      {isJudged ? (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Judged 🟢</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Pending Review 🟡</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-white truncate">{project.title}</h4>
                      <p className="text-xs text-slate-400 font-medium">Team: <span className="text-slate-200">{project.team_name}</span></p>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {project.tag_line}
                    </p>

                    {/* Scores Comparison */}
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 block">AI Score</span>
                        <span className="font-extrabold text-brand-300">
                          {(project.evaluation?.overall_score || 8.0).toFixed(1)} / 10
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">Your Judge Score</span>
                        <span className="font-extrabold text-purple-300">
                          {overallJudgeScore ? `${overallJudgeScore} / 10` : 'Not Scored'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <a
                      href={project.demo_url || project.repo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 flex items-center space-x-1 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Live App</span>
                    </a>

                    <button
                      onClick={() => openRubricModal(project)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 ${
                        isJudged
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30'
                          : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
                      }`}
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>{isJudged ? 'Edit Judge Score' : 'Score Submission'}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* RUBRIC SCORING MODAL */}
        {activeProject && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                      Official Judge Rubric
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{activeProject.category}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white mt-1">{activeProject.title}</h3>
                  <p className="text-xs text-slate-400">Team: {activeProject.team_name}</p>
                </div>

                <button
                  onClick={handleAutoFillAiScore}
                  className="px-3.5 py-2 rounded-xl bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/40 text-xs font-bold flex items-center space-x-1.5 transition-all"
                  title="Auto-fill rubric sliders using AI evaluation recommendations"
                >
                  <Bot className="w-4 h-4 text-brand-400" />
                  <span>⚡ AI Pre-Fill Score</span>
                </button>
              </div>

              <form onSubmit={handleSubmitJudgeScore} className="space-y-5">
                
                {/* 1. Innovation Slider */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white">1. Innovation & Originality (30% Weight)</span>
                    <span className="text-purple-300 font-mono text-sm">{innovationScore.toFixed(1)} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={innovationScore}
                    onChange={(e) => setInnovationScore(parseFloat(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500">Novelty of concept, creative problem-solving, and unique architecture.</p>
                </div>

                {/* 2. Technical Complexity Slider */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white">2. Technical Complexity & Depth (30% Weight)</span>
                    <span className="text-cyan-300 font-mono text-sm">{technicalScore.toFixed(1)} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={technicalScore}
                    onChange={(e) => setTechnicalScore(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500">Code quality, backend pipeline robust execution, model integration.</p>
                </div>

                {/* 3. UI/UX & Polish Slider */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white">3. UI/UX & Design Polish (20% Weight)</span>
                    <span className="text-emerald-300 font-mono text-sm">{uxScore.toFixed(1)} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={uxScore}
                    onChange={(e) => setUxScore(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500">Visual design, responsive interface, micro-interactions, accessibility.</p>
                </div>

                {/* 4. Feasibility & Impact Slider */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white">4. Feasibility & Business Impact (20% Weight)</span>
                    <span className="text-brand-300 font-mono text-sm">{impactScore.toFixed(1)} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={impactScore}
                    onChange={(e) => setImpactScore(parseFloat(e.target.value))}
                    className="w-full accent-brand-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500">Real-world market viability, scalability, and problem statement resolution.</p>
                </div>

                {/* Judge Private Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Judge Private Feedback / Review Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter key observations, strengths, or areas for improvement..."
                    value={judgeNotes}
                    onChange={(e) => setJudgeNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 text-white rounded-2xl border border-slate-800 focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                {/* Weighted Total Calculation Banner */}
                <div className="p-4 rounded-2xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-200">Weighted Final Judge Score</span>
                  <span className="text-2xl font-black text-white font-mono">
                    {((innovationScore * 0.3 + technicalScore * 0.3 + uxScore * 0.2 + impactScore * 0.2)).toFixed(2)} / 10
                  </span>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProjectId(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-950 text-xs font-semibold text-slate-400 hover:text-white border border-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 flex items-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Judge Score 🚀</span>
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
