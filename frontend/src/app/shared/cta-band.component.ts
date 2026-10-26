import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { SiteService } from '../core/site.service';
import { SplitDirective } from './split.directive';

/** Closing call to action. On the home page it is the contact section (#contact); the button opens an email. */
@Component({
  selector: 'app-cta-band',
  imports: [SplitDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-block' },
  template: `
    <div class="wrap">
      <div class="card cta-band reveal">
        <div>
          <h2 [appSplit]="title()"></h2>
          <p>{{ text() }}</p>
        </div>
        <a class="btn btn-primary" [href]="'mailto:' + site.email()">{{ button() }} →</a>
      </div>
    </div>
  `
})
export class CtaBandComponent {
  readonly site = inject(SiteService);
  readonly title = input('Have an AI problem worth solving?');
  readonly text = input('Tell me what you\'re trying to solve.');
  readonly button = input('Email Me');
}
