import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, signal } from '@angular/core';

import { prefersReducedMotion } from '../core/util';

export interface TocItem {
  id: string;
  label: string;
}

/** Sticky "on this page" navigation with scroll-spy. */
@Component({
  selector: 'app-toc',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-contents' },
  template: `
    <nav class="toc" aria-label="On this page">
      <p>on this page</p>
      @for (s of sections(); track s.id) {
        <a [href]="'#' + s.id" [class.on]="active() === s.id" (click)="go($event, s.id)">{{ s.label }}</a>
      }
    </nav>
  `
})
export class TocComponent {
  readonly sections = input.required<TocItem[]>();
  readonly active = signal('');
  private io?: IntersectionObserver;

  constructor() {
    effect(() => {
      const secs = this.sections();
      setTimeout(() => this.observe(secs), 60);
    });
    inject(DestroyRef).onDestroy(() => this.io?.disconnect());
  }

  go(e: Event, id: string): void {
    e.preventDefault();
    const t = document.getElementById(id);
    if (t) t.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    this.active.set(id);
  }

  private observe(secs: TocItem[]): void {
    this.io?.disconnect();
    if (!('IntersectionObserver' in window)) return;
    this.io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) this.active.set(e.target.id); });
    }, { rootMargin: '-25% 0px -65% 0px' });
    secs.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) this.io?.observe(el);
    });
  }
}
