import { createClient as createBrowserSupabaseClient } from './supabase/client';
import { MOCK_PROJECTS, MOCK_MATCHED_TEAMS } from './seed-data';
import { Project, Evaluation, MentorRequest, MatchedTeam } from './types';

// Browser client using @supabase/ssr
export const supabase = createBrowserSupabaseClient();

// Local fallback store for offline development
let projectsStore: Project[] = [...MOCK_PROJECTS];
let mentorRequestsStore: MentorRequest[] = [];
let teamsStore: MatchedTeam[] = [...MOCK_MATCHED_TEAMS];

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
      console.warn('Supabase fetch projects bypassed, using local store:', e);
    }
    return projectsStore;
  },

  /**
   * Save a new project to Supabase Database
   */
  async saveProject(project: Project): Promise<Project> {
    projectsStore.unshift(project);
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        const { error } = await supabase.from('projects').insert(project);
        if (error) console.warn('Supabase project insert error:', error.message);
      }
    } catch (e) {
      console.warn('Supabase project save bypassed:', e);
    }
    return project;
  },

  /**
   * Fetch all evaluations joined with project information
   */
  async getEvaluations(): Promise<Evaluation[]> {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        const { data, error } = await supabase.from('evaluations').select('*').order('overall_score', { ascending: false });
        if (!error && data && data.length > 0) {
          return data as Evaluation[];
        }
      }
    } catch (e) {
      console.warn('Supabase evaluations fetch bypassed:', e);
    }
    return projectsStore.map(p => p.evaluation).filter(Boolean) as Evaluation[];
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
        evaluation_history: [
          ...(projectsStore[projIndex].evaluation_history || []),
          evaluation,
        ],
      };
    }

    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        const { error } = await supabase.from('evaluations').upsert({
          id: evaluation.id,
          project_id: projectId,
          scores: evaluation.scores,
          overall_score: evaluation.overall_score,
          score_breakdown: evaluation.score_breakdown,
          feedback: evaluation.feedback,
          recommendations: evaluation.recommendations,
          model_used: evaluation.model_used || 'gemini-2.5-flash',
          created_at: evaluation.created_at,
        });

        if (error) console.warn('Supabase evaluation insert error:', error.message);

        await supabase.from('projects').update({ evaluation }).eq('id', projectId);
      }
    } catch (e) {
      console.warn('Supabase evaluation save bypassed:', e);
    }
    return evaluation;
  },

  /**
   * Save a mentor triage request to Supabase Database
   */
  async saveMentorRequest(request: MentorRequest): Promise<MentorRequest> {
    mentorRequestsStore.unshift(request);
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        const { error } = await supabase.from('mentor_requests').insert({
          id: request.id,
          participant_id: request.participant_id,
          participant_name: request.participant_name,
          category: request.category,
          message: request.message,
          ai_response: request.ai_response,
          matched_mentor_id: request.matched_mentor_id,
          status: request.status,
          model_used: request.model_used || 'gemini-2.5-flash',
          created_at: request.created_at,
        });
        if (error) console.warn('Supabase mentor request error:', error.message);
      }
    } catch (e) {
      console.warn('Supabase mentor request save bypassed:', e);
    }
    return request;
  },

  /**
   * Fetch all mentor requests from Supabase Database
   */
  async getMentorRequests(): Promise<MentorRequest[]> {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        const { data, error } = await supabase.from('mentor_requests').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data as MentorRequest[];
        }
      }
    } catch (e) {
      console.warn('Supabase mentor requests fetch error:', e);
    }
    return mentorRequestsStore;
  },

  /**
   * Fetch matched teams
   */
  async getTeams(): Promise<MatchedTeam[]> {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        const { data, error } = await supabase.from('teams').select('*');
        if (!error && data && data.length > 0) {
          return data as MatchedTeam[];
        }
      }
    } catch (e) {
      console.warn('Supabase teams fetch error:', e);
    }
    return teamsStore;
  },

  /**
   * Save a matched team to Supabase
   */
  async saveTeam(team: MatchedTeam): Promise<MatchedTeam> {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        await supabase.from('teams').upsert(team);
      }
    } catch (e) {
      console.warn('Supabase team save error:', e);
    }
    return team;
  }
};

export const dbService = supabaseDbService;
