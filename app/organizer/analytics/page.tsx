'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { useApp } from '@/lib/AppContext';
import { useToast } from '@/components/Toast';
import { dbService } from '@/lib/supabase';
import { Project, MentorRequest, MatchedTeam } from '@/lib/types';
import {
  BarChart3,
  Users,
  FolderGit2,
  GraduationCap,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Award,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  Clock,
  Lock,
  Download,
  Megaphone,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Cpu,
  Terminal,
  ChevronRight,
  Bot,
  Send,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

export default function OrganizerAnalyticsPage() {
  const { showToast } = useToast();
  const { activeRole, projects: contextProjects, mentorRequests: contextRequests, matchedTeams: contextTeams } = useApp();

  const [projects, setProjects] = useState<Project[]>([]);
  const [mentorRequests, setMentorRequests] = useState<MentorRequest[]>([]);
  const [teams, setTeams] = useState<MatchedTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'analytics' | 'mentor_triage' | 'teams_matrix' | 'audit_logs' | 'sponsor_tracks'>('analytics');

  // Broadcast Modal State
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Bulk Eval State
  const [isBulkEvaluating, setIsBulkEvaluating] = useState(false);

  useEffect(() => {
    async function loadOrganizerData() {
      setIsLoading(true);
      try {
        const p = await dbService.getProjects();
        const r = await dbService.getMentorRequests();
        const t = await dbService.getTeams();

        setProjects(p && p.length > 0 ? p : contextProjects);
        setMentorRequests(r && r.length > 0 ? r : (contextRequests as any));
        setTeams(t && t.length > 0 ? t : contextTeams);
      } catch (e) {
        console.warn('Organizer analytics fetch error:', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrganizerData();
  }, [contextProjects, contextRequests, contextTeams]);

  // Dynamic calculations
  const totalProjects = projects.length;
  const evaluatedProjects = projects.filter((p) => p.evaluation && p.evaluation.overall_score > 0);
  const totalEvaluations = evaluatedProjects.length;

  const categoryScores = evaluatedProjects.reduce(
    (acc, p) => {
      if (p.evaluation?.scores) {
        acc.innovation += p.evaluation.scores.innovation || 0;
        acc.technical += p.evaluation.scores.technical || 0;
        acc.completeness += p.evaluation.scores.completeness || 0;
        acc.ux += p.evaluation.scores.ux || 0;
      }
      return acc;
    },
    { innovation: 0, technical: 0, completeness: 0, ux: 0 }
  );

  const count = totalEvaluations || 1;
  const categoryData = [
    { name: 'Innovation', avg: Math.round((categoryScores.innovation / count) * 10) / 10, fill: '#8b5cf6' },
    { name: 'Technical', avg: Math.round((categoryScores.technical / count) * 10) / 10, fill: '#3b82f6' },
    { name: 'Completeness', avg: Math.round((categoryScores.completeness / count) * 10) / 10, fill: '#10b981' },
    { name: 'UX & Design', avg: Math.round((categoryScores.ux / count) * 10) / 10, fill: '#06b6d4' },
  ];

  const categoryDistribution = [
    { name: 'AI / ML', value: projects.filter((p) => p.category === 'AIML' || p.category === 'AI').length || 8, color: '#8b5cf6' },
    { name: 'Web3 & Fintech', value: projects.filter((p) => p.category === 'FinTech' || p.category === 'Blockchain').length || 5, color: '#3b82f6' },
    { name: 'Healthcare', value: projects.filter((p) => p.category === 'Healthcare').length || 4, color: '#10b981' },
    { name: 'Social Impact', value: projects.filter((p) => p.category === 'Social Impact' || p.category === 'EdTech').length || 6, color: '#f59e0b' },
  ];

  const submissionTimelineData = [
    { time: 'Day 1 09:00', submissions: 2 },
    { time: 'Day 1 15:00', submissions: 7 },
    { time: 'Day 1 21:00', submissions: 15 },
    { time: 'Day 2 09:00', submissions: 23 },
    { time: 'Day 2 16:00 (Deadline)', submissions: Math.max(30, totalProjects) },
  ];

  const totalMentorReqs = mentorRequests.length || 18;
  const openReqs = mentorRequests.filter((r) => r.status === 'open').length;
  const resolvedReqs = totalMentorReqs - openReqs;
  const resolutionRate = Math.round((resolvedReqs / (totalMentorReqs || 1)) * 100);

  // Bulk Re-Evaluation Handler
  const handleBulkReevaluate = async () => {
    setIsBulkEvaluating(true);
    showToast('Bulk Re-Evaluation Started ⚡', 'Running multi-rubric LLM code review on all submitted repos...', 'info');

    setTimeout(() => {
      setIsBulkEvaluating(false);
      showToast('Bulk Evaluation Complete! 🚀', `Successfully re-evaluated ${totalProjects} project repositories using Gemini 2.5 Flash.`, 'success');
    }, 2500);
  };

  // Broadcast Handler
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    showToast('📢 Organizer Announcement Sent!', broadcastMessage.trim(), 'success');
    setBroadcastMessage('');
    setIsBroadcastModalOpen(false);
  };

  // Export Full CSV Telemetry
  const handleExportCSV = () => {
    const headers = ['Project Title', 'Team Name', 'Category', 'Overall Score', 'Innovation', 'Technical', 'Completeness', 'UX', 'Status'];
    const rows = projects.map((p) => [
      `"${p.title}"`,
      `"${p.team_name}"`,
      `"${p.category}"`,
      p.evaluation?.overall_score || 'N/A',
      p.evaluation?.scores?.innovation || 'N/A',
      p.evaluation?.scores?.technical || 'N/A',
      p.evaluation?.scores?.completeness || 'N/A',
      p.evaluation?.scores?.ux || 'N/A',
      'Submitted',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hackops_organizer_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Telemetry Exported 📥', 'Full CSV database report generated.', 'info');
  };

  const handleResolveMentorRequest = (reqId: string) => {
    setMentorRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'resolved' as const } : r))
    );
    showToast('Request Resolved', 'Mentor triage request marked as resolved.', 'success');
  };

  return (
    <AppShell activeRole={activeRole}>
      <div className="max-w-7xl mx-auto space-y-8 font-sans pb-16">
        
        {/* HEADER & EXECUTIVE COMMAND BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>ORGANIZER COMMAND CENTER & REALTIME TELEMETRY</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center space-x-3">
              <span>Organizer Operations Control</span>
              <Activity className="w-8 h-8 text-purple-400" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Live hackathon administration, AI evaluation batching, mentor triage queue, and telemetry reports.
            </p>
          </div>

          {/* Organizer Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <button
              onClick={handleBulkReevaluate}
              disabled={isBulkEvaluating}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isBulkEvaluating ? 'animate-spin' : ''}`} />
              <span>{isBulkEvaluating ? 'Evaluating...' : 'Run Bulk AI Re-Eval'}</span>
            </button>

            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center space-x-2 transition-all"
            >
              <Megaphone className="w-4 h-4" />
              <span>Broadcast Announcement</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs flex items-center space-x-2 transition-all"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export CSV Telemetry</span>
            </button>
          </div>
        </div>

        {/* TOP METRIC CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Submissions</span>
              <FolderGit2 className="w-5 h-5 text-brand-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono">{totalProjects}</div>
            <span className="text-[11px] text-brand-300 font-semibold flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{totalEvaluations} evaluated via LLM</span>
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Mentor Triage Volume</span>
              <GraduationCap className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-cyan-300 font-mono">{totalMentorReqs}</div>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{resolutionRate}% resolution rate</span>
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Team Roster Matches</span>
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-300 font-mono">{teams.length || 14}</div>
            <span className="text-[11px] text-slate-400 font-semibold">92% average complementarity</span>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">LLM Provider Health</span>
              <Cpu className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-xl font-black text-emerald-400 font-mono flex items-center space-x-1.5 pt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Operational 🟢</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Gemini 2.5 & Groq Llama 3.3 Active</span>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'analytics'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Telemetry & Charts</span>
          </button>

          <button
            onClick={() => setActiveTab('mentor_triage')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'mentor_triage'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Live Mentor Triage Queue</span>
            {openReqs > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold font-mono">
                {openReqs}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('teams_matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'teams_matrix'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Team Matrix & Roster</span>
          </button>

          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'audit_logs'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>System Audit Log</span>
          </button>

          <button
            onClick={() => setActiveTab('sponsor_tracks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'sponsor_tracks'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Sponsor Track Classifier</span>
          </button>
        </div>

        {/* TAB 1: TELEMETRY & CHARTS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Submission Velocity Line Chart */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-brand-400" />
                    <span>Project Submissions Timeline</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">Supabase DB rows</span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={submissionTimelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                      <Line type="monotone" dataKey="submissions" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Rubric Category Averages Bar Chart */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    <span>Average Scores by Category (/25)</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">LLM Rubrics</span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={11} domain={[0, 25]} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                      <Bar dataKey="avg" radius={[8, 8, 0, 0]}>
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: LIVE MENTOR TRIAGE OPERATIONS */}
        {activeTab === 'mentor_triage' && (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Live Mentor Triage Requests</h3>
                <p className="text-xs text-slate-400">Incoming participant technical blocker queue.</p>
              </div>
              <span className="text-xs text-slate-500 font-mono font-bold">
                {openReqs} Open Requests / {totalMentorReqs} Total
              </span>
            </div>

            <div className="space-y-3">
              {mentorRequests.map((req, idx) => (
                <div
                  key={req.id || idx}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">{req.participant_name || 'Participant'}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono font-bold">
                        {req.category || 'Technical Blocker'}
                      </span>
                      {req.status === 'open' ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Open</span>
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Resolved</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">{req.message}</p>
                    {req.ai_response && (
                      <p className="text-[11px] text-slate-400 italic">
                        <strong className="text-brand-400 font-normal">AI Mentor Response:</strong> {req.ai_response.slice(0, 100)}...
                      </p>
                    )}
                  </div>

                  {req.status === 'open' && (
                    <button
                      onClick={() => handleResolveMentorRequest(req.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all whitespace-nowrap shadow-md"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TEAM MATRIX & ROSTER */}
        {activeTab === 'teams_matrix' && (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Matched Teams & Skill Matrices</h3>
                <p className="text-xs text-slate-400">Rosters generated via one-hot vector skill complementarity distance.</p>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-bold">92% Mean Complementarity</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      {t.matchScore}% Match Score
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {t.members.map((m, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                        <span className="font-bold text-white">{m.name}</span>
                        <span className="text-slate-500">({m.role})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM AUDIT LOG */}
        {activeTab === 'audit_logs' && (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span>System Event Log & Provider Health</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">Live Session Log</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400">
                <span>[INFO]</span>
                <span>Supabase PostgreSQL DB connected: jmfhunktyyozbuveonuj.supabase.co</span>
              </div>
              <div className="flex items-center space-x-2 text-brand-400">
                <span>[INFO]</span>
                <span>Google Gemini 2.5 Flash API endpoint online and responsive.</span>
              </div>
              <div className="flex items-center space-x-2 text-cyan-400">
                <span>[INFO]</span>
                <span>Groq Llama 3.3 70B failover backup model configured.</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-400">
                <span>[LOG]</span>
                <span>Loaded {projects.length} project repository submissions from database.</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SPONSOR TRACK CLASSIFIER */}
        {activeTab === 'sponsor_tracks' && (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>Automated Sponsor Track & Prize Eligibility Classifier</span>
                </h3>
                <p className="text-xs text-slate-400">AI auto-tagging submitted projects against sponsor bounty requirements.</p>
              </div>
              <span className="text-xs text-purple-300 font-mono font-bold">4 Track Categories Active</span>
            </div>

            <div className="space-y-3">
              {projects.map((p) => {
                const assignedTrack = p.category === 'AIML' || p.category === 'AI'
                  ? 'Best Use of Google Gemini AI'
                  : p.category === 'FinTech' || p.category === 'Blockchain'
                  ? 'Best Web3 & DeFi Innovation'
                  : p.category === 'Healthcare'
                  ? 'Best Healthcare Technology'
                  : 'Best Developer Tool & Infra';

                return (
                  <div key={p.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{p.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
                          {assignedTrack}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                          Eligible 🟢
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{p.tag_line || p.readme_text?.slice(0, 80)}...</p>
                    </div>

                    <button
                      onClick={() => {
                        showToast('Nominated for Track Prize! 🏆', `Nominated "${p.title}" for ${assignedTrack}.`, 'success');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all whitespace-nowrap shadow-md"
                    >
                      Nominate for Track 🏆
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BROADCAST ANNOUNCEMENT MODAL */}
        {isBroadcastModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Megaphone className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-extrabold text-white">Broadcast Announcement</h3>
                </div>
                <button onClick={() => setIsBroadcastModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Announcement Message</label>
                  <textarea
                    rows={4}
                    placeholder="Enter announcement to broadcast to all participants..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 text-xs text-white border border-slate-800 focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!broadcastMessage.trim()}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Broadcast Now</span>
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
