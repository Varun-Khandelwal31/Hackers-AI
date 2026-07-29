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
  Database,
  Server,
  CheckCircle2,
} from 'lucide-react';

export default function SettingsPage() {
  const { showToast } = useToast();
  const { userSettings, updateUserSettings, activeRole, setActiveRole, geminiApiKey, setGeminiApiKey, groqApiKey, setGroqApiKey } = useApp();
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [settings, setSettings] = useState<UserSettings>(userSettings);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [supabaseUrl, setSupabaseUrl] = useState<string>('');
  const [supabaseKey, setSupabaseKey] = useState<string>('');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account & Socials', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'roles', label: 'Role & Permissions', icon: Shield },
    { id: 'api', label: 'API Keys & LLMs', icon: Key },
    { id: 'database', label: 'Supabase DB', icon: Database },
  ];

  const roleOptions: { role: UserRole; label: string }[] = [
    { role: 'judge', label: 'Judge / Evaluator' },
    { role: 'participant', label: 'Participant / Hacker' },
    { role: 'mentor', label: 'AI Mentor' },
    { role: 'organizer', label: 'Hackathon Organizer' },
    { role: 'sponsor', label: 'Track Sponsor' },
  ];

  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateUserSettings(settings);
      setIsSaving(false);
      showToast('Settings Saved', 'Your user preferences have been updated successfully', 'success');
    }, 600);
  };

  const handleRoleSelect = (role: UserRole) => {
    setActiveRole(role);
    setSettings((prev) => ({ ...prev, role }));
    showToast('Role Switch Active', `Switched default active persona to ${role.toUpperCase()}`, 'info');
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
  };

  return (
    <AppShell activeRole={activeRole}>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">System Settings</h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage your persona role, LLM API keys, Supabase PostgreSQL database, and notifications.
            </p>
          </div>
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Subnav */}
          <div className="md:col-span-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Tab Content */}
          <div className="md:col-span-9 space-y-6">
            
            {/* TAB 1: PROFILE */}
            {activeTab === 'profile' && (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                  Profile Information
                </h2>

                <div className="flex items-center space-x-5">
                  {settings.avatarUrl ? (
                    <img
                      src={settings.avatarUrl}
                      alt="Avatar"
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/40"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-brand-600/20 border border-brand-500/40 flex items-center justify-center text-brand-300 font-extrabold text-xl uppercase">
                      {settings.fullName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        const newUrl = prompt('Enter Image Avatar URL:', settings.avatarUrl);
                        if (newUrl !== null) setSettings({ ...settings, avatarUrl: newUrl });
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center space-x-2"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-400" />
                      <span>Upload / Change Photo</span>
                    </button>
                    <p className="text-[10px] text-slate-500 mt-1.5">Enter custom image URL or select avatar.</p>
                  </div>
                </div>

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
                </div>
              </div>
            )}

            {/* TAB 2: ACCOUNT & SOCIALS */}
            {activeTab === 'account' && (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                  Connected Accounts
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Github className="w-5 h-5 text-white" />
                      <div>
                        <span className="text-xs font-bold text-white block">Github</span>
                        <span className="text-[11px] text-slate-400 font-mono">Connected</span>
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

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-amber-400" />
                      <div>
                        <span className="text-xs font-bold text-white block">Google</span>
                        <span className="text-[11px] text-slate-400 font-mono">Connected</span>
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
                </div>
              </div>
            )}

            {/* TAB 3: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                  Notification Preferences
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div>
                      <span className="text-xs font-bold text-white block">Email Notifications</span>
                      <span className="text-[11px] text-slate-400">Receive email updates about evaluations.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleNotif('emailNotifications')}
                      className={`w-11 h-6 rounded-full p-1 transition-colors ${
                        settings.notifications.emailNotifications ? 'bg-brand-600' : 'bg-slate-800'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.notifications.emailNotifications ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ROLES */}
            {activeTab === 'roles' && (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                  Active Persona Role
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roleOptions.map(({ role, label }) => {
                    const isSelected = activeRole === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleSelect(role)}
                        className={`p-4 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'bg-brand-600/20 text-brand-300 border-brand-500/50 shadow-sm'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        <span className="text-xs font-bold block text-white">{label}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Persona: {role}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: API KEYS */}
            {activeTab === 'api' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <Key className="w-4 h-4 text-brand-400" />
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider">Google Gemini API Key</h2>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono">Gemini 2.5 Flash</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="password"
                      placeholder="AIzaSy..."
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 text-xs text-white border border-slate-800 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => showToast('Saved!', 'Gemini API Key updated', 'success')}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold"
                    >
                      Save Key
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <Key className="w-4 h-4 text-cyan-400" />
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider">Groq Ultra-Fast LLM API Key</h2>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">Llama 3.3 70B</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="password"
                      placeholder="gsk_..."
                      value={groqApiKey}
                      onChange={(e) => setGroqApiKey(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 text-xs text-white border border-slate-800 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => showToast('Saved!', 'Groq Llama 3.3 70B API Key updated', 'success')}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
                    >
                      Save Key
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: SUPABASE DATABASE CONFIGURATION */}
            {activeTab === 'database' && (
              <div className="space-y-6">
                
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <Database className="w-5 h-5 text-emerald-400" />
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                        Supabase PostgreSQL Database
                      </h2>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Primary Database</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    HackOps AI uses <span className="text-white font-semibold">Supabase PostgreSQL</span> as its exclusive primary relational database for managing projects, multi-rubric radar evaluations, and mentor triage logs.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                    <Server className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Supabase Credentials & Endpoint
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Supabase URL</label>
                      <input
                        type="text"
                        placeholder="https://your-project.supabase.co"
                        value={supabaseUrl}
                        onChange={(e) => setSupabaseUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-xs text-white border border-slate-800 font-mono focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Supabase Anon Public Key</label>
                      <input
                        type="password"
                        placeholder="eyJhbGciOiJIUzI1Ni..."
                        value={supabaseKey}
                        onChange={(e) => setSupabaseKey(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-xs text-white border border-slate-800 font-mono focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => showToast('Supabase Saved!', 'Supabase PostgreSQL database configured as single primary DB', 'success')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save Supabase DB Config</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </AppShell>
  );
}
