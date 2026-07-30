'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import LiveMentorSessionModal from './LiveMentorSessionModal';
import { useApp } from '@/lib/AppContext';

interface AppShellProps {
  children: React.ReactNode;
  activeRole?: string;
}

export default function AppShell({ children, activeRole = 'judge' }: AppShellProps) {
  const { isLiveSessionOpen, activeLiveMentor, closeLiveSession } = useApp();

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Persistent Left Sidebar */}
      <Sidebar activeRole={activeRole} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Global Persistent Live Session Modal & Floating PiP Dock */}
      <LiveMentorSessionModal
        isOpen={isLiveSessionOpen}
        onClose={closeLiveSession}
        mentorName={activeLiveMentor.name}
        mentorTitle={activeLiveMentor.title}
        mentorAvatar={activeLiveMentor.avatarUrl}
      />
    </div>
  );
}
