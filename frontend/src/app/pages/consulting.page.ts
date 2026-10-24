import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ENGAGE, FAQ, FORMATS, SERVICES } from '../core/data/site.data';
import { MotionService } from '../core/motion.service';
import { SeoService } from '../core/seo.service';
import { pad2 } from '../core/util';
import { CtaBandComponent } from '../shared/cta-band.component';
import { IconComponent } from '../shared/icon.component';
import { SectionHeadComponent } from '../shared/section-head.component';
import { SplitDirective } from '../shared/split.directive';

@Component({
  selector: 'app-consulting-page',
  imports: [RouterLink, IconComponent, SectionHeadComponent, CtaBandComponent, SplitDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    <div class="wrap consult-hero">
      <div>
        <nav class="crumbs" aria-label="Breadcrumb">~/<a routerLink="/">home</a> / <span>consulting</span></nav>
        <h1 [appSplit]="'Have an AI problem worth solving?'"></h1>
        <p class="lede">I help organizations design, build, evaluate and deploy AI systems that work in production. You get senior, hands-on engineering and clear advice, from first conversation to running system.</p>
        <div class="hero-ctas">
          <a class="btn btn-primary" routerLink="/contact">Start a Conversation →</a>
          <a class="btn" href="#services" (click)="scrollTo($event, 'services')">See services</a>
        </div>
      </div>
      <div class="codeblock reveal">
        <div class="window-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span>engagement.yaml</span><span></span></div>
        <pre><span class="c"># every engagement starts the same way</span>
<span class="k">engagement</span>:
  <span class="k">problem</span>: <span class="s">"what is broken, for whom, at what cost"</span>
  <span class="k">success</span>:
    - <span class="s">metric agreed before building</span>
    - <span class="s">evaluation set from your experts</span>
  <span class="k">delivery</span>: <span class="s">working software every week</span>
  <span class="k">ownership</span>: <span class="s">your team, your cloud, your code</span>
  <span class="k">handover</span>: <span class="n">true</span>
  <span class="k">demo_only</span>: <span class="n">false</span></pre>
      </div>
    </div>

    <section class="section" id="services">
      <div class="wrap">
        <app-section-head eyebrow="services" title="What I can help with" text="Each service is defined by the outcome you get, not the hours spent." />
        <div class="grid-3">
          @for (s of services; track s.title) {
            <article class="card card-link svc reveal">
              <div class="cap-ico"><app-icon [name]="s.icon" /></div>
              <h3>{{ s.title }}</h3>
              <p>{{ s.desc }}</p>
              <ul>@for (x of s.items; track x) {<li>{{ x }}</li>}</ul>
              <p class="out"><b>outcome</b>{{ s.outcome }}</p>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="section" id="engagement">
      <div class="wrap">
        <app-section-head eyebrow="engagement model" title="How an engagement runs"
          text="Seven steps, with a decision point after each one. You can stop after Design and still own a useful plan." />
        <ol class="engage" #engage>
          @for (e of engageSteps; track e.title; let i = $index) {
            <li class="step" [class.lit]="litCount() > i">
              <span class="dot">{{ num(i) }}</span>
              <h4>{{ e.title }}</h4>
              <p>{{ e.text }}</p>
            </li>
          }
        </ol>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <app-section-head eyebrow="formats" title="Ways to work together" />
        <div class="formats">
          @for (f of formats; track f.title) {
            <article class="card card-link fmt reveal">
              <span class="dur">⏱ {{ f.duration }}</span>
              <h3>{{ f.title }}</h3>
              <p>{{ f.text }}</p>
              <a class="btn btn-sm" routerLink="/contact">{{ f.cta }} →</a>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <app-section-head eyebrow="faq" title="Common questions" />
        <div class="faq reveal">
          @for (f of faq; track f.q; let first = $first) {
            <details [open]="first"><summary>{{ f.q }}</summary><p>{{ f.a }}</p></details>
          }
        </div>
      </div>
    </section>

    <app-cta-band title="Let's talk about your problem." text="A short description is enough to start. You'll get a reply within two working days." />
  `
})
export class ConsultingPage {
  readonly services = SERVICES;
  readonly engageSteps = ENGAGE;
  readonly formats = FORMATS;
  readonly faq = FAQ;
  readonly litCount = signal(0);
  private engage = viewChild.required<ElementRef<HTMLElement>>('engage');
  private motion = inject(MotionService);

  constructor() {
    inject(SeoService).set('Consulting', 'AI strategy, enterprise AI applications, evaluation, voice agents, open-weight LLM deployment and training.', '/consulting');
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      if (this.motion.reduced || !('IntersectionObserver' in window)) { this.litCount.set(ENGAGE.length); return; }
      let timer: ReturnType<typeof setInterval> | undefined;
      const io = new IntersectionObserver((e) => {
        if (!e[0].isIntersecting) return;
        io.disconnect();
        timer = setInterval(() => {
          if (this.litCount() >= ENGAGE.length) { clearInterval(timer); return; }
          this.litCount.update((n) => n + 1);
        }, 260);
      }, { threshold: 0.4 });
      io.observe(this.engage().nativeElement);
      destroy.onDestroy(() => { io.disconnect(); clearInterval(timer); });
    });
  }

  num(i: number): string { return pad2(i + 1); }

  scrollTo(e: Event, id: string): void {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: this.motion.reduced ? 'auto' : 'smooth', block: 'start' });
  }
}
