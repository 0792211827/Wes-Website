import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService } from '../../core/content.service';
import { BUILDING, CAPS, SUGGESTED } from '../../core/data/site.data';
import { MotionService } from '../../core/motion.service';
import { SeoService } from '../../core/seo.service';
import { SiteService } from '../../core/site.service';
import { UiStateService } from '../../core/ui-state.service';
import { esc } from '../../core/util';
import { LabCardComponent, PostRowComponent, WorkCardComponent } from '../../shared/cards';
import { CountUpDirective } from '../../shared/count-up.directive';
import { CtaBandComponent } from '../../shared/cta-band.component';
import { HowItWorksComponent } from '../../shared/how-it-works.component';
import { IconComponent } from '../../shared/icon.component';
import { SectionHeadComponent } from '../../shared/section-head.component';
import { SplitDirective } from '../../shared/split.directive';
import { AsciiPortraitComponent } from './ascii-portrait.component';
import { GithubActivityComponent } from './github-activity.component';
import { PipelineComponent } from './pipeline.component';
import { SystemTraceComponent } from './system-trace.component';


const TECH = ['Python', 'FastAPI', 'PostgreSQL', 'pgvector', 'vLLM', 'Kubernetes', 'Docker', 'Prometheus', 'Grafana', 'LangGraph',
  'Langfuse', 'Hugging Face', 'AWQ', 'BM25', 'Cross-encoders', 'WebRTC', 'Temporal', 'Spring Boot', 'Angular', 'Terraform'];

@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink, IconComponent, SplitDirective, SectionHeadComponent, CtaBandComponent, WorkCardComponent, LabCardComponent,
    PostRowComponent, AsciiPortraitComponent, SystemTraceComponent, GithubActivityComponent, PipelineComponent,
    HowItWorksComponent, CountUpDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    <!-- ================= HERO ================= -->
    <section class="hero">
      <div class="wrap hero-grid">
        <div class="portrait-box">
          <app-ascii-portrait />
          <div class="portrait-tabs" role="tablist" aria-label="Quick facts">
            <button class="ptab" role="tab" type="button" [attr.aria-selected]="tab() === 'tldr'" (click)="tab.set('tldr')">tl;dr</button>
            <button class="ptab" role="tab" type="button" [attr.aria-selected]="tab() === 'now'" (click)="tab.set('now')">now</button>
          </div>
          <div class="ptab-panel" role="tabpanel">
            <ul>
              @for (x of tabItems(); track x) {
                <li>{{ x }}</li>
              }
            </ul>
          </div>
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
          <p class="building" aria-live="off">currently building <b>{{ typed() }}</b><span class="type-caret" aria-hidden="true"></span></p>
          <div class="chips">
            @for (t of site.heroTags(); track t.label) {
              <span [class]="'chip ' + t.color">{{ t.label }}</span>
            }
          </div>
          <div class="socials">
            <a [href]="site.github()" target="_blank" rel="noopener" aria-label="GitHub"><app-icon name="github" /></a>
            <a [href]="site.linkedin()" target="_blank" rel="noopener" aria-label="LinkedIn"><app-icon name="linkedin" /></a>
            <a [href]="'mailto:' + site.email()" aria-label="Email"><app-icon name="mail" /></a>
            @if (site.cvUrl(); as cv) {
              <a [href]="cv" aria-label="Download CV"><app-icon name="file" /></a>
            }
          </div>
          <div class="hero-ctas">
            <a class="btn btn-primary" routerLink="/contact">Work With Me <app-icon name="arrow" /></a>
            <a class="btn" routerLink="/work">Explore My Work</a>
          </div>
        </div>
      </div>

      @if (site.show('system')) {
        <div class="wrap system reveal">
          <app-system-trace />
        </div>
      }

      @if (site.show('github')) {
        <div class="wrap" style="margin-top:28px">
          <app-github-activity />
        </div>
      }

      @if (site.show('marquee')) {
      <div class="marquee" aria-label="Tools and technologies">
        <div class="marquee-track">
          @for (t of techLoop; track $index) {
            <span [attr.aria-hidden]="$index >= tech.length ? 'true' : null">
              @if ($index % 4 === 0) { <b>{{ t }}</b> } @else { {{ t }} }
            </span>
          }
        </div>
      </div>
      }
    </section>

    <!-- ================= NUMBERS ================= -->
    @if (site.show('stats')) {
    <section class="section" style="padding-top:56px;padding-bottom:56px">
      <div class="wrap">
        <div class="stats">
          @for (s of stats(); track s.label) {
            <div class="card stat-card reveal">
              <b [appCountUp]="s.value"></b>
              <span>{{ s.label }}</span>
              <i aria-hidden="true"></i>
            </div>
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
            <p>Every engagement follows the same path, from the problem to a system running in production.</p>
          </div>
          <div class="demo-vs">
            <div class="card no"><h4>× a demo</h4><ul><li>works on the happy path</li><li>quality is a feeling</li><li>no cost model</li><li>one person can run it</li></ul></div>
            <div class="card yes"><h4>✓ production</h4><ul><li>handles real, messy input</li><li>quality is measured</li><li>cost per request is known</li><li>monitored, owned, improving</li></ul></div>
          </div>
        </div>
        <app-pipeline />
      </div>
    </section>
    }

    <!-- ================= WHAT I BUILD ================= -->
    @if (site.show('build')) {
    <section class="section" id="build">
      <div class="wrap">
        <app-section-head eyebrow="expertise" title="What I Build" text="Six areas where I help teams go from an AI idea to a system people rely on."
          link="/consulting" linkLabel="Consulting services" />
        <div class="grid-3">
          @for (c of caps; track c.id) {
            <article class="card card-link cap reveal">
              <div class="cap-ico"><app-icon [name]="c.icon" /></div>
              <h3>{{ c.title }}</h3>
              <p>{{ c.desc }}</p>
              <div class="chips">
                @for (t of c.tags; track t) {
                  <span [class]="'chip ' + c.color">{{ t }}</span>
                }
              </div>
              <div class="cap-foot">
                <span class="tag">{{ c.id }}</span>
                <a routerLink="/work" [queryParams]="{ c: workCat(c.id) }">related work →</a>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
    }

    <!-- ================= SELECTED WORK ================= -->
    @if (site.show('work')) {
    <section class="section" id="work">
      <div class="wrap">
        <app-section-head eyebrow="selected work" title="Problems solved, not just models shipped"
          text="Each case study covers the problem, architecture, decisions, evaluation and results." link="/work" linkLabel="All case studies" />
        <div class="work-list">
          @for (p of featured(); track p.slug; let i = $index) {
            <app-work-card [project]="p" [index]="i" />
          }
        </div>
      </div>
    </section>
    }

    <!-- ================= HOW THE WORK WORKS ================= -->
    @if (site.show('howItWorks')) {
    <section class="section" id="how-it-works">
      <div class="wrap">
        <app-section-head eyebrow="how it works" title="See each system work, step by step"
          text="Pick a project. A request travels through the system while each step explains what happens and why it matters." />
        <div class="hiw-tabs reveal" role="group" aria-label="Choose a project">
          @for (p of allProjects(); track p.slug; let i = $index) {
            <button class="filter" type="button" [attr.aria-pressed]="i === hiwIndex()" (click)="hiwIndex.set(i)">{{ p.title }}</button>
          }
        </div>
        @if (hiwProject(); as hp) {
          <div class="reveal">
            <app-how-it-works [project]="hp" (finished)="nextProject()" />
            <div class="hiw-foot">
              <p><b style="color:var(--cream)">{{ hp.metric.value }}</b> {{ hp.metric.label }} · {{ hp.outcome }}</p>
              <a class="link-more" [routerLink]="['/work', hp.slug]">Read the full case study</a>
            </div>
          </div>
        }
      </div>
    </section>
    }

    <!-- ================= LAB ================= -->
    @if (site.show('lab')) {
    <section class="section">
      <div class="wrap">
        <app-section-head eyebrow="ai lab" title="Experiments, benchmarks and research"
          text="Evidence before opinions: questions tested on real hardware, with the method and code." link="/lab" linkLabel="Open the AI Lab" />
        <div class="grid-3">
          @for (l of lab(); track l.slug) {
            <app-lab-card [entry]="l" />
          }
        </div>
      </div>
    </section>
    }

    <!-- ================= WRITING ================= -->
    @if (site.show('writing')) {
    <section class="section">
      <div class="wrap">
        <app-section-head eyebrow="writing" title="Notes for engineers and leaders"
          text="Practical writing on building, evaluating and deploying AI systems." link="/writing" linkLabel="All articles" />
        <div class="reveal">
          @for (p of posts(); track p.slug) {
            <app-post-row [post]="p" />
          }
        </div>
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
      <app-cta-band />
    }
  `
})
export class HomePage {
  private content = inject(ContentService);
  private motion = inject(MotionService);
  private ui = inject(UiStateService);

  readonly site = inject(SiteService);
  readonly caps = CAPS;
  readonly suggested = SUGGESTED;
  readonly tech = TECH;
  readonly techLoop = [...TECH, ...TECH];

  readonly tab = signal<'tldr' | 'now'>('tldr');
  readonly tabItems = computed(() => this.site.lines(this.tab()));
  readonly typed = signal(BUILDING[0]);
  readonly nameHtml = signal('&nbsp;');
  /** After the decode animation the name follows the saved setting directly. */
  readonly decoded = signal(false);
  readonly landed = signal(false);

  readonly featured = computed(() => this.content.projects().filter((p) => p.featured).slice(0, 4));
  readonly lab = computed(() => this.content.lab().slice(0, 3));
  readonly posts = computed(() => this.content.posts().slice(0, 4));
  readonly allProjects = computed(() => this.content.projects());
  readonly hiwIndex = signal(0);
  readonly hiwProject = computed(() => {
    const list = this.allProjects();
    return list.length ? list[this.hiwIndex() % list.length] : undefined;
  });
  readonly stats = computed(() => [
    { value: String(this.content.projects().length), label: 'case studies, problem to production' },
    { value: String(this.content.lab().length), label: 'AI Lab experiments & benchmarks' },
    { value: String(this.content.posts().length), label: 'articles for engineers & leaders' },
    { value: '9', label: 'stages from problem to production' },
    { value: '7', label: 'steps in every engagement' }
  ]);

  /** After a walkthrough plays to the end, move on to the next project. */
  nextProject(): void {
    const n = this.allProjects().length;
    if (n) this.hiwIndex.set((this.hiwIndex() + 1) % n);
  }

  constructor() {
    inject(SeoService).set('Wesley Nyamosi — AI Engineering & Consulting',
      'Wesley Nyamosi designs and builds production-ready AI systems: AI strategy, architecture, RAG, agents, evaluation, voice AI and open-weight LLM deployment.', '/');
    const destroy = inject(DestroyRef);
    const timers: Array<ReturnType<typeof setTimeout>> = [];
    destroy.onDestroy(() => timers.forEach((t) => clearTimeout(t)));

    if (this.motion.reduced) {
      this.decoded.set(true);
      this.landed.set(true);
      return;
    }

    /* name decodes from random glyphs once the boot intro is finished */
    this.ui.bootDone.then(() => {
      const final = this.site.text('name');
      const glyphs = '!<>-_/[]{}=+*^?#01ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const t0 = performance.now();
      const step = (t: number) => {
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

    /* "currently building …" types, pauses, deletes and moves on (list editable in the admin) */
    const words = () => {
      const list = this.site.lines('building');
      return list.length ? list : BUILDING;
    };
    let i = 0, j = BUILDING[0].length, deleting = true;
    const tick = () => {
      const list = words();
      const word = list[i % list.length];
      if (deleting) {
        j--;
        this.typed.set(word.slice(0, Math.max(0, j)));
        if (j <= 0) { deleting = false; i = (i + 1) % list.length; timers.push(setTimeout(tick, 350)); return; }
        timers.push(setTimeout(tick, 22));
      } else {
        j++;
        this.typed.set(word.slice(0, j));
        if (j >= word.length) { deleting = true; timers.push(setTimeout(tick, 2600)); return; }
        timers.push(setTimeout(tick, 42));
      }
    };
    afterNextRender(() => {
      this.site.ready.then(() => {
        const first = words()[0];
        this.typed.set(first);
        j = first.length;
        timers.push(setTimeout(tick, 3200));
      });
    });
  }

  workCat(id: string): string {
    if (id === 'strategy') return 'all';
    if (id === 'evaluation') return 'rag';
    return id;
  }
}
