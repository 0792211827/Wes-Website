import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { LabEntry, Post, Project } from '../core/models';
import { fmtDate, fmtVal, pad2 } from '../core/util';
import { workArt } from './art';
import { CountUpDirective } from './count-up.directive';

/** Selected-work card: illustration, category, problem, outcome, tech and headline metric. */
@Component({
  selector: 'app-work-card',
  imports: [RouterLink, CountUpDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-contents' },
  template: `
    <article class="card card-link work-card reveal">
      <div class="work-art">
        <span class="idx">{{ num() }} / {{ project().year }}</span>
        <div class="host-contents" [innerHTML]="art()"></div>
      </div>
      <div class="work-body">
        <span class="work-cat">{{ project().category }}</span>
        <h3><a [routerLink]="['/work', project().slug]">{{ project().title }}</a></h3>
        <dl class="kv">
          <dt>problem</dt><dd>{{ project().problem }}</dd>
          <dt>outcome</dt><dd>{{ project().outcome }}</dd>
        </dl>
        <div class="chips">
          @for (t of project().tech.slice(0, 6); track t) {
            <span class="chip">{{ t }}</span>
          }
        </div>
        <div class="work-foot">
          <span class="outcome"><b [appCountUp]="project().metric.value"></b> {{ project().metric.label }}</span>
          <a class="link-more" [routerLink]="['/work', project().slug]">View Case Study</a>
        </div>
      </div>
    </article>
  `
})
export class WorkCardComponent {
  private sanitizer = inject(DomSanitizer);
  readonly project = input.required<Project>();
  readonly index = input(0);
  readonly num = computed(() => pad2(this.index() + 1));
  readonly art = computed<SafeHtml>(() => this.sanitizer.bypassSecurityTrustHtml(workArt(this.project().art)));
}

/** AI Lab card with a mini bar chart of the first results. */
@Component({
  selector: 'app-lab-card',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-contents' },
  template: `
    <article class="card card-link lab-card reveal">
      <div class="lab-type">
        <b [class]="typeClass()">● {{ entry().type.toLowerCase() }}</b>
        <span>{{ date() }}</span>
      </div>
      <h3><a [routerLink]="['/lab', entry().slug]">{{ entry().title }}</a></h3>
      <p class="q">{{ entry().question }}</p>
      <div class="spark">
        @for (r of entry().rows.slice(0, 3); track r.label; let i = $index) {
          <div class="spark-row">
            <span>{{ r.label }}</span>
            <span class="track"><i [class.alt]="i > 0" [attr.data-w]="r.pct"></i></span>
            <span>{{ val(r.value) }}</span>
          </div>
        }
      </div>
      <div class="lab-foot">
        <span>{{ entry().unit }}</span>
        <span>{{ entry().status === 'complete' ? '✓ complete' : '◐ in progress' }}</span>
      </div>
    </article>
  `
})
export class LabCardComponent {
  readonly entry = input.required<LabEntry>();
  readonly typeClass = computed(() => this.entry().color.replace('c-', 't-'));
  readonly date = computed(() => fmtDate(this.entry().date));
  val(v: number): string { return fmtVal(v); }
}

/** One line in an article list. */
@Component({
  selector: 'app-post-row',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-contents' },
  template: `
    <a class="post" [routerLink]="['/writing', post().slug]">
      <time [attr.datetime]="post().date">{{ date() }}</time>
      <div>
        <h3>{{ post().title }}</h3>
        <p>{{ post().excerpt }}</p>
      </div>
      <span class="meta"><b>{{ post().track }}</b>{{ post().readMinutes }} min read</span>
    </a>
  `
})
export class PostRowComponent {
  readonly post = input.required<Post>();
  readonly date = computed(() => fmtDate(this.post().date));
}
