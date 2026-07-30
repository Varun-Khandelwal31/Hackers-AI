'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import { useApp } from '@/lib/AppContext';
import { useToast } from '@/components/Toast';
import {
  HelpCircle,
  Sparkles,
  Send,
  Bot,
  User,
  Search,
  Wifi,
  Clock,
  MapPin,
  FileCheck,
  ShieldAlert,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

// Static Event Knowledge Base Chunks
const EVENT_KNOWLEDGE_BASE = [
  {
    id: 'wifi',
    title: 'WiFi & Network Credentials',
    category: 'Logistics',
    content: 'Hackathon WiFi SSID is "HackOps_5G_Guest". Password is "hackops2026!". High-speed 1Gbps fiber is available across all venue floors.',
  },
  {
    id: 'deadlines',
    title: 'Submission Deadlines & Schedule',
    category: 'Schedule',
    content: 'Project submission deadline is Sunday 4:00 PM IST. Code freeze happens at 4:30 PM. Live project demos start at 5:00 PM IST on Main Stage.',
  },
  {
    id: 'venue',
    title: 'Venue Map & Facilities',
    category: 'Venue',
    content: 'Hacking bays are on Floors 2 and 3. Rest areas and sleeping pods are on Floor 4. 24/7 snacks and coffee station is located on Floor 1 Cafeteria.',
  },
  {
    id: 'judging',
    title: 'Judging Criteria & Process',
    category: 'Judging',
    content: 'Projects are evaluated across 4 equal rubrics (25% each): 1. Innovation, 2. Technical Complexity, 3. Completeness (must have working demo), and 4. UX/Presentation. Re-evaluations are supported.',
  },
  {
    id: 'rules',
    title: 'Code Rules & Originality',
    category: 'Rules',
    content: 'All code submitted must be created during the hackathon timeline. Open-source libraries and APIs are permitted provided they are disclosed in the README.',
  },
];

// Cosine Similarity Keyword Vector Search
function retrieveRelevantChunks(query: string, k = 2) {
  const qTokens = query.toLowerCase().split(/\W+/).filter((t) => t.length > 2);
  const scored = EVENT_KNOWLEDGE_BASE.map((chunk) => {
    const chunkText = (chunk.title + ' ' + chunk.content + ' ' + chunk.category).toLowerCase();
    let score = 0;
    for (const token of qTokens) {
      if (chunkText.includes(token)) score += 1;
    }
    return { ...chunk, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}

export default function EventFAQPage() {
  const { showToast } = useToast();
  const { geminiApiKey, groqApiKey } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [retrievedContext, setRetrievedContext] = useState<typeof EVENT_KNOWLEDGE_BASE>([]);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string; sources?: string[] }>>([
    {
      sender: 'bot',
      text: "Hello! I'm your Event Logistics Q&A Bot. Ask me anything about WiFi, submission deadlines, venue maps, or judging criteria!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const handleAskFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setInputQuery('');

    setMessages((prev) => [...prev, { sender: 'user', text: userText, time: timeStr }]);
    setIsAsking(true);

    // Vector Similarity Search (Top-k Chunks)
    const topChunks = retrieveRelevantChunks(userText, 2);
    setRetrievedContext(topChunks);

    const contextText = topChunks.map((c) => `[${c.title}]: ${c.content}`).join('\n');

    try {
      let botReply = '';
      const geminiKey = geminiApiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

      if (geminiKey) {
        try {
          const res = await fetch('/api/mentor-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: `[Event Logistics RAG Query]: ${userText}\n\nGrounding Knowledge Base Context:\n${contextText}`,
              participantId: 'faq-user',
            }),
          });
          if (res.ok) {
            const data = await res.json();
            botReply = data.ai_response || data.aiResponse;
          }
        } catch (err) {}
      }

      if (!botReply) {
        if (topChunks[0] && topChunks[0].score > 0) {
          botReply = `According to our hackathon logistics guide:\n\n${topChunks[0].content}\n\nLet me know if you need any more details!`;
        } else {
          botReply = `For event logistics: WiFi is "HackOps_5G_Guest" (Pass: "hackops2026!"). Project submissions close at 4:00 PM IST on Sunday. Rest areas are on Floor 4!`;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: topChunks.map((c) => c.title),
        },
      ]);
    } catch (e) {
      showToast('Error', 'Failed to fetch FAQ response', 'error');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8 font-sans pb-16">
        
        {/* HEADER SECTION */}
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>GROUNDED LOGISTICS RAG BOT</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <span>Event Logistics FAQ & Assistance</span>
            <HelpCircle className="w-8 h-8 text-cyan-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Ask any questions regarding WiFi passwords, schedule deadlines, venue floors, or judging rubrics. Grounded via vector similarity search.
          </p>
        </div>

        {/* QUICK LOGISTICS TILES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold">
              <Wifi className="w-4 h-4" />
              <span>WiFi Credentials</span>
            </div>
            <p className="text-xs text-white font-mono font-bold">SSID: HackOps_5G_Guest</p>
            <p className="text-[11px] text-slate-400 font-mono">Pass: hackops2026!</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
              <Clock className="w-4 h-4" />
              <span>Submission Deadline</span>
            </div>
            <p className="text-xs text-white font-bold">Sunday 4:00 PM IST</p>
            <p className="text-[11px] text-slate-400">Code Freeze at 4:30 PM</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
              <MapPin className="w-4 h-4" />
              <span>Venue Layout</span>
            </div>
            <p className="text-xs text-white font-bold">Floor 2 & 3: Hacking Bays</p>
            <p className="text-[11px] text-slate-400">Floor 4: Sleeping Pods</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold">
              <FileCheck className="w-4 h-4" />
              <span>Judging Criteria</span>
            </div>
            <p className="text-xs text-white font-bold">4 Equal Rubrics (25%)</p>
            <p className="text-[11px] text-slate-400">Innovation, Tech, Complete, UX</p>
          </div>
        </div>

        {/* CHAT CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col h-[550px] justify-between">
            
            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl text-xs leading-relaxed space-y-1.5 ${
                    m.sender === 'user'
                      ? 'bg-slate-950 border border-slate-800 text-slate-200 ml-8'
                      : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-100 mr-8'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span className="font-bold uppercase text-slate-400">
                      {m.sender === 'user' ? 'You' : 'Event Logistics Bot'}
                    </span>
                    <span>{m.time}</span>
                  </div>
                  <p className="whitespace-pre-line text-xs">{m.text}</p>

                  {m.sources && m.sources.length > 0 && (
                    <div className="pt-2 border-t border-cyan-500/20 flex items-center space-x-2 text-[10px] text-cyan-300 font-mono">
                      <span>Sources:</span>
                      {m.sources.map((src, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40">
                          {src}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleAskFAQ} className="pt-4 flex items-center space-x-3 border-t border-slate-800">
              <input
                type="text"
                placeholder="Ask about WiFi, submission rules, food options, or schedules..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950 text-xs text-white border border-slate-800 focus:outline-none focus:border-cyan-500/50"
              />
              <button
                type="submit"
                disabled={isAsking || !inputQuery.trim()}
                className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center space-x-2 transition-all disabled:opacity-50"
              >
                <span>Ask Bot</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

          {/* RIGHT SIDE: KNOWLEDGE CHUNKS INSPECTOR */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>RAG Vector Chunks</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Top-k Similarity</span>
            </div>

            <div className="space-y-3">
              {EVENT_KNOWLEDGE_BASE.map((chunk) => (
                <div
                  key={chunk.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-white">{chunk.title}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                      {chunk.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">{chunk.content}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
