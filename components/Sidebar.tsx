'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';
import { useApp } from '@/lib/AppContext';

interface SidebarProps {
  activeRole?: string;
}

export default function Sidebar({ activeRole: propRole }: SidebarProps) {
  const pathname = usePathname();
  const { userSettings, activeRole: contextRole } = useApp();
  const currentRole = propRole || contextRole || 'judge';

  const navItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Projects', href: '/projects', icon: FolderGit2 },
    { label: 'Evaluation', href: '/evaluation', icon: ShieldCheck, badge: 'AI' },
    { label: 'Teams', href: '/participant/team-matching', icon: Users },
    { label: 'Mentor', href: '/participant/mentor-assistant', icon: GraduationCap },
    { label: 'Roadmap', href: '/roadmap', icon: Compass },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between hidden md:flex min-h-screen sticky top-0 h-screen z-40">
      <div className="p-5 space-y-6">
        {/* Brand Header */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-ai-cyan p-0.5 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-400 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg text-white tracking-tight group-hover:text-brand-300 transition-colors">
              HackOps <span className="text-brand-400">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">
              Hackathon AI Ops Layer
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
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

      {/* User Profile & Landing Page Button at bottom */}
      <div className="p-4 border-t border-slate-800/80 space-y-2">
        <Link
          href="/landing"
          className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
        >
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>3D Live Landing Page</span>
        </Link>

        <Link
          href="/settings"
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all group"
        >
          <div className="flex items-center space-x-3">
            <img
              src={userSettings.avatarUrl}
              alt={userSettings.fullName}
              className="w-9 h-9 rounded-lg object-cover ring-2 ring-brand-500/30"
            />
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
