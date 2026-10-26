import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ContentService } from '../core/content.service';
import { SeoService } from '../core/seo.service';
import { SiteService } from '../core/site.service';
import { WorkCardComponent } from '../shared/cards';
import { CtaBandComponent } from '../shared/cta-band.component';
import { PageHeadComponent } from '../shared/page-head.component';
import { SystemTraceComponent } from '../shared/system-trace.component';

@Component({
  selector: 'app-work-page',
  imports: [PageHeadComponent, WorkCardComponent, CtaBandComponent, SystemTraceComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    <app-page-head [crumbs]="[{ label: 'work' }]" title="Selected work"
      lede="Case studies: the problem, the context, the architecture and what I learned. Client names are withheld; the engineering is not." />
    @if (site.show('system')) {
      <div class="wrap system reveal">
        <app-system-trace />
      </div>
    }
    <section class="section">
      <div class="wrap">
        <h2 class="sr-only">Case studies</h2>
        <div class="work-list">
          @for (p of content.projects(); track p.slug; let i = $index) {
            <app-work-card [project]="p" [index]="i" />
          } @empty {
            <p class="empty">No case studies yet.</p>
          }
        </div>
      </div>
    </section>
    <app-cta-band title="Have a similar problem?" text="Most of these started with a short message describing what was broken." />
  `
})
export class WorkPage {
  readonly site = inject(SiteService);
  readonly content = inject(ContentService);

  constructor() {
    inject(SeoService).set('Work', 'Case studies: a customer-service voice agent, document intelligence and retrieval, and local RAG on private infrastructure.', '/work');
  }
}
