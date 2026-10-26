import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, afterRenderEffect, computed, effect, inject, input, signal,
  untracked
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { DIAGRAMS } from '../core/data/diagrams';
import { esc, pad2, prefersReducedMotion } from '../core/util';

const STEP_MS = 1900;
const MOVE_MS = 1000;
const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * One architecture diagram from the bundled registry; scrolls sideways on narrow screens instead of shrinking.
 * Diagrams with `steps` play like a looping GIF while on screen: each step's boxes and connectors light up and a
 * packet travels along the connectors. Visitors can pause or step through; no autoplay under reduced motion.
 */
@Component({
  selector: 'app-diagram',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-block' },
  template: `
    @if (diagram(); as d) {
      <figure class="diagram reveal" [class.stepping]="step() >= 0" [class.playing]="playing()">
        <div class="diagram-scroll" (pointerdown)="touched = true" (wheel)="touched = true" tabindex="0" role="region" [attr.aria-label]="d.title + ' (scrolls sideways)'" [innerHTML]="svg()"></div>
        @if (d.steps?.length) {
          <div class="dg-player">
            <button class="icon-btn" type="button" (click)="go(step() < 0 ? count() - 1 : step() - 1)" aria-label="Previous step">‹</button>
            <button class="icon-btn" type="button" (click)="toggle()" [attr.aria-label]="playing() ? 'Pause animation' : 'Play animation'">
              {{ playing() ? '❚❚' : '▶︎' }}
            </button>
            <button class="icon-btn" type="button" (click)="go(step() + 1)" aria-label="Next step">›</button>
            <!-- always polite; the text is hidden from assistive tech while autoplaying so it is announced only on manual steps -->
            <p class="dg-step" aria-live="polite"><span [attr.aria-hidden]="playing() ? 'true' : null">
              @if (step() >= 0) {
                <b>{{ num(step()) }} / {{ num(d.steps!.length - 1) }}</b> {{ d.steps![step()] }}
              } @else {
                <b>{{ d.steps!.length }} steps</b> {{ playing() ? 'the whole system' : 'press play or step through' }}
              }
            </span></p>
          </div>
        }
        <figcaption><b>{{ d.title }}.</b> {{ d.caption }}</figcaption>
      </figure>
    }
  `
})
export class DiagramComponent {
  private sanitizer = inject(DomSanitizer);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly key = input.required<string>();
  readonly diagram = computed(() => DIAGRAMS[this.key()]);
  readonly svg = computed<SafeHtml>(() => {
    const d = this.diagram();
    if (!d) return '';
    const id = 'dg-' + this.key().replace(/[^a-z0-9-]/gi, '');
    return this.sanitizer.bypassSecurityTrustHtml(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + esc(d.viewBox) + '" role="img" aria-labelledby="' + id + '-t ' + id + '-d">' +
      '<title id="' + id + '-t">' + esc(d.title) + '</title><desc id="' + id + '-d">' + esc(d.caption) + '</desc>' + d.svg + '</svg>');
  });

  /** Current step, 0-based; -1 shows the whole diagram with nothing highlighted. */
  readonly step = signal(-1);
  private readonly reduced = prefersReducedMotion();
  readonly playing = signal(!this.reduced);
  private readonly visible = signal(false);
  readonly count = computed(() => this.diagram()?.steps?.length ?? 0);
  private timer: ReturnType<typeof setTimeout> | undefined;
  private raf = 0;
  /** Set once the visitor scrolls the diagram themselves; autoplay then stops panning it. */
  touched = false;

  constructor() {
    const destroy = inject(DestroyRef);
    /* a new diagram starts from the full view */
    effect(() => {
      this.key();
      untracked(() => {
        this.step.set(-1);
        this.schedule();
      });
    });
    afterRenderEffect(() => this.apply(this.step(), this.svg()));
    afterNextRender(() => {
      if (!('IntersectionObserver' in window)) { this.visible.set(true); this.schedule(); return; }
      const io = new IntersectionObserver((e) => {
        this.visible.set(e[e.length - 1].isIntersecting);
        this.schedule();
      }, { threshold: 0.35 });
      io.observe(this.host.nativeElement);
      destroy.onDestroy(() => io.disconnect());
    });
    destroy.onDestroy(() => {
      clearTimeout(this.timer);
      cancelAnimationFrame(this.raf);
    });
  }

  num(i: number): string { return pad2(i + 1); }

  go(i: number): void {
    const n = this.count();
    if (!n) return;
    this.playing.set(false);
    this.step.set(((i % n) + n) % n);
    this.schedule();
  }

  toggle(): void {
    this.playing.set(!this.playing());
    if (this.playing() && this.step() < 0) this.step.set(0);
    this.schedule();
  }

  private schedule(): void {
    clearTimeout(this.timer);
    if (!this.count() || !this.playing() || !this.visible()) return;
    this.timer = setTimeout(() => {
      const s = this.step();
      // after the last step, rest one beat on the whole diagram, then loop
      this.step.set(s >= this.count() - 1 ? -1 : s + 1);
      this.schedule();
    }, STEP_MS);
  }

  /** Lights up the current step's elements and sends a packet along its connectors. */
  private apply(step: number, _svg: SafeHtml): void {
    const svg = this.host.nativeElement.querySelector('svg');
    if (!svg) return;
    const tag = String(step + 1);
    svg.querySelectorAll('[data-step]').forEach((el) => {
      el.classList.toggle('is-on', step >= 0 && (el.getAttribute('data-step') ?? '').split(/\s+/).includes(tag));
    });
    this.pan(svg);
    cancelAnimationFrame(this.raf);
    svg.querySelectorAll('.dg-packet').forEach((c) => c.remove());
    if (step < 0 || this.reduced) return;
    const dots = Array.from(svg.querySelectorAll<SVGGeometryElement>('path.is-on, line.is-on')).map((path) => {
      const dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('class', 'dg-packet');
      dot.setAttribute('r', '4.5');
      svg.appendChild(dot);
      return { path, dot, len: path.getTotalLength() };
    });
    const t0 = performance.now();
    const frame = (now: number) => {
      const t = Math.min(1, (now - t0) / MOVE_MS);
      const e = t < 0.5 ? 2 * t * t : 1 - (2 - 2 * t) ** 2 / 2;
      for (const d of dots) {
        const pt = d.path.getPointAtLength(e * d.len);
        d.dot.setAttribute('cx', String(pt.x));
        d.dot.setAttribute('cy', String(pt.y));
      }
      if (t < 1) this.raf = requestAnimationFrame(frame);
    };
    this.raf = requestAnimationFrame(frame);
  }

  /** On narrow screens the diagram scrolls sideways; keep the lit step in view (always on manual steps). */
  private pan(svg: SVGSVGElement): void {
    const box = svg.parentElement;
    const on = Array.from(svg.querySelectorAll('.is-on'));
    if (!box || !on.length || box.scrollWidth <= box.clientWidth || (this.playing() && this.touched)) return;
    const rects = on.map((el) => el.getBoundingClientRect());
    const left = Math.min(...rects.map((r) => r.left));
    const right = Math.max(...rects.map((r) => r.right));
    const view = box.getBoundingClientRect();
    const target = box.scrollLeft + (left + right) / 2 - (view.left + view.right) / 2;
    box.scrollTo({ left: target, behavior: this.reduced ? 'auto' : 'smooth' });
  }
}
