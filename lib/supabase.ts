import { createClient } from '@supabase/supabase-js';
import { MOCK_PROJECTS, MOCK_MENTORS, ROADMAP_FEATURES } from './seed-data';
import { Project, Evaluation, MentorRequest, User } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-hackops.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// In-memory store for fallback operations during demo
let projectsStore: Project[] = [...MOCK_PROJECTS];
let mentorRequestsStore: MentorRequest[] = [];

export const dbService = {
  async getProjects(): Promise<Project[]> {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const { data, error } = await supabase.from('projects').select('*');
        if (!error && data && data.length > 0) {
          return data as Project[];
        }
      }
    } catch (e) {
      console.warn('Supabase fetch bypassed, using in-memory store:', e);
    }
    return projectsStore;
  },

  async getProjectById(id: string): Promise<Project | null> {
    const projects = await this.getProjects();
    return projects.find(p => p.id === id) || null;
  },

  async saveEvaluation(projectId: string, evaluation: Evaluation): Promise<Evaluation> {
    const projIndex = projectsStore.findIndex(p => p.id === projectId);
    if (projIndex !== -1) {
      projectsStore[projIndex] = {
        ...projectsStore[projIndex],
        evaluation,
      };
    }
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        await supabase.from('evaluations').upsert({
          id: evaluation.id,
          project_id: projectId,
          scores: evaluation.scores,
          feedback: evaluation.feedback,
          created_at: evaluation.created_at,
        });
      }
    } catch (e) {
      console.warn('Supabase evaluation save bypassed:', e);
    }
    return evaluation;
  },

  async saveMentorRequest(request: MentorRequest): Promise<MentorRequest> {
    mentorRequestsStore.unshift(request);
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
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
