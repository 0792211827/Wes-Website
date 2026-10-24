/* Types shared by the whole app. Content types match the Spring Boot DTOs exactly (see docs/API_CONTRACT.md). */

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

/** One step of an animated "How it works" walkthrough. */
export interface HowStep {
  title: string;
  text: string;
  stat?: string;
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
  /** Two suggested next questions (newer API versions). */
  followUps?: string[];
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

/* ---------- site settings & files (admin-editable) ---------- */
export interface FileInfo {
  key: string;
  filename: string;
  contentType: string;
  size: number;
  updatedAt: string;
  url: string;
}

export interface SiteResponse {
  settings: Record<string, string>;
  photo: FileInfo | null;
  cv: FileInfo | null;
}

/* ---------- visitor workspace ---------- */
export interface CountItem { label: string; count: number; }
export interface DayPoint { day: string; visitors: number; pageViews: number; }

export interface AnalyticsSummary {
  days: number;
  visitors: number;
  newVisitors: number;
  sessions: number;
  pageViews: number;
  activeNow: number;
  avgSessionSeconds: number;
  avgPageSeconds: number;
  bounceRate: number;
  cvDownloads: number;
  questions: number;
  contacts: number;
  outboundClicks: number;
  timeline: DayPoint[];
  topPages: CountItem[];
  countries: CountItem[];
  cities: CountItem[];
  devices: CountItem[];
  browsers: CountItem[];
  systems: CountItem[];
  referrers: CountItem[];
  actions: CountItem[];
}

export interface VisitSession {
  sessionId: string;
  visitorId: string | null;
  returning: boolean;
  start: string;
  end: string;
  durationSeconds: number;
  pageViews: number;
  events: number;
  entryPage: string | null;
  exitPage: string | null;
  referrer: string | null;
  ip: string | null;
  country: string | null;
  countryCode: string | null;
  region: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  isp: string | null;
  deviceType: string | null;
  browser: string | null;
  os: string | null;
  screen: string | null;
  language: string | null;
  timezone: string | null;
  actions: string[];
}

export interface VisitEvent {
  id: number;
  at: string;
  type: string;
  path: string | null;
  title: string | null;
  label: string | null;
  durationMs: number | null;
  referrer: string | null;
}

export interface SessionDetail {
  session: VisitSession;
  events: VisitEvent[];
  otherSessions: VisitSession[];
}
