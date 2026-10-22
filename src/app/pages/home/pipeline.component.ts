import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild
} from '@angular/core';

import { PHILOSOPHY } from '../../core/data/site.data';
import { MotionService } from '../../core/motion.service';

/** Problem → … → Production. A line fills as you scroll and each stage lights up when reached. */
@Component({
  selector: 'app-pipeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-contents' },
  template: `
    <ol class="pipeline" #pipe aria-label="From problem to production">
      <span class="fill" [style.height]="fill()" aria-hidden="true"></span>
      @for (s of stages; track s.title; let i = $index; let last = $last) {
        <li class="stage" [class.final]="last" [class.lit]="lit()[i]" [class.open]="open() === i" tabindex="0"
          (click)="open.set(open() === i ? -1 : i)">
          <span class="stage-n" aria-hidden="true"></span>
          <div><h3>{{ s.title }}</h3><p>{{ s.text }}</p></div>
        </li>
      }
    </ol>
  `
})
export class PipelineComponent {
  readonly stages = PHILOSOPHY;
  readonly fill = signal('0px');
  readonly lit = signal<boolean[]>(PHILOSOPHY.map(() => false));
  readonly open = signal(-1);
  private pipe = viewChild.required<ElementRef<HTMLElement>>('pipe');

  constructor() {
    const motion = inject(MotionService);
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const pipe = this.pipe().nativeElement;
      if (motion.reduced) {
        this.fill.set('calc(100% - 40px)');
        this.lit.set(this.stages.map(() => true));
        return;
      }
      const update = () => {
        const r = pipe.getBoundingClientRect();
        const max = r.height - 40;
        const prog = Math.min(1, Math.max(0, (window.innerHeight * 0.62 - r.top) / r.height));
        const h = prog * max;
        this.fill.set(h + 'px');
        const items = Array.from(pipe.querySelectorAll<HTMLElement>('.stage'));
        this.lit.set(items.map((s) => s.offsetTop <= h + 4));
      };
      update();
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      destroy.onDestroy(() => {
        window.removeEventListener('scroll', update);
        window.removeEventListener('resize', update);
      });
    });
  }
}
