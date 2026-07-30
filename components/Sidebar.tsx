'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import {
  LayoutDashboard,
  FolderGit2,
  ShieldCheck,
  Users,
  GraduationCap,
  Compass,
  Settings,
  Sparkles,
  ChevronRight,
  LogOut,
  User,
  Trophy,
  BarChart3,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '@/lib/AppContext';

interface SidebarProps {
  activeRole?: string;
}

export default function Sidebar({ activeRole: propRole }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const { userSettings, activeRole: contextRole, logout } = useApp();
  const currentRole = propRole || contextRole || 'judge';

  const handleSignOut = () => {
    logout();
    showToast('Signed Out', 'You have been signed out successfully', 'info');
    router.push('/landing');
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Leaderboard', href: '/leaderboard', icon: Trophy, badge: 'LIVE' },
    { label: 'Projects', href: '/projects', icon: FolderGit2 },
    { label: 'Evaluation', href: '/evaluation', icon: ShieldCheck, badge: 'AI' },
    { label: 'Organizer View', href: '/organizer/analytics', icon: BarChart3 },
    { label: 'Event Logistics FAQ', href: '/faq', icon: HelpCircle },
    { label: 'Teams', href: '/teams', icon: Users },
    { label: 'Mentor', href: '/mentor', icon: GraduationCap },
    { label: 'Roadmap', href: '/roadmap', icon: Compass },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-30 font-sans">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 p-0.5 shadow-lg shadow-brand-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base text-white tracking-tight">
              HackOps <span className="text-brand-400">AI</span>
            </span>
            <span className="text-[9px] text-slate-500 font-mono tracking-wider uppercase">
              Hackathon AI Ops Layer
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/40">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Actions at bottom */}
      <div className="p-4 border-t border-slate-800/80 space-y-2">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Sign Out</span>
        </button>

        <Link
          href="/settings"
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all group"
        >
          <div className="flex items-center space-x-3">
            {userSettings.avatarUrl ? (
              <img
                src={userSettings.avatarUrl}
                alt={userSettings.fullName}
                className="w-9 h-9 rounded-lg object-cover ring-2 ring-brand-500/30"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-brand-600/20 border border-brand-500/40 flex items-center justify-center text-brand-300 font-extrabold text-sm uppercase">
                {userSettings.fullName?.charAt(0) || 'U'}
              </div>
            )}
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors truncate max-w-[110px]">
                {userSettings.fullName}
              </span>
              <span className="text-[10px] text-slate-400 capitalize font-medium">
                {currentRole} Persona
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
        </Link>
      </div>
    </aside>
  );
}
