import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SiteService } from '../core/site.service';
import { MotionService } from '../core/motion.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-contents' },
  template: `
    <footer class="foot" role="contentinfo">
      <div class="wrap">
        <div class="foot-grid">
          <div>
            <a class="brand" routerLink="/">wesley<span class="cursor" aria-hidden="true"></span></a>
            <p class="about-line">{{ site.text('footerText') }}</p>
          </div>
          <div>
            <h4>Explore</h4>
            <a routerLink="/work">Selected work</a>
            <a routerLink="/blogs">Blogs</a>
            <a routerLink="/ask">Ask my AI</a>
          </div>
          <div>
            <h4>Work together</h4>
            <a routerLink="/" fragment="contact">Start a conversation</a>
          </div>
          <div>
            <h4>Contact</h4>
            <a [href]="'mailto:' + site.email()">{{ site.email() }}</a>
            <a [href]="site.linkedin()" target="_blank" rel="noopener">LinkedIn ↗</a>
            @if (site.x()) {
              <a [href]="site.x()" target="_blank" rel="noopener">X ↗</a>
            }
            @if (site.github()) {
              <a [href]="site.github()" target="_blank" rel="noopener">GitHub ↗</a>
            }
            @if (site.cvUrl(); as cv) {
              <a [href]="cv">Download CV ↓</a>
            }
          </div>
        </div>
        <div class="foot-bottom">
          <span>© {{ year }} Wesley Nyamosi · <a routerLink="/privacy">Privacy</a></span>
          <span class="status"><span class="status-dot" aria-hidden="true"></span> all systems operational · session uptime <span class="uptime">{{ uptime() }}</span></span>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  readonly site = inject(SiteService);
  readonly year = new Date().getFullYear();
  readonly uptime = signal('00:00:00');

  constructor() {
    const start = Date.now();
    const t = setInterval(() => this.uptime.set(MotionService.uptime(start)), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(t));
  }
}
