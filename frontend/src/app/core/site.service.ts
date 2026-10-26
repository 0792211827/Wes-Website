import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, of, timeout } from 'rxjs';

import { environment } from '../../environments/environment';
import { SITE } from './data/site.data';
import { ColoredTag, FileInfo, SiteResponse } from './models';

/** Same defaults as the API (SiteService.DEFAULTS), used until /api/site answers or if it cannot be reached. */
export const DEFAULT_SETTINGS: Record<string, string> = {
  name: 'Wesley Nyamosi',
  role: 'AI Engineering',
  headline: 'Building [[real value]] in the AI generation.',
  support: 'I build AI systems that turn models into something useful: agents and RAG pipelines, open-weight LLMs deployed locally, and fast inference with engines like vLLM and Ollama.',
  availability: 'open to opportunities',
  showStamp: 'true',
  heroTags: [
    'AI Agents|c-sky', 'RAG|c-green', 'LLMs|c-amber', 'Local Deployment|c-teal', 'vLLM|c-orange', 'Ollama|c-violet', 'Python|c-cream'
  ].join('\n'),
  email: SITE.email,
  whatsapp: '',
  location: '',
  github: SITE.github,
  githubUser: SITE.githubUser,
  linkedin: SITE.linkedin,
  x: SITE.x,
  footerText: 'AI engineering. I build AI systems that create real value in the AI generation. Production matters more than demos.',
  showSampleNotes: 'true',
  'section.github': 'true',
  'section.pillars': 'true',
  'section.philosophy': 'true',
  'section.ask': 'true',
  'section.cta': 'true',
  /* Work page */
  'section.system': 'true'
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

  /** Resolves once the saved settings arrived (or after 3 s), so the hero knows which photo to use. */
  private readyResolve!: () => void;
  readonly ready: Promise<void> = new Promise<void>((r) => { this.readyResolve = r; }).then(() => this.isReady.set(true));
  private loaded = false;
  /** Signal form of `ready`. */
  readonly isReady = signal(false);

  /** Uploaded photo, or the stock placeholder in public/assets. */
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
  readonly x = computed(() => this.text('x'));
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

  /** Is a home or work page section switched on in the admin? */
  show(section: string): boolean {
    return this.flag('section.' + section);
  }
}
