import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal, viewChild
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MotionService } from '../core/motion.service';
import { pad2 } from '../core/util';
import { systemSVG } from './art';

type Kind = 'a' | 'b' | 'c';
interface Packet { el: SVGCircleElement; kind: Kind; d: number; speed: number; }
interface LogLine { id: number; text: string; cls: string; }

/**
 * Simulated live trace of a RAG request path: packets travel request → gateway → retriever
 * → vector DB / cache → LLM → evaluator → response, lighting up each node they pass.
 * Runs only while visible; static under reduced motion. Clearly labelled as simulated.
 */
@Component({
  selector: 'app-system-trace',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-block' },
  template: `
    <div class="window">
      <div class="window-bar">
        <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="grow">~/systems/knowledge-assistant — live trace <span class="muted-i">(simulated)</span></span>
        <span class="status-dot" aria-hidden="true"></span><span>healthy</span>
      </div>
      <div class="system-grid">
        <div class="sys-canvas" #canvas [innerHTML]="svg" tabindex="0" role="region" aria-label="Request flow diagram"></div>
        <aside class="sys-side" aria-label="Simulated system metrics">
          <div class="sys-metrics">
            <div class="metric"><b>{{ p50() }}ms</b><span>p50 latency</span><div class="bar-mini"><i [style.width.%]="p50() / 15"></i></div></div>
            <div class="metric"><b>{{ tps().toLocaleString('en-US') }}</b><span>tokens / s</span><div class="bar-mini"><i [style.width.%]="tps() / 30"></i></div></div>
            <div class="metric"><b>{{ faith() }}</b><span>faithfulness</span><div class="bar-mini"><i [style.width.%]="faithPct()"></i></div></div>
            <div class="metric"><b>{{ reqs().toLocaleString('en-US') }}</b><span>requests</span><div class="bar-mini"><i [style.width.%]="(reqs() % 100) + 4"></i></div></div>
          </div>
          <div class="sys-log" aria-hidden="true">
            @for (l of logLines(); track l.id) {
              <div [class]="l.cls">{{ l.text }}</div>
            }
          </div>
        </aside>
      </div>
    </div>
  `
})
export class SystemTraceComponent {
  readonly svg = inject(DomSanitizer).bypassSecurityTrustHtml(systemSVG());
  readonly p50 = signal(812);
  readonly tps = signal(2410);
  readonly faith = signal('0.94');
  readonly faithPct = computed(() => Number(this.faith()) * 100);
  readonly reqs = signal(0);
  readonly logLines = signal<LogLine[]>([]);

  private canvas = viewChild.required<ElementRef<HTMLElement>>('canvas');
  private motion = inject(MotionService);
  private lineId = 0;

  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const stop = this.start();
      destroy.onDestroy(stop);
    });
  }

  private log(text: string, cls = ''): void {
    const d = new Date();
    const stamp = '[' + pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds()) + '] ';
    this.logLines.update((l) => [...l, { id: this.lineId++, text: stamp + text, cls }].slice(-7));
  }

  private start(): () => void {
    const svg = this.canvas().nativeElement.querySelector('svg');
    if (!svg) return () => undefined;
    const layer = svg.querySelector('#packets');
    const routes: Record<Kind, SVGPathElement | null> = {
      a: svg.querySelector<SVGPathElement>('#route-a'),
      b: svg.querySelector<SVGPathElement>('#route-b'),
      c: svg.querySelector<SVGPathElement>('#route-c')
    };
    const nodes = Array.from(svg.querySelectorAll<SVGGElement>('.sys-node')).map((g) => ({
      el: g, x: Number(g.dataset['x']), y: Number(g.dataset['y'])
    }));

    if (this.motion.reduced || !layer || !routes.a || !routes.b || !routes.c) {
      nodes.forEach((n) => n.el.classList.add('hot'));
      this.log('animation paused (reduced motion)');
      this.log('200 POST /api/ask · 812ms · 8 chunks · faith 0.94', 'ok');
      return () => undefined;
    }
    const lens: Record<Kind, number> = { a: routes.a.getTotalLength(), b: routes.b.getTotalLength(), c: routes.c.getTotalLength() };
    const packets: Packet[] = [];
    const lat: number[] = [];
    let raf = 0, last = 0, spawnIn = 300, visible = true;
    this.log('trace started · simulated traffic');

    const spawn = () => {
      const r = Math.random();
      const kind: Kind = r < 0.62 ? 'a' : r < 0.86 ? 'b' : 'c';
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('r', '4');
      c.setAttribute('class', 'sys-packet' + (kind === 'c' ? ' slow' : ''));
      layer.appendChild(c);
      packets.push({ el: c, kind, d: 0, speed: kind === 'b' ? 420 : kind === 'c' ? 230 : 300 });
    };
    const done = (p: Packet) => {
      this.reqs.update((n) => n + 1);
      const ms = Math.round(p.kind === 'b' ? 180 + Math.random() * 140 : p.kind === 'c' ? 1350 + Math.random() * 600 : 620 + Math.random() * 420);
      lat.push(ms);
      if (lat.length > 30) lat.shift();
      const sorted = lat.slice().sort((x, y) => x - y);
      const faith = (0.9 + Math.random() * 0.08).toFixed(2);
      if (p.kind === 'a') this.log('200 POST /api/ask · ' + ms + 'ms · 8 chunks · faith ' + faith, 'ok');
      if (p.kind === 'b') this.log('200 POST /api/ask · ' + ms + 'ms · cache hit', 'ok');
      if (p.kind === 'c') this.log('200 POST /api/ask · ' + ms + 'ms · eval retry → passed', 'warn');
      this.p50.set(sorted[Math.floor(sorted.length / 2)]);
      this.tps.set(Math.round(2200 + Math.random() * 600));
      this.faith.set(faith);
    };
    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) { last = t; return; }
      const dt = Math.min(0.05, (t - (last || t)) / 1000);
      last = t;
      spawnIn -= dt * 1000;
      if (spawnIn <= 0 && packets.length < 6) { spawn(); spawnIn = 700 + Math.random() * 900; }
      const hot = new Set<number>();
      for (let k = packets.length - 1; k >= 0; k--) {
        const p = packets[k];
        p.d += p.speed * dt;
        const route = routes[p.kind] as SVGPathElement;
        if (p.d >= lens[p.kind]) { p.el.remove(); packets.splice(k, 1); done(p); continue; }
        const pt = route.getPointAtLength(p.d);
        p.el.setAttribute('cx', pt.x.toFixed(1));
        p.el.setAttribute('cy', pt.y.toFixed(1));
        nodes.forEach((n, idx) => {
          if (pt.x >= n.x && pt.x <= n.x + 100 && pt.y >= n.y && pt.y <= n.y + 46) hot.add(idx);
        });
      }
      nodes.forEach((n, idx) => n.el.classList.toggle('hot', hot.has(idx)));
    };
    raf = requestAnimationFrame(frame);
    let io: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((e) => { visible = e[0].isIntersecting; }, { threshold: 0 });
      io.observe(svg);
    }
    return () => { cancelAnimationFrame(raf); io?.disconnect(); };
  }
}
