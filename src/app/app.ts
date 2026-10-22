import { ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, ElementRef, afterNextRender, computed, inject, signal, viewChild
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { ContentService } from './core/content.service';
import { MotionService } from './core/motion.service';
import { ToastService } from './core/toast.service';
import { UiStateService } from './core/ui-state.service';
import { AssistantFabComponent } from './layout/assistant-fab.component';
import { BootComponent } from './layout/boot.component';
import { CommandPaletteComponent } from './layout/command-palette.component';
import { FooterComponent } from './layout/footer.component';
import { ToTopComponent } from './layout/to-top.component';
import { TopbarComponent } from './layout/topbar.component';

/** App shell: top bar, page outlet, footer and the global overlays. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopbarComponent, FooterComponent, BootComponent, CommandPaletteComponent, AssistantFabComponent, ToTopComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html'
})
export class App {
  readonly toast = inject(ToastService);
  private ui = inject(UiStateService);
  private router = inject(Router);
  private motion = inject(MotionService);

  private main = viewChild.required<ElementRef<HTMLElement>>('main');
  private glow = viewChild.required<ElementRef<HTMLElement>>('cursorGlow');
  private grid = viewChild.required<ElementRef<HTMLElement>>('gridGlow');

  private readonly url = signal('/');
  readonly showFab = computed(() => !this.url().startsWith('/ask') && !this.url().startsWith('/admin'));

  constructor() {
    inject(ContentService).load();
    inject(ViewportScroller).setOffset([0, 80]);

    let first = true;
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e) => {
      this.url.set(e.urlAfterRedirects);
      this.ui.paletteOpen.set(false);
      this.ui.drawerOpen.set(false);
      if (!first && !e.urlAfterRedirects.includes('#')) {
        /* move keyboard and screen-reader focus to the new page */
        setTimeout(() => this.main().nativeElement.focus({ preventScroll: true }), 0);
      }
      first = false;
    });

    afterNextRender(() => {
      this.motion.watch(this.main().nativeElement);
      const progress = document.getElementById('progress');
      if (progress) this.motion.initGlobal(this.glow().nativeElement, this.grid().nativeElement, progress);
    });
  }

  skip(e: Event): void {
    e.preventDefault();
    this.main().nativeElement.focus();
    this.main().nativeElement.scrollIntoView();
  }
}
