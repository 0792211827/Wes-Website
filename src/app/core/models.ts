/* Types shared by the whole app. Content types match the Spring Boot DTOs exactly (see API_CONTRACT.md). */

export interface Pair {
  label: string;
  value: string;
}

export interface Decision {
  title: string;
  body: string;
  tradeoff: string;
}

export interface LabRow {
  label: string;
  value: number;
  pct: number;
}

export interface SourceLink {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  cat: string;
  art: string;
  year: string;
  problem: string;
  outcome: string;
  metric: Pair;
  tech: string[];
  overview: string;
  context: string;
  requirements: string[];
  arch: string[];
  implementation: string;
  challenges: string[];
  decisions: Decision[];
  evaluation: string;
  results: Pair[];
  lessons: string[];
  resources: string[];
  featured: boolean;
  sortOrder: number;
}

export interface LabEntry {
  slug: string;
  type: string;
  color: string;
  date: string;
  status: string;
  title: string;
  question: string;
  method: string;
  env: Pair[];
  experiment: string;
  unit: string;
  rows: LabRow[];
  analysis: string;
  conclusion: string;
  code: string;
  sortOrder: number;
}

export interface Post {
  slug: string;
  track: string;
  date: string;
  readMinutes: number;
  title: string;
  tags: string[];
  excerpt: string;
  body: string;
}

export interface KnowledgeEntry {
  key: string;
  title: string;
  keywords: string;
  answer: string;
  sources: SourceLink[];
}

/* ---------- site copy ---------- */
export interface SiteInfo {
  name: string;
  role: string;
  email: string;
  github: string;
  githubUser: string;
  linkedin: string;
  cv: string;
  photo: string;
  url: string;
}

export interface ColoredTag {
  label: string;
  color: string;
}

export interface TitledText {
  title: string;
  text: string;
}

export interface Capability {
  id: string;
  title: string;
  color: string;
  icon: string;
  desc: string;
  tags: string[];
}

export interface KeyLabel {
  key: string;
  label: string;
}

export interface Service {
  title: string;
  icon: string;
  desc: string;
  items: string[];
  outcome: string;
}

export interface EngagementFormat {
  title: string;
  duration: string;
  text: string;
  cta: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface TimelineItem {
  when: string;
  title: string;
  text: string;
  now: boolean;
}

/* ---------- API ---------- */
export interface ContactRequest {
  name: string;
  email: string;
  company: string;
  role: string;
  services: string[];
  problem: string;
  budget: string | null;
  timeline: string | null;
  website: string;
}

export interface ContactResponse {
  id: number;
  message: string;
}

export interface AskResponse {
  answer: string;
  sources: SourceLink[];
  grounded: boolean;
  fallback: boolean;
  mode: string;
  trace: string;
  remaining: number;
}

export interface GithubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork?: boolean;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface Contributions {
  total: Record<string, number>;
  contributions: ContributionDay[];
}

/* ---------- admin ---------- */
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'WON' | 'LOST' | 'ARCHIVED';

export interface Lead {
  id: number;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  services: string[];
  problem: string;
  budget: string | null;
  timeline: string | null;
  status: LeadStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface AskLog {
  id: number;
  question: string;
  mode: string;
  topKey: string | null;
  score: number;
  fallback: boolean;
  latencyMs: number;
  createdAt: string;
}

export interface AdminStats {
  leads: number;
  newLeads: number;
  questions: number;
  fallbackRate: number;
  projects: number;
  labEntries: number;
  posts: number;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
}
