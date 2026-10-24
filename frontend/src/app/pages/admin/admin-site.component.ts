import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminService } from '../../core/admin.service';
import { problemMessage } from '../../core/api.service';
import { DEFAULT_SETTINGS, SiteService } from '../../core/site.service';
import { ToastService } from '../../core/toast.service';

interface Field {
  key: string;
  label: string;
  hint?: string;
  kind: 'text' | 'area' | 'toggle';
}

const GROUPS: Array<{ title: string; text: string; fields: Field[] }> = [
  {
    title: 'Hero (top of the home page)', text: 'The first thing visitors see.', fields: [
      { key: 'name', label: 'Name', kind: 'text' },
      { key: 'role', label: 'Role line', kind: 'text' },
      { key: 'headline', label: 'Headline', hint: 'Wrap the highlighted words in double square brackets, e.g. Building AI systems that [[work beyond the demo.]]', kind: 'text' },
      { key: 'support', label: 'Supporting text', kind: 'area' },
      { key: 'availability', label: 'Stamp text', hint: 'The rotated stamp next to the name, e.g. open to engagements', kind: 'text' },
      { key: 'showStamp', label: 'Show the stamp', kind: 'toggle' },
      { key: 'building', label: '"Currently building" lines', hint: 'One per line; they type in one after another.', kind: 'area' },
      { key: 'heroTags', label: 'Skill tags', hint: 'One per line as Label|colour. Colours: c-green, c-amber, c-sky, c-rose, c-violet, c-teal, c-orange, c-cream', kind: 'area' },
      { key: 'tldr', label: '"tl;dr" tab', hint: 'One point per line.', kind: 'area' },
      { key: 'now', label: '"now" tab', hint: 'One point per line.', kind: 'area' }
    ]
  },
  {
    title: 'Contact & links', text: 'Used in the hero, footer, contact page and the AI chat.', fields: [
      { key: 'email', label: 'Email', kind: 'text' },
      { key: 'phone', label: 'Phone', hint: 'Optional, shown on the contact page. Leave empty to hide.', kind: 'text' },
      { key: 'whatsapp', label: 'WhatsApp number', hint: 'Optional, international format without +, e.g. 254712345678. Adds WhatsApp buttons.', kind: 'text' },
      { key: 'location', label: 'Location', hint: 'Optional.', kind: 'text' },
      { key: 'github', label: 'GitHub profile URL', kind: 'text' },
      { key: 'githubUser', label: 'GitHub username (label)', kind: 'text' },
      { key: 'linkedin', label: 'LinkedIn URL', kind: 'text' }
    ]
  },
  {
    title: 'About page', text: '', fields: [
      { key: 'aboutTitle', label: 'Title', kind: 'text' },
      { key: 'aboutLede', label: 'Intro', kind: 'area' },
      { key: 'aboutStory', label: 'Story', hint: 'Leave an empty line between paragraphs.', kind: 'area' },
      { key: 'aboutBeyond', label: 'Outside of work', kind: 'area' }
    ]
  },
  {
    title: 'Footer', text: '', fields: [
      { key: 'footerText', label: 'Footer text', kind: 'area' }
    ]
  },
  {
    title: 'What is visible', text: 'Switch home-page sections and the "sample content" notes on or off.', fields: [
      { key: 'showSampleNotes', label: '"Sample content" notes on work, lab and articles', kind: 'toggle' },
      { key: 'section.system', label: 'Live system diagram', kind: 'toggle' },
      { key: 'section.github', label: 'GitHub activity', kind: 'toggle' },
      { key: 'section.marquee', label: 'Scrolling tech strip', kind: 'toggle' },
      { key: 'section.stats', label: 'Numbers band', kind: 'toggle' },
      { key: 'section.philosophy', label: 'Philosophy (Production matters…)', kind: 'toggle' },
      { key: 'section.build', label: 'What I Build', kind: 'toggle' },
      { key: 'section.work', label: 'Selected work', kind: 'toggle' },
      { key: 'section.howItWorks', label: 'How it works walkthrough', kind: 'toggle' },
      { key: 'section.lab', label: 'AI Lab preview', kind: 'toggle' },
      { key: 'section.writing', label: 'Writing preview', kind: 'toggle' },
      { key: 'section.ask', label: 'Ask my AI teaser', kind: 'toggle' },
      { key: 'section.cta', label: 'Closing call to action', kind: 'toggle' }
    ]
  }
];

/** Admin: edit the website's texts, links and which sections are visible. Changes go live immediately. */
@Component({
  selector: 'app-admin-site',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-block' },
  template: `
    <div class="ws-toolbar">
      <p class="prose-font" style="color:var(--text-2)">Edit what visitors see. Saved changes appear on the site straight away.</p>
      <div class="ws-tools">
        <a class="btn btn-sm" routerLink="/" target="_blank">View site ↗</a>
        <button class="btn btn-sm" type="button" (click)="discard()" [disabled]="!dirty()">Discard</button>
        <button class="btn btn-sm btn-primary" type="button" (click)="save()" [disabled]="!dirty() || saving()">
          {{ saving() ? 'Saving…' : 'Save changes' + (dirty() ? ' (' + changedCount() + ')' : '') }}
        </button>
      </div>
    </div>

    @for (g of groups; track g.title) {
      <section class="card ad-group">
        <h3>{{ g.title }}</h3>
        @if (g.text) { <p class="ad-sub">{{ g.text }}</p> }
        <div class="ad-fields">
          @for (f of g.fields; track f.key) {
            @if (f.kind === 'toggle') {
              <label class="ad-toggle">
                <input type="checkbox" [checked]="value(f.key) !== 'false'" (change)="toggle(f.key)">
                <span class="ad-switch" aria-hidden="true"></span>
                <span>{{ f.label }}</span>
              </label>
            } @else {
              <div class="field" [class.ad-wide]="f.kind === 'area'">
                <label [attr.for]="'set-' + f.key">{{ f.label }} @if (changed(f.key)) { <span class="ad-dot">● edited</span> }</label>
                @if (f.kind === 'area') {
                  <textarea [id]="'set-' + f.key" rows="4" [value]="value(f.key)" (input)="edit(f.key, $event)"></textarea>
                } @else {
                  <input [id]="'set-' + f.key" [value]="value(f.key)" (input)="edit(f.key, $event)">
                }
                @if (f.hint) { <span class="hint">{{ f.hint }}</span> }
              </div>
            }
          }
        </div>
      </section>
    }

    <div class="ad-danger">
      <button class="btn btn-sm" type="button" (click)="resetAll()">Reset every setting to the original text</button>
    </div>
  `
})
export class AdminSiteComponent {
  private admin = inject(AdminService);
  private site = inject(SiteService);
  private toast = inject(ToastService);

  readonly groups = GROUPS;
  /** Saved values from the API. */
  readonly saved = signal<Record<string, string>>({ ...DEFAULT_SETTINGS });
  /** Unsaved edits. */
  readonly edits = signal<Record<string, string>>({});
  readonly saving = signal(false);
  readonly changedCount = computed(() => Object.keys(this.edits()).length);
  readonly dirty = computed(() => this.changedCount() > 0);

  constructor() {
    this.admin.site().subscribe({
      next: (res) => { this.saved.set({ ...DEFAULT_SETTINGS, ...res.settings }); this.site.apply(res); },
      error: (err: unknown) => this.toast.show(problemMessage(err, 'Could not load the settings.'))
    });
  }

  value(key: string): string {
    const e = this.edits();
    return key in e ? e[key] : this.saved()[key] ?? '';
  }

  changed(key: string): boolean { return key in this.edits(); }

  edit(key: string, ev: Event): void {
    this.set(key, (ev.target as HTMLInputElement | HTMLTextAreaElement).value);
  }

  toggle(key: string): void {
    this.set(key, this.value(key) === 'false' ? 'true' : 'false');
  }

  private set(key: string, v: string): void {
    this.edits.update((e) => {
      const next = { ...e };
      if (v === (this.saved()[key] ?? '')) delete next[key];
      else next[key] = v;
      return next;
    });
  }

  discard(): void { this.edits.set({}); }

  save(): void {
    this.saving.set(true);
    this.admin.updateSite(this.edits()).subscribe({
      next: (res) => {
        this.saving.set(false);
        this.saved.set({ ...DEFAULT_SETTINGS, ...res.settings });
        this.edits.set({});
        this.site.apply(res);
        this.toast.show('Saved. The website is updated.');
      },
      error: (err: unknown) => { this.saving.set(false); this.toast.show(problemMessage(err, 'Could not save.')); }
    });
  }

  resetAll(): void {
    if (!confirm('Reset every text, link and section switch to the original version?')) return;
    this.admin.resetSite().subscribe({
      next: (res) => {
        this.saved.set({ ...DEFAULT_SETTINGS, ...res.settings });
        this.edits.set({});
        this.site.apply(res);
        this.toast.show('All settings reset.');
      },
      error: (err: unknown) => this.toast.show(problemMessage(err))
    });
  }
}
