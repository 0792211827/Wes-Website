import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, input, signal, viewChild } from '@angular/core';

import { ContentService } from '../core/content.service';
import { CAPS, WORK_CATS } from '../core/data/site.data';
import { MotionService } from '../core/motion.service';
import { SeoService } from '../core/seo.service';
import { SiteService } from '../core/site.service';
import { WorkCardComponent } from '../shared/cards';
import { CtaBandComponent } from '../shared/cta-band.component';
import { IconComponent } from '../shared/icon.component';
import { PageHeadComponent } from '../shared/page-head.component';
import { SectionHeadComponent } from '../shared/section-head.component';
import { SystemTraceComponent } from '../shared/system-trace.component';

@Component({
  selector: 'app-work-page',
  imports: [PageHeadComponent, WorkCardComponent, CtaBandComponent, IconComponent, SectionHeadComponent, SystemTraceComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    <app-page-head [crumbs]="[{ label: 'home', link: '/' }, { label: 'work' }]" title="Selected work"
      lede="Case studies with the problem, architecture, decisions, evaluation and results. Client names are withheld; the engineering is not."
      [note]="site.flag('showSampleNotes') ? 'Sample case studies: replace with Wesley’s real projects before launch.' : ''" />
    @if (site.show('system')) {
      <div class="wrap system reveal">
        <app-system-trace />
      </div>
    }
    <section class="section">
      <div class="wrap">
        <h2 class="sr-only" #list tabindex="-1">Case studies</h2>
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
    @if (site.show('build')) {
    <section class="section" id="build">
      <div class="wrap">
        <app-section-head eyebrow="expertise" title="What I build" text="The kinds of AI systems these case studies cover, from an AI idea to a system people rely on." />
        <div class="grid-3">
          @for (c of caps; track c.id) {
            <article class="card cap reveal">
              <div class="cap-ico"><app-icon [name]="c.icon" /></div>
              <h3>{{ c.title }}</h3>
              <p>{{ c.desc }}</p>
              <div class="chips">
                @for (t of c.tags; track t) {
                  <span [class]="'chip ' + c.color">{{ t }}</span>
                }
              </div>
              <div class="cap-foot">
                <span class="tag">{{ c.id }}</span>
                <button class="link-btn" type="button" [attr.aria-label]="'Show case studies related to ' + c.title" (click)="showCat(c.id)">
                  related work <span aria-hidden="true">→</span>
                </button>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
    }
    <app-cta-band title="Have a similar problem?" text="Most of these started with a short message describing what was broken." />
  `
})
export class WorkPage {
  readonly site = inject(SiteService);
  private content = inject(ContentService);
  /** ?c=rag from the "related work" links */
  readonly c = input<string | undefined>(undefined);
  readonly cats = WORK_CATS;
  readonly caps = CAPS;
  private motion = inject(MotionService);
  private list = viewChild.required<ElementRef<HTMLElement>>('list');
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

  /** "related work" on a capability card: filter the case studies and scroll back up to them. */
  showCat(id: string): void {
    const cat = id === 'strategy' ? 'all' : id === 'evaluation' ? 'rag' : id;
    this.active.set(this.cats.some((x) => x.key === cat) ? cat : 'all');
    const head = this.list().nativeElement;
    head.focus({ preventScroll: true });
    head.parentElement?.scrollIntoView({ behavior: this.motion.reduced ? 'auto' : 'smooth', block: 'start' });
  }

  count(key: string): number {
    const list = this.content.projects();
    return key === 'all' ? list.length : list.filter((p) => p.cat === key).length;
  }
}
