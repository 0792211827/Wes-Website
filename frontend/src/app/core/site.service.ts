import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, of, timeout } from 'rxjs';

import { environment } from '../../environments/environment';
import { SITE } from './data/site.data';
import { ColoredTag, FileInfo, SiteResponse } from './models';

/** Same defaults as the API (SiteService.DEFAULTS), used until /api/site answers or if it cannot be reached. */
export const DEFAULT_SETTINGS: Record<string, string> = {
  name: 'Wesley Nyamosi',
  role: 'AI Engineering & Consulting',
  headline: 'Building AI systems that [[work beyond the demo.]]',
  support: 'I design and build production-ready AI systems and applications that solve real business problems, from strategy and architecture to evaluation, deployment and the infrastructure underneath.',
  availability: 'open to engagements',
  showStamp: 'true',
  building: [
    'an evaluation harness for multi-turn RAG assistants',
    'a self-hosted inference stack for open-weight models',
    'a sub-second voice agent pipeline',
    'agent tool-use guardrails with human approval steps'
  ].join('\n'),
  heroTags: [
    'AI Architecture|c-green', 'Enterprise AI|c-amber', 'RAG & Agents|c-sky', 'LLM Evaluation|c-rose', 'Voice AI|c-violet',
    'Open-Weight LLMs|c-teal', 'vLLM|c-orange', 'Python|c-cream', 'Kubernetes|c-sky', 'PostgreSQL|c-green'
  ].join('\n'),
  tldr: ['AI engineer & consultant', 'RAG, agents, voice & open-weight LLMs', 'evaluation before opinions', 'open to consulting engagements'].join('\n'),
  now: [
    'building: an evaluation harness for multi-turn RAG assistants', 'writing: Evaluating LLM applications',
    'testing: prefix caching on vLLM', 'updated monthly'
  ].join('\n'),
  email: SITE.email,
  phone: '',
  whatsapp: '',
  location: '',
  github: SITE.github,
  githubUser: SITE.githubUser,
  linkedin: SITE.linkedin,
  aboutTitle: 'I build AI systems people can depend on.',
  aboutLede: 'AI engineer and consultant. I work across the whole path from problem to production: strategy, architecture, data, models, applications, evaluation and infrastructure.',
  aboutStory: [
    'I started in software and data engineering, building the backends, pipelines and cloud infrastructure that products run on. When large language models became practical, I saw the same pattern again and again: impressive prototypes that never reached the people they were meant for.',
    'That gap is where I work. I help organizations decide where AI is worth it, design systems that hold up under real use, and measure them honestly. Sometimes that means building an assistant or an agent. Sometimes it means deploying open-weight models on infrastructure the client controls. Sometimes it means advising not to use AI for a problem.'
  ].join('\n\n'),
  aboutBeyond: 'Add a short, personal paragraph here: interests, community work, teaching, or what keeps you curious.',
  footerText: 'AI engineering & consulting. I design and build production-ready AI systems that solve real business problems. Production matters more than demos.',
  showSampleNotes: 'true',
  'section.system': 'true',
  'section.github': 'true',
  'section.philosophy': 'true',
  'section.build': 'true',
  'section.work': 'true',
  'section.lab': 'true',
  'section.writing': 'true',
  'section.ask': 'true',
  'section.cta': 'true',
  /* off by default to keep the home page short (can be switched on in the admin) */
  'section.stats': 'false',
  'section.marquee': 'false',
  'section.howItWorks': 'false'
};

/**
 * Website texts, links, section visibility, profile photo and CV, all editable in the admin.
 * Renders instantly from the defaults, then switches to the saved values from the API.
 */
@Injectable({ providedIn: 'root' })
export class SiteService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  readonly settings = signal<Record<string, string>>({ ...DEFAULT_SETTINGS });
  readonly photoFile = signal<FileInfo | null>(null);
  readonly cvFile = signal<FileInfo | null>(null);

  /** Resolves once the saved settings arrived (or after 3 s), so the portrait knows which photo to use. */
  private readyResolve!: () => void;
  readonly ready: Promise<void> = new Promise<void>((r) => { this.readyResolve = r; });
  private loaded = false;

  /** Uploaded photo, or the static file in public/assets, or nothing. */
  readonly photoUrl = computed(() => {
    const f = this.photoFile();
    return f ? this.base + f.url : SITE.photo;
  });
  /** Uploaded CV, or null when none is uploaded yet (CV buttons are then hidden). */
  readonly cvUrl = computed(() => {
    const f = this.cvFile();
    return f ? this.base + f.url : null;
  });
  readonly email = computed(() => this.text('email'));
  readonly github = computed(() => this.text('github'));
  readonly githubUser = computed(() => this.text('githubUser'));
  readonly linkedin = computed(() => this.text('linkedin'));
  readonly phone = computed(() => this.text('phone'));
  readonly whatsapp = computed(() => {
    const raw = this.text('whatsapp').replace(/[^\d]/g, '');
    return raw ? 'https://wa.me/' + raw : '';
  });
  readonly heroTags = computed<ColoredTag[]>(() =>
    this.lines('heroTags').map((l) => {
      const [label, color] = l.split('|');
      return { label: label.trim(), color: (color || 'c-green').trim() };
    })
  );

  load(): void {
    if (this.loaded) return;
    this.loaded = true;
    setTimeout(() => this.readyResolve(), 3000);
    this.http.get<SiteResponse>(this.base + '/api/site')
      .pipe(timeout(15000), catchError(() => of(null)))
      .subscribe((res) => {
        if (res) this.apply(res);
        this.readyResolve();
      });
  }

  apply(res: SiteResponse): void {
    this.settings.set({ ...DEFAULT_SETTINGS, ...(res.settings || {}) });
    this.photoFile.set(res.photo ?? null);
    this.cvFile.set(res.cv ?? null);
  }

  text(key: string): string {
    return this.settings()[key] ?? DEFAULT_SETTINGS[key] ?? '';
  }

  lines(key: string): string[] {
    return this.text(key).split('\n').map((l) => l.trim()).filter(Boolean);
  }

  flag(key: string): boolean {
    return this.text(key) !== 'false';
  }

  /** Is a home-page section switched on in the admin? */
  show(section: string): boolean {
    return this.flag('section.' + section);
  }
}
