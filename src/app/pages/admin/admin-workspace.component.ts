import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';

import { AdminService } from '../../core/admin.service';
import { AnalyticsService } from '../../core/analytics.service';
import { problemMessage } from '../../core/api.service';
import { AnalyticsSummary, CountItem, SessionDetail, VisitSession } from '../../core/models';
import { ToastService } from '../../core/toast.service';

const PERIODS = [
  { days: 1, label: 'Today' }, { days: 7, label: '7 days' }, { days: 30, label: '30 days' },
  { days: 90, label: '90 days' }, { days: 365, label: '1 year' }
];

/**
 * Admin "Workspace": who visited the portfolio, from where, on which device, what they read,
 * how long they stayed and what they did. Click a visit for its full timeline.
 */
@Component({
  selector: 'app-admin-workspace',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-block' },
  template: `
    <div class="ws-toolbar">
      <div class="tabs" role="group" aria-label="Period">
        @for (p of periods; track p.days) {
          <button type="button" [attr.aria-selected]="days() === p.days" (click)="setDays(p.days)">{{ p.label }}</button>
        }
      </div>
      <div class="ws-tools">
        <label class="ws-check"><input type="checkbox" [checked]="auto()" (change)="toggleAuto()"> auto-refresh</label>
        <label class="ws-check"><input type="checkbox" [checked]="notrack()" (change)="toggleNotrack()"> don't track this browser</label>
        <button class="btn btn-sm" type="button" (click)="load()" [disabled]="loading()">{{ loading() ? 'Loading…' : 'Refresh' }}</button>
      </div>
    </div>

    @if (error()) {
      <p class="form-error">{{ error() }}</p>
    }

    @if (summary(); as s) {
      <div class="ws-kpis">
        <div class="card ws-kpi"><span>visitors</span><b>{{ s.visitors }}</b><small>{{ s.newVisitors }} new · {{ s.visitors - s.newVisitors }} returning</small></div>
        <div class="card ws-kpi"><span>visits</span><b>{{ s.sessions }}</b><small>{{ s.pageViews }} page views</small></div>
        <div class="card ws-kpi live"><span><i class="status-dot"></i> on the site now</span><b>{{ s.activeNow }}</b><small>active in the last 5 min</small></div>
        <div class="card ws-kpi"><span>avg. visit</span><b>{{ dur(s.avgSessionSeconds) }}</b><small>{{ dur(s.avgPageSeconds) }} per page</small></div>
        <div class="card ws-kpi"><span>bounce rate</span><b>{{ pct(s.bounceRate) }}</b><small>left after one page</small></div>
        <div class="card ws-kpi"><span>cv downloads</span><b>{{ s.cvDownloads }}</b><small>{{ s.contacts }} contact forms</small></div>
        <div class="card ws-kpi"><span>ai questions</span><b>{{ s.questions }}</b><small>{{ s.outboundClicks }} link clicks</small></div>
      </div>

      <div class="card ws-chart">
        <div class="ws-chart-head">
          <h3>Visitors &amp; page views</h3>
          <span class="ws-legend"><i class="lv"></i> visitors <i class="lp"></i> page views</span>
        </div>
        <svg [attr.viewBox]="'0 0 ' + chartW + ' 160'" preserveAspectRatio="none" class="ws-svg" role="img" aria-label="Daily visitors and page views">
          @for (d of s.timeline; track d.day; let i = $index) {
            <svg:rect class="ws-bar" [attr.x]="i * step() + step() * 0.15" [attr.width]="step() * 0.7"
              [attr.y]="140 - (d.pageViews / maxY()) * 130" [attr.height]="(d.pageViews / maxY()) * 130">
              <svg:title>{{ d.day }}: {{ d.visitors }} visitors, {{ d.pageViews }} page views</svg:title>
            </svg:rect>
          }
          <polyline class="ws-line" [attr.points]="linePoints()" />
          @for (d of s.timeline; track d.day; let i = $index) {
            <svg:circle class="ws-dot" [attr.cx]="i * step() + step() / 2" [attr.cy]="140 - (d.visitors / maxY()) * 130" r="2.5">
              <svg:title>{{ d.day }}: {{ d.visitors }} visitors</svg:title>
            </svg:circle>
          }
        </svg>
        <div class="ws-axis"><span>{{ s.timeline[0]?.day }}</span><span>{{ s.timeline[s.timeline.length - 1]?.day }}</span></div>
      </div>

      <div class="ws-lists">
        @for (l of lists(); track l.title) {
          <div class="card ws-list">
            <h3>{{ l.title }}</h3>
            @for (it of l.items; track it.label) {
              <div class="ws-row">
                <span class="ws-row-label">{{ l.flags ? flag(it.label) + ' ' : '' }}{{ it.label }}</span>
                <span class="ws-row-bar"><i [style.width.%]="(it.count / max(l.items)) * 100"></i></span>
                <b>{{ it.count }}</b>
              </div>
            } @empty {
              <p class="empty" style="padding:12px 0">No data yet.</p>
            }
          </div>
        }
      </div>
    }

    <div class="card ws-sessions">
      <div class="ws-chart-head">
        <h3>Visits <small>({{ sessions().length }})</small></h3>
        <label class="search" style="min-width:240px">
          <span class="sr">Search visits</span>
          <input type="search" placeholder="Search IP, city, country, browser, page…" [value]="q()" (input)="search($event)">
        </label>
      </div>
      <div class="admin-scroll">
        <table class="admin-table ws-table">
          <thead><tr><th>when</th><th>visitor</th><th>location</th><th>device</th><th>ip</th><th>pages</th><th>time</th><th>path</th><th>did</th></tr></thead>
          <tbody>
            @for (v of sessions(); track v.sessionId) {
              <tr class="ws-click" (click)="open(v.sessionId)" tabindex="0" (keydown.enter)="open(v.sessionId)">
                <td><b>{{ ago(v.end) }}</b><br>{{ v.start | date: 'MMM d, HH:mm' }}</td>
                <td><span class="status-pill" [class.NEW]="!v.returning">{{ v.returning ? 'returning' : 'new' }}</span></td>
                <td>{{ flag(v.countryCode) }} {{ v.city || '—' }}<br><small>{{ v.region ? v.region + ', ' : '' }}{{ v.country || 'Unknown' }}</small></td>
                <td>{{ deviceIcon(v.deviceType) }} {{ v.deviceType }}<br><small>{{ v.browser }} · {{ v.os }}</small></td>
                <td><code>{{ v.ip }}</code></td>
                <td>{{ v.pageViews }}</td>
                <td>{{ dur(v.durationSeconds) }}</td>
                <td><small>{{ v.entryPage }}{{ v.exitPage && v.exitPage !== v.entryPage ? ' → ' + v.exitPage : '' }}</small><br><small class="muted-i">{{ host(v.referrer) }}</small></td>
                <td>
                  @for (a of v.actions; track a) { <span class="chip c-green ws-act">{{ a }}</span> }
                </td>
              </tr>
            } @empty {
              <tr><td colspan="9" class="empty">No visits in this period yet. Visits appear here a few seconds after someone opens the site.</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    @if (detail(); as d) {
      <div class="ws-back" (click)="detail.set(null)"></div>
      <aside class="window ws-drawer" role="dialog" aria-label="Visit details">
        <div class="mc-head">
          <span class="mc-av" aria-hidden="true">{{ deviceIcon(d.session.deviceType) }}</span>
          <div class="mc-title">
            <b>{{ flag(d.session.countryCode) }} {{ d.session.city || 'Unknown city' }}, {{ d.session.country || 'Unknown' }}</b>
            <span class="mc-status">{{ d.session.start | date: 'EEE MMM d, y · HH:mm:ss' }} · {{ dur(d.session.durationSeconds) }}</span>
          </div>
          <button class="mc-btn" type="button" (click)="detail.set(null)" aria-label="Close">✕</button>
        </div>
        <div class="ws-drawer-body">
          <dl class="ws-facts">
            <dt>visitor</dt><dd>{{ d.session.returning ? 'Returning visitor' : 'First visit' }} <small class="muted-i">{{ d.session.visitorId }}</small></dd>
            <dt>ip address</dt><dd><code>{{ d.session.ip }}</code>{{ d.session.isp ? ' · ' + d.session.isp : '' }}</dd>
            <dt>location</dt>
            <dd>
              {{ place(d.session) }}
              @if (d.session.latitude !== null && d.session.longitude !== null) {
                · <a [href]="'https://www.google.com/maps?q=' + d.session.latitude + ',' + d.session.longitude" target="_blank" rel="noopener">map ↗</a>
              }
            </dd>
            <dt>device</dt><dd>{{ d.session.deviceType }} · {{ d.session.browser }} · {{ d.session.os }}</dd>
            <dt>screen</dt><dd>{{ d.session.screen || '—' }} · {{ d.session.language || '—' }} · {{ d.session.timezone || '—' }}</dd>
            <dt>came from</dt><dd>{{ d.session.referrer || 'Direct visit (typed the address or a bookmark)' }}</dd>
          </dl>

          <h4>Timeline</h4>
          <ol class="ws-timeline">
            @for (e of d.events; track e.id) {
              <li [class]="'t-' + e.type">
                <span class="ws-time">{{ e.at | date: 'HH:mm:ss' }}</span>
                <div>
                  <b>{{ eventLabel(e.type) }}</b> {{ e.path }}
                  @if (e.label) { <small>· {{ e.label }}</small> }
                  @if (e.durationMs) { <small class="ws-stay">stayed {{ dur(e.durationMs / 1000) }}</small> }
                  @if (e.title && e.type === 'pageview') { <br><small class="muted-i">{{ e.title }}</small> }
                </div>
              </li>
            }
          </ol>

          @if (d.otherSessions.length) {
            <h4>Other visits by this visitor</h4>
            @for (o of d.otherSessions; track o.sessionId) {
              <button class="ws-other" type="button" (click)="open(o.sessionId)">
                {{ o.start | date: 'MMM d, HH:mm' }} · {{ o.pageViews }} pages · {{ dur(o.durationSeconds) }} · {{ o.entryPage }}
              </button>
            }
          }
        </div>
      </aside>
    }
  `
})
export class AdminWorkspaceComponent {
  private admin = inject(AdminService);
  private analytics = inject(AnalyticsService);
  private toast = inject(ToastService);

  readonly periods = PERIODS;
  readonly chartW = 700;
  readonly days = signal(7);
  readonly summary = signal<AnalyticsSummary | null>(null);
  readonly sessions = signal<VisitSession[]>([]);
  readonly detail = signal<SessionDetail | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly q = signal('');
  readonly auto = signal(true);
  readonly notrack = signal(this.analytics.disabled);
  private searchTimer: ReturnType<typeof setTimeout> | undefined;

  readonly step = computed(() => this.chartW / Math.max(1, this.summary()?.timeline.length ?? 1));
  readonly maxY = computed(() => {
    const t = this.summary()?.timeline ?? [];
    return Math.max(1, ...t.map((d) => Math.max(d.pageViews, d.visitors)));
  });
  readonly linePoints = computed(() => {
    const t = this.summary()?.timeline ?? [];
    return t.map((d, i) => (i * this.step() + this.step() / 2) + ',' + (140 - (d.visitors / this.maxY()) * 130)).join(' ');
  });
  readonly lists = computed(() => {
    const s = this.summary();
    if (!s) return [];
    return [
      { title: 'Top pages', items: s.topPages, flags: false },
      { title: 'Countries', items: s.countries, flags: true },
      { title: 'Cities', items: s.cities, flags: false },
      { title: 'Came from', items: s.referrers, flags: false },
      { title: 'Devices', items: s.devices, flags: false },
      { title: 'Browsers', items: s.browsers, flags: false },
      { title: 'Operating systems', items: s.systems, flags: false },
      { title: 'Actions', items: s.actions, flags: false }
    ];
  });

  constructor() {
    this.load();
    const timer = setInterval(() => { if (this.auto() && !this.detail()) this.load(true); }, 30000);
    inject(DestroyRef).onDestroy(() => { clearInterval(timer); clearTimeout(this.searchTimer); });
  }

  setDays(d: number): void {
    this.days.set(d);
    this.load();
  }

  load(quiet = false): void {
    if (!quiet) this.loading.set(true);
    this.error.set('');
    this.admin.analytics(this.days()).subscribe({
      next: (s) => { this.summary.set(s); this.loading.set(false); },
      error: (err: unknown) => { this.loading.set(false); this.error.set(problemMessage(err, 'Could not load the statistics.')); }
    });
    this.admin.sessions(this.days(), this.q()).subscribe({ next: (v) => this.sessions.set(v), error: () => undefined });
  }

  search(e: Event): void {
    this.q.set((e.target as HTMLInputElement).value);
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.admin.sessions(this.days(), this.q()).subscribe({ next: (v) => this.sessions.set(v) }), 350);
  }

  open(id: string): void {
    this.admin.session(id).subscribe({
      next: (d) => this.detail.set(d),
      error: (err: unknown) => this.toast.show(problemMessage(err, 'Could not open this visit.'))
    });
  }

  toggleAuto(): void { this.auto.set(!this.auto()); }

  toggleNotrack(): void {
    const off = !this.notrack();
    this.analytics.setDisabled(off);
    this.notrack.set(off);
    this.toast.show(off ? 'Your own visits from this browser will not be recorded.' : 'This browser is tracked again.');
  }

  /* ---------- formatting ---------- */
  max(items: CountItem[]): number { return Math.max(1, ...items.map((i) => i.count)); }

  dur(seconds: number): string {
    const s = Math.round(seconds || 0);
    if (s < 60) return s + 's';
    const m = Math.floor(s / 60);
    if (m < 60) return m + 'm ' + (s % 60) + 's';
    return Math.floor(m / 60) + 'h ' + (m % 60) + 'm';
  }

  pct(v: number): string { return Math.round((v || 0) * 100) + '%'; }

  ago(iso: string): string {
    const diff = Math.max(0, Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
    if (diff < 86400) return Math.floor(diff / 3600) + ' h ago';
    return Math.floor(diff / 86400) + ' d ago';
  }

  /** Country flag emoji from a two-letter code, or a name (best effort). */
  flag(code: string | null): string {
    if (!code || !/^[A-Za-z]{2}$/.test(code)) return '🌐';
    return String.fromCodePoint(...code.toUpperCase().split('').map((c) => 127397 + c.charCodeAt(0)));
  }

  deviceIcon(type: string | null): string {
    return type === 'mobile' ? '📱' : type === 'tablet' ? '📲' : type === 'desktop' ? '💻' : '❔';
  }

  host(ref: string | null): string {
    if (!ref) return 'direct';
    try { return 'from ' + new URL(ref).hostname.replace(/^www\./, ''); } catch { return ref; }
  }

  place(v: VisitSession): string {
    return [v.city, v.region, v.country].filter((x): x is string => !!x).join(', ') || 'Unknown';
  }

  eventLabel(type: string): string {
    switch (type) {
      case 'pageview': return 'Viewed';
      case 'cv_download': return 'Downloaded the CV';
      case 'outbound': return 'Opened a link';
      case 'ask': return 'Asked the AI';
      case 'contact': return 'Sent the contact form';
      case 'theme': return 'Switched theme';
      default: return type;
    }
  }
}
