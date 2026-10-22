import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SplitDirective } from './split.directive';

@Component({
  selector: 'app-cta-band',
  imports: [RouterLink, SplitDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-block' },
  template: `
    <div class="wrap">
      <div class="card cta-band reveal">
        <div>
          <h2 [appSplit]="title()"></h2>
          <p>{{ text() }}</p>
        </div>
        <a class="btn btn-primary" [routerLink]="link()">{{ button() }} →</a>
      </div>
    </div>
  `
})
export class CtaBandComponent {
  readonly title = input('Have an AI problem worth solving?');
  readonly text = input('Tell me what you\'re trying to solve. You\'ll get a reply within two working days, and a clear next step.');
  readonly button = input('Start a Conversation');
  readonly link = input('/contact');
}
