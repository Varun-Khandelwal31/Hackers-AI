'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, MatchedTeam, UserSettings, UserRole, Evaluation } from './types';
import { MOCK_PROJECTS, MOCK_MATCHED_TEAMS } from './seed-data';

import { supabase, dbService } from './supabase';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface MentorSessionRequest {
  id: string;
  mentorName: string;
  date: string;
  status: 'open' | 'confirmed';
  createdAt: string;
}

export interface EvaluationWeights {
  innovation: number;
  technical: number;
  completeness: number;
  ux: number;
}

interface AppContextType {
  projects: Project[];
  matchedTeams: MatchedTeam[];
  mentorMessages: ChatMessage[];
  mentorRequests: MentorSessionRequest[];
  userSettings: UserSettings;
  activeRole: UserRole;
  geminiApiKey: string;
  groqApiKey: string;
  isAuthenticated: boolean;
  isLoaded: boolean;
  evaluationWeights: EvaluationWeights;
  stats: {
    totalProjects: number;
    pendingEvaluations: number;
    activeTeams: number;
    openMentorRequests: number;
  };
  addProject: (project: Omit<Project, 'id' | 'submitted_at'>) => Project;
  updateProjectEvaluation: (projectId: string, evaluation: Evaluation) => void;
  addMentorMessage: (text: string, sender: 'user' | 'ai') => void;
  requestMentorSession: (mentorName: string, date: string) => void;
  acceptTeam: (teamId: string) => void;
  reshuffleTeam: (teamId: string) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  setActiveRole: (role: UserRole) => void;
  setGeminiApiKey: (key: string) => void;
  setGroqApiKey: (key: string) => void;
  setEvaluationWeights: (weights: EvaluationWeights) => void;
  login: (name: string, email: string, role?: UserRole, avatarUrl?: string) => void;
  logout: () => void;
}

const defaultSettings: UserSettings = {
  fullName: 'Varun Khandelwal',
  email: 'varun@hackops.ai',
  bio: 'Full Stack Engineer & Hackathon Judge. Enthusiastic about AI operations and developer tooling.',
  role: 'judge',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  notifications: {
    emailNotifications: true,
    mentorRequests: true,
    teamUpdates: true,
    systemAnnouncements: false,
  },
  connectedAccounts: {
    github: true,
    google: true,
    linkedin: true,
    discord: false,
  },
};

const initialMessages: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'user',
    text: "Hi, I'm working on an AI-based solution for crop disease detection using satellite images. Can you suggest how to improve my model accuracy?",
    timestamp: '10:15 AM',
  },
  {
    id: 'm2',
    sender: 'ai',
    text: `Great project! Here are a few ways to improve your model accuracy:

1. Use more diverse training data from different seasons and regions.
2. Try data augmentation techniques (rotation, scaling, brightness).
3. Consider using ensemble models like EfficientNet + ResNet.
4. Validate with real-time field data for better generalization.

Would you like me to connect you with a mentor who specializes in computer vision for agriculture?`,
    timestamp: '10:16 AM',
  },
  {
    id: 'm3',
    sender: 'user',
    text: 'Yes, that would be really helpful!',
    timestamp: '10:17 AM',
  },
  {
    id: 'm4',
    sender: 'ai',
    text: "I've found a great mentor for you. You can connect with them or schedule a session below.",
    timestamp: '10:17 AM',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [matchedTeams, setMatchedTeams] = useState<MatchedTeam[]>(MOCK_MATCHED_TEAMS);
  const [mentorMessages, setMentorMessages] = useState<ChatMessage[]>(initialMessages);
  const [mentorRequests, setMentorRequests] = useState<MentorSessionRequest[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultSettings);
  const [activeRole, setActiveRole] = useState<UserRole>('judge');
  const [geminiApiKey, setGeminiApiKeyState] = useState<string>('');
  const [groqApiKey, setGroqApiKeyState] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [evaluationWeights, setEvaluationWeightsState] = useState<EvaluationWeights>({
    innovation: 25,
    technical: 25,
    completeness: 25,
    ux: 25,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem('hackops_projects');
      if (savedProjects) setProjects(JSON.parse(savedProjects));

      const savedTeams = localStorage.getItem('hackops_teams');
      if (savedTeams) setMatchedTeams(JSON.parse(savedTeams));

      const savedMessages = localStorage.getItem('hackops_mentor_messages');
      if (savedMessages) setMentorMessages(JSON.parse(savedMessages));

      const savedRequests = localStorage.getItem('hackops_mentor_requests');
      if (savedRequests) setMentorRequests(JSON.parse(savedRequests));

      const savedSettings = localStorage.getItem('hackops_user_settings');
      if (savedSettings) setUserSettings(JSON.parse(savedSettings));

      const savedRole = localStorage.getItem('hackops_active_role');
      if (savedRole) setActiveRole(savedRole as UserRole);

      const savedApiKey = localStorage.getItem('hackops_gemini_api_key');
      if (savedApiKey) setGeminiApiKeyState(savedApiKey);

      const savedGroqKey = localStorage.getItem('hackops_groq_api_key');
      if (savedGroqKey) setGroqApiKeyState(savedGroqKey);

      const savedAuth = localStorage.getItem('hackops_is_auth');
      if (savedAuth !== null) setIsAuthenticated(savedAuth === 'true');

      const savedWeights = localStorage.getItem('hackops_eval_weights');
      if (savedWeights) setEvaluationWeightsState(JSON.parse(savedWeights));
    } catch (e) {
      console.error('Error loading saved state:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync with Supabase Auth Session (Google OAuth & Email/Password)
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setIsAuthenticated(true);
          const email = session.user.email || 'member@hackops.ai';
          const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split('@')[0];
          const avatar = session.user.user_metadata?.avatar_url || `https://unavatar.io/${encodeURIComponent(email)}`;
          const role = (session.user.user_metadata?.role as UserRole) || 'judge';

          setUserSettings((prev) => ({
            ...prev,
            fullName: name,
            email: email,
            avatarUrl: avatar,
            role: role,
            connectedAccounts: { ...prev.connectedAccounts, google: true },
          }));
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
          const email = session.user.email || 'member@hackops.ai';
          const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split('@')[0];
          const avatar = session.user.user_metadata?.avatar_url || `https://unavatar.io/${encodeURIComponent(email)}`;
          const role = (session.user.user_metadata?.role as UserRole) || 'judge';

          setUserSettings((prev) => ({
            ...prev,
            fullName: name,
            email: email,
            avatarUrl: avatar,
            role: role,
            connectedAccounts: { ...prev.connectedAccounts, google: true },
          }));
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('hackops_projects', JSON.stringify(projects));
    } catch (e) {}
  }, [projects, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('hackops_teams', JSON.stringify(matchedTeams));
    } catch (e) {}
  }, [matchedTeams, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('hackops_mentor_messages', JSON.stringify(mentorMessages));
    } catch (e) {}
  }, [mentorMessages, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('hackops_mentor_requests', JSON.stringify(mentorRequests));
    } catch (e) {}
  }, [mentorRequests, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('hackops_user_settings', JSON.stringify(userSettings));
    } catch (e) {}
  }, [userSettings, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('hackops_active_role', activeRole);
    } catch (e) {}
  }, [activeRole, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('hackops_gemini_api_key', geminiApiKey);
    } catch (e) {}
  }, [geminiApiKey, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('hackops_is_auth', isAuthenticated ? 'true' : 'false');
    } catch (e) {}
  }, [isAuthenticated, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('hackops_eval_weights', JSON.stringify(evaluationWeights));
    } catch (e) {}
  }, [evaluationWeights, isLoaded]);

  // Dynamic stats computation
  const stats = {
    totalProjects: projects.length,
    pendingEvaluations: projects.filter((p) => !p.evaluation || p.evaluation.overall_score === 0).length,
    activeTeams: 56 + matchedTeams.filter((t) => t.accepted).length,
    openMentorRequests: 19 + mentorRequests.filter((r) => r.status === 'open').length,
  };

  const addProject = (projectData: Omit<Project, 'id' | 'submitted_at'>): Project => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      submitted_at: 'Just now',
    };
    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  };

  const updateProjectEvaluation = (projectId: string, evaluation: Evaluation) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const currentHistory = p.evaluation_history || [];
        const newHistory = p.evaluation ? [p.evaluation, ...currentHistory] : currentHistory;
        return {
          ...p,
          evaluation,
          evaluation_history: newHistory,
        };
      })
    );
  };

  const addMentorMessage = (text: string, sender: 'user' | 'ai') => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMentorMessages((prev) => [...prev, newMsg]);
  };

  const requestMentorSession = (mentorName: string, date: string) => {
    const newReq: MentorSessionRequest = {
      id: `req-${Date.now()}`,
      mentorName,
      date,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setMentorRequests((prev) => [newReq, ...prev]);
  };

  const acceptTeam = (teamId: string) => {
    setMatchedTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, accepted: true } : t))
    );
  };

  const reshuffleTeam = (teamId: string) => {
    setMatchedTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              matchScore: Math.floor(Math.random() * 8) + 88,
              accepted: false,
            }
          : t
      )
    );
  };

  const updateUserSettings = (newSettings: Partial<UserSettings>) => {
    setUserSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const setGeminiApiKey = (key: string) => {
    setGeminiApiKeyState(key);
  };

  const setGroqApiKey = (key: string) => {
    setGroqApiKeyState(key);
  };

  const setEvaluationWeights = (weights: EvaluationWeights) => {
    setEvaluationWeightsState(weights);
  };

  const login = (name: string, email: string, role: UserRole = 'judge', avatarUrl?: string) => {
    setIsAuthenticated(true);
    setActiveRole(role);
    const computedAvatar = avatarUrl || userSettings.avatarUrl || `https://unavatar.io/${encodeURIComponent(email || name || 'user')}`;
    const newSettings: UserSettings = {
      ...userSettings,
      fullName: name || 'Hackathon Member',
      email: email || 'member@hackops.ai',
      role: role || 'judge',
      avatarUrl: computedAvatar,
      connectedAccounts: {
        ...userSettings.connectedAccounts,
        google: true,
      },
    };
    setUserSettings(newSettings);
    try {
      localStorage.setItem('hackops_is_auth', 'true');
      localStorage.setItem('hackops_active_role', role);
      localStorage.setItem('hackops_user_settings', JSON.stringify(newSettings));
    } catch (e) {}
  };

  const logout = async () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('hackops_is_auth');
      localStorage.removeItem('hackops_user_settings');
      localStorage.removeItem('hackops_active_role');
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        await supabase.auth.signOut();
      }
    } catch (e) {}
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        matchedTeams,
        mentorMessages,
        mentorRequests,
        userSettings,
        activeRole,
        geminiApiKey,
        groqApiKey,
        isAuthenticated,
        isLoaded,
        evaluationWeights,
        stats,
        addProject,
        updateProjectEvaluation,
        addMentorMessage,
        requestMentorSession,
        acceptTeam,
        reshuffleTeam,
        updateUserSettings,
        setActiveRole,
        setGeminiApiKey,
        setGroqApiKey,
        setEvaluationWeights,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
