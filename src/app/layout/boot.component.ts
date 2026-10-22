import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, inject, signal } from '@angular/core';

import { MotionService } from '../core/motion.service';
import { UiStateService } from '../core/ui-state.service';

const LINES: Array<[string, string]> = [
  ['$ ssh wesley@ai-engineering', ''],
  ['  establishing secure session ............', 'ok'],
  ['  loading case studies ...................', 'ok'],
  ['  warming up inference (vLLM) ............', 'ok'],
  ['  running evaluation suite ...............', '412/412 passed'],
  ['  production readiness ...................', 'ready']
];

/** Terminal boot intro: first visit to the home page in a browser session only. Any key or click skips it. */
@Component({
  selector: 'app-boot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-contents' },
  template: `
    @if (visible()) {
      <div class="boot" [class.done]="done()" aria-hidden="true" (click)="finish()">
        <div class="boot-term">
          @for (l of shown(); track $index) {
            <div><span [class.dim]="$index > 0">{{ l[0] }}</span>@if (l[1]) { <span class="ok">{{ l[1] }}</span>}</div>
          }
          <div class="boot-bar"><i [style.width.%]="progress()"></i></div>
        </div>
        <span class="boot-skip">press any key to skip</span>
      </div>
    }
  `
})
export class BootComponent {
  private ui = inject(UiStateService);
  readonly visible = signal(false);
  readonly done = signal(false);
  readonly shown = signal<Array<[string, string]>>([]);
  readonly progress = signal(0);
  private timers: Array<ReturnType<typeof setTimeout>> = [];
  private finished = false;

  constructor() {
    const motion = inject(MotionService);
    let seen = false;
    try {
      seen = sessionStorage.getItem('wn-boot') === '1';
      sessionStorage.setItem('wn-boot', '1');
    } catch { /* ignore */ }
    const onHome = location.pathname === '/' || location.pathname === '';
    if (motion.reduced || seen || !onHome) {
      this.ui.finishBoot();
      return;
    }
    this.visible.set(true);
    let i = 0;
    const next = () => {
      if (this.finished) return;
      if (i >= LINES.length) { this.timers.push(setTimeout(() => this.finish(), 260)); return; }
      this.shown.update((s) => [...s, LINES[i]]);
      i++;
      this.progress.set((i / LINES.length) * 100);
      this.timers.push(setTimeout(next, i === 1 ? 260 : 170));
    };
    this.timers.push(setTimeout(next, 120));
    inject(DestroyRef).onDestroy(() => this.timers.forEach((t) => clearTimeout(t)));
  }

  @HostListener('document:keydown')
  onKey(): void {
    if (this.visible() && !this.finished) this.finish();
  }

  finish(): void {
    if (this.finished) return;
    this.finished = true;
    this.done.set(true);
    this.ui.finishBoot();
    this.timers.push(setTimeout(() => this.visible.set(false), 520));
  }
}
