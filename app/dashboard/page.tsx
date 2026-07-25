'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useApp } from '@/lib/AppContext';
import { useToast } from '@/components/Toast';
import {
  FolderGit2,
  Clock,
  Users,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Sparkles,
  Search,
  BarChart3,
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react';

export default function MainDashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { projects, stats: liveStats, userSettings, activeRole, addProject } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Project Form state
  const [newTitle, setNewTitle] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newCategory, setNewCategory] = useState('AIML');
  const [newRepoUrl, setNewRepoUrl] = useState('https://github.com/hackathon/new-project');
  const [newTags, setNewTags] = useState('AI/ML, Next.js, Python');
  const [newCoverImage, setNewCoverImage] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80');

  const stats = [
    {
      title: 'Total Projects',
      value: liveStats.totalProjects.toString(),
      change: 'vs last 24h ↑ 18%',
      isPositive: true,
      icon: FolderGit2,
      color: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
    },
    {
      title: 'Pending Evaluations',
      value: liveStats.pendingEvaluations.toString(),
      change: 'vs yesterday ↓ 12%',
      isPositive: false,
      icon: Clock,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Active Teams',
      value: liveStats.activeTeams.toString(),
      change: 'vs yesterday ↑ 8%',
      isPositive: true,
      icon: Users,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Open Mentor Requests',
      value: liveStats.openMentorRequests.toString(),
      change: 'vs yesterday ↑ 5%',
      isPositive: true,
      icon: MessageSquare,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
  ];

  const categories = ['all', 'AIML', 'Healthcare', 'EdTech', 'Agritech', 'FinTech', 'Travel', 'Blockchain', 'Social Impact'];

  const filteredProjects = projects.filter((proj) => {
    const matchesCat = activeCategory === 'all' || proj.tags.includes(activeCategory) || proj.category === activeCategory;
    const matchesSearch =
      proj.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      proj.team_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      proj.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTeamName.trim()) {
      showToast('Validation Error', 'Project title and team name are required', 'error');
      return;
    }

    const tagsArray = newTags.split(',').map((t) => t.trim()).filter(Boolean);

    const created = addProject({
      title: newTitle.trim(),
      team_name: newTeamName.trim(),
      team_id: `team-${Date.now()}`,
      tag_line: newTagline.trim() || 'Innovative hackathon submission built with modern AI stack.',
      repo_url: newRepoUrl.trim(),
      readme_text: `# ${newTitle}\n\nBuilt by ${newTeamName} during HackOps AI Hackathon.`,
      file_tree: `src/\n  app/page.tsx\n  components/\n  lib/\npackage.json`,
      tags: tagsArray.length > 0 ? tagsArray : [newCategory],
      category: newCategory,
      team_size: 4,
      cover_image: newCoverImage,
      badge: 'New Submission',
    });

    setIsAddModalOpen(false);
    showToast('Project Submitted Live! 🚀', `"${created.title}" added to real-time hackathon operations dashboard.`, 'success');

    // Clear form
    setNewTitle('');
    setNewTeamName('');
    setNewTagline('');
  };

  return (
    <AppShell activeRole={activeRole}>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        {/* Welcome Header & Action bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
              <span>Main Operations Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
              <span>Welcome back, {userSettings.fullName.split(' ')[0]}!</span>
              <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Here&apos;s what&apos;s happening with the hackathon evaluation & team matching layer.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white flex items-center space-x-2 shadow-lg shadow-brand-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New Project</span>
            </button>

            <button
              onClick={() => showToast('Analytics Sync', `Real-time telemetry active across ${projects.length} live projects`, 'info')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center space-x-2 transition-all"
            >
              <BarChart3 className="w-4 h-4 text-brand-400" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>

        {/* 4 Key Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">{stat.title}</span>
                  <div className={`p-2 rounded-xl border ${stat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</span>
                  <span
                    className={`text-[11px] font-semibold flex items-center space-x-1 ${
                      stat.isPositive ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {stat.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{stat.change}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Projects Header & Filter Strip */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-bold text-white tracking-tight">Recent Projects</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {filteredProjects.length} Repos
              </span>
            </div>

            <Link
              href="/projects"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center space-x-1 transition-colors"
            >
              <span>View All Projects in Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Category Tabs & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-brand-600 text-white font-semibold shadow-md shadow-brand-600/20'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>

            <div className="relative sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by keyword..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900 text-xs text-white rounded-lg border border-slate-800 focus:outline-none focus:border-brand-500/50"
              />
            </div>
          </div>

          {/* Grid of Project Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredProjects.map((project) => {
              const score = project.evaluation?.overall_score || 8.0;
              return (
                <div
                  key={project.id}
                  onClick={() => router.push(`/evaluation?projectId=${project.id}`)}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/40 transition-all cursor-pointer group flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-brand-500/5"
                >
                  {/* Thumbnail / Image with overlay */}
                  <div className="relative h-32 rounded-xl overflow-hidden bg-slate-950">
                    <img
                      src={project.cover_image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    {/* Badge top right */}
                    {project.badge && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {project.badge}
                      </span>
                    )}

                    {/* Category pill bottom left */}
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900/90 text-slate-300 border border-slate-700/80 backdrop-blur-md">
                      {project.tags[0] || 'Tech'}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400">
                      Team: <span className="text-slate-300">{project.team_name}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {project.tag_line}
                    </p>
                  </div>

                  {/* Footer Bar with Score */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <div className="flex items-center space-x-1 text-[11px] font-medium text-slate-400">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>{project.team_size || 4} Members</span>
                    </div>

                    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-brand-500/10 border border-brand-500/30 text-brand-300">
                      <span className="text-xs font-bold font-mono">{score.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400">/ 10</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MODAL: Submit New Project */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl relative">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/30">
                  <FolderGit2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Submit New Hackathon Project</h3>
                  <p className="text-xs text-slate-400">Add a project live to the operations dashboard.</p>
                </div>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. VisionPulse AI"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-950 text-white rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Team Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Team NeuralOps"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-950 text-white rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Tagline / Brief Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Real-time multi-agent copilot for edge devices..."
                    value={newTagline}
                    onChange={(e) => setNewTagline(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 text-white rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-950 text-white rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500/50"
                    >
                      <option value="AIML">AIML</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="EdTech">EdTech</option>
                      <option value="Agritech">Agritech</option>
                      <option value="FinTech">FinTech</option>
                      <option value="Travel">Travel</option>
                      <option value="Blockchain">Blockchain</option>
                      <option value="Social Impact">Social Impact</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      GitHub Repository URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://github.com/user/repo"
                      value={newRepoUrl}
                      onChange={(e) => setNewRepoUrl(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-950 text-white rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Tech Stack Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Python, PyTorch, Next.js, FastAPI"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 text-white rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500/50"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-950 text-xs font-semibold text-slate-400 hover:text-white border border-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Project</span>
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
