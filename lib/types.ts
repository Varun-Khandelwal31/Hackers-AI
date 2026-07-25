export type UserRole = 'participant' | 'mentor' | 'judge' | 'sponsor' | 'organizer';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'lead';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  skills: string[]; // Skill list for team matching
  expertise_tags: string[]; // Domain expertise for mentor matching
  experience_level: ExperienceLevel;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

export interface MatchedTeamMember {
  name: string;
  role: string;
  avatar_url?: string;
}

export interface MatchedTeam {
  id: string;
  name: string;
  matchScore: number; // percentage (e.g. 92)
  badge?: string; // e.g. "Best Match"
  members: MatchedTeamMember[];
  skillBreakdown: {
    design: number;
    frontend: number;
    backend: number;
    ml: number;
  };
  accepted?: boolean;
}

export interface Team {
  id: string;
  name: string;
  member_ids: string[];
  members?: User[];
  problem_statement: string;
  created_at: string;
}

export interface Project {
  id: string;
  team_id: string;
  team_name: string;
  title: string;
  tag_line: string;
  repo_url: string;
  readme_text: string;
  file_tree: string;
  demo_video_url?: string;
  submitted_at: string;
  tags: string[];
  category: string;
  team_size: number;
  evaluation?: Evaluation;
  badge?: string; // e.g. 'Finalist'
  cover_image?: string;
}

export interface EvaluationScores {
  innovation: number;
  technical: number;
  completeness: number;
  ux: number;
}

export interface ScoreDetail {
  score: number;
  maxScore: number;
  explanation: string;
}

export interface Evaluation {
  id: string;
  project_id: string;
  scores: EvaluationScores;
  overall_score: number;
  score_breakdown?: {
    innovation: ScoreDetail;
    technical: ScoreDetail;
    completeness: ScoreDetail;
    ux: ScoreDetail;
  };
  feedback: string;
  recommendations: string[];
  created_at: string;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  status: 'Open' | 'Busy' | 'Offline';
  tags: string[];
  experience_years: number;
  about: string;
  sessions_completed: number;
  avg_rating: number;
  response_time: string;
  avatar_url: string;
}

export interface MentorRequest {
  id: string;
  participant_id: string;
  participant_name: string;
  category: string;
  message: string;
  ai_response: string;
  matched_mentor_id: string;
  matched_mentor?: User;
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
}

export interface UserSettings {
  fullName: string;
  email: string;
  bio: string;
  role: UserRole;
  avatarUrl: string;
  notifications: {
    emailNotifications: boolean;
    mentorRequests: boolean;
    teamUpdates: boolean;
    systemAnnouncements: boolean;
  };
  connectedAccounts: {
    github: boolean;
    google: boolean;
    linkedin: boolean;
    discord: boolean;
  };
}

export interface RoadmapFeature {
  id: string;
  name: string;
  description: string;
  tier: 1 | 2;
  category: string;
  icon_name?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}
