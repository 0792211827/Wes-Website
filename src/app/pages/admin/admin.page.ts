import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminService } from '../../core/admin.service';
import { problemMessage } from '../../core/api.service';
import { AdminStats, AskLog, Lead, LeadStatus } from '../../core/models';
import { SeoService } from '../../core/seo.service';
import { ToastService } from '../../core/toast.service';
import { IconComponent } from '../../shared/icon.component';
import { AdminContentComponent } from './admin-content.component';
import { AdminFilesComponent } from './admin-files.component';
import { AdminSiteComponent } from './admin-site.component';
import { AdminWorkspaceComponent } from './admin-workspace.component';

const STATUSES: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST', 'ARCHIVED'];

type Tab = 'workspace' | 'leads' | 'ask' | 'site' | 'files' | 'content';

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'workspace', label: 'workspace' },
  { id: 'leads', label: 'leads' },
  { id: 'ask', label: 'ai questions' },
  { id: 'site', label: 'website' },
  { id: 'files', label: 'photo & cv' },
  { id: 'content', label: 'content' }
];

/**
 * Private dashboard at /admin (not linked from the site, blocked in robots.txt).
 * Wesley signs in with ADMIN_USERNAME / ADMIN_PASSWORD from the API settings to see
 * the visitor workspace, consulting leads, AI questions, and to edit the website, photo, CV and content.
 */
@Component({
  selector: 'app-admin-page',
  imports: [FormsModule, DatePipe, IconComponent, AdminWorkspaceComponent, AdminSiteComponent, AdminFilesComponent, AdminContentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    <div class="wrap" style="padding:56px 0 90px">
      @if (!admin.token()) {
        <div class="card" style="max-width:420px;margin:0 auto">
          <form class="form" (ngSubmit)="login()">
            <p class="eyebrow"><b>//</b> admin</p>
            <h1 style="font-size:1.6rem">Sign in</h1>
            <div class="field">
              <label for="a-user">Username</label>
              <input id="a-user" name="username" autocomplete="username" [(ngModel)]="username" required>
            </div>
            <div class="field">
              <label for="a-pass">Password</label>
              <input id="a-pass" name="password" type="password" autocomplete="current-password" [(ngModel)]="password" required>
            </div>
            @if (error()) {
              <p class="form-error" role="alert">{{ error() }}</p>
            }
            <button class="btn btn-primary btn-block" type="submit" [disabled]="busy()">{{ busy() ? 'Signing in…' : 'Sign in' }}</button>
          </form>
        </div>
      } @else {
        <div class="toolbar">
          <div>
            <p class="eyebrow"><b>//</b> admin</p>
            <h1 style="font-size:1.8rem;margin-top:6px">Dashboard</h1>
          </div>
          <div class="hero-ctas">
            <button class="btn btn-sm" type="button" (click)="refresh()">Refresh</button>
            <button class="btn btn-sm" type="button" (click)="admin.logout()"><app-icon name="logout" /> Sign out</button>
          </div>
        </div>

        @if (stats(); as s) {
          <div class="admin-stats">
            <div class="card"><div class="metric"><b>{{ s.leads }}</b><span>leads ({{ s.newLeads }} new)</span></div></div>
            <div class="card"><div class="metric"><b>{{ s.questions }}</b><span>AI questions</span></div></div>
            <div class="card"><div class="metric"><b>{{ (s.fallbackRate * 100).toFixed(0) }}%</b><span>unanswered by the AI</span></div></div>
            <div class="card"><div class="metric"><b>{{ s.projects }} · {{ s.labEntries }} · {{ s.posts }}</b><span>projects · lab · posts</span></div></div>
          </div>
        }

        <div class="tabs admin-tabs ad-main-tabs" role="tablist">
          @for (t of tabs; track t.id) {
            <button type="button" role="tab" [attr.aria-selected]="tab() === t.id" (click)="go(t.id)">
              {{ t.label }}
              @if (t.id === 'leads' && stats()?.newLeads) { <span class="ad-badge">{{ stats()?.newLeads }}</span> }
            </button>
          }
        </div>

        @if (tab() === 'workspace') {
          <app-admin-workspace />
        } @else if (tab() === 'site') {
          <app-admin-site />
        } @else if (tab() === 'files') {
          <app-admin-files />
        } @else if (tab() === 'content') {
          <app-admin-content />
        } @else if (tab() === 'leads') {
          <div class="card admin-scroll" style="padding:0">
            <table class="admin-table">
              <thead><tr><th>received</th><th>who</th><th>looking for</th><th>problem</th><th>budget / timeline</th><th>status</th><th></th></tr></thead>
              <tbody>
                @for (l of leads(); track l.id) {
                  <tr>
                    <td>{{ l.createdAt | date: 'MMM d, y HH:mm' }}</td>
                    <td><b>{{ l.name }}</b><br><a [href]="'mailto:' + l.email" style="color:var(--accent)">{{ l.email }}</a><br>{{ l.company }} {{ l.role ? '· ' + l.role : '' }}</td>
                    <td>{{ l.services.join(', ') }}</td>
                    <td style="max-width:360px">{{ l.problem }}</td>
                    <td>{{ l.budget || '—' }}<br>{{ l.timeline || '—' }}</td>
                    <td>
                      <select [ngModel]="l.status" (ngModelChange)="setStatus(l, $event)" [attr.aria-label]="'Status for ' + l.name">
                        @for (s of statuses; track s) { <option [value]="s">{{ s }}</option> }
                      </select>
                      <textarea rows="2" placeholder="notes" style="margin-top:6px;width:100%" [ngModel]="l.notes ?? ''"
                        (blur)="saveNotes(l, $event)"></textarea>
                    </td>
                    <td><button class="copy-btn" type="button" (click)="remove(l)">delete</button></td>
                  </tr>
                } @empty {
                  <tr><td colspan="7" class="empty">No leads yet.</td></tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="card admin-scroll" style="padding:0">
            <table class="admin-table">
              <thead><tr><th>asked</th><th>question</th><th>answer</th><th>top source</th><th>score</th><th>ms</th></tr></thead>
              <tbody>
                @for (a of logs(); track a.id) {
                  <tr>
                    <td>{{ a.createdAt | date: 'MMM d, HH:mm' }}</td>
                    <td style="max-width:420px">{{ a.question }}</td>
                    <td><span class="status-pill" [class.LOST]="a.fallback">{{ a.mode }}</span></td>
                    <td>{{ a.topKey || '—' }}</td>
                    <td>{{ a.score.toFixed(2) }}</td>
                    <td>{{ a.latencyMs }}</td>
                  </tr>
                } @empty {
                  <tr><td colspan="6" class="empty">No questions yet.</td></tr>
                }
              </tbody>
            </table>
          </div>
        }
      }
    </div>
  `
})
export class AdminPage {
  readonly admin = inject(AdminService);
  private toast = inject(ToastService);
  readonly statuses = STATUSES;
  readonly tabs = TABS;
  readonly tab = signal<Tab>(this.savedTab());
  readonly stats = signal<AdminStats | null>(null);
  readonly leads = signal<Lead[]>([]);
  readonly logs = signal<AskLog[]>([]);
  readonly busy = signal(false);
  readonly error = signal('');
  username = '';
  password = '';

  constructor() {
    inject(SeoService).set('Admin', 'Private dashboard.', '/admin');
    effect(() => {
      if (this.admin.token()) this.refresh();
    });
  }

  login(): void {
    if (!this.username || !this.password) { this.error.set('Enter your username and password.'); return; }
    this.busy.set(true);
    this.error.set('');
    this.admin.login(this.username, this.password).subscribe({
      next: () => { this.busy.set(false); this.password = ''; },
      error: (err: unknown) => { this.busy.set(false); this.error.set(problemMessage(err, 'Wrong username or password.')); }
    });
  }

  go(t: Tab): void {
    this.tab.set(t);
    try { sessionStorage.setItem('wn-admin-tab', t); } catch { /* ignore */ }
  }

  private savedTab(): Tab {
    try {
      const t = sessionStorage.getItem('wn-admin-tab') as Tab | null;
      return t && TABS.some((x) => x.id === t) ? t : 'workspace';
    } catch {
      return 'workspace';
    }
  }

  refresh(): void {
    this.admin.stats().subscribe({ next: (s) => this.stats.set(s), error: () => undefined });
    this.admin.leads().subscribe({ next: (l) => this.leads.set(l), error: () => undefined });
    this.admin.askLogs().subscribe({ next: (l) => this.logs.set(l), error: () => undefined });
  }

  setStatus(l: Lead, status: LeadStatus): void {
    this.admin.updateLead(l.id, { status }).subscribe({
      next: (u) => { this.replace(u); this.toast.show('Status updated'); },
      error: (err: unknown) => this.toast.show(problemMessage(err))
    });
  }

  saveNotes(l: Lead, e: Event): void {
    const notes = (e.target as HTMLTextAreaElement).value;
    if ((l.notes ?? '') === notes) return;
    this.admin.updateLead(l.id, { notes }).subscribe({
      next: (u) => { this.replace(u); this.toast.show('Notes saved'); },
      error: (err: unknown) => this.toast.show(problemMessage(err))
    });
  }

  remove(l: Lead): void {
    if (!confirm('Delete the lead from ' + l.name + '? This cannot be undone.')) return;
    this.admin.deleteLead(l.id).subscribe({
      next: () => { this.leads.update((list) => list.filter((x) => x.id !== l.id)); this.toast.show('Lead deleted'); },
      error: (err: unknown) => this.toast.show(problemMessage(err))
    });
  }

  private replace(u: Lead): void {
    this.leads.update((list) => list.map((x) => (x.id === u.id ? u : x)));
  }
}
