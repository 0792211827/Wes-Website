import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SplitDirective } from './split.directive';

export interface Crumb {
  label: string;
  link?: string;
}

/** Breadcrumbs, eyebrow, animated title, lede, extra content and an optional "sample content" note. */
@Component({
  selector: 'app-page-head',
  imports: [RouterLink, SplitDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-block' },
  template: `
    <header class="page-head">
      <div class="wrap">
        <nav class="crumbs" aria-label="Breadcrumb"><span aria-hidden="true">/</span>@for (c of crumbs(); track $index) {@if ($index > 0) {<span aria-hidden="true"> / </span>}@if (c.link && !$last) {<a [routerLink]="c.link">{{ c.label }}</a>} @else {<span [attr.aria-current]="$last ? 'page' : null">{{ c.label }}</span>}}</nav>
        @if (eyebrow()) {
          <p class="eyebrow" style="margin-bottom:10px"><b>{{ eyebrow() }}</b>{{ eyebrowRest() }}</p>
        }
        <h1 [appSplit]="title()"></h1>
        @if (lede()) {
          <p class="lede">{{ lede() }}</p>
        }
        <ng-content />
        @if (note()) {
          <p class="note">{{ note() }}</p>
        }
      </div>
    </header>
  `
})
export class PageHeadComponent {
  readonly crumbs = input.required<Crumb[]>();
  readonly title = input.required<string>();
  readonly eyebrow = input<string>('');
  readonly eyebrowRest = input<string>('');
  readonly lede = input<string>('');
  readonly note = input<string>('');
}
