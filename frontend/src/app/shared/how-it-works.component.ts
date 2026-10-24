import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, effect, inject, input, output, signal,
  untracked, viewChild
} from '@angular/core';

import { HOW_IT_WORKS } from '../core/data/how-it-works.data';
import { HowStep, Project } from '../core/models';
import { pad2, prefersReducedMotion } from '../core/util';

const STEP_MS = 3600;

/**
 * Animated, interactive "How it works" walkthrough for a case study.
 * A data packet travels along the system's steps; the active step lights up and its
 * explanation appears below. Plays by itself while visible; visitors can pause,
 * step back and forth, or click any step. No autoplay under reduced motion.
 */
@Component({
  selector: 'app-how-it-works',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-block' },
  template: `
    <div class="hiw card" #root [style.--n]="steps().length" [style.--p]="progress()">
      <div class="hiw-head">
        <p class="eyebrow"><b>//</b> how it works · {{ project().title }}</p>
        <div class="hiw-controls">
          <button class="icon-btn" type="button" (click)="prev()" aria-label="Previous step">‹</button>
          <button class="icon-btn hiw-play" type="button" (click)="toggle()" [attr.aria-label]="playing() ? 'Pause' : 'Play'">
            {{ playing() ? '❚❚' : '▶' }}
          </button>
          <button class="icon-btn" type="button" (click)="next()" aria-label="Next step">›</button>
          <span class="hiw-count">step {{ num(active()) }} / {{ num(steps().length - 1) }}</span>
        </div>
      </div>

      <div class="hiw-track" role="tablist" aria-label="System steps">
        <span class="hiw-line" aria-hidden="true"><i class="hiw-fill"></i><b class="hiw-packet"></b></span>
        @for (s of steps(); track $index; let i = $index) {
          <button class="hiw-node" type="button" role="tab" [attr.aria-selected]="i === active()"
            [class.on]="i === active()" [class.done]="i < active()" (click)="go(i, true)">
            <span class="hiw-dot">{{ num(i) }}</span>
            <span class="hiw-label">{{ s.title }}</span>
          </button>
        }
      </div>

      <div class="hiw-detail" aria-live="polite">
        @for (s of current(); track active()) {
          <div class="hiw-card">
            <h4><span>{{ num(active()) }}</span> {{ s.title }}</h4>
            <p>{{ s.text || 'Step ' + num(active()) + ' of the system.' }}</p>
            @if (s.stat) {
              <span class="chip c-green hiw-stat">{{ s.stat }}</span>
            }
            <div class="hiw-timer" aria-hidden="true"><i [class.run]="playing() && visible()" [style.animation-duration.ms]="stepMs"></i></div>
          </div>
        }
      </div>
    </div>
  `
})
export class HowItWorksComponent {
  readonly project = input.required<Project>();
  /** Fires when the walkthrough has played through its last step (used to move to the next project). */
  readonly finished = output<void>();

  readonly stepMs = STEP_MS;
  readonly active = signal(0);
  readonly playing = signal(!prefersReducedMotion());
  readonly visible = signal(false);
  readonly steps = computed<HowStep[]>(() => {
    const p = this.project();
    return HOW_IT_WORKS[p.slug] ?? p.arch.map((title) => ({ title, text: '' }));
  });
  readonly current = computed<HowStep[]>(() => {
    const s = this.steps()[this.active()];
    return s ? [s] : [];
  });
  readonly progress = computed(() => {
    const n = this.steps().length;
    return n > 1 ? this.active() / (n - 1) : 0;
  });

  private root = viewChild.required<ElementRef<HTMLElement>>('root');
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    const destroy = inject(DestroyRef);
    /* a new project starts from step 1 */
    effect(() => {
      this.project();
      untracked(() => {
        this.active.set(0);
        this.schedule();
      });
    });
    afterNextRender(() => {
      if (!('IntersectionObserver' in window)) { this.visible.set(true); this.schedule(); return; }
      const io = new IntersectionObserver((e) => {
        this.visible.set(e[0].isIntersecting);
        this.schedule();
      }, { threshold: 0.35 });
      io.observe(this.root().nativeElement);
      destroy.onDestroy(() => io.disconnect());
    });
    destroy.onDestroy(() => clearTimeout(this.timer));
  }

  num(i: number): string { return pad2(i + 1); }

  go(i: number, manual = false): void {
    const n = this.steps().length;
    this.active.set(((i % n) + n) % n);
    if (manual) this.playing.set(false);
    this.schedule();
  }

  next(): void { this.go(this.active() + 1, true); }
  prev(): void { this.go(this.active() - 1, true); }

  toggle(): void {
    this.playing.set(!this.playing());
    this.schedule();
  }

  private schedule(): void {
    clearTimeout(this.timer);
    if (!this.playing() || !this.visible()) return;
    this.timer = setTimeout(() => {
      const last = this.active() >= this.steps().length - 1;
      if (last) {
        this.finished.emit();
        this.active.set(0);
      } else {
        this.active.set(this.active() + 1);
      }
      this.schedule();
    }, STEP_MS);
  }
}
