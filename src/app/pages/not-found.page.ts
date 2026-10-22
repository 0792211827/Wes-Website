import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    <div class="wrap page-head" style="border:0;min-height:50vh">
      <pre class="nf">$ cd {{ path }}
bash: no such file or directory
$ <span class="type-caret"></span></pre>
      <h1 style="margin-top:22px">404 — page not found</h1>
      <p class="lede">That page doesn't exist, or has moved.</p>
      <div class="hero-ctas" style="margin-top:24px">
        <a class="btn btn-primary" routerLink="/">Go home</a>
        <a class="btn" routerLink="/work">See the work</a>
      </div>
    </div>
  `
})
export class NotFoundPage {
  readonly path = location.pathname;
}
