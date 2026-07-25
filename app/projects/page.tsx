'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useApp } from '@/lib/AppContext';
import { useToast } from '@/components/Toast';
import {
  FolderGit2,
  Search,
  Plus,
  Grid,
  List as ListIcon,
  Github,
  Users,
  ExternalLink,
  Sparkles,
  Award,
  ChevronRight,
  SlidersHorizontal,
  X,
  CheckCircle2,
} from 'lucide-react';

export default function ProjectsDirectoryPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { projects, activeRole, addProject } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'score' | 'recent' | 'team'>('score');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New project modal form state
  const [newTitle, setNewTitle] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newCategory, setNewCategory] = useState('AIML');
  const [newRepoUrl, setNewRepoUrl] = useState('https://github.com/hackathon/new-repo');
  const [newTags, setNewTags] = useState('AI/ML, Next.js, Python');
  const [newCoverImage, setNewCoverImage] = useState('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80');

  const categories = ['all', 'AIML', 'Healthcare', 'EdTech', 'Agritech', 'FinTech', 'Travel', 'Blockchain', 'Social Impact'];

  const filteredProjects = projects
    .filter((proj) => {
      const matchesCat = activeCategory === 'all' || proj.tags.includes(activeCategory) || proj.category === activeCategory;
      const matchesSearch =
        proj.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        proj.team_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        proj.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()));
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'score') {
        const scoreA = a.evaluation?.overall_score || 0;
        const scoreB = b.evaluation?.overall_score || 0;
        return scoreB - scoreA;
      }
      if (sortBy === 'team') {
        return (b.team_size || 0) - (a.team_size || 0);
      }
      return 0; // default order
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
    showToast('Project Created! 🚀', `"${created.title}" added to the Projects Directory.`, 'success');
    setNewTitle('');
    setNewTeamName('');
    setNewTagline('');
  };

  return (
    <AppShell activeRole={activeRole}>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-2">
              <FolderGit2 className="w-3.5 h-3.5 text-brand-400" />
              <span>Hackathon Repositories Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Projects Directory</h1>
            <p className="text-xs text-slate-400 mt-1">
              Browse, filter, and inspect all submitted hackathon projects, code repositories, and team metrics.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white flex items-center space-x-2 shadow-lg shadow-brand-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New Project</span>
            </button>
          </div>
        </div>

        {/* CONTROLS STRIP: Search, Category Tabs, Sort, View Toggle */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects by title, team, or tech stack..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/80 text-white rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500/50"
              />
            </div>

            {/* Sort & View Mode Controls */}
            <div className="flex items-center space-x-3 justify-between md:justify-end">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-xs font-medium text-white border border-slate-800 focus:outline-none focus:border-brand-500/50 cursor-pointer"
                >
                  <option value="score">Highest Score</option>
                  <option value="recent">Recently Added</option>
                  <option value="team">Team Size</option>
                </select>
              </div>

              {/* Grid vs List toggle */}
              <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${
                    viewMode === 'grid' ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${
                    viewMode === 'list' ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                  title="List View"
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
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
        </div>

        {/* PROJECTS DISPLAY SECTION */}
        {viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const score = project.evaluation?.overall_score || 8.0;
              return (
                <div
                  key={project.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group hover:shadow-xl hover:shadow-brand-500/5"
                >
                  {/* Cover Image */}
                  <div className="relative h-40 rounded-xl overflow-hidden bg-slate-950">
                    <img
                      src={project.cover_image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    {project.badge && (
                      <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md flex items-center space-x-1">
                        <Award className="w-3 h-3" />
                        <span>{project.badge}</span>
                      </span>
                    )}

                    <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900/90 text-slate-300 border border-slate-700/80 backdrop-blur-md">
                      {project.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                        {project.title}
                      </h3>
                      <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-brand-500/10 border border-brand-500/30 text-brand-300">
                        <span className="text-xs font-bold font-mono">{score.toFixed(1)}</span>
                        <span className="text-[10px] text-slate-400">/ 10</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 font-medium">
                      Team: <span className="text-slate-200">{project.team_name}</span>
                    </p>
                    
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {project.tag_line}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-slate-300 border border-slate-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <a
                      href={project.repo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>

                    <button
                      onClick={() => router.push(`/evaluation?projectId=${project.id}`)}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-600/20 hover:bg-brand-600 text-brand-300 hover:text-white border border-brand-500/30 text-xs font-semibold flex items-center space-x-1 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Evaluate Project</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* LIST TABLE VIEW */
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Project / Repository</th>
                    <th className="p-4">Team</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Submitted</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredProjects.map((project) => {
                    const score = project.evaluation?.overall_score || 8.0;
                    return (
                      <tr key={project.id} className="hover:bg-slate-900/80 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={project.cover_image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100'}
                              alt={project.title}
                              className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-800"
                            />
                            <div>
                              <span className="font-bold text-white block text-sm">{project.title}</span>
                              <span className="text-[11px] text-slate-400 line-clamp-1">{project.tag_line}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300 font-medium">{project.team_name}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-950 text-slate-300 border border-slate-800">
                            {project.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold font-mono text-brand-300 text-sm">{score.toFixed(1)} / 10</span>
                        </td>
                        <td className="p-4 text-slate-400 font-mono">{project.submitted_at}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => router.push(`/evaluation?projectId=${project.id}`)}
                            className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all inline-flex items-center space-x-1"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Evaluate</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
                  <p className="text-xs text-slate-400">Add a project live to the Projects Directory.</p>
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
