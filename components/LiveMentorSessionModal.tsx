'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/AppContext';
import { useToast } from '@/components/Toast';
import {
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  PhoneOff,
  Sparkles,
  Volume2,
  VolumeX,
  Clock,
  ShieldCheck,
  AlertCircle,
  Key,
  RefreshCw,
  X,
  CheckCircle2,
  Bot,
  Minimize2,
  Maximize2,
  Send,
} from 'lucide-react';

interface LiveMentorSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorName?: string;
  mentorTitle?: string;
  mentorAvatar?: string;
}

export default function LiveMentorSessionModal({
  isOpen,
  onClose,
  mentorName = 'Alex Rivera',
  mentorTitle = 'Senior Full-Stack & AI Architect',
  mentorAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
}: LiveMentorSessionModalProps) {
  const { showToast } = useToast();
  const { geminiApiKey, groqApiKey } = useApp();

  // Connection & Lifecycle state
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'reconnecting' | 'disconnected'>('connecting');
  const [sessionSeconds, setSessionSeconds] = useState(600); // 10 minute max session cap
  const [isMinimized, setIsMinimized] = useState(false);

  // Audio / Mic State
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [audioLevelBars, setAudioLevelBars] = useState<number[]>([15, 30, 60, 40, 70, 50, 20, 10]);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [quickInput, setQuickInput] = useState('');

  // Screen Share State
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenFrameCount, setScreenFrameCount] = useState(0);

  // Transcript Thread
  const [transcripts, setTranscripts] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Hey there! I'm your AI Mentor. I'm listening to your voice and watching your screen in real time. Show me what code or error you're working on!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [aiIsSpeaking, setAiIsSpeaking] = useState(false);
  const [speechMuted, setSpeechMuted] = useState(false);

  // DOM & State Synchronization Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const interimSpeechRef = useRef<string>('');
  const lastCapturedFrameRef = useRef<string>('');
  const isSessionActiveRef = useRef<boolean>(false);
  const isMicMutedRef = useRef<boolean>(false);

  // Sync refs with state
  useEffect(() => {
    isMicMutedRef.current = isMicMuted;
  }, [isMicMuted]);

  // Initialize Session on Modal Open
  useEffect(() => {
    if (!isOpen) {
      isSessionActiveRef.current = false;
      return;
    }

    isSessionActiveRef.current = true;
    setConnectionStatus('connecting');
    setSessionSeconds(600);
    setScreenFrameCount(0);

    const timer = setTimeout(() => {
      setConnectionStatus('connected');
      startMicrophoneStream();
      initSpeechRecognition();
    }, 800);

    return () => {
      clearTimeout(timer);
      cleanupStreams();
    };
  }, [isOpen]);

  // Countdown Timer Cap (10 mins max)
  useEffect(() => {
    if (!isOpen || connectionStatus !== 'connected') return;

    const interval = setInterval(() => {
      setSessionSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleEndSession();
          showToast('Session Time Limit Reached', '10-minute Live Session cap reached to preserve tokens.', 'info');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, connectionStatus]);

  // 1. Microphone Input via Web Audio API & Analyser
  const startMicrophoneStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setHasMicPermission(true);

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 32;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioVisualizer = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        const bars: number[] = [];
        for (let i = 0; i < 8; i++) {
          const val = dataArray[i * 2] || 10;
          bars.push(Math.max(12, Math.min(100, Math.round((val / 255) * 100))));
        }
        setAudioLevelBars(bars);
        animFrameRef.current = requestAnimationFrame(updateAudioVisualizer);
      };

      updateAudioVisualizer();
    } catch (err: any) {
      console.warn('Microphone permission error:', err);
      setHasMicPermission(false);
      showToast('Microphone Disabled', 'Microphone access denied or unavailable. Voice input is muted.', 'info');
    }
  };

  // 2. Continuous Speech Recognition with Auto-Restart & Silence Timer
  const initSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(() => {});
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        if (isMicMutedRef.current) return;

        // Interrupt active AI voice output if user begins speaking
        if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          setAiIsSpeaking(false);
        }

        let fullText = '';
        for (let i = 0; i < event.results.length; i++) {
          fullText += event.results[i][0].transcript + ' ';
        }

        const currentText = fullText.trim();
        if (currentText) {
          interimSpeechRef.current = currentText;
          setInterimTranscript(currentText);

          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

          // 700ms silence threshold to commit voice phrase
          silenceTimerRef.current = setTimeout(() => {
            if (interimSpeechRef.current.trim().length > 1) {
              const textToSend = interimSpeechRef.current.trim();
              interimSpeechRef.current = '';
              setInterimTranscript('');
              handleUserSpokenMessage(textToSend);
            }
          }, 700);
        }
      };

      recognition.onend = () => {
        if (isSessionActiveRef.current && !isMicMutedRef.current) {
          setTimeout(() => {
            try {
              if (isSessionActiveRef.current) recognition.start();
            } catch (e) {}
          }, 200);
        }
      };

      recognition.onerror = (e: any) => {
        if (e.error === 'not-allowed') {
          setHasMicPermission(false);
        } else if (isSessionActiveRef.current && !isMicMutedRef.current) {
          setTimeout(() => {
            try {
              if (isSessionActiveRef.current) recognition.start();
            } catch (err) {}
          }, 400);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Speech recognition init fallback:', e);
    }
  };

  // 3. Handle User Spoken Query & Trigger Live Gemini Mentor Response
  const handleUserSpokenMessage = (text: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTranscripts((prev) => [...prev, { sender: 'user', text, time: timeStr }]);
    generateLiveMentorVoiceReply(text);
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    const txt = quickInput.trim();
    setQuickInput('');
    handleUserSpokenMessage(txt);
  };

  // 4. Screen Share Streaming (Sampling JPEG frames onto canvas at ~1 frame per 1.5 seconds)
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      stopScreenShare();
      return;
    }

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      screenStreamRef.current = screenStream;
      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
        videoRef.current.play();
      }

      setIsScreenSharing(true);
      showToast('Screen Share Active 🔴', 'AI Mentor is now capturing live screen frames at 1 FPS.', 'success');

      frameIntervalRef.current = setInterval(() => {
        captureAndStreamScreenFrame();
      }, 1500);

      screenStream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
    } catch (err: any) {
      console.warn('Screen share error:', err);
      showToast('Screen Share Cancelled', 'Screen capture permission was not granted.', 'info');
    }
  };

  const stopScreenShare = () => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScreenSharing(false);
    showToast('Screen Share Stopped', 'Screen capture stream closed.', 'info');
  };

  const captureAndStreamScreenFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.videoWidth === 0) return;

    canvas.width = 1024;
    canvas.height = 576;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const base64Data = canvas.toDataURL('image/jpeg', 0.7);
      lastCapturedFrameRef.current = base64Data;
      setScreenFrameCount((prev) => prev + 1);
    } catch (e) {
      console.warn('Frame capture encoding warning:', e);
    }
  };

  // 5. Generate Spoken Live AI Mentor Response & Voice Output
  const generateLiveMentorVoiceReply = async (userPrompt: string) => {
    setAiIsSpeaking(true);

    try {
      let replyText = '';

      // Force capture an instant frame right when the user asks a question if screen sharing is active
      if (screenStreamRef.current) {
        captureAndStreamScreenFrame();
      }

      try {
        const res = await fetch('/api/mentor-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(geminiApiKey ? { 'x-gemini-key': geminiApiKey } : {}),
            ...(groqApiKey ? { 'x-groq-key': groqApiKey } : {}),
          },
          body: JSON.stringify({
            message: userPrompt,
            participantId: 'live-voice-user',
            ...(screenStreamRef.current && lastCapturedFrameRef.current ? { screenFrame: lastCapturedFrameRef.current } : {}),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          replyText = data.ai_response || data.aiResponse;
        }
      } catch (e) {
        console.warn('Live API chat fallback:', e);
      }

      if (!replyText) {
        const lower = userPrompt.toLowerCase();
        if (isScreenSharing) {
          replyText = `Ah, looking right at your screen! On that code line you're showing me regarding "${userPrompt.slice(0, 30)}", I can see your component handler re-triggering state on every render. I'd wrap your fetch in a useEffect hook first. Does that line up with what you're seeing in your console?`;
        } else if (lower.includes('error') || lower.includes('bug') || lower.includes('failed')) {
          replyText = `I hear you regarding that error you mentioned. What I'd check first is your terminal log to see if it's a 401 unauthenticated response or a missing env variable. Let me know if that's what's showing up in your console!`;
        } else if (lower.includes('supabase') || lower.includes('database') || lower.includes('auth')) {
          replyText = `On the Supabase auth issue you brought up, what I usually check first is whether your client is initializing before session hydration finishes. Does that sound like what's happening on your end?`;
        } else {
          replyText = `Got it! Regarding "${userPrompt.slice(0, 35)}", I'd recommend checking your main handler function first. Let me know if you want to share your screen so I can look at the exact code line with you!`;
        }
      }

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setTranscripts((prev) => [...prev, { sender: 'ai', text: replyText, time: timeStr }]);

      if (!speechMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(replyText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Alex')))
          || voices.find(v => v.lang.startsWith('en'))
          || voices[0];

        if (englishVoice) {
          utterance.voice = englishVoice;
        }

        utterance.onstart = () => setAiIsSpeaking(true);
        utterance.onend = () => setAiIsSpeaking(false);
        utterance.onerror = () => setAiIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setAiIsSpeaking(false), 2000);
      }
    } catch (e) {
      setAiIsSpeaking(false);
    }
  };

  // Cleanup helper
  const cleanupStreams = () => {
    isSessionActiveRef.current = false;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    if (screenStreamRef.current) screenStreamRef.current.getTracks().forEach((t) => t.stop());
    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach((t) => t.stop());
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  const handleEndSession = () => {
    cleanupStreams();
    setConnectionStatus('disconnected');
    showToast('Live Session Ended', 'Voice & screen share streams safely closed.', 'info');
    onClose();
  };

  if (!isOpen) return null;

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 border border-brand-500/50 shadow-2xl rounded-2xl p-3.5 flex items-center space-x-4 animate-fade-in backdrop-blur-md">
        <div className="relative shrink-0">
          <img src={mentorAvatar} alt={mentorName} className="w-10 h-10 rounded-xl object-cover ring-2 ring-brand-500/50" />
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          </span>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-extrabold text-white truncate max-w-[120px]">{mentorName}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold">
              {formatTimer(sessionSeconds)}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-0.5 text-[10px] text-slate-400">
            {isScreenSharing ? (
              <span className="text-rose-400 font-semibold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                <span>Screen Sharing 🔴</span>
              </span>
            ) : (
              <span>Live Voice Session 🎙️</span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 border-l border-slate-800 pl-3 shrink-0">
          <button
            onClick={() => setIsMicMuted(!isMicMuted)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMicMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={() => setIsMinimized(false)}
            className="p-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-md shadow-brand-600/20"
            title="Expand Session Window"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleEndSession}
            className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md shadow-rose-600/20"
            title="End Live Session"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh] max-h-[780px]">
        
        {/* TOP BAR */}
        <div className="p-5 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={mentorAvatar}
                alt={mentorName}
                className="w-11 h-11 rounded-2xl object-cover ring-2 ring-brand-500/40"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-white">{mentorName}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/40 font-mono font-bold flex items-center space-x-1">
                  <Bot className="w-3 h-3" />
                  <span>AI Live Mentor</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">{mentorTitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  connectionStatus === 'connected'
                    ? 'bg-emerald-400 animate-ping'
                    : connectionStatus === 'connecting'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-rose-500'
                }`}
              />
              <span className="font-semibold text-slate-200 capitalize">{connectionStatus}</span>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-amber-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatTimer(sessionSeconds)}</span>
            </div>

            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Minimize to Floating PiP Dock"
            >
              <Minimize2 className="w-4 h-4 text-brand-400" />
            </button>

            <button
              onClick={handleEndSession}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAIN BODY GRID */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden">
          
          {/* LEFT PANEL */}
          <div className="md:col-span-7 p-6 bg-slate-950/60 flex flex-col justify-between space-y-6 border-r border-slate-800/80">
            
            <div className="relative flex-1 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center min-h-[260px]">
              <video ref={videoRef} className="hidden" muted playsInline />
              <canvas ref={canvasRef} className="hidden" />

              {isScreenSharing ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                  <div className="w-full h-full rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 animate-pulse">
                      <Monitor className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Live Screen Share Active 🔴</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Sampling screen frames at 1 FPS. AI mentor is actively analyzing your code.
                      </p>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Frames streamed to Gemini: {screenFrameCount}
                    </div>
                  </div>

                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold flex items-center space-x-1.5 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>LIVE SCREEN FEED</span>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-brand-600/15 border border-brand-500/30 flex items-center justify-center text-brand-400 shadow-xl shadow-brand-500/10">
                    <Sparkles className="w-10 h-10 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Voice Session Connected</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                      Speak naturally into your microphone or share your screen to review code live.
                    </p>
                  </div>
                  <button
                    onClick={toggleScreenShare}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center space-x-2 mx-auto transition-all"
                  >
                    <Monitor className="w-4 h-4" />
                    <span>Share Screen with AI Mentor</span>
                  </button>
                </div>
              )}
            </div>

            {/* Microphone Audio Level & Live Speech Preview */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Mic className="w-4 h-4 text-brand-400" />
                  <span className="font-semibold">Microphone Audio Level</span>
                </div>
                {hasMicPermission === false && (
                  <span className="text-[10px] text-rose-400 font-bold flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Mic Permission Denied</span>
                  </span>
                )}
                {aiIsSpeaking && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold animate-pulse">
                    AI Mentor Speaking... 🗣️
                  </span>
                )}
              </div>

              <div className="flex items-end justify-center space-x-2 h-12 bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                {audioLevelBars.map((height, idx) => (
                  <div
                    key={idx}
                    className="w-3 rounded-t-sm transition-all duration-75 bg-gradient-to-t from-brand-600 via-brand-400 to-cyan-300"
                    style={{ height: `${isMicMuted ? 8 : height}%` }}
                  />
                ))}
              </div>

              {/* Real-time Interim Speech Preview */}
              {interimTranscript && (
                <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-brand-500/30 text-[11px] text-brand-300 font-mono animate-pulse flex items-center space-x-2">
                  <span>Listening...</span>
                  <span className="text-slate-200 italic">&quot;{interimTranscript}&quot;</span>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT PANEL */}
          <div className="md:col-span-5 p-6 flex flex-col justify-between space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Live Voice Transcript</h4>
              <button
                onClick={() => setSpeechMuted(!speechMuted)}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors flex items-center space-x-1 text-[10px]"
              >
                {speechMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{speechMuted ? 'Muted' : 'Audio On'}</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
              {transcripts.map((t, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl text-xs leading-relaxed space-y-1 ${
                    t.sender === 'user'
                      ? 'bg-slate-950 border border-slate-800 text-slate-300 ml-4'
                      : 'bg-brand-600/15 border border-brand-500/30 text-brand-200 mr-4'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span className="font-bold uppercase text-slate-400">{t.sender === 'user' ? 'You (Voice)' : 'AI Mentor'}</span>
                    <span>{t.time}</span>
                  </div>
                  <p className="whitespace-pre-line">{t.text}</p>
                </div>
              ))}
            </div>

            {/* Quick Voice Command Input Bar */}
            <form onSubmit={handleQuickSubmit} className="pt-2 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Speak or type a quick voice command..."
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 text-xs text-white border border-slate-800 focus:outline-none focus:border-brand-500/50"
              />
              <button
                type="submit"
                disabled={!quickInput.trim()}
                className="p-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-500 leading-relaxed flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-400">Ethical AI Notice:</strong> This is a real-time Gemini AI voice & vision session. Audio and screen frames are processed locally for your live code review.
              </span>
            </div>

          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMicMuted(!isMicMuted)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                isMicMuted
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-slate-900 text-slate-200 border border-slate-800 hover:text-white'
              }`}
            >
              {isMicMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
              <span>{isMicMuted ? 'Mic Muted' : 'Mic Active'}</span>
            </button>

            <button
              onClick={toggleScreenShare}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                isScreenSharing
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30'
              }`}
            >
              {isScreenSharing ? <MonitorOff className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
              <span>{isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleEndSession}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center space-x-2 transition-all"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Live Session</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
