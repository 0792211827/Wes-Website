import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ApiService, problemMessage } from '../core/api.service';
import { AnalyticsService } from '../core/analytics.service';
import { SiteService } from '../core/site.service';
import { SeoService } from '../core/seo.service';
import { ToastService } from '../core/toast.service';
import { IconComponent } from '../shared/icon.component';
import { SplitDirective } from '../shared/split.directive';

const SERVICES = ['AI Strategy', 'AI Architecture', 'Enterprise AI', 'RAG / Agents', 'AI Evaluation', 'Voice AI', 'LLM Deployment', 'Training', 'Other'];

@Component({
  selector: 'app-contact-page',
  imports: [ReactiveFormsModule, RouterLink, IconComponent, SplitDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    <div class="wrap contact-grid">
      <aside class="contact-aside">
        <nav class="crumbs" aria-label="Breadcrumb">~/<a routerLink="/">home</a> / <span>contact</span></nav>
        <h1 [appSplit]="'Let’s solve an AI problem.'"></h1>
        <p class="lede">Tell me what you're trying to solve. A few sentences is enough; we'll work out the details together.</p>
        <ol class="expect">
          <li><span>01</span>A reply within two working days.</li>
          <li><span>02</span>A 30-minute call to understand the problem.</li>
          <li><span>03</span>A written proposal with scope, approach and cost.</li>
        </ol>
        <div class="reach">
          <a [href]="'mailto:' + site.email()"><app-icon name="mail" />{{ site.email() }}</a>
          @if (site.whatsapp(); as wa) {
            <a [href]="wa" target="_blank" rel="noopener"><app-icon name="chat" />WhatsApp</a>
          }
          @if (site.phone(); as tel) {
            <a [href]="'tel:' + tel"><app-icon name="phone" />{{ tel }}</a>
          }
          <a [href]="site.linkedin()" target="_blank" rel="noopener"><app-icon name="linkedin" />LinkedIn</a>
          <a [href]="site.github()" target="_blank" rel="noopener"><app-icon name="github" />GitHub</a>
          @if (site.cvUrl(); as cv) {
            <a [href]="cv"><app-icon name="file" />Download CV</a>
          }
        </div>
      </aside>

      <div class="card reveal">
        @if (sentTo(); as who) {
          <div class="sent" role="status">
            <div class="big">✓</div>
            <h2>Thanks, {{ who.first }}. Message received.</h2>
            <p class="prose-font" style="color:var(--text-2);max-width:460px">You'll get a reply at <b style="color:var(--cream)">{{ who.email }}</b> within two working days.</p>
            <a class="btn" routerLink="/work">Browse the work meanwhile →</a>
          </div>
        } @else {
          <form class="form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <div class="form-row">
              <div class="field" [class.invalid]="bad('name')">
                <label for="f-name">Name <span class="req">*</span></label>
                <input id="f-name" formControlName="name" autocomplete="name" maxlength="120">
                <span class="err">{{ bad('name') ? 'Please enter your name.' : '' }}</span>
              </div>
              <div class="field" [class.invalid]="bad('email')">
                <label for="f-email">Email <span class="req">*</span></label>
                <input id="f-email" type="email" formControlName="email" autocomplete="email" maxlength="160">
                <span class="err">{{ bad('email') ? 'Please enter a valid email address.' : '' }}</span>
              </div>
            </div>
            <div class="form-row">
              <div class="field">
                <label for="f-company">Company</label>
                <input id="f-company" formControlName="company" autocomplete="organization" maxlength="120">
              </div>
              <div class="field">
                <label for="f-role">Role</label>
                <input id="f-role" formControlName="role" autocomplete="organization-title" maxlength="120">
              </div>
            </div>
            <fieldset class="field" [class.invalid]="servicesError()">
              <legend>What are you looking for? <span class="req" style="color:var(--accent)">*</span></legend>
              <div class="svc-pick">
                @for (s of services; track s) {
                  <label><input type="checkbox" [checked]="picked().includes(s)" (change)="toggle(s)"><span>{{ s }}</span></label>
                }
              </div>
              <span class="err">{{ servicesError() ? 'Choose at least one option.' : '' }}</span>
            </fieldset>
            <div class="field" [class.invalid]="bad('problem')">
              <label for="f-problem">Problem description <span class="req">*</span></label>
              <textarea id="f-problem" formControlName="problem" maxlength="4000"
                placeholder="What are you trying to solve? Who is affected, and what have you tried so far?"></textarea>
              <span class="hint">{{ problemLength() }} / 4000 · at least 30 characters</span>
              <span class="err">{{ bad('problem') ? 'A little more detail helps: at least 30 characters.' : '' }}</span>
            </div>
            <div class="form-row">
              <div class="field">
                <label for="f-budget">Budget range <span class="hint">(optional)</span></label>
                <select id="f-budget" formControlName="budget">
                  <option value="">Not sure yet</option>
                  @for (b of budgets; track b) { <option [value]="b">{{ b }}</option> }
                </select>
              </div>
              <div class="field">
                <label for="f-timeline">Timeline <span class="hint">(optional)</span></label>
                <select id="f-timeline" formControlName="timeline">
                  <option value="">Flexible</option>
                  @for (t of timelines; track t) { <option [value]="t">{{ t }}</option> }
                </select>
              </div>
            </div>
            <div class="hp" aria-hidden="true">
              <label for="f-website">Website</label>
              <input id="f-website" formControlName="website" tabindex="-1" autocomplete="off">
            </div>
            @if (error()) {
              <p class="form-error" role="alert">{{ error() }}</p>
            }
            <div class="form-foot">
              <p class="consent">By sending this you agree to the <a routerLink="/privacy">privacy policy</a>. Your details are only used to reply to you.</p>
              <button class="btn btn-primary" type="submit" [disabled]="sending()">{{ sending() ? 'Sending…' : 'Start a Conversation →' }}</button>
            </div>
          </form>
        }
      </div>
    </div>
  `
})
export class ContactPage {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);
  readonly site = inject(SiteService);
  private analytics = inject(AnalyticsService);
  readonly services = SERVICES;
  readonly budgets = ['Under $10k', '$10k – $25k', '$25k – $50k', '$50k – $100k', '$100k+'];
  readonly timelines = ['As soon as possible', 'Within 1 month', '1 – 3 months', '3 – 6 months', 'Just exploring'];

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(160)]],
    company: ['', [Validators.maxLength(120)]],
    role: ['', [Validators.maxLength(120)]],
    problem: ['', [Validators.required, Validators.minLength(30), Validators.maxLength(4000)]],
    budget: [''],
    timeline: [''],
    website: ['']
  });

  readonly picked = signal<string[]>([]);
  readonly submitted = signal(false);
  readonly sending = signal(false);
  readonly error = signal('');
  readonly sentTo = signal<{ first: string; email: string } | null>(null);
  private readonly problemText = signal('');
  readonly problemLength = computed(() => this.problemText().length);
  readonly servicesError = computed(() => this.submitted() && this.picked().length === 0);

  constructor() {
    inject(SeoService).set('Contact', 'Let\'s solve an AI problem. Tell Wesley what you\'re trying to solve.', '/contact');
    this.form.controls.problem.valueChanges.subscribe((v) => this.problemText.set(v ?? ''));
  }

  bad(name: 'name' | 'email' | 'problem'): boolean {
    const c = this.form.controls[name];
    if (name === 'email' && c.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.value.trim())) return this.submitted() || c.touched;
    return c.invalid && (c.touched || this.submitted());
  }

  toggle(s: string): void {
    this.picked.update((list) => (list.includes(s) ? list.filter((x) => x !== s) : [...list, s]));
  }

  submit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    this.error.set('');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(this.form.controls.email.value.trim());
    if (this.form.invalid || !emailOk || !this.picked().length) {
      this.toast.show('Please check the highlighted fields.');
      const first = document.querySelector<HTMLElement>('.field.invalid input, .field.invalid textarea, .field.invalid select');
      first?.focus();
      return;
    }
    const v = this.form.getRawValue();
    this.sending.set(true);
    this.api.sendContact({
      name: v.name.trim(), email: v.email.trim(), company: v.company.trim(), role: v.role.trim(),
      services: this.picked(), problem: v.problem.trim(),
      budget: v.budget || null, timeline: v.timeline || null, website: v.website
    }).subscribe({
      next: () => {
        this.sending.set(false);
        this.sentTo.set({ first: v.name.trim().split(' ')[0], email: v.email.trim() });
        this.analytics.track('contact', this.picked().join(', '));
      },
      error: (err: unknown) => {
        this.sending.set(false);
        this.error.set(problemMessage(err, 'Your message could not be sent. Please email ' + this.site.email() + ' instead.'));
      }
    });
  }
}
