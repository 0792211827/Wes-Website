import { DestroyRef, Directive, ElementRef, effect, inject, input } from '@angular/core';

import { prefersReducedMotion } from '../core/util';

/**
 * Animated numbers: <b [appCountUp]="'-68%'"></b> counts from 0 to -68% when scrolled into view.
 * Keeps prefixes, suffixes, decimals and thousands separators.
 */
@Directive({ selector: '[appCountUp]' })
export class CountUpDirective {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly appCountUp = input.required<string | number>();
  private seen = false;
  private io?: IntersectionObserver;

  constructor() {
    const reduced = prefersReducedMotion();
    effect(() => {
      const target = String(this.appCountUp() ?? '');
      const node = this.el.nativeElement;
      node.textContent = target;
      if (reduced || !('IntersectionObserver' in window)) return;
      if (this.seen) { this.run(target); return; }
      this.io?.disconnect();
      this.io = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        this.seen = true;
        this.io?.disconnect();
        this.run(target);
      }, { threshold: 0.3 });
      this.io.observe(node);
    });
    inject(DestroyRef).onDestroy(() => this.io?.disconnect());
  }

  private run(target: string): void {
    const node = this.el.nativeElement;
    // Bounds such as "< 1 s" or "≥ 0.9" would count through values they exclude; show them as-is.
    if (/^[<>≤≥]/.test(target.trim())) { node.textContent = target; return; }
    const m = target.match(/^([^\d-]*)(-?[\d,]*\.?\d+)(.*)$/);
    if (!m) { node.textContent = target; return; }
    const pre = m[1], raw = m[2], post = m[3];
    const end = parseFloat(raw.replace(/,/g, ''));
    const decimals = (raw.split('.')[1] || '').length;
    const comma = raw.includes(',');
    const t0 = performance.now(), dur = 1100;
    const fmt = (v: number) => {
      let s = v.toFixed(decimals);
      if (comma) s = Number(s).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      return pre + s + post;
    };
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      node.textContent = fmt(end * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
      else node.textContent = target;
    };
    requestAnimationFrame(step);
  }
}
