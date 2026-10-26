import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PILLARS, SUGGESTED } from '../../core/data/site.data';
import { MotionService } from '../../core/motion.service';
import { SeoService } from '../../core/seo.service';
import { SiteService } from '../../core/site.service';
import { UiStateService } from '../../core/ui-state.service';
import { esc } from '../../core/util';
import { CtaBandComponent } from '../../shared/cta-band.component';
import { IconComponent } from '../../shared/icon.component';
import { SectionHeadComponent } from '../../shared/section-head.component';
import { SplitDirective } from '../../shared/split.directive';
import { GithubActivityComponent } from './github-activity.component';
import { PipelineComponent } from './pipeline.component';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, IconComponent, SplitDirective, SectionHeadComponent, CtaBandComponent, GithubActivityComponent, PipelineComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    <!-- ================= HERO ================= -->
    <section class="hero">
      <div class="wrap hero-grid">
        <div class="portrait-box">
          <!-- stock image until Wesley uploads his own photo in the admin; waits for the saved settings so it never swaps -->
          @if (site.isReady()) {
            <img class="portrait" [src]="site.photoUrl()" [alt]="site.photoFile() ? 'Portrait of Wesley Nyamosi' : ''"
              width="340" height="380" decoding="async">
          } @else {
            <div class="portrait" aria-hidden="true"></div>
          }
        </div>

        <div class="hero-copy">
          @if (site.flag('showStamp')) {
            <span class="stamp" [class.land]="landed()" aria-hidden="true">{{ site.text('availability') }}</span>
          }
          <p class="whoami">whoami</p>
          <h1 class="scramble" [attr.aria-label]="site.text('name')" [innerHTML]="decoded() ? site.text('name') : nameHtml()"></h1>
          <p class="positioning">{{ site.text('role') }}</p>
          <p class="headline" [appSplit]="site.text('headline')"></p>
          <p class="support">{{ site.text('support') }}</p>
          <div class="chips">
            @for (t of site.heroTags(); track t.label) {
              <span [class]="'chip ' + t.color">{{ t.label }}</span>
            }
          </div>
          <div class="socials">
            @if (site.github()) {
              <a [href]="site.github()" target="_blank" rel="noopener" aria-label="GitHub"><app-icon name="github" /></a>
            }
            <a [href]="site.linkedin()" target="_blank" rel="noopener" aria-label="LinkedIn"><app-icon name="linkedin" /></a>
            @if (site.x()) {
              <a [href]="site.x()" target="_blank" rel="noopener" aria-label="X"><app-icon name="x" /></a>
            }
            <a [href]="'mailto:' + site.email()" aria-label="Email"><app-icon name="mail" /></a>
            @if (site.cvUrl(); as cv) {
              <a [href]="cv" aria-label="Download CV"><app-icon name="file" /></a>
            }
          </div>
          <div class="hero-ctas">
            <a class="btn btn-primary" routerLink="/" fragment="contact">Work With Me <app-icon name="arrow" /></a>
            <a class="btn" routerLink="/work">Explore My Work</a>
          </div>
        </div>
      </div>

      @if (site.show('github')) {
        <div class="wrap">
          <app-github-activity />
        </div>
      }
    </section>

    <!-- ================= AI ENGINEERING ================= -->
    @if (site.show('pillars')) {
    <section class="section" id="ai-engineering">
      <div class="wrap">
        <app-section-head eyebrow="ai engineering" title="Where I build value"
          text="Where I work hands-on, from the model to the system around it, and where I help teams decide what is worth building." link="/work" linkLabel="See the work" />
        <div class="grid-2">
          @for (c of pillars; track c.id) {
            <article class="card cap reveal">
              <div class="cap-ico"><app-icon [name]="c.icon" /></div>
              <h3>{{ c.title }}</h3>
              <p>{{ c.desc }}</p>
              <div class="chips">
                @for (t of c.tags; track t) {
                  <span [class]="'chip ' + c.color">{{ t }}</span>
                }
              </div>
            </article>
          }
        </div>
      </div>
    </section>
    }

    <!-- ================= PHILOSOPHY ================= -->
    @if (site.show('philosophy')) {
    <section class="section" id="philosophy">
      <div class="wrap philo">
        <div class="reveal">
          <p class="eyebrow"><b>//</b> philosophy</p>
          <h2 class="big-quote" style="margin-top:14px" [appSplit]="'Production matters [[more than demos.]]'" appSplitTag="span"></h2>
          <div class="philo-copy">
            <p>A model, or a prototype that impresses in a meeting, is the easy part. The hard part is everything that makes it dependable: the right problem, data you can trust, an architecture that fails safely, evaluation that catches regressions, and infrastructure that keeps costs predictable.</p>
            <p>That is where the value is, and it is the part I focus on: from the problem to a system people can depend on.</p>
          </div>
          <div class="demo-vs">
            <div class="card no"><h3>× a demo</h3><ul><li>works on the happy path</li><li>quality is a feeling</li><li>no cost model</li><li>one person can run it</li></ul></div>
            <div class="card yes"><h3>✓ production</h3><ul><li>handles real, messy input</li><li>quality is measured</li><li>cost per request is known</li><li>monitored, owned, improving</li></ul></div>
          </div>
        </div>
        <app-pipeline />
      </div>
    </section>
    }

    <!-- ================= ASK TEASER ================= -->
    @if (site.show('ask')) {
    <section class="section">
      <div class="wrap ask-teaser">
        <div class="reveal">
          <p class="eyebrow"><b>//</b> ask my ai</p>
          <h2 style="font-size:clamp(1.5rem,2.6vw,2.05rem);margin-top:8px" [appSplit]="'Questions? Ask an assistant grounded on this site.'"></h2>
          <p class="prose-font" style="color:var(--text-2);margin-top:12px">It answers only from approved public content, cites the pages it used, and tells you when it does not know.</p>
          <a class="btn btn-green" style="margin-top:22px" routerLink="/ask">Open Ask My AI →</a>
        </div>
        <div class="window reveal">
          <div class="window-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="grow">try asking</span></div>
          <div class="teaser-qs">
            @for (q of suggested; track q) {
              <a routerLink="/ask" [queryParams]="{ q: q }"><span>❯</span> {{ q }}</a>
            }
          </div>
        </div>
      </div>
    </section>
    }

    @if (site.show('cta')) {
      <app-cta-band id="contact" />
    }
  `
})
export class HomePage {
  private motion = inject(MotionService);
  private ui = inject(UiStateService);

  readonly site = inject(SiteService);
  readonly pillars = PILLARS;
  readonly suggested = SUGGESTED;

  readonly nameHtml = signal('&nbsp;');
  /** After the decode animation the name follows the saved setting directly. */
  readonly decoded = signal(false);
  readonly landed = signal(false);

  constructor() {
    inject(SeoService).set('Wesley Nyamosi — AI Engineering',
      'Wesley Nyamosi builds AI systems that create real value: agents and RAG pipelines, open-weight LLMs deployed locally, and fast inference with vLLM and Ollama.', '/');

    if (this.motion.reduced) {
      this.decoded.set(true);
      this.landed.set(true);
      return;
    }

    /* name decodes from random glyphs once the boot intro is finished */
    let alive = true;
    inject(DestroyRef).onDestroy(() => (alive = false));
    this.ui.bootDone.then(() => {
      const final = this.site.text('name');
      const glyphs = '!<>-_/[]{}=+*^?#01ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const t0 = performance.now();
      const step = (t: number) => {
        if (!alive) return;
        const k = Math.min(1, (t - t0) / 900);
        const fixed = Math.floor(k * final.length);
        let html = esc(final.slice(0, fixed));
        for (let i = fixed; i < final.length; i++) {
          html += final[i] === ' ' ? ' ' : '<span class="g">' + esc(glyphs[Math.floor(Math.random() * glyphs.length)]) + '</span>';
        }
        this.nameHtml.set(html);
        if (k < 1) requestAnimationFrame(step);
        else { this.decoded.set(true); this.landed.set(true); }
      };
      requestAnimationFrame(step);
    });
  }
}
