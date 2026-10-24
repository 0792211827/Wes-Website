import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AnalyticsService } from '../core/analytics.service';
import { ThemeService } from '../core/theme.service';
import { UiStateService } from '../core/ui-state.service';
import { IconComponent } from '../shared/icon.component';

export const NAV = [
  { path: '/', label: 'home', exact: true },
  { path: '/work', label: 'work', exact: false },
  { path: '/blogs', label: 'blogs', exact: false },
  { path: '/ask', label: 'ask my ai', exact: false }
];

@Component({
  selector: 'app-topbar',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-contents' },
  template: `
    <header class="bar" role="banner">
      <div class="wrap bar-in">
        <a class="brand" routerLink="/" aria-label="Wesley Nyamosi, home">wesley<span class="cursor" aria-hidden="true"></span></a>

        <nav class="nav" aria-label="Primary">
          @for (n of nav; track n.path) {
            <a [routerLink]="n.path" routerLinkActive [routerLinkActiveOptions]="{ exact: n.exact }" ariaCurrentWhenActive="page">{{ n.label }}</a>
          }
        </nav>

        <div class="bar-actions">
          <button class="icon-btn kbd-btn" type="button" aria-label="Open command menu" (click)="ui.paletteOpen.set(true)">
            <app-icon name="search" />
            <span class="lbl"><kbd>⌘</kbd> <kbd>K</kbd></span>
          </button>
          <button class="icon-btn" type="button" (click)="toggleTheme()"
            [attr.aria-label]="theme.theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'">
            <app-icon [name]="theme.theme() === 'dark' ? 'sun' : 'moon'" />
          </button>
          <a class="btn btn-sm btn-green" id="barCta" routerLink="/" fragment="contact">work with me</a>
          <button class="icon-btn menu-btn" type="button" aria-controls="drawer" [attr.aria-expanded]="ui.drawerOpen()"
            [attr.aria-label]="ui.drawerOpen() ? 'Close menu' : 'Open menu'" (click)="ui.drawerOpen.set(!ui.drawerOpen())">
            <app-icon [name]="ui.drawerOpen() ? 'close' : 'menu'" />
          </button>
        </div>
      </div>
      <div class="progress" id="progress" aria-hidden="true"></div>
    </header>

    <div class="drawer" id="drawer" [class.open]="ui.drawerOpen()" aria-label="Mobile navigation">
      @for (n of nav; track n.path) {
        <a [routerLink]="n.path" routerLinkActive [routerLinkActiveOptions]="{ exact: n.exact }" ariaCurrentWhenActive="page"
          (click)="ui.drawerOpen.set(false)">~/{{ n.label.replace(' ', '-') }}</a>
      }
      <a class="btn btn-primary" routerLink="/" fragment="contact" (click)="ui.drawerOpen.set(false)">Work With Me →</a>
    </div>
  `
})
export class TopbarComponent {
  readonly theme = inject(ThemeService);
  private analytics = inject(AnalyticsService);

  toggleTheme(): void {
    this.theme.toggle();
    this.analytics.track('theme', this.theme.theme());
  }
  readonly ui = inject(UiStateService);
  readonly nav = NAV;
}
