import { Injectable, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

/** Dark is the default (client request). The choice is remembered per browser. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.initial());
  private listeners: Array<() => void> = [];

  private initial(): Theme {
    const attr = document.documentElement.getAttribute('data-theme');
    return attr === 'light' ? 'light' : 'dark';
  }

  toggle(): void {
    this.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  set(t: Theme): void {
    this.theme.set(t);
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('wn-theme', t); } catch { /* private mode */ }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#000000' : '#ffffff');
    this.listeners.forEach((fn) => fn());
  }

  /** Canvas-based components redraw when the theme changes. Returns an unsubscribe function. */
  onChange(fn: () => void): () => void {
    this.listeners.push(fn);
    return () => { this.listeners = this.listeners.filter((x) => x !== fn); };
  }
}
