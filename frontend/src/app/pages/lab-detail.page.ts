import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';

import { ContentService } from '../core/content.service';
import { SeoService } from '../core/seo.service';
import { ToastService } from '../core/toast.service';
import { fmtDate, fmtVal, highlight, pad2 } from '../core/util';
import { CountUpDirective } from '../shared/count-up.directive';
import { PageHeadComponent } from '../shared/page-head.component';
import { TocComponent, TocItem } from '../shared/toc.component';
import { NotFoundPage } from './not-found.page';

const SECTIONS: TocItem[] = [
  { id: 'question', label: 'Question' }, { id: 'method', label: 'Method' }, { id: 'environment', label: 'Environment' },
  { id: 'experiment', label: 'Experiment' }, { id: 'results', label: 'Results' }, { id: 'analysis', label: 'Analysis' },
  { id: 'conclusion', label: 'Conclusion' }, { id: 'code', label: 'Code' }
];

@Component({
  selector: 'app-lab-detail-page',
  imports: [PageHeadComponent, TocComponent, CountUpDirective, NotFoundPage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    @if (entry(); as l) {
      <app-page-head [crumbs]="[{ label: 'home', link: '/' }, { label: 'ai lab', link: '/lab' }, { label: l.title }]"
        [eyebrow]="l.type.toLowerCase()" [eyebrowRest]="' · ' + date() + ' · ' + (l.status === 'complete' ? '✓ complete' : '◐ in progress')"
        [title]="l.title" [lede]="l.question" />
      <div class="wrap detail">
        <app-toc [sections]="sections" />
        <article class="prose">
          <section id="question"><h2><span class="num">01</span>Question</h2><p>{{ l.question }}</p></section>
          <section id="method"><h2><span class="num">02</span>Method</h2><p>{{ l.method }}</p></section>
          <section id="environment"><h2><span class="num">03</span>Environment</h2>
            <div class="env">
              @for (e of l.env; track $index) {
                <div class="reveal"><span>{{ e.label }}</span><b>{{ e.value }}</b></div>
              }
            </div>
          </section>
          <section id="experiment"><h2><span class="num">04</span>Experiment</h2><p>{{ l.experiment }}</p></section>
          <section id="results"><h2><span class="num">05</span>Results</h2>
            <figure class="card chart">
              <div class="chart-rows">
                @for (r of l.rows; track $index; let i = $index) {
                  <div class="chart-row">
                    <span>{{ r.label }}</span>
                    <span class="track"><i [class.alt]="i > 0" [attr.data-w]="pct(r.value)"></i></span>
                    <b [appCountUp]="val(r.value)"></b>
                  </div>
                }
              </div>
              <figcaption class="chart-note">unit: {{ l.unit }} · sample figures</figcaption>
            </figure>
          </section>
          <section id="analysis"><h2><span class="num">06</span>Analysis</h2><p>{{ l.analysis }}</p></section>
          <section id="conclusion"><h2><span class="num">07</span>Conclusion</h2><blockquote>{{ l.conclusion }}</blockquote></section>
          <section id="code"><h2><span class="num">08</span>Code</h2>
            <div class="codeblock">
              <div class="window-bar"><span>{{ l.slug }}.py</span><button class="copy-btn" type="button" (click)="toast.copy(l.code, 'Code copied')">copy</button></div>
              <pre [innerHTML]="code()"></pre>
            </div>
          </section>
        </article>
      </div>
    } @else {
      <app-not-found-page />
    }
  `
})
export class LabDetailPage {
  private content = inject(ContentService);
  private seo = inject(SeoService);
  readonly toast = inject(ToastService);
  readonly slug = input.required<string>();
  readonly sections = SECTIONS;
  readonly entry = computed(() => this.content.labEntry(this.slug()));
  readonly date = computed(() => fmtDate(this.entry()?.date ?? ''));
  readonly code = computed(() => highlight(this.entry()?.code ?? ''));
  private readonly max = computed(() => Math.max(1e-9, ...(this.entry()?.rows ?? []).map((r) => r.value)));

  constructor() {
    effect(() => {
      const l = this.entry();
      if (l) this.seo.set(l.title + ' — AI Lab', l.question, '/lab/' + l.slug);
    });
  }

  pct(v: number): number { return Math.round((v / this.max()) * 100); }
  val(v: number): string { return fmtVal(v); }
  n(i: number): string { return pad2(i + 1); }
}
