import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { Post, Project } from '../core/models';
import { fmtDate, pad2 } from '../core/util';
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

/** One line in an article list. */
@Component({
  selector: 'app-post-row',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-contents' },
  template: `
    <a class="post" [routerLink]="['/blogs', post().slug]">
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
