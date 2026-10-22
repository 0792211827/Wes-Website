import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SITE, TIMELINE } from '../core/data/site.data';
import { SeoService } from '../core/seo.service';
import { CtaBandComponent } from '../shared/cta-band.component';
import { PageHeadComponent } from '../shared/page-head.component';
import { SectionHeadComponent } from '../shared/section-head.component';

@Component({
  selector: 'app-about-page',
  imports: [PageHeadComponent, SectionHeadComponent, CtaBandComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    <app-page-head [crumbs]="[{ label: 'home', link: '/' }, { label: 'about' }]" title="I build AI systems people can depend on."
      lede="AI engineer and consultant. I work across the whole path from problem to production: strategy, architecture, data, models, applications, evaluation and infrastructure." />

    <section class="section">
      <div class="wrap about-intro">
        <div class="prose reveal">
          <p>I started in software and data engineering, building the backends, pipelines and cloud infrastructure that products run on. When large language models became practical, I saw the same pattern again and again: impressive prototypes that never reached the people they were meant for.</p>
          <p>That gap is where I work. I help organizations decide where AI is worth it, design systems that hold up under real use, and measure them honestly. Sometimes that means building an assistant or an agent. Sometimes it means deploying open-weight models on infrastructure the client controls. Sometimes it means advising <em>not</em> to use AI for a problem.</p>
          <h3>What I focus on</h3>
          <ul class="bullets">
            <li>Retrieval-augmented and agentic systems that stay grounded and auditable</li>
            <li>Evaluation: test sets, metrics and regression gates before opinions</li>
            <li>Open-weight LLM serving, quantization and cost control</li>
            <li>Real-time voice agents with tight latency budgets</li>
            <li>Clear architecture and handover so teams can own what is built</li>
          </ul>
          <blockquote>The goal is not to use AI. The goal is to solve the problem, and keep it solved.</blockquote>
        </div>
        <aside class="card fact-card reveal">
          <p class="eyebrow"><b>//</b> at a glance</p>
          <dl>
            <dt>role</dt><dd>AI Engineer &amp; Consultant</dd>
            <dt>focus</dt><dd>Production AI systems</dd>
            <dt>works with</dt><dd>Enterprises, scale-ups, public sector</dd>
            <dt>engagements</dt><dd>Advisory · builds · evaluation · training</dd>
            <dt>works</dt><dd>Remote, with on-site when needed</dd>
            <dt>status</dt><dd><span class="status-dot" aria-hidden="true"></span> open to engagements</dd>
          </dl>
          <div class="hero-ctas">
            <a class="btn btn-primary btn-sm" [href]="site.cv" download>Download CV ↓</a>
            <a class="btn btn-sm" [href]="site.linkedin" target="_blank" rel="noopener">LinkedIn ↗</a>
          </div>
        </aside>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <app-section-head eyebrow="journey" title="Experience" text="Replace these entries with real roles, dates and outcomes." />
        <div class="timeline prose">
          @for (t of timeline; track $index) {
            <div class="tl reveal" [class.now]="t.now">
              <time>{{ t.when }}</time>
              <h3>{{ t.title }}</h3>
              <p>{{ t.text }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <app-section-head eyebrow="principles" title="How I work" />
        <div class="grid-2">
          @for (p of principles; track p[0]; let i = $index) {
            <div class="card reveal principle">
              <span class="tag">0{{ i + 1 }}</span>
              <h3>{{ p[0] }}</h3>
              <p>{{ p[1] }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <app-section-head eyebrow="beyond engineering" title="Outside of work" />
        <div class="prose reveal">
          <p>Add a short, personal paragraph here: interests, community work, teaching, or what keeps you curious. It makes the page human without distracting from the work.</p>
        </div>
        <div class="chips reveal" style="margin-top:18px">
          <span class="chip c-green">mentoring</span><span class="chip c-amber">tech community</span><span class="chip c-sky">reading research papers</span>
          <span class="chip c-violet">open source</span><span class="chip c-rose">teaching</span>
        </div>
      </div>
    </section>

    <app-cta-band title="Want to work together?" text="Advisory, builds, evaluation or training. Tell me about the problem." />
  `
})
export class AboutPage {
  readonly site = SITE;
  readonly timeline = TIMELINE;
  readonly principles: Array<[string, string]> = [
    ['Start from the problem', 'The first conversation is about the business problem and how success will be measured, not about models.'],
    ['Show the work', 'Architecture diagrams, evaluation results and trade-offs are written down and shared, so decisions can be checked.'],
    ['Measure before arguing', 'An agreed evaluation set ends opinion-driven debates and makes every change visible.'],
    ['Leave teams stronger', 'Documentation, handover and pairing mean the team can own and improve the system after I leave.']
  ];

  constructor() {
    inject(SeoService).set('About', 'Wesley Nyamosi is an AI engineer and consultant who designs and builds production-ready AI systems.', '/about');
  }
}
