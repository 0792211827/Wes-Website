import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { AdminService } from '../../core/admin.service';
import { problemMessage } from '../../core/api.service';
import { ContentService } from '../../core/content.service';
import { KnowledgeEntry, LabEntry, Post, Project } from '../../core/models';
import { ToastService } from '../../core/toast.service';

type Kind = 'projects' | 'lab' | 'posts' | 'knowledge';
type Item = Record<string, unknown>;

const KINDS: Array<{ id: Kind; label: string; help: string }> = [
  { id: 'projects', label: 'Case studies', help: 'The projects on the Work page. "featured": true shows a project on the home page.' },
  { id: 'lab', label: 'AI Lab', help: 'Experiments on the AI Lab page.' },
  { id: 'posts', label: 'Articles', help: 'Writing. The body supports simple markdown (## headings, **bold**, lists, `code`).' },
  { id: 'knowledge', label: 'AI chat answers', help: 'What the AI assistant knows. Keywords decide when an answer is used.' }
];

const BLANK: Record<Kind, Item> = {
  projects: {
    slug: 'new-project', title: 'New project', category: 'AI Systems', cat: 'ai', art: 'rag', year: '2026',
    problem: '', outcome: '', metric: { label: '', value: '' }, tech: [], overview: '', context: '', requirements: [],
    arch: [], implementation: '', challenges: [], decisions: [], evaluation: '', results: [], lessons: [], resources: [],
    featured: false, sortOrder: 99
  },
  lab: {
    slug: 'new-experiment', type: 'Benchmark', color: 'c-sky', date: '2026', status: 'Running', title: 'New experiment',
    question: '', method: '', env: [], experiment: '', unit: '', rows: [], analysis: '', conclusion: '', code: '', sortOrder: 99
  },
  posts: { slug: 'new-article', track: 'Engineering', date: '2026', readMinutes: 5, title: 'New article', tags: [], excerpt: '', body: '' },
  knowledge: { key: 'new-topic', title: 'New topic', keywords: '', answer: '', sources: [] }
};

/** Admin: add, edit and delete case studies, lab entries, articles and the AI chat's knowledge. */
@Component({
  selector: 'app-admin-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-block' },
  template: `
    <div class="tabs admin-tabs ad-kinds" role="tablist">
      @for (k of kinds; track k.id) {
        <button type="button" role="tab" [attr.aria-selected]="kind() === k.id" (click)="pick(k.id)">{{ k.label }}</button>
      }
    </div>
    <p class="ad-sub">{{ help() }} Edit the fields in the editor and press Save. The "{{ idField() }}" is the address of the item; changing it saves a copy under the new name.</p>

    <div class="ad-content">
      <aside class="card ad-list">
        <button class="btn btn-sm btn-primary btn-block" type="button" (click)="create()">+ New</button>
        @for (it of items(); track $index) {
          <button type="button" class="ad-item" [class.on]="selected() === idOf(it)" (click)="open(it)">
            <b>{{ it['title'] || idOf(it) }}</b><span>{{ idOf(it) }}</span>
          </button>
        } @empty {
          <p class="empty">Nothing here yet.</p>
        }
      </aside>

      <section class="card ad-editor">
        @if (draft() !== null) {
          <div class="ad-editor-head">
            <b>{{ selected() ? 'Editing ' + selected() : 'New item' }}</b>
            <div class="hero-ctas">
              <button class="btn btn-sm" type="button" (click)="format()">Tidy</button>
              @if (selected()) { <button class="btn btn-sm" type="button" (click)="remove()">Delete</button> }
              <button class="btn btn-sm btn-primary" type="button" (click)="save()" [disabled]="saving()">{{ saving() ? 'Saving…' : 'Save' }}</button>
            </div>
          </div>
          <textarea class="ad-json" spellcheck="false" [value]="draft()" (input)="draft.set($any($event.target).value); error.set('')"
            aria-label="Item editor"></textarea>
          @if (error()) { <p class="form-error" role="alert">{{ error() }}</p> }
        } @else {
          <p class="empty">Pick an item on the left, or press + New.</p>
        }
      </section>
    </div>
  `
})
export class AdminContentComponent {
  private admin = inject(AdminService);
  private content = inject(ContentService);
  private toast = inject(ToastService);

  readonly kinds = KINDS;
  readonly kind = signal<Kind>('projects');
  readonly knowledge = signal<KnowledgeEntry[]>([]);
  readonly selected = signal<string>('');
  readonly draft = signal<string | null>(null);
  readonly error = signal('');
  readonly saving = signal(false);

  readonly help = computed(() => KINDS.find((k) => k.id === this.kind())!.help);
  readonly idField = computed(() => (this.kind() === 'knowledge' ? 'key' : 'slug'));
  readonly items = computed<Item[]>(() => {
    switch (this.kind()) {
      case 'projects': return this.content.projects() as unknown as Item[];
      case 'lab': return this.content.lab() as unknown as Item[];
      case 'posts': return this.content.posts() as unknown as Item[];
      default: return this.knowledge() as unknown as Item[];
    }
  });

  constructor() {
    this.content.refresh();
    this.loadKnowledge();
  }

  idOf(it: Item): string { return String(it[this.idField()] ?? ''); }

  pick(k: Kind): void {
    this.kind.set(k);
    this.selected.set('');
    this.draft.set(null);
    this.error.set('');
  }

  open(it: Item): void {
    this.selected.set(this.idOf(it));
    this.draft.set(JSON.stringify(it, null, 2));
    this.error.set('');
  }

  create(): void {
    this.selected.set('');
    this.draft.set(JSON.stringify(BLANK[this.kind()], null, 2));
    this.error.set('');
  }

  format(): void {
    const v = this.parse();
    if (v) this.draft.set(JSON.stringify(v, null, 2));
  }

  save(): void {
    const v = this.parse();
    if (!v) return;
    const id = String(v[this.idField()] ?? '').trim();
    const ok = this.kind() === 'knowledge' ? id.length > 0 && id.length <= 80 : /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);
    if (!ok) {
      this.error.set(this.kind() === 'knowledge'
        ? 'The "key" is required (up to 80 characters).'
        : 'The "slug" must be lowercase letters, numbers and single dashes, e.g. my-new-project.');
      return;
    }
    let call: Observable<unknown>;
    switch (this.kind()) {
      case 'projects': call = this.admin.saveProject(v as unknown as Project); break;
      case 'lab': call = this.admin.saveLab(v as unknown as LabEntry); break;
      case 'posts': call = this.admin.savePost(v as unknown as Post); break;
      default: call = this.admin.saveKnowledge(v as unknown as KnowledgeEntry);
    }
    this.saving.set(true);
    call.subscribe({
      next: (saved) => {
        this.saving.set(false);
        this.selected.set(id);
        this.draft.set(JSON.stringify(saved, null, 2));
        this.reload();
        this.toast.show('Saved. It is live on the site.');
      },
      error: (err: unknown) => { this.saving.set(false); this.error.set(problemMessage(err, 'Could not save. Check the fields.')); }
    });
  }

  remove(): void {
    const id = this.selected();
    if (!id || !confirm('Delete "' + id + '"? This cannot be undone.')) return;
    let call: Observable<void>;
    switch (this.kind()) {
      case 'projects': call = this.admin.deleteProject(id); break;
      case 'lab': call = this.admin.deleteLab(id); break;
      case 'posts': call = this.admin.deletePost(id); break;
      default: call = this.admin.deleteKnowledge(id);
    }
    call.subscribe({
      next: () => { this.selected.set(''); this.draft.set(null); this.reload(); this.toast.show('Deleted.'); },
      error: (err: unknown) => this.toast.show(problemMessage(err))
    });
  }

  private parse(): Item | null {
    try {
      const v: unknown = JSON.parse(this.draft() ?? '');
      if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error('not an object');
      return v as Item;
    } catch (e) {
      this.error.set('The editor text is not valid JSON: ' + (e instanceof Error ? e.message : 'check quotes and commas') + '.');
      return null;
    }
  }

  private reload(): void {
    if (this.kind() === 'knowledge') this.loadKnowledge();
    else this.content.refresh();
  }

  private loadKnowledge(): void {
    this.admin.knowledge().subscribe({ next: (k) => this.knowledge.set(k), error: () => undefined });
  }
}
