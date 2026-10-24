import { Injectable } from '@angular/core';

import { pad2, prefersReducedMotion } from './util';

const WATCH = '.reveal, [data-w], .draw-ready, .split';
const STAGGER_PARENTS = '.grid-3, .grid-2, .work-list, .formats, .results, .repos, .timeline, .faq, .related';

type Marked = HTMLElement & { __wnMotion?: boolean };

/**
 * The motion layer, shared by every page:
 *  - reveal-on-scroll for anything with .reveal / .split / [data-w] / .draw-ready
 *    (new elements are picked up automatically through a MutationObserver)
 *  - staggered cards in grids, self-drawing SVG diagrams, animated bars
 *  - pointer glow over the grid, magnetic buttons, subtle card tilt
 * Everything is skipped when the visitor prefers reduced motion.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  readonly reduced = prefersReducedMotion();
  private io?: IntersectionObserver;
  private mo?: MutationObserver;
  private scheduled = false;

  /** Start watching a container (the <main> element). */
  watch(root: HTMLElement): void {
    if (!this.reduced && 'IntersectionObserver' in window) {
      this.io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          this.show(e.target as HTMLElement);
          this.io?.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    }
    const scan = () => {
      this.scheduled = false;
      root.querySelectorAll<HTMLElement>(WATCH).forEach((el) => this.track(el as Marked));
    };
    scan();
    this.mo = new MutationObserver(() => {
      if (this.scheduled) return;
      this.scheduled = true;
      requestAnimationFrame(scan);
    });
    this.mo.observe(root, { childList: true, subtree: true });
  }

  private track(el: Marked): void {
    if (el.__wnMotion) return;
    el.__wnMotion = true;
    const parent = el.parentElement;
    const grid = parent?.closest(STAGGER_PARENTS);
    if (grid && el.classList.contains('reveal')) {
      const items = Array.from(grid.querySelectorAll(':scope > *, :scope > .host-contents > *'));
      const idx = items.indexOf(el);
      if (idx > -1) el.style.setProperty('--i', String(idx % 6));
    }
    if (el.classList.contains('draw-ready')) {
      el.querySelectorAll('path, rect, circle, line, polyline').forEach((s) => s.setAttribute('pathLength', '1'));
    }
    if (this.io) this.io.observe(el);
    else this.show(el);
  }

  show(el: HTMLElement): void {
    el.classList.add('in');
    const w = el.getAttribute('data-w');
    if (w) el.style.width = w + '%';
    if (el.classList.contains('draw-ready')) el.classList.add('drawn');
    el.querySelectorAll('.draw-ready').forEach((s) => s.classList.add('drawn'));
  }

  /** Pointer glow, magnetic buttons, card tilt and the scroll progress bar. Called once by the app shell. */
  initGlobal(glow: HTMLElement, grid: HTMLElement, progress: HTMLElement): void {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    if (this.reduced || !window.matchMedia('(pointer: fine)').matches) return;

    let tx = innerWidth / 2, ty = innerHeight / 3, x = tx, y = ty, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      glow.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      grid.style.setProperty('--mx', x.toFixed(1) + 'px');
      grid.style.setProperty('--my', y.toFixed(1) + 'px');
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.4 ? requestAnimationFrame(loop) : 0;
    };

    document.addEventListener('pointermove', (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      glow.classList.add('on'); grid.classList.add('on');
      if (!raf) raf = requestAnimationFrame(loop);

      const target = e.target as Element | null;
      if (!target || !target.closest) return;

      /* magnetic buttons */
      const b = target.closest<HTMLElement>('.btn-primary, .fab, #barCta');
      document.querySelectorAll<HTMLElement>('.magnetic-on').forEach((m) => {
        if (m !== b) { m.style.transform = ''; m.classList.remove('magnetic-on'); }
      });
      if (b) {
        const r = b.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        b.classList.add('magnetic', 'magnetic-on');
        b.style.transform = 'translate(' + (dx * 8).toFixed(1) + 'px,' + (dy * 6).toFixed(1) + 'px)';
      }

      /* card tilt + spotlight */
      const c = target.closest<HTMLElement>('.card-link');
      document.querySelectorAll<HTMLElement>('.tilting').forEach((t) => {
        if (t !== c) { t.style.removeProperty('--rx'); t.style.removeProperty('--ry'); t.classList.remove('tilting'); }
      });
      if (c) {
        const r = c.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        c.classList.add('tilting');
        c.style.setProperty('--rx', (-py * 3).toFixed(2) + 'deg');
        c.style.setProperty('--ry', (px * 4).toFixed(2) + 'deg');
        c.style.setProperty('--gx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--gy', (e.clientY - r.top) + 'px');
      }
    }, { passive: true });

    document.documentElement.addEventListener('pointerleave', () => {
      glow.classList.remove('on');
      grid.classList.remove('on');
    });
  }

  /** "hh:mm:ss" since the page opened, for the footer. */
  static uptime(start: number): string {
    const s = Math.floor((Date.now() - start) / 1000);
    return pad2(Math.floor(s / 3600)) + ':' + pad2(Math.floor(s / 60) % 60) + ':' + pad2(s % 60);
  }
}
