import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';

import { SITE } from '../../core/data/site.data';
import { MotionService } from '../../core/motion.service';
import { ThemeService } from '../../core/theme.service';
import { UiStateService } from '../../core/ui-state.service';

const RAMP = ' .\'`^",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
/** How long the slow-motion ASCII decode takes before the photo is revealed. */
const DECODE_MS = 3000;
/** Rows below the reveal line that flicker with random characters while "decoding". */
const BAND = 7;
let shownOnce = false;

/**
 * Wesley's photo (public/assets/wesley.jpg), first drawn as ASCII art that types in row by row,
 * then a scan line sweeps down and reveals the real photo. Hovering the photo flips it back to
 * the ASCII version, where characters near the pointer light up.
 * Without a photo a neutral silhouette is drawn in ASCII and stays that way.
 */
@Component({
  selector: 'app-ascii-portrait',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-contents' },
  template: `
    <div class="ascii" #box role="img" aria-label="Portrait of Wesley Nyamosi"
      [class.photo-on]="photoShown()" [class.revealing]="revealing()"
      (pointerenter)="hover(true)" (pointerleave)="hover(false)">
      <canvas #cv></canvas>
      @if (photoOk()) {
        <img class="ascii-photo" [class.show]="photoShown()" [src]="photo" alt="" decoding="async">
      }
      <span class="ascii-scan" aria-hidden="true"></span>
    </div>
  `
})
export class AsciiPortraitComponent {
  private box = viewChild.required<ElementRef<HTMLElement>>('box');
  private cv = viewChild.required<ElementRef<HTMLCanvasElement>>('cv');
  private motion = inject(MotionService);
  private theme = inject(ThemeService);
  private ui = inject(UiStateService);
  private stop: (() => void) | null = null;
  readonly photo = SITE.photo;
  /** The real photo exists and loaded. */
  readonly photoOk = signal(false);
  /** The real photo is currently showing over the ASCII art. */
  readonly photoShown = signal(false);
  readonly revealing = signal(false);
  private revealed = false;
  private revealTimer: ReturnType<typeof setTimeout> | undefined;

  /** Hover flips back to the ASCII art (desktop); leaving shows the photo again. */
  hover(on: boolean): void {
    if (!this.revealed || this.motion.reduced) return;
    this.photoShown.set(!on);
  }

  private reveal(delay: number): void {
    clearTimeout(this.revealTimer);
    if (!this.photoOk() || this.revealed) return;
    this.revealTimer = setTimeout(() => {
      this.revealed = true;
      this.revealing.set(true);
      this.photoShown.set(true);
      setTimeout(() => this.revealing.set(false), 1300);
    }, delay);
  }

  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      this.init();
      let t: ReturnType<typeof setTimeout> | undefined;
      const onResize = () => { clearTimeout(t); t = setTimeout(() => this.init(), 200); };
      window.addEventListener('resize', onResize);
      const offTheme = this.theme.onChange(() => this.redraw?.());
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => this.init());
      destroy.onDestroy(() => {
        window.removeEventListener('resize', onResize);
        offTheme();
        clearTimeout(this.revealTimer);
        this.stop?.();
      });
    });
  }

  private redraw: (() => void) | null = null;

  private init(): void {
    this.stop?.();
    const reduced = this.motion.reduced;
    const box = this.box().nativeElement, cv = this.cv().nativeElement;
    const W = box.clientWidth, H = box.clientHeight;
    if (!W || !H) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const fs = W < 280 ? 6 : 7;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = '600 ' + fs + 'px "IBM Plex Mono", ui-monospace, monospace';
    const cw = Math.max(3.4, ctx.measureText('M').width);
    const cols = Math.floor(W / cw), rows = Math.floor(H / fs);
    const off = document.createElement('canvas');
    off.width = cols;
    off.height = rows;
    const o = off.getContext('2d', { willReadFrequently: true });
    if (!o) return;
    o.setTransform(1 / cw, 0, 0, 1 / fs, 0, 0);
    let lum: Float32Array | null = null;
    let raf = 0, hoverRaf = 0, hx = -999, hy = -999, cancelled = false;

    const silhouette = () => {
      o.fillStyle = '#000'; o.fillRect(0, 0, W, H);
      const g = o.createRadialGradient(W * 0.38, H * 0.28, 4, W * 0.5, H * 0.45, W * 0.75);
      g.addColorStop(0, '#fff'); g.addColorStop(0.45, '#9a9a9a'); g.addColorStop(1, '#1a1a1a');
      o.fillStyle = g;
      o.beginPath(); o.ellipse(W * 0.5, H * 0.34, W * 0.2, H * 0.19, 0, 0, Math.PI * 2); o.fill();
      o.fillRect(W * 0.43, H * 0.48, W * 0.14, H * 0.1);
      o.beginPath(); o.ellipse(W * 0.5, H * 0.98, W * 0.47, H * 0.36, 0, Math.PI, 0); o.fill();
      o.fillStyle = 'rgba(0,0,0,.55)';
      o.beginPath(); o.ellipse(W * 0.5, H * 0.17, W * 0.21, H * 0.06, 0, Math.PI, 0); o.fill();
    };
    const sample = () => {
      const d = o.getImageData(0, 0, cols, rows).data;
      lum = new Float32Array(cols * rows);
      for (let k = 0; k < cols * rows; k++) {
        const v = (0.2126 * d[k * 4] + 0.7152 * d[k * 4 + 1] + 0.0722 * d[k * 4 + 2]) / 255;
        lum[k] = Math.min(1, Math.max(0, (v - 0.5) * 1.35 + 0.5));
      }
    };
    /*
     * upTo = reveal line in rows (may be fractional). Rows above it are final; the BAND rows
     * just above the line flicker with random characters in the accent colour, so the portrait
     * "decodes" from top to bottom; a thin scan line marks the edge.
     */
    const draw = (upTo: number, decoding = false) => {
      if (!lum) return;
      const st = getComputedStyle(document.documentElement);
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      const ink = st.getPropertyValue('--cream').trim() || '#e9dfc2';
      const acc = st.getPropertyValue('--accent').trim() || '#8fbf7a';
      ctx.clearRect(0, 0, W, H);
      ctx.textBaseline = 'top';
      for (let y = 0; y < Math.min(rows, Math.ceil(upTo)); y++) {
        const inBand = decoding && y >= upTo - BAND;
        for (let x = 0; x < cols; x++) {
          let v = lum[y * cols + x];
          if (v < 0.08) continue;
          if (light) v = 0.25 + (1 - v) * 0.75;
          if (inBand) {
            const depth = 1 - (upTo - y) / BAND;
            if (Math.random() < depth * 0.5) continue;
            ctx.globalAlpha = 0.25 + Math.random() * 0.55;
            ctx.fillStyle = acc;
            ctx.fillText(RAMP[1 + Math.floor(Math.random() * (RAMP.length - 2))], x * cw, y * fs);
            continue;
          }
          const dx = x * cw - hx, dy = y * fs - hy, dist = Math.sqrt(dx * dx + dy * dy);
          const near = dist < 46;
          if (near) v = Math.min(1, v + (1 - dist / 46) * 0.45);
          const ch = RAMP[Math.min(RAMP.length - 1, Math.floor(v * (RAMP.length - 1)))];
          ctx.globalAlpha = near ? 1 : 0.35 + v * 0.65;
          ctx.fillStyle = near || ((x + y * 3) % 23 === 0 && v > 0.55) ? acc : ink;
          ctx.fillText(ch, x * cw, y * fs);
        }
      }
      if (decoding && upTo < rows) {
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = acc;
        ctx.fillRect(0, upTo * fs, W, 1.5);
      }
      ctx.globalAlpha = 1;
    };
    const start = (isPhoto: boolean) => {
      sample();
      if (isPhoto) this.photoOk.set(true);
      if (reduced) {
        draw(rows);
        shownOnce = true;
        if (isPhoto) { this.revealed = true; this.photoShown.set(true); }
        return;
      }
      if (shownOnce) { draw(rows); if (isPhoto) this.reveal(400); return; }
      /* slow-motion decode over DECODE_MS, starting once the boot intro has finished */
      this.ui.bootDone.then(() => {
        if (cancelled) return;
        const t0 = performance.now();
        const step = (t: number) => {
          const k = Math.min(1, (t - t0) / DECODE_MS);
          const eased = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          draw(eased * (rows + BAND), k < 1);
          if (k < 1) raf = requestAnimationFrame(step);
          else {
            shownOnce = true;
            draw(rows);
            /* hold the finished ASCII portrait for a moment, then sweep in the real photo */
            if (isPhoto) this.reveal(900);
          }
        };
        raf = requestAnimationFrame(step);
      });
    };
    this.redraw = () => draw(rows);

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      hx = e.clientX - r.left;
      hy = e.clientY - r.top;
      if (!hoverRaf && lum && shownOnce) hoverRaf = requestAnimationFrame(() => { hoverRaf = 0; draw(rows); });
    };
    const onLeave = () => { hx = hy = -999; if (lum && shownOnce) draw(rows); };
    if (!reduced) {
      cv.addEventListener('pointermove', onMove);
      cv.addEventListener('pointerleave', onLeave);
    }

    const img = new Image();
    img.onload = () => {
      const s = Math.max(W / img.width, H / img.height);
      const dw = img.width * s, dh = img.height * s;
      o.fillStyle = '#000'; o.fillRect(0, 0, W, H);
      o.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      start(true);
    };
    img.onerror = () => { silhouette(); start(false); };
    img.src = SITE.photo;

    this.stop = () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(hoverRaf);
      img.onload = null;
      img.onerror = null;
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerleave', onLeave);
      this.stop = null;
    };
  }
}