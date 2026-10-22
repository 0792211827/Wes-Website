import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SplitDirective } from './split.directive';

@Component({
  selector: 'app-section-head',
  imports: [RouterLink, SplitDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-contents' },
  template: `
    <div class="section-head reveal">
      <div>
        <p class="eyebrow"><b>//</b> {{ eyebrow() }}</p>
        <h2 [appSplit]="title()"></h2>
        @if (text()) {
          <p>{{ text() }}</p>
        }
      </div>
      @if (link()) {
        <a class="link-more" [routerLink]="link()">{{ linkLabel() }}</a>
      }
    </div>
  `
})
export class SectionHeadComponent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly text = input<string>('');
  readonly link = input<string>('');
  readonly linkLabel = input<string>('');
}
