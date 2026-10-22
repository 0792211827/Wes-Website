import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { ICONS } from '../core/data/icons';

/** <app-icon name="github" /> — inline SVG icons from a fixed, trusted set. */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true" [innerHTML]="html()"></svg>`,
  host: { class: 'host-contents' }
})
export class IconComponent {
  private sanitizer = inject(DomSanitizer);
  readonly name = input.required<string>();
  readonly html = computed<SafeHtml>(() => this.sanitizer.bypassSecurityTrustHtml(ICONS[this.name()] ?? ''));
}
