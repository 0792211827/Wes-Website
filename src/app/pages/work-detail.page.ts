import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { ContentService } from '../core/content.service';
import { SeoService } from '../core/seo.service';
import { ToastService } from '../core/toast.service';
import { pad2 } from '../core/util';
import { archFigure } from '../shared/art';
import { CountUpDirective } from '../shared/count-up.directive';
import { CtaBandComponent } from '../shared/cta-band.component';
import { PageHeadComponent } from '../shared/page-head.component';
import { TocComponent, TocItem } from '../shared/toc.component';
import { NotFoundPage } from './not-found.page';

const SECTIONS: TocItem[] = [
  { id: 'overview', label: 'Overview' }, { id: 'problem', label: 'Problem' }, { id: 'context', label: 'Business Context' },
  { id: 'requirements', label: 'Requirements' }, { id: 'architecture', label: 'Architecture' },
  { id: 'implementation', label: 'Technical Implementation' }, { id: 'challenges', label: 'Engineering Challenges' },
  { id: 'decisions', label: 'Decisions & Tradeoffs' }, { id: 'evaluation', label: 'Evaluation' }, { id: 'results', label: 'Results' },
  { id: 'lessons', label: 'Lessons Learned' }, { id: 'resources', label: 'Resources' }
];

/** Case study in the spec's 12-section structure. */
@Component({
  selector: 'app-work-detail-page',
  imports: [RouterLink, PageHeadComponent, TocComponent, CtaBandComponent, CountUpDirective, NotFoundPage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    @if (project(); as p) {
      <app-page-head [crumbs]="[{ label: 'home', link: '/' }, { label: 'work', link: '/work' }, { label: p.title }]"
        eyebrow="case study" [eyebrowRest]="' · ' + p.category + ' · ' + p.year" [title]="p.title" [lede]="p.outcome"
        note="Sample case study: replace the content and figures with real project details.">
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
          <section id="context"><h2><span class="num">{{ n(2) }}</span>Business Context</h2><p>{{ p.context }}</p></section>
          <section id="requirements"><h2><span class="num">{{ n(3) }}</span>Requirements</h2>
            <ul class="bullets">@for (r of p.requirements; track $index) {<li>{{ r }}</li>}</ul>
          </section>
          <section id="architecture"><h2><span class="num">{{ n(4) }}</span>Architecture</h2>
            <p>High-level flow of the system.</p>
            <figure class="card arch reveal" [innerHTML]="arch()"></figure>
          </section>
          <section id="implementation"><h2><span class="num">{{ n(5) }}</span>Technical Implementation</h2><p>{{ p.implementation }}</p></section>
          <section id="challenges"><h2><span class="num">{{ n(6) }}</span>Engineering Challenges</h2>
            <ul class="bullets">@for (r of p.challenges; track $index) {<li>{{ r }}</li>}</ul>
          </section>
          <section id="decisions"><h2><span class="num">{{ n(7) }}</span>Decisions &amp; Tradeoffs</h2>
            <div class="decision">
              @for (d of p.decisions; track $index) {
                <div class="card reveal"><h4>{{ d.title }}</h4><p>{{ d.body }}</p><p class="why"><b>tradeoff:</b> {{ d.tradeoff }}</p></div>
              }
            </div>
          </section>
          <section id="evaluation"><h2><span class="num">{{ n(8) }}</span>Evaluation</h2><p>{{ p.evaluation }}</p></section>
          <section id="results"><h2><span class="num">{{ n(9) }}</span>Results</h2>
            <div class="results">
              @for (r of p.results; track $index) {
                <div class="card reveal"><div class="metric"><b [appCountUp]="r.value"></b><span>{{ r.label }}</span></div></div>
              }
            </div>
          </section>
          <section id="lessons"><h2><span class="num">{{ n(10) }}</span>Lessons Learned</h2>
            <ul class="bullets">@for (r of p.lessons; track $index) {<li>{{ r }}</li>}</ul>
          </section>
          <section id="resources"><h2><span class="num">{{ n(11) }}</span>Resources</h2>
            <div class="resources">
              @for (r of p.resources; track $index) {
                <button type="button" class="chip c-green" (click)="toast.show('Resource link placeholder: attach the real file or URL')">{{ r }} ↗</button>
              }
            </div>
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
  private sanitizer = inject(DomSanitizer);
  private seo = inject(SeoService);
  readonly toast = inject(ToastService);
  readonly slug = input.required<string>();
  readonly sections = SECTIONS;

  readonly project = computed(() => this.content.project(this.slug()));
  private readonly index = computed(() => this.content.projects().findIndex((p) => p.slug === this.slug()));
  readonly prev = computed(() => {
    const list = this.content.projects();
    return list[(this.index() - 1 + list.length) % list.length];
  });
  readonly next = computed(() => {
    const list = this.content.projects();
    return list[(this.index() + 1) % list.length];
  });
  readonly arch = computed<SafeHtml>(() => {
    const p = this.project();
    return this.sanitizer.bypassSecurityTrustHtml(p ? archFigure(p.arch, 'fig. 1 — ' + p.title.toLowerCase() + ', simplified') : '');
  });

  constructor() {
    effect(() => {
      const p = this.project();
      if (p) this.seo.set(p.title + ' — Case Study', p.outcome, '/work/' + p.slug);
    });
  }

  n(i: number): string { return pad2(i + 1); }
}
