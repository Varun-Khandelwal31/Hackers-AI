'use client';

import React, { useState, useRef, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { MOCK_MENTORS_LIST } from '@/lib/seed-data';
import { Mentor } from '@/lib/types';
import { useToast } from '@/components/Toast';
import { useApp } from '@/lib/AppContext';
import {
  Sparkles,
  Send,
  Paperclip,
  Check,
  Star,
  Video,
  ChevronRight,
  Calendar,
  X,
} from 'lucide-react';

export default function MentorAssistantPage() {
  const { showToast } = useToast();
  const { mentorMessages, addMentorMessage, requestMentorSession, activeRole, userSettings, geminiApiKey, groqApiKey } = useApp();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [activeMentor, setActiveMentor] = useState<Mentor>(MOCK_MENTORS_LIST[0]);
  const [inputQuery, setInputQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('Today at 4:00 PM');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mentorMessages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isSending) return;

    const userMsgText = inputQuery.trim();
    addMentorMessage(userMsgText, 'user');
    setInputQuery('');
    setIsSending(true);

    try {
      const response = await fetch('/api/mentor-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(geminiApiKey ? { 'x-gemini-key': geminiApiKey } : {}),
          ...(groqApiKey ? { 'x-groq-key': groqApiKey } : {}),
        },
        body: JSON.stringify({
          category: 'AI/ML',
          message: userMsgText,
          apiKey: geminiApiKey,
          groqApiKey: groqApiKey,
        }),
      });

      const data = await response.json();
      const aiReply =
        data.ai_response ||
        data.aiResponse ||
        `I analyzed your question regarding "${userMsgText.slice(0, 35)}...". I recommend checking model parameters and consulting ${activeMentor.name} for domain guidance.`;

      addMentorMessage(aiReply, 'ai');
      if (data.matchedMentor) {
        // Find matching mentor in list or set matched
        const matched = MOCK_MENTORS_LIST.find((m) => m.name.toLowerCase().includes(data.matchedMentor.name?.toLowerCase() || '')) || data.matchedMentor;
        if (matched) setActiveMentor(matched);
      }
    } catch (e) {
      addMentorMessage(
        `Here is my recommendation for your query: Always ensure your dataset distribution matches your production inference environment. Let me know if you would like me to schedule a session with ${activeMentor.name}.`,
        'ai'
      );
    } finally {
      setIsSending(false);
    }
  };


  const handleConfirmBooking = () => {
    setIsBookingModalOpen(false);
    requestMentorSession(activeMentor.name, bookingDate);
    showToast('Live Session Requested! 📅', `Mentorship session booked with ${activeMentor.name} for ${bookingDate}. Open mentor requests count updated live!`, 'success');
  };

  return (
    <AppShell activeRole={activeRole}>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        
        {/* SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Mentor Assistant Chat */}
          <div className="lg:col-span-7 flex flex-col h-[680px] p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center space-x-2">
                    <span>Mentor Assistant</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/40">AI</span>
                  </h2>
                  <p className="text-[11px] text-slate-400">Your AI mentor to guide you</p>
                </div>
              </div>
            </div>

            {/* Messages Thread Container */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
              {mentorMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0 mt-1">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                        isUser
                          ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20 rounded-tr-none'
                          : 'bg-slate-950/80 text-slate-200 border border-slate-800 rounded-tl-none space-y-2'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>
                      <div
                        className={`text-[9px] mt-1 text-right font-mono ${
                          isUser ? 'text-brand-200' : 'text-slate-500'
                        }`}
                      >
                        {msg.timestamp} ✓✓
                      </div>
                    </div>

                    {isUser && (
                      <img
                        src={userSettings.avatarUrl}
                        alt="User"
                        className="w-8 h-8 rounded-xl object-cover ring-1 ring-brand-500/30 shrink-0 mt-1"
                      />
                    )}
                  </div>
                );
              })}

              {isSending && (
                <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
                  <Sparkles className="w-4 h-4 text-brand-400 animate-spin" />
                  <span>AI Mentor is thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-slate-800 flex items-center space-x-2">
              <button
                type="button"
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder="Type your question..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 text-xs text-white border border-slate-800 focus:outline-none focus:border-brand-500/50"
              />

              <button
                type="submit"
                disabled={!inputQuery.trim() || isSending}
                className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

          {/* RIGHT COLUMN: Recommended Mentor Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Recommended Mentor</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                AI Matched
              </span>
            </div>

            {/* Main Active Mentor Card */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-5">
              
              <div className="flex items-start space-x-4">
                <img
                  src={activeMentor.avatar_url}
                  alt={activeMentor.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/30"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white truncate">{activeMentor.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {activeMentor.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{activeMentor.title}</p>

                  {/* Skill Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {activeMentor.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Experience Badge */}
              <div className="text-xs text-slate-400 font-medium pt-1 border-t border-slate-800/80">
                Experience: <span className="text-white font-semibold">{activeMentor.experience_years}+ years</span>
              </div>

              {/* About text */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">About</span>
                <p className="text-xs text-slate-400 leading-relaxed">{activeMentor.about}</p>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Sessions</span>
                  <span className="text-sm font-bold text-white font-mono">{activeMentor.sessions_completed}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Rating</span>
                  <span className="text-sm font-bold text-amber-300 font-mono flex items-center justify-center space-x-1">
                    <span>{activeMentor.avg_rating}</span>
                    <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Response</span>
                  <span className="text-xs font-bold text-slate-300 font-mono mt-0.5 block">{activeMentor.response_time}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2 transition-all"
                >
                  <Video className="w-4 h-4" />
                  <span>Request Live Session</span>
                </button>

                <button
                  onClick={() => showToast('Full Profile', `Viewing detailed resume for ${activeMentor.name}`, 'info')}
                  className="w-full text-center text-xs font-semibold text-slate-400 hover:text-white py-1 flex items-center justify-center space-x-1 transition-colors"
                >
                  <span>View Full Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Sub-section: More Mentors You Might Like */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                More Mentors You Might Like
              </span>

              <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                {MOCK_MENTORS_LIST.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveMentor(m)}
                    className={`relative p-1 rounded-2xl border transition-all ${
                      activeMentor.id === m.id
                        ? 'border-brand-500 ring-2 ring-brand-500/30'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={m.avatar_url}
                      alt={m.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Live Session Booking Modal */}
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl relative">
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/30">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Book Mentorship Session</h3>
                  <p className="text-xs text-slate-400">With {activeMentor.name}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Select Time Slot
                </label>
                {['Today at 4:00 PM', 'Today at 6:30 PM', 'Tomorrow at 10:00 AM'].map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setBookingDate(slot)}
                    className={`w-full p-3 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                      bookingDate === slot
                        ? 'bg-brand-600/20 text-brand-300 border-brand-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-brand-400" />
                      <span>{slot}</span>
                    </div>
                    {bookingDate === slot && <Check className="w-4 h-4 text-brand-400" />}
                  </button>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-950 text-xs font-semibold text-slate-400 hover:text-white border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30"
                >
                  Confirm Request
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
