'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import { UserRole, UserSettings } from '@/lib/types';
import { useToast } from '@/components/Toast';
import { useApp } from '@/lib/AppContext';
import {
  User,
  Shield,
  Bell,
  Key,
  Lock,
  Github,
  Globe,
  Linkedin,
  MessageSquare,
  Save,
  Upload,
} from 'lucide-react';

export default function SettingsPage() {
  const { showToast } = useToast();
  const { userSettings, updateUserSettings, activeRole, setActiveRole, geminiApiKey, setGeminiApiKey, groqApiKey, setGroqApiKey } = useApp();
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [settings, setSettings] = useState<UserSettings>(userSettings);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'roles', label: 'Role & Permissions', icon: Shield },
    { id: 'api', label: 'API Keys', icon: Key },
  ];

  const roleOptions: { role: UserRole; label: string }[] = [
    { role: 'judge', label: 'Judge' },
    { role: 'participant', label: 'Participant' },
    { role: 'mentor', label: 'Mentor' },
    { role: 'organizer', label: 'Organizer' },
    { role: 'sponsor', label: 'Sponsor' },
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSettings((prev) => ({ ...prev, role }));
    setActiveRole(role);
  };

  const handleToggleNotif = (key: keyof UserSettings['notifications']) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleToggleConnected = (key: keyof UserSettings['connectedAccounts']) => {
    setSettings((prev) => ({
      ...prev,
      connectedAccounts: {
        ...prev.connectedAccounts,
        [key]: !prev.connectedAccounts[key],
      },
    }));
    showToast('Account Status Updated', `Toggled connection for ${key.toUpperCase()}`, 'info');
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    updateUserSettings(settings);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Settings Saved Live!', 'Profile, notifications, and persona updated across all screens in real-time.', 'success');
    }, 300);
  };

  return (
    <AppShell activeRole={activeRole}>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="border-b border-slate-800/80 pb-4">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Settings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your profile details, notification preferences, role permissions, and connected accounts.
          </p>
        </div>

        {/* 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Tabs Navigation */}
          <div className="md:col-span-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Settings Form Sections */}
          <div className="md:col-span-9 space-y-8">
            
            {/* SECTION 1: Profile Information */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                Profile Information
              </h2>

              {/* Avatar Uploader Row */}
              <div className="flex items-center space-x-5">
                <img
                  src={settings.avatarUrl}
                  alt="Avatar"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/40"
                />
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      const newUrl = prompt('Enter image URL for avatar:', settings.avatarUrl);
                      if (newUrl) setSettings({ ...settings, avatarUrl: newUrl });
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-white flex items-center space-x-2 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-400" />
                    <span>Upload / Change Photo</span>
                  </button>
                  <p className="text-[10px] text-slate-500 mt-1.5">Enter custom image URL or select preset avatar.</p>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    value={settings.fullName}
                    onChange={(e) => setSettings({ ...settings, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 text-xs text-white border border-slate-800 focus:outline-none focus:border-brand-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 text-xs text-white border border-slate-800 focus:outline-none focus:border-brand-500/50"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Bio</label>
                  <textarea
                    rows={2}
                    value={settings.bio}
                    onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 text-xs text-white border border-slate-800 focus:outline-none focus:border-brand-500/50"
                  />
                </div>

                {/* Role Pill Selection */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Active Persona Role</label>
                  <div className="flex flex-wrap gap-2">
                    {roleOptions.map(({ role, label }) => {
                      const isSelected = settings.role === role;
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => handleRoleSelect(role)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 border border-brand-500'
                              : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* SECTION 2: Notification Preferences */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                Notification Preferences
              </h2>

              <div className="space-y-4">
                
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div>
                    <span className="text-xs font-bold text-white block">Email Notifications</span>
                    <span className="text-[11px] text-slate-400">Receive email updates about evaluations and projects.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleNotif('emailNotifications')}
                    className={`w-11 h-6 rounded-full p-1 transition-colors ${
                      settings.notifications.emailNotifications ? 'bg-brand-600' : 'bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        settings.notifications.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div>
                    <span className="text-xs font-bold text-white block">Mentor Requests</span>
                    <span className="text-[11px] text-slate-400">Get notified when participants request mentorship.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleNotif('mentorRequests')}
                    className={`w-11 h-6 rounded-full p-1 transition-colors ${
                      settings.notifications.mentorRequests ? 'bg-brand-600' : 'bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        settings.notifications.mentorRequests ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div>
                    <span className="text-xs font-bold text-white block">Team Updates</span>
                    <span className="text-[11px] text-slate-400">Receive updates about team activities and changes.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleNotif('teamUpdates')}
                    className={`w-11 h-6 rounded-full p-1 transition-colors ${
                      settings.notifications.teamUpdates ? 'bg-brand-600' : 'bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        settings.notifications.teamUpdates ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div>
                    <span className="text-xs font-bold text-white block">System Announcements</span>
                    <span className="text-[11px] text-slate-400">Important updates and announcements.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleNotif('systemAnnouncements')}
                    className={`w-11 h-6 rounded-full p-1 transition-colors ${
                      settings.notifications.systemAnnouncements ? 'bg-brand-600' : 'bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        settings.notifications.systemAnnouncements ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

              </div>
            </div>

            {/* SECTION 3: Connected Accounts */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                Connected Accounts
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* GitHub */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Github className="w-5 h-5 text-white" />
                    <div>
                      <span className="text-xs font-bold text-white block">Github</span>
                      <span className="text-[11px] text-slate-400 font-mono">Varun_khandelwal</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleConnected('github')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      settings.connectedAccounts.github
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {settings.connectedAccounts.github ? 'Connected' : 'Connect'}
                  </button>
                </div>

                {/* Google */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-amber-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Google</span>
                      <span className="text-[11px] text-slate-400 font-mono">{settings.email}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleConnected('google')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      settings.connectedAccounts.google
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {settings.connectedAccounts.google ? 'Connected' : 'Connect'}
                  </button>
                </div>

                {/* LinkedIn */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Linkedin className="w-5 h-5 text-sky-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">LinkedIn</span>
                      <span className="text-[11px] text-slate-400 font-mono">Varun-khandelwal</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleConnected('linkedin')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      settings.connectedAccounts.linkedin
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {settings.connectedAccounts.linkedin ? 'Connected' : 'Connect'}
                  </button>
                </div>

                {/* Discord */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-indigo-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Discord</span>
                      <span className="text-[11px] text-slate-400 font-mono">Varun#4477</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleConnected('discord')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      settings.connectedAccounts.discord
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {settings.connectedAccounts.discord ? 'Connected' : 'Connect'}
                  </button>
                </div>

              </div>
            </div>

            {/* SECTION 4: Google Gemini AI API Configuration */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Key className="w-4 h-4 text-brand-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Google Gemini AI API Key
                  </h2>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono">
                  Gemini 1.5 Flash Engine
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your official <span className="text-white font-semibold">Google Gemini API Key</span> to enable real-time LLM multi-rubric radar evaluations, code analysis, and AI mentor triage.
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Gemini API Key
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="password"
                      placeholder="AIzaSy..."
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 text-xs text-white border border-slate-800 focus:outline-none focus:border-brand-500/50 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        showToast('Gemini Key Saved!', 'Real-time Google Gemini LLM API active for evaluations & triage', 'success');
                      }}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-all"
                    >
                      Save Key
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Key is securely stored in your local session context (`localStorage`). If left blank, local neural scoring fallback is used.
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 5: Groq High-Speed LLM API Configuration */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Key className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Groq Ultra-Fast LLM API Key
                  </h2>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                  Llama 3.3 70B Engine
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your official <span className="text-white font-semibold">Groq API Key</span> to enable sub-second high-speed Llama 3.3 70B code evaluation and mentor triage.
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Groq API Key
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="password"
                      placeholder="gsk_..."
                      value={groqApiKey}
                      onChange={(e) => setGroqApiKey(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 text-xs text-white border border-slate-800 focus:outline-none focus:border-cyan-500/50 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        showToast('Groq Key Saved!', 'Groq Llama 3.3 70B ultra-fast LLM API active', 'success');
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md transition-all"
                    >
                      Save Key
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Key is securely stored in your local session context (`localStorage`).
                  </span>
                </div>
              </div>
            </div>

            {/* Save Changes Button Bar */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="px-7 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center space-x-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}
