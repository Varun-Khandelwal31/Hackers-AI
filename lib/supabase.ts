import { createClient } from '@supabase/supabase-js';
import { MOCK_PROJECTS } from './seed-data';
import { Project, Evaluation, MentorRequest } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-hackops.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Local memory store for fallback operations during offline / missing keys
let projectsStore: Project[] = [...MOCK_PROJECTS];
let mentorRequestsStore: MentorRequest[] = [];

export const supabaseDbService = {
  /**
   * Fetch all hackathon projects from Supabase Database
   */
  async getProjects(): Promise<Project[]> {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        const { data, error } = await supabase.from('projects').select('*').order('submitted_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data as Project[];
        }
      }
    } catch (e) {
      console.warn('Supabase fetch bypassed, using local store:', e);
    }
    return projectsStore;
  },

  /**
   * Save a new project to Supabase
   */
  async saveProject(project: Project): Promise<Project> {
    projectsStore.unshift(project);
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        await supabase.from('projects').insert(project);
      }
    } catch (e) {
      console.warn('Supabase project save bypassed:', e);
    }
    return project;
  },

  /**
   * Save or update an evaluation in Supabase Database
   */
  async saveEvaluation(projectId: string, evaluation: Evaluation): Promise<Evaluation> {
    const projIndex = projectsStore.findIndex(p => p.id === projectId);
    if (projIndex !== -1) {
      projectsStore[projIndex] = {
        ...projectsStore[projIndex],
        evaluation,
      };
    }

    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        await supabase.from('evaluations').upsert({
          id: evaluation.id,
          project_id: projectId,
          scores: evaluation.scores,
          overall_score: evaluation.overall_score,
          feedback: evaluation.feedback,
          recommendations: evaluation.recommendations,
          created_at: evaluation.created_at,
        });

        await supabase.from('projects').update({ evaluation }).eq('id', projectId);
      }
    } catch (e) {
      console.warn('Supabase evaluation save bypassed:', e);
    }
    return evaluation;
  },

  /**
   * Save a mentor triage request to Supabase
   */
  async saveMentorRequest(request: MentorRequest): Promise<MentorRequest> {
    mentorRequestsStore.unshift(request);
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        await supabase.from('mentor_requests').insert({
          id: request.id,
          participant_id: request.participant_id,
          category: request.category,
          message: request.message,
          ai_response: request.ai_response,
          matched_mentor_id: request.matched_mentor_id,
          status: request.status,
          created_at: request.created_at,
        });
      }
    } catch (e) {
      console.warn('Supabase mentor request save bypassed:', e);
    }
    return request;
  },

  async getMentorRequests(): Promise<MentorRequest[]> {
    return mentorRequestsStore;
  }
};

export const dbService = supabaseDbService;
