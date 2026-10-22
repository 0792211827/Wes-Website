import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';

import { ContentService } from '../core/content.service';
import { LAB_TYPES } from '../core/data/site.data';
import { SeoService } from '../core/seo.service';
import { SiteService } from '../core/site.service';
import { LabCardComponent } from '../shared/cards';
import { PageHeadComponent } from '../shared/page-head.component';

@Component({
  selector: 'app-lab-page',
  imports: [PageHeadComponent, LabCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    <app-page-head [crumbs]="[{ label: 'home', link: '/' }, { label: 'ai lab' }]" title="AI Lab"
      lede="Experiments, benchmarks, research notes, infrastructure tests and prototypes. Every entry shows the question, method, environment, results and code."
      [note]="site.flag('showSampleNotes') ? 'Sample entries: figures are illustrative until replaced with Wesley’s real runs.' : ''" />
    <section class="section">
      <div class="wrap">
        <div class="filters" role="group" aria-label="Filter by type">
          @for (t of types; track t) {
            <button class="filter" type="button" [attr.aria-pressed]="active() === t" (click)="active.set(t)">
              {{ t }}<span class="n">{{ count(t) }}</span>
            </button>
          }
        </div>
        <div class="grid-3">
          @for (l of shown(); track l.slug) {
            <app-lab-card [entry]="l" />
          }
        </div>
        @if (!shown().length) {
          <p class="empty">Nothing here yet. Check back soon.</p>
        }
      </div>
    </section>
  `
})
export class LabPage {
  readonly site = inject(SiteService);
  private content = inject(ContentService);
  readonly t = input<string | undefined>(undefined);
  readonly types = LAB_TYPES;
  readonly active = signal('All');
  readonly shown = computed(() => this.content.lab().filter((l) => this.active() === 'All' || l.type === this.active()));

  constructor() {
    inject(SeoService).set('AI Lab', 'Experiments and benchmarks on LLM serving, quantization, retrieval and voice latency, with methods and code.', '/lab');
    effect(() => {
      const q = this.t();
      if (q && this.types.includes(q)) this.active.set(q);
    });
  }

  count(t: string): number {
    const list = this.content.lab();
    return t === 'All' ? list.length : list.filter((l) => l.type === t).length;
  }
}
