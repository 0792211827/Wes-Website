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
            <a routerLink="/lab">AI Lab</a>
            <a routerLink="/writing">Writing</a>
            <a routerLink="/ask">Ask my AI</a>
          </div>
          <div>
            <h4>Work together</h4>
            <a routerLink="/consulting">Consulting</a>
            <a routerLink="/consulting" fragment="services">Services</a>
            <a routerLink="/consulting" fragment="engagement">How engagements run</a>
            <a routerLink="/contact">Start a conversation</a>
          </div>
          <div>
            <h4>Elsewhere</h4>
            <a [href]="site.github()" target="_blank" rel="noopener">GitHub ↗</a>
            <a [href]="site.linkedin()" target="_blank" rel="noopener">LinkedIn ↗</a>
            @if (site.cvUrl(); as cv) {
              <a [href]="cv">Download CV ↓</a>
            }
            <a [href]="'mailto:' + site.email()">{{ site.email() }}</a>
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
