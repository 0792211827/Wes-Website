import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService } from '../core/content.service';
import { DIAGRAMS } from '../core/data/diagrams';
import { SeoService } from '../core/seo.service';
import { pad2 } from '../core/util';
import { CtaBandComponent } from '../shared/cta-band.component';
import { DiagramComponent } from '../shared/diagram.component';
import { HowItWorksComponent } from '../shared/how-it-works.component';
import { PageHeadComponent } from '../shared/page-head.component';
import { TocComponent, TocItem } from '../shared/toc.component';
import { NotFoundPage } from './not-found.page';

/**
 * Diagram keys referenced by `[[diagram:key]]` lines in a case study's body, in order, skipping unknown keys.
 * Only the diagrams are used: older bodies in the database still hold long write-ups, and the page shows
 * the same five sections whatever else the body contains.
 */
function diagramKeys(body: string): string[] {
  const keys = Array.from((body || '').matchAll(/^\s*\[\[diagram:([a-z0-9-]+)\]\]\s*$/gim), (m) => m[1]);
  return [...new Set(keys)].filter((k) => k in DIAGRAMS);
}

/** Case study: overview, problem, context, architecture (the body's diagrams, or the walkthrough without any) and lessons. */
@Component({
  selector: 'app-work-detail-page',
  imports: [RouterLink, PageHeadComponent, TocComponent, CtaBandComponent, NotFoundPage, HowItWorksComponent, DiagramComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    @if (project(); as p) {
      <app-page-head [crumbs]="[{ label: 'work', link: '/work' }, { label: p.title }]"
        eyebrow="case study" [eyebrowRest]="' · ' + p.category + ' · ' + p.year" [title]="p.title" [lede]="p.outcome">
        <div class="chips">
          @for (t of p.tech; track t) {
            <span class="chip">{{ t }}</span>
          }
        </div>
      </app-page-head>

      <div class="wrap detail">
        <app-toc [sections]="sections" />
        <article class="prose">
          <section id="overview"><h2><span class="num">{{ n(0) }}</span>Overview</h2><p>{{ p.overview }}</p></section>
          <section id="problem"><h2><span class="num">{{ n(1) }}</span>Problem</h2><p>{{ p.problem }}</p></section>
          <section id="context"><h2><span class="num">{{ n(2) }}</span>Context</h2><p>{{ p.context }}</p></section>
          <section id="architecture"><h2><span class="num">{{ n(3) }}</span>Architecture</h2>
            @for (k of diagrams(); track k) {
              <app-diagram [key]="k" />
            } @empty {
              <app-how-it-works class="reveal" [project]="p" />
            }
          </section>
          <section id="lessons"><h2><span class="num">{{ n(4) }}</span>Lessons Learned</h2>
            <ul class="bullets">@for (r of p.lessons; track $index) {<li>{{ r }}</li>}</ul>
          </section>
          <div class="pn">
            <a class="card card-link" [routerLink]="['/work', prev().slug]"><span class="tag">previous</span><b>← {{ prev().title }}</b></a>
            <a class="card card-link" [routerLink]="['/work', next().slug]" style="text-align:right"><span class="tag">next</span><b>{{ next().title }} →</b></a>
          </div>
        </article>
      </div>
      <app-cta-band title="Facing a similar problem?" text="Tell me about it. The first call is about the problem, not a sales pitch." />
    } @else {
      <app-not-found-page />
    }
  `
})
export class WorkDetailPage {
  private content = inject(ContentService);
  private seo = inject(SeoService);
  readonly slug = input.required<string>();
  readonly project = computed(() => this.content.project(this.slug()));
  /** Animated architecture diagrams named in the body; empty falls back to the how-it-works walkthrough. */
  readonly diagrams = computed(() => diagramKeys(this.project()?.body ?? ''));
  readonly sections: TocItem[] = [
    { id: 'overview', label: 'Overview' }, { id: 'problem', label: 'Problem' }, { id: 'context', label: 'Context' },
    { id: 'architecture', label: 'Architecture' }, { id: 'lessons', label: 'Lessons Learned' }
  ];
  private readonly index = computed(() => this.content.projects().findIndex((p) => p.slug === this.slug()));
  readonly prev = computed(() => {
    const list = this.content.projects();
    return list[(this.index() - 1 + list.length) % list.length];
  });
  readonly next = computed(() => {
    const list = this.content.projects();
    return list[(this.index() + 1) % list.length];
  });

  constructor() {
    effect(() => {
      const p = this.project();
      if (p) this.seo.set(p.title + ' — Case Study', p.outcome, '/work/' + p.slug);
    });
  }

  n(i: number): string { return pad2(i + 1); }
}
