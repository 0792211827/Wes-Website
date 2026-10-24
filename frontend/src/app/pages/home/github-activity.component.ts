import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterRenderEffect, computed, inject, signal, viewChild
} from '@angular/core';

import { ApiService } from '../../core/api.service';
import { SiteService } from '../../core/site.service';
import { ContributionDay, GithubRepo } from '../../core/models';
import { MONTHS } from '../../core/util';
import { CountUpDirective } from '../../shared/count-up.directive';
import { IconComponent } from '../../shared/icon.component';

interface Cell { l: number; n: number; label: string; delay: number; future: boolean; }

const LANG_COLORS: Record<string, string> = {
  Python: '#3572A5', TypeScript: '#3178c6', JavaScript: '#f1e05a', Java: '#b07219', Go: '#00ADD8',
  Rust: '#dea584', 'Jupyter Notebook': '#DA5B0B', Shell: '#89e051', HTML: '#e34c26', Dockerfile: '#384d54'
};

/**
 * GitHub contribution calendar (cells wave in) and the most recent repositories.
 * Shows only real data: if the API can't reach GitHub, nothing is rendered.
 */
@Component({
  selector: 'app-github-activity',
  imports: [CountUpDirective, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-block', '[style.margin-top.px]': 'live() || repos().length ? 28 : 0' },
  template: `
    @if (live()) {
      <div class="card heat reveal" id="github">
        <div class="heat-head">
          <span><b [appCountUp]="totalLabel()" style="color:var(--cream)"></b> contributions in the last year</span>
          @if (site.github()) {
            <a class="link-more" [href]="site.github()" target="_blank" rel="noopener">github.com/{{ site.githubUser() }}</a>
          }
        </div>
        <div class="heat-scroll" #scroller>
          <div class="heat-months">
            @for (m of months(); track $index) {
              <span>{{ m }}</span>
            }
          </div>
          <div class="heat-body">
            <div class="heat-days"><span></span><span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span></div>
            <div class="heat-grid" role="img" aria-label="GitHub contribution calendar" (mousemove)="tipMove($event)" (mouseleave)="tipHide()">
              @for (c of cells(); track $index) {
                @if (c.future) {
                  <i style="visibility:hidden"></i>
                } @else {
                  <i [attr.data-l]="c.l" [attr.data-n]="c.n" [attr.data-d]="c.label" [style.--d]="c.delay + 'ms'"></i>
                }
              }
            </div>
          </div>
        </div>
        <div class="heat-foot">
          <span>live from GitHub</span>
          <span class="legend">Less <i></i><i></i><i></i><i></i><i></i> More</span>
        </div>
      </div>
    }
    @if (repos().length) {
      <div class="repos">
        @for (r of repos(); track r.name) {
          <a class="card card-link repo reveal" [href]="r.html_url" target="_blank" rel="noopener">
            <h4><app-icon name="book" />{{ r.name }}</h4>
            <p>{{ r.description || 'No description' }}</p>
            <div class="repo-meta">
              <span><span class="lang-dot" [style.background]="color(r.language)"></span>{{ r.language || '—' }}</span>
              <span>★ {{ r.stargazers_count }}</span>
              <span>⑂ {{ r.forks_count }}</span>
            </div>
          </a>
        }
      </div>
    }
    <div class="tip" #tip aria-hidden="true"></div>
  `
})
export class GithubActivityComponent {
  readonly site = inject(SiteService);
  readonly days = signal<ContributionDay[]>([]);
  readonly repos = signal<GithubRepo[]>([]);
  readonly live = signal(false);

  private api = inject(ApiService);
  private tip = viewChild.required<ElementRef<HTMLElement>>('tip');
  private scroller = viewChild<ElementRef<HTMLElement>>('scroller');

  readonly total = computed(() => this.days().reduce((s, d) => s + d.count, 0));
  readonly totalLabel = computed(() => this.total().toLocaleString('en-US'));

  /** Weeks run Sunday → Saturday in columns, like GitHub. */
  readonly cells = computed<Cell[]>(() => {
    const days = this.days();
    if (!days.length) return [];
    const first = new Date(days[0].date + 'T00:00:00');
    const pad = first.getDay();
    const out: Cell[] = [];
    for (let i = 0; i < pad; i++) out.push({ l: 0, n: 0, label: '', delay: 0, future: true });
    days.forEach((d, i) => {
      const idx = i + pad;
      const w = Math.floor(idx / 7), dow = idx % 7;
      const date = new Date(d.date + 'T00:00:00');
      out.push({ l: d.level, n: d.count, label: date.toDateString(), delay: w * 14 + dow * 10, future: false });
    });
    while (out.length % 7) out.push({ l: 0, n: 0, label: '', delay: 0, future: true });
    return out;
  });

  readonly months = computed<string[]>(() => {
    const days = this.days();
    if (!days.length) return [];
    const pad = new Date(days[0].date + 'T00:00:00').getDay();
    const weeks = Math.ceil((days.length + pad) / 7);
    const labels: string[] = new Array(weeks).fill('');
    days.forEach((d, i) => {
      const date = new Date(d.date + 'T00:00:00');
      const w = Math.floor((i + pad) / 7);
      if (date.getDate() === 1 && w > 0 && w < weeks - 1) labels[w] = MONTHS[date.getMonth()];
    });
    return labels;
  });

  constructor() {
    const destroy = inject(DestroyRef);
    this.api.githubContributions().subscribe((res) => {
      if (res && Array.isArray(res.contributions) && res.contributions.length) {
        this.days.set(res.contributions.slice(-371));
        this.live.set(true);
      }
    });
    this.api.githubRepos().subscribe((list) => {
      if (Array.isArray(list) && list.length) {
        const own = list.filter((r) => !r.fork);
        if (own.length) this.repos.set(own.slice(0, 3));
      }
    });
    /* show the most recent weeks first once the calendar appears */
    afterRenderEffect(() => {
      const sc = this.scroller()?.nativeElement;
      if (sc) sc.scrollLeft = sc.scrollWidth;
    });
    destroy.onDestroy(() => this.tipHide());
  }

  color(lang: string | null): string {
    return (lang && LANG_COLORS[lang]) || 'var(--accent)';
  }

  tipMove(e: MouseEvent): void {
    const target = e.target as HTMLElement | null;
    const tip = this.tip().nativeElement;
    const c = target?.closest<HTMLElement>('i[data-n]');
    if (!c) { tip.style.opacity = '0'; return; }
    const n = Number(c.dataset['n']);
    tip.textContent = (n ? n : 'No') + ' contribution' + (n === 1 ? '' : 's') + ' on ' + c.dataset['d'];
    const r = c.getBoundingClientRect();
    tip.style.left = r.left + r.width / 2 + 'px';
    tip.style.top = r.top + 'px';
    tip.style.opacity = '1';
  }

  tipHide(): void {
    const tip = this.tip();
    if (tip) tip.nativeElement.style.opacity = '0';
  }
}
