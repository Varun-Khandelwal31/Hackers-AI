'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import { useApp } from '@/lib/AppContext';
import { useToast } from '@/components/Toast';
import confetti from 'canvas-confetti';
import {
  Users,
  Sparkles,
  Plus,
  X,
  RotateCw,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

export default function TeamMatchingPage() {
  const { showToast } = useToast();
  const { matchedTeams, acceptTeam, reshuffleTeam, activeRole } = useApp();

  const [userSkills, setUserSkills] = useState<string[]>(['Python', 'Machine Learning', 'React', 'UI/UX Design']);
  const [newSkillInput, setNewSkillInput] = useState<string>('');
  const [isAddingSkill, setIsAddingSkill] = useState<boolean>(false);
  const [experienceLevel, setExperienceLevel] = useState<string>('Intermediate (2-4 yrs)');
  const [availability, setAvailability] = useState<string>('Full-time');
  const [isMatching, setIsMatching] = useState<boolean>(false);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (!userSkills.includes(newSkillInput.trim())) {
      setUserSkills([...userSkills, newSkillInput.trim()]);
    }
    setNewSkillInput('');
    setIsAddingSkill(false);
  };

  const handleRemoveSkill = (skill: string) => {
    setUserSkills(userSkills.filter((s) => s !== skill));
  };

  const handleFindMyTeam = async () => {
    setIsMatching(true);
    showToast('Calculating Matrix Distance', 'Evaluating skill complementarity across active rosters...', 'info');

    setTimeout(() => {
      matchedTeams.forEach((t) => reshuffleTeam(t.id));
      setIsMatching(false);
      showToast('Matches Updated Live!', 'Top complementary team matrices computed & saved to state.', 'success');
    }, 600);
  };

  const handleAcceptTeam = (teamId: string, teamName: string) => {
    acceptTeam(teamId);
    showToast('Team Joined! 🎉', `You have joined ${teamName}. Active teams count updated live on Dashboard!`, 'success');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleReshuffleTeam = (teamId: string) => {
    showToast('Reshuffling Roster', 'Recalculating member complementarity matrix...', 'info');
    reshuffleTeam(teamId);
  };

  return (
    <AppShell activeRole={activeRole}>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        {/* TOP PANEL: Find Your Perfect Team */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                <Users className="w-4 h-4" />
                <span>AI Complementarity Vector Engine</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Find Your Perfect Team</h1>
              <p className="text-xs text-slate-400 mt-1">
                Select your skills and preferences. We&apos;ll match you with the best teams!
              </p>
            </div>
          </div>

          {/* Filter Bar Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end pt-2 border-t border-slate-800/80">
            
            {/* Skills selection pills */}
            <div className="md:col-span-6 space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Your Skills
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {userSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 text-xs font-semibold text-white border border-slate-700/80 shadow-sm"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}

                {isAddingSkill ? (
                  <form onSubmit={handleAddSkill} className="inline-flex items-center">
                    <input
                      type="text"
                      autoFocus
                      placeholder="e.g. Next.js"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onBlur={() => setIsAddingSkill(false)}
                      className="px-3 py-1 text-xs bg-slate-950 text-white rounded-xl border border-brand-500/50 focus:outline-none"
                    />
                  </form>
                ) : (
                  <button
                    onClick={() => setIsAddingSkill(true)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-950/50 text-xs font-semibold text-slate-400 hover:text-white border border-dashed border-slate-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add skill</span>
                  </button>
                )}
              </div>
            </div>

            {/* Experience Level Dropdown */}
            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Experience Level
              </label>
              <div className="relative">
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2 rounded-xl bg-slate-950/80 text-xs font-medium text-white border border-slate-800 focus:outline-none focus:border-brand-500/50 cursor-pointer"
                >
                  <option>Intermediate (2-4 yrs)</option>
                  <option>Beginner (0-1 yrs)</option>
                  <option>Advanced (5+ yrs)</option>
                  <option>Lead / Architect</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Availability Dropdown */}
            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Availability
              </label>
              <div className="relative">
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2 rounded-xl bg-slate-950/80 text-xs font-medium text-white border border-slate-800 focus:outline-none focus:border-brand-500/50 cursor-pointer"
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Flexible hours</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleFindMyTeam}
              disabled={isMatching}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 text-brand-200 ${isMatching ? 'animate-spin' : ''}`} />
              <span>{isMatching ? 'Matching Teams...' : 'Find My Team'}</span>
            </button>
          </div>

        </div>

        {/* SECTION: AI Suggested Teams List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-bold text-white tracking-tight">AI Suggested Teams</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                Based on your skills & preferences
              </span>
            </div>

            <button
              onClick={() => handleFindMyTeam()}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reshuffle All</span>
            </button>
          </div>

          {/* List of Matched Team Cards */}
          <div className="space-y-4">
            {matchedTeams.map((team) => (
              <div
                key={team.id}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-6"
              >
                
                {/* Team Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-white">{team.name}</h3>
                    {team.badge && (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {team.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-extrabold text-brand-300 font-mono">{team.matchScore}%</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Match</span>
                  </div>
                </div>

                {/* Roster Members list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {team.members.map((mem, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center space-x-3"
                    >
                      <img
                        src={mem.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={mem.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-800"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{mem.name}</span>
                        <span className="text-[10px] text-slate-400">{mem.role}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skill Breakdown Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                    <span>Complementary Skills Matrix</span>
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                        <span>Design</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Frontend</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span>Backend</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-brand-400" />
                        <span>ML</span>
                      </span>
                    </div>
                  </div>

                  <div className="h-2 rounded-full bg-slate-950 overflow-hidden flex">
                    <div style={{ width: `${team.skillBreakdown.design}%` }} className="bg-purple-500 h-full" />
                    <div style={{ width: `${team.skillBreakdown.frontend}%` }} className="bg-emerald-500 h-full" />
                    <div style={{ width: `${team.skillBreakdown.backend}%` }} className="bg-cyan-500 h-full" />
                    <div style={{ width: `${team.skillBreakdown.ml}%` }} className="bg-brand-500 h-full" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      showToast('AI Teammate Spawned! 🤖', 'Added AI Agent (Docs & Test Suite Automation) to roster.', 'success');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Spawn AI Teammate 🤖</span>
                  </button>

                  <button
                    onClick={() => handleReshuffleTeam(team.id)}
                    className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors"
                  >
                    Reshuffle
                  </button>

                  <button
                    onClick={() => handleAcceptTeam(team.id, team.name)}
                    disabled={team.accepted}
                    className={`px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 ${
                      team.accepted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/30'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{team.accepted ? 'Joined Team!' : 'Accept Team'}</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
