'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sparkles,
  Shield,
  User,
  GraduationCap,
  Search,
  Bell,
  Check,
  ChevronDown,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import { UserRole } from '@/lib/types';
import { useToast } from './Toast';
import { useApp } from '@/lib/AppContext';
import AuthModal from './AuthModal';
import { LogOut, LogIn, UserPlus, Settings as SettingsIcon } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const { userSettings, activeRole, setActiveRole, isAuthenticated, logout } = useApp();
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    setIsUserMenuOpen(false);
  };

  const notifications = [
    { id: 1, title: 'Evaluation Complete', desc: 'EcoVerse AI evaluated with 8.28/10', time: '5m ago' },
    { id: 2, title: 'New Mentor Request', desc: 'Team AgroNexus requested AgriTech assistance', time: '12m ago' },
    { id: 3, title: 'Team Match Found', desc: 'Team Nova is a 92% match for your skills', time: '1h ago' },
  ];

  const handleRoleSelect = (role: UserRole) => {
    setActiveRole(role);
    setIsRoleMenuOpen(false);
    showToast('Switched Persona View', `Now viewing as ${role.toUpperCase()}`, 'info');
    if (role === 'judge') router.push('/evaluation');
    else if (role === 'participant') router.push('/participant/team-matching');
    else if (role === 'mentor') router.push('/participant/mentor-assistant');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/projects?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
    judge: { label: 'Judge', icon: <Shield className="w-3.5 h-3.5 text-brand-400" />, color: 'bg-brand-500/10 text-brand-300 border-brand-500/30' },
    participant: { label: 'Participant', icon: <User className="w-3.5 h-3.5 text-emerald-400" />, color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
    mentor: { label: 'Mentor', icon: <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />, color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' },
    organizer: { label: 'Organizer', icon: <Zap className="w-3.5 h-3.5 text-amber-400" />, color: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
    sponsor: { label: 'Sponsor', icon: <Zap className="w-3.5 h-3.5 text-purple-400" />, color: 'bg-purple-500/10 text-purple-300 border-purple-500/30' },
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/90 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Mobile Toggle & Brand */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="md:hidden flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-white text-base">HackOps AI</span>
          </Link>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects, teams, mentors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/80 text-white rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500/50 transition-all placeholder:text-slate-500"
          />
        </form>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Persona Role Switcher Pills */}
          <div className="hidden sm:flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            {(['judge', 'participant', 'mentor'] as UserRole[]).map((r) => {
              const isActive = activeRole === r;
              return (
                <button
                  key={r}
                  onClick={() => handleRoleSelect(r)}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? `${roleLabels[r].color} border shadow-sm`
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {roleLabels[r].icon}
                  <span className="capitalize">{r}</span>
                </button>
              );
            })}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" />
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
                  <span className="text-[10px] text-brand-400 font-mono">3 New</span>
                </div>
                <div className="space-y-2.5">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all text-left">
                      <div className="flex items-center justify-between text-xs font-semibold text-white mb-0.5">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Account Menu / Auth Buttons */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
            >
              {userSettings.avatarUrl ? (
                <img
                  src={userSettings.avatarUrl}
                  alt={userSettings.fullName}
                  className="w-7 h-7 rounded-lg object-cover ring-2 ring-brand-500/40"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-brand-600/20 border border-brand-500/40 flex items-center justify-center text-brand-300 font-extrabold text-xs uppercase">
                  {userSettings.fullName?.charAt(0) || 'U'}
                </div>
              )}
              <span className="hidden lg:inline text-xs font-bold text-white truncate max-w-[110px]">
                {userSettings.fullName || 'Sign In'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-fade-in space-y-1">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 mb-2">
                  <div className="text-xs font-bold text-white truncate">{userSettings.fullName}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{userSettings.email || 'guest@hackops.ai'}</div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    {activeRole}
                  </span>
                </div>

                <Link
                  href="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center space-x-2 w-full p-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <SettingsIcon className="w-4 h-4 text-slate-400" />
                  <span>Account Settings</span>
                </Link>

                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="flex items-center space-x-2 w-full p-2 rounded-xl text-xs font-medium text-brand-300 hover:bg-brand-500/20 transition-all"
                >
                  <LogIn className="w-4 h-4 text-brand-400" />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="flex items-center space-x-2 w-full p-2 rounded-xl text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition-all"
                >
                  <UserPlus className="w-4 h-4 text-emerald-400" />
                  <span>Create Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsUserMenuOpen(false);
                    showToast('Logged Out', 'Successfully signed out of session', 'info');
                  }}
                  className="flex items-center space-x-2 w-full p-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/20 transition-all border-t border-slate-800/80 pt-2"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 text-white rounded-xl border border-slate-800"
            />
          </form>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 bg-slate-900 rounded-xl text-slate-200">Dashboard</Link>
            <Link href="/projects" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 bg-slate-900 rounded-xl text-slate-200">Projects Directory</Link>
            <Link href="/evaluation" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 bg-slate-900 rounded-xl text-slate-200">AI Evaluation</Link>
            <Link href="/participant/team-matching" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 bg-slate-900 rounded-xl text-slate-200">Team Matching</Link>
            <Link href="/participant/mentor-assistant" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 bg-slate-900 rounded-xl text-slate-200">AI Mentor</Link>
            <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 bg-slate-900 rounded-xl text-slate-200">Settings</Link>
            <Link href="/roadmap" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 bg-slate-900 rounded-xl text-slate-200">Roadmap</Link>
          </div>
        </div>
      )}
    </header>
  );
}
