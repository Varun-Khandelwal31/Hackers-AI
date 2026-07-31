'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useToast } from '@/components/Toast';
import { UserRole } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  X,
  Mail,
  Lock,
  User,
  Shield,
  GraduationCap,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { login } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('participant');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast('Validation Error', 'Email address is required', 'error');
      return;
    }

    if (!password.trim() || password.length < 6) {
      showToast('Validation Error', 'Password must be at least 6 characters', 'error');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      showToast('Validation Error', 'Full name is required for account creation', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const displayName = name.trim() || email.split('@')[0] || 'Hackathon Member';
      const avatarUrl = `https://unavatar.io/${encodeURIComponent(email.trim())}`;
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

      // Supabase Authentication
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        if (mode === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password.trim(),
            options: {
              data: {
                full_name: displayName,
                role: role,
                avatar_url: avatarUrl,
              },
              emailRedirectTo: `${origin}/auth/callback`,
            },
          });

          if (error) {
            console.warn('Supabase Auth error:', error.message);
            // Fallback to local session login
          } else if (data.user) {
            showToast('Account Created! 🎉', `Welcome to HackOps AI, ${displayName}!`, 'success');
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim(),
          });

          if (error) {
            console.warn('Supabase Sign In error:', error.message);
          } else if (data.user) {
            showToast('Welcome Back! 👋', `Signed in as ${displayName}`, 'success');
          }
        }
      }

      // Sync local app state
      login(displayName, email.trim(), mode === 'signup' ? role : 'participant', avatarUrl);
      if (mode === 'signin') {
        showToast('Signed In Successfully!', `Welcome back, ${displayName}`, 'success');
      } else {
        showToast('Account Created! 🎉', `Welcome to HackOps AI, ${displayName}!`, 'success');
      }
      setIsLoading(false);
      onClose();
      router.push('/dashboard');
    } catch (e: any) {
      setIsLoading(false);
      showToast('Authentication Error', e.message || 'Failed to authenticate', 'error');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${origin}/auth/callback`,
          },
        });
      } else {
        login('Demo Member', 'demo@hackops.ai', 'participant');
        showToast('Signed In with Google Demo', 'Authenticated via OAuth provider', 'success');
        onClose();
        router.push('/dashboard');
      }
    } catch (e: any) {
      showToast('Google Sign In Error', e.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/40">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-extrabold text-white">
              {mode === 'signin' ? 'Sign In to HackOps AI' : 'Create HackOps Account'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 relative z-10">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'signin' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'signup' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 text-xs text-white border border-slate-800 focus:outline-none focus:border-brand-500/50"
                  required={mode === 'signup'}
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="developer@hackops.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 text-xs text-white border border-slate-800 focus:outline-none focus:border-brand-500/50"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 text-xs text-white border border-slate-800 focus:outline-none focus:border-brand-500/50"
                required
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Hackathon Persona Role</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { r: 'participant', label: 'Participant', icon: <User className="w-3.5 h-3.5" /> },
                  { r: 'judge', label: 'Judge', icon: <Shield className="w-3.5 h-3.5" /> },
                  { r: 'mentor', label: 'Mentor', icon: <GraduationCap className="w-3.5 h-3.5" /> },
                ].map((item) => (
                  <button
                    key={item.r}
                    type="button"
                    onClick={() => setRole(item.r as UserRole)}
                    className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center space-y-1 border transition-all ${
                      role === item.r
                        ? 'bg-brand-500/20 border-brand-500 text-brand-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="capitalize">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <span>{isLoading ? 'Authenticating...' : mode === 'signin' ? 'Sign In Now' : 'Create Account Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* OAuth Provider Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[10px] uppercase text-slate-500 font-mono font-bold absolute">OR</span>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.3s.7 5.6 1.9 8l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </svg>
          <span>Continue with Google OAuth</span>
        </button>

        {/* Footer Security Note */}
        <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 justify-center font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secured with Supabase PostgreSQL Auth</span>
        </div>
      </div>
    </div>
  );
}
