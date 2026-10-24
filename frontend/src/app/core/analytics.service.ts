import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { environment } from '../../environments/environment';

/**
 * Privacy-light visitor tracking for the admin Workspace (described on the privacy page):
 * page views, time on page, CV downloads, outbound clicks, questions to the AI and contact forms.
 * A random visitor id lives in this browser; nothing is sent from /admin, and
 * "Don't track this browser" in the admin switches it off completely.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private router = inject(Router);
  private base = environment.apiUrl;
  private visitorId = this.id(localStorageSafe(), 'wn-vid');
  private sessionId = this.id(sessionStorageSafe(), 'wn-sid-a');
  private currentViewId: number | null = null;
  private viewStarted = 0;
  private segmentStart = 0;
  private accumulated = 0;
  private paused = false;
  private firstView = true;
  private started = false;

  /** Switched off for this browser (set from the admin). */
  get disabled(): boolean {
    try { return localStorage.getItem('wn-notrack') === '1'; } catch { return false; }
  }

  setDisabled(off: boolean): void {
    try {
      if (off) localStorage.setItem('wn-notrack', '1');
      else localStorage.removeItem('wn-notrack');
    } catch { /* ignore */ }
  }

  start(): void {
    if (this.started) return;
    this.started = true;
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e) => {
      this.flush(true);
      const path = e.urlAfterRedirects.split('#')[0];
      if (path.startsWith('/admin')) return;
      /* wait a moment so the page has set its title */
      setTimeout(() => this.pageView(path), 400);
    });
    /* time on page only counts while the tab is visible */
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush(false);
        this.paused = true;
      } else {
        this.segmentStart = Date.now();
        this.paused = false;
      }
    });
    window.addEventListener('pagehide', () => this.flush(true));
    /* CV downloads and links that leave the site */
    document.addEventListener('click', (ev) => {
      const a = (ev.target as Element | null)?.closest?.('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href.includes('/api/files/cv') || href.endsWith('.pdf')) this.track('cv_download', a.textContent?.trim() || 'CV');
      else if (/^(https?:|mailto:|tel:)/.test(href) && !href.includes(location.host)) this.track('outbound', describe(href));
    }, { capture: true });
  }

  track(type: string, label?: string): void {
    if (this.disabled || location.pathname.startsWith('/admin')) return;
    this.send({ type, label: label?.slice(0, 300), path: location.pathname + location.search, title: document.title });
  }

  private pageView(path: string): void {
    if (this.disabled) return;
    const referrer = this.firstView ? document.referrer : '';
    this.firstView = false;
    this.viewStarted = Date.now();
    this.segmentStart = this.viewStarted;
    this.accumulated = 0;
    this.paused = document.visibilityState === 'hidden';
    this.currentViewId = null;
    const started = this.viewStarted;
    this.send({
      type: 'pageview', path, title: document.title, referrer,
      screen: window.screen ? window.screen.width + 'x' + window.screen.height : '',
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }).then((id) => {
      /* ignore late answers for a page the visitor already left */
      if (id && this.viewStarted === started) this.currentViewId = id;
    });
  }

  /** Send the visible time spent on the current page; final = the visitor left the page. */
  private flush(final: boolean): void {
    if (this.currentViewId === null || this.disabled) return;
    if (!this.paused) {
      this.accumulated += Date.now() - this.segmentStart;
      this.segmentStart = Date.now();
    }
    const refId = this.currentViewId;
    if (final) this.currentViewId = null;
    this.send({ type: 'leave', refId, durationMs: this.accumulated });
  }

  private send(body: Record<string, unknown>): Promise<number | null> {
    const payload = JSON.stringify({ visitorId: this.visitorId, sessionId: this.sessionId, ...body });
    try {
      return fetch(this.base + '/api/track', {
        method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: payload
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((j: { id?: number } | null) => (j && typeof j.id === 'number' ? j.id : null))
        .catch(() => null);
    } catch {
      return Promise.resolve(null);
    }
  }

  private id(store: Storage | null, key: string): string {
    try {
      let v = store?.getItem(key);
      if (!v) {
        v = (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36)).replace(/-/g, '').slice(0, 32);
        store?.setItem(key, v);
      }
      return v;
    } catch {
      return Math.random().toString(36).slice(2, 18);
    }
  }
}

function localStorageSafe(): Storage | null {
  try { return localStorage; } catch { return null; }
}

function sessionStorageSafe(): Storage | null {
  try { return sessionStorage; } catch { return null; }
}

function describe(href: string): string {
  if (href.startsWith('mailto:')) return 'Email';
  if (href.startsWith('tel:')) return 'Phone';
  try {
    const host = new URL(href).hostname.replace(/^www\./, '');
    if (host.includes('linkedin')) return 'LinkedIn';
    if (host.includes('github')) return 'GitHub';
    if (host.includes('wa.me') || host.includes('whatsapp')) return 'WhatsApp';
    return host;
  } catch {
    return href.slice(0, 80);
  }
}
