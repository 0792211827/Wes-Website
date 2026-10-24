import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';

import { ContentService } from '../core/content.service';
import { SITE } from '../core/data/site.data';
import { SeoService } from '../core/seo.service';
import { SiteService } from '../core/site.service';
import { ToastService } from '../core/toast.service';
import { fmtDate, markdown } from '../core/util';
import { PostRowComponent } from '../shared/cards';
import { PageHeadComponent } from '../shared/page-head.component';
import { SectionHeadComponent } from '../shared/section-head.component';
import { NotFoundPage } from './not-found.page';

@Component({
  selector: 'app-post-page',
  imports: [PageHeadComponent, SectionHeadComponent, PostRowComponent, NotFoundPage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    @if (post(); as p) {
      <app-page-head [crumbs]="[{ label: 'home', link: '/' }, { label: 'blogs', link: '/blogs' }, { label: p.title }]"
        [eyebrow]="p.track" [title]="p.title" [lede]="p.excerpt" [note]="site.flag('showSampleNotes') ? 'Sample article: replace with the full text.' : ''">
        <div class="article-meta">
          <span>{{ date() }}</span>
          <span>{{ p.readMinutes }} min read</span>
          @for (t of p.tags; track t) {
            <span class="tag">{{ t }}</span>
          }
        </div>
      </app-page-head>
      <div class="wrap" style="padding:48px 0 30px">
        <article class="prose md reveal" [innerHTML]="body()"></article>
        <div class="share prose">
          <button class="btn btn-sm" type="button" (click)="toast.copy(url(), 'Link copied')">Copy link</button>
          <a class="btn btn-sm" target="_blank" rel="noopener" [href]="linkedinShare()">Share on LinkedIn ↗</a>
        </div>
      </div>
      <section class="section">
        <div class="wrap">
          <app-section-head eyebrow="related" title="Keep reading" />
          <div class="related">
            @for (r of related(); track r.slug) {
              <app-post-row [post]="r" />
            }
          </div>
        </div>
      </section>
    } @else {
      <app-not-found-page />
    }
  `
})
export class PostPage {
  readonly site = inject(SiteService);
  private content = inject(ContentService);
  private seo = inject(SeoService);
  readonly toast = inject(ToastService);
  readonly slug = input.required<string>();
  readonly post = computed(() => this.content.post(this.slug()));
  readonly date = computed(() => fmtDate(this.post()?.date ?? ''));
  readonly body = computed(() => markdown(this.post()?.body ?? ''));
  readonly url = computed(() => SITE.url + '/blogs/' + this.slug());
  readonly linkedinShare = computed(() => 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(this.url()));
  readonly related = computed(() => {
    const p = this.post();
    if (!p) return [];
    return this.content.posts().filter((x) => x.slug !== p.slug && (x.track === p.track || x.tags.some((t) => p.tags.includes(t)))).slice(0, 3);
  });

  constructor() {
    effect(() => {
      const p = this.post();
      if (p) this.seo.set(p.title, p.excerpt, '/blogs/' + p.slug);
    });
  }
}
