import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';

import { ContentService } from '../core/content.service';
import { WORK_CATS } from '../core/data/site.data';
import { SeoService } from '../core/seo.service';
import { WorkCardComponent } from '../shared/cards';
import { CtaBandComponent } from '../shared/cta-band.component';
import { PageHeadComponent } from '../shared/page-head.component';

@Component({
  selector: 'app-work-page',
  imports: [PageHeadComponent, WorkCardComponent, CtaBandComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    <app-page-head [crumbs]="[{ label: 'home', link: '/' }, { label: 'work' }]" title="Selected work"
      lede="Case studies with the problem, architecture, decisions, evaluation and results. Client names are withheld; the engineering is not."
      note="Sample case studies: replace with Wesley's real projects before launch." />
    <section class="section">
      <div class="wrap">
        <div class="filters" role="group" aria-label="Filter by category">
          @for (c of cats; track c.key) {
            <button class="filter" type="button" [attr.aria-pressed]="active() === c.key" (click)="active.set(c.key)">
              {{ c.label }}<span class="n">{{ count(c.key) }}</span>
            </button>
          }
        </div>
        <div class="work-list">
          @for (p of shown(); track p.slug; let i = $index) {
            <app-work-card [project]="p" [index]="i" />
          } @empty {
            <p class="empty">No case studies in this category yet.</p>
          }
        </div>
      </div>
    </section>
    <app-cta-band title="Have a similar problem?" text="Most of these started with a short message describing what was broken." />
  `
})
export class WorkPage {
  private content = inject(ContentService);
  /** ?c=rag from the "related work" links */
  readonly c = input<string | undefined>(undefined);
  readonly cats = WORK_CATS;
  readonly active = signal('all');
  readonly shown = computed(() => {
    const a = this.active();
    return this.content.projects().filter((p) => a === 'all' || p.cat === a);
  });

  constructor() {
    inject(SeoService).set('Work', 'Case studies: enterprise RAG, document AI, voice agents, private LLM platforms and agentic systems.', '/work');
    effect(() => {
      const q = this.c();
      if (q && this.cats.some((x) => x.key === q)) this.active.set(q);
    });
  }

  count(key: string): number {
    const list = this.content.projects();
    return key === 'all' ? list.length : list.filter((p) => p.cat === key).length;
  }
}
