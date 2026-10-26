import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';

import { ContentService } from '../core/content.service';
import { SeoService } from '../core/seo.service';
import { IconComponent } from '../shared/icon.component';
import { PostRowComponent } from '../shared/cards';
import { PageHeadComponent } from '../shared/page-head.component';

@Component({
  selector: 'app-writing-page',
  imports: [PageHeadComponent, PostRowComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    <app-page-head [crumbs]="[{ label: 'blogs' }]" title="Blogs"
      lede="Two tracks: engineering deep-dives for builders, and executive notes for people deciding where AI fits." />
    <section class="section">
      <div class="wrap">
        <div class="toolbar">
          <div class="tabs" role="tablist" aria-label="Track">
            @for (t of tracks; track t) {
              <button type="button" role="tab" [attr.aria-selected]="track() === t" (click)="track.set(t)">{{ t }}</button>
            }
          </div>
          <label class="search">
            <app-icon name="search" />
            <span class="sr">Search articles</span>
            <input type="search" placeholder="Search articles…" autocomplete="off" [value]="text()" (input)="onSearch($event)">
          </label>
        </div>
        <div class="chips" style="margin-bottom:18px">
          @for (t of tags(); track t) {
            <button class="chip tag-btn" type="button" [attr.aria-pressed]="tag() === t" (click)="tag.set(tag() === t ? '' : t)">#{{ t }}</button>
          }
        </div>
        <div class="related">
          @for (p of shown(); track p.slug) {
            <app-post-row [post]="p" />
          }
        </div>
        @if (!shown().length) {
          <p class="empty">No articles match. Try another search or tag.</p>
        }
      </div>
    </section>
  `
})
export class WritingPage {
  private content = inject(ContentService);
  readonly trackParam = input<string | undefined>(undefined, { alias: 'track' });
  readonly tracks = ['all', 'engineering', 'executive'];
  readonly track = signal('all');
  readonly tag = signal('');
  readonly text = signal('');
  readonly tags = computed(() => Array.from(new Set(this.content.posts().flatMap((p) => p.tags))).sort());
  readonly shown = computed(() => {
    const t = this.text().toLowerCase();
    return this.content.posts().filter((p) =>
      (this.track() === 'all' || p.track === this.track()) &&
      (!this.tag() || p.tags.includes(this.tag())) &&
      (!t || (p.title + ' ' + p.excerpt + ' ' + p.tags.join(' ')).toLowerCase().includes(t)));
  });

  constructor() {
    inject(SeoService).set('Blogs', 'Articles on building RAG, evaluating LLM applications, deploying open-weight models, voice AI and AI strategy.', '/blogs');
    effect(() => {
      const q = this.trackParam();
      if (q && this.tracks.includes(q)) this.track.set(q);
    });
  }

  onSearch(e: Event): void {
    this.text.set((e.target as HTMLInputElement).value.trim());
  }
}
