export interface SubScores {
  apt: number;
  code: number;
  tech: number;
  interview: number;
  resume: number;
}

export interface ResumeItem {
  id: string;
  name: string;
  uploadedAt: string;
  size: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  ip: string;
  location: string;
  active: boolean;
  lastActive: string;
}

export interface LoginHistoryItem {
  date: string;
  status: string;
  ip: string;
  device: string;
}

export interface StudentProfile {
  name: string;
  college: string;
  branch: string;
  roll: string;
  gpa: number;
  backlogs: number;
  readiness: number;
  subScores: SubScores;
  drives: Record<string, string>;
  packageVisibility?: 'public' | 'private';
  
  // Phase 12 fields
  mobile?: string;
  personalEmail?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  profilePhoto?: string;
  
  resumes?: ResumeItem[];
  defaultResumeId?: string;
  
  notifications?: Record<string, boolean>;
  
  sessions?: ActiveSession[];
  loginHistory?: LoginHistoryItem[];
  twoFactorEnabled?: boolean;
  
  appearance?: 'light' | 'dark' | 'system';
}

export interface FunnelStep {
  name: string;
  date: string;
}

export interface RecruitmentDrive {
  companyId: string;
  companyName: string;
  avatar: string;
  role: string;
  package: string;
  minGpa: number;
  eventType: string;
  statusType: 'deadline' | 'exam' | 'open' | 'shortlisted';
  criteria: string;
  description: string;
  funnel: FunnelStep[];
}

export interface PrepModule {
  id: string;
  name: string;
  desc: string;
  icon: string; // SVG string
  cta: string;
  getProgress: (p: StudentProfile) => string;
  getProgressPercent: (p: StudentProfile) => number;
}

export type WalkthroughFeatureId = 'coding' | 'technical' | 'mock' | 'resume';

export interface WalkthroughFeature {
  id: WalkthroughFeatureId;
  title: string;
  subtitle: string;
  gradientClass: string;
}
