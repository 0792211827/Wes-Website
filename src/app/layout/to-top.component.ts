import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';

import { MotionService } from '../core/motion.service';
import { IconComponent } from '../shared/icon.component';

const C = 2 * Math.PI * 22;

/** Back-to-top button whose ring fills as you scroll. */
@Component({
  selector: 'app-to-top',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-contents' },
  template: `
    <button class="to-top" [class.show]="show()" type="button" aria-label="Back to top" (click)="top()">
      <svg class="ring" viewBox="0 0 46 46" aria-hidden="true">
        <circle cx="23" cy="23" r="22" [style.stroke-dasharray]="circ" [style.stroke-dashoffset]="offset()"></circle>
      </svg>
      <span class="arrow"><app-icon name="up" /></span>
    </button>
  `
})
export class ToTopComponent {
  private motion = inject(MotionService);
  readonly circ = C;
  readonly show = signal(false);
  readonly offset = signal(C);

  @HostListener('window:scroll')
  onScroll(): void {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const k = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    this.show.set(window.scrollY > 600);
    this.offset.set(C * (1 - k));
  }

  top(): void {
    window.scrollTo({ top: 0, behavior: this.motion.reduced ? 'auto' : 'smooth' });
  }
}
