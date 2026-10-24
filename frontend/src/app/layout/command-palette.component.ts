import {
  ChangeDetectionStrategy, Component, ElementRef, HostListener, computed, effect, inject, signal, viewChild
} from '@angular/core';
import { Router } from '@angular/router';

import { ContentService } from '../core/content.service';
import { SiteService } from '../core/site.service';
import { ThemeService } from '../core/theme.service';
import { ToastService } from '../core/toast.service';
import { UiStateService } from '../core/ui-state.service';

interface Item {
  label: string;
  kind: string;
  target: string;
}

/** ⌘K / Ctrl+K / "/" command menu: jump to any page, case study, lab entry or article, or run an action. */
@Component({
  selector: 'app-command-palette',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-contents' },
  template: `
    <div class="palette-back" [class.open]="ui.paletteOpen()" (click)="close()"></div>
    <div class="window palette" [class.open]="ui.paletteOpen()" role="dialog" aria-modal="true" aria-label="Command menu">
      <div class="palette-in">
        <span aria-hidden="true">❯</span>
        <label class="sr" for="paletteInput">Type a command or search</label>
        <input #input id="paletteInput" type="text" placeholder="Type a command or search…" autocomplete="off" spellcheck="false"
          [value]="query()" (input)="onInput($event)" (keydown)="onKey($event)">
        <kbd>esc</kbd>
      </div>
      <ul role="listbox" aria-label="Results">
        @for (it of results(); track it.target; let i = $index) {
          <li>
            <button type="button" role="option" [attr.aria-selected]="i === sel()" [class.sel]="i === sel()"
              (click)="run(it)" (mouseenter)="sel.set(i)">
              <span>{{ it.label }}</span><small>{{ it.kind }}</small>
            </button>
          </li>
        } @empty {
          <li class="empty" style="padding:24px">No results. Try "rag" or "contact".</li>
        }
      </ul>
      <div class="palette-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span><kbd>/</kbd> or <kbd>⌘K</kbd> anywhere</span></div>
    </div>
  `
})
export class CommandPaletteComponent {
  readonly ui = inject(UiStateService);
  private router = inject(Router);
  private theme = inject(ThemeService);
  private toast = inject(ToastService);
  private content = inject(ContentService);
  private site = inject(SiteService);
  private input = viewChild<ElementRef<HTMLInputElement>>('input');
  private lastFocus: Element | null = null;

  readonly query = signal('');
  readonly sel = signal(0);

  private readonly all = computed<Item[]>(() => [
    ...[['Home', '/'], ['About', '/about'], ['Work', '/work'], ['Consulting', '/consulting'], ['AI Lab', '/lab'], ['Writing', '/writing'],
      ['Ask My AI', '/ask'], ['Contact', '/contact'], ['Privacy', '/privacy']].map(([label, target]) => ({ label, kind: 'page', target })),
    ...this.content.projects().map((p) => ({ label: p.title, kind: 'case study', target: '/work/' + p.slug })),
    ...this.content.lab().map((l) => ({ label: l.title, kind: 'lab · ' + l.type.toLowerCase(), target: '/lab/' + l.slug })),
    ...this.content.posts().map((p) => ({ label: p.title, kind: 'article', target: '/writing/' + p.slug })),
    { label: 'Toggle theme', kind: 'action', target: 'action:theme' },
    { label: 'Copy email address', kind: 'action', target: 'action:email' },
    { label: 'Download CV', kind: 'action', target: 'action:cv' },
    { label: 'Open GitHub', kind: 'link', target: this.site.github() },
    { label: 'Open LinkedIn', kind: 'link', target: this.site.linkedin() }
  ].filter((it) => it.kind !== 'link' || it.target));

  readonly results = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.all().filter((it) => !q || (it.label + ' ' + it.kind).toLowerCase().includes(q)).slice(0, 12);
  });

  constructor() {
    effect(() => {
      if (this.ui.paletteOpen()) {
        this.lastFocus = document.activeElement;
        this.query.set('');
        this.sel.set(0);
        setTimeout(() => this.input()?.nativeElement.focus(), 10);
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  onGlobalKey(e: KeyboardEvent): void {
    const active = document.activeElement;
    const typing = !!active && /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName);
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.ui.paletteOpen.set(!this.ui.paletteOpen());
    } else if (e.key === '/' && !typing) {
      e.preventDefault();
      this.ui.paletteOpen.set(true);
    } else if (e.key === 'Escape') {
      if (this.ui.paletteOpen()) this.close();
      this.ui.miniChatOpen.set(false);
      this.ui.drawerOpen.set(false);
    }
  }

  onInput(e: Event): void {
    this.query.set((e.target as HTMLInputElement).value);
    this.sel.set(0);
  }

  onKey(e: KeyboardEvent): void {
    const n = this.results().length;
    if (e.key === 'ArrowDown') { e.preventDefault(); this.sel.set(Math.min(n - 1, this.sel() + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); this.sel.set(Math.max(0, this.sel() - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); const it = this.results()[this.sel()]; if (it) this.run(it); }
    else if (e.key === 'Tab') { e.preventDefault(); }
  }

  close(): void {
    this.ui.paletteOpen.set(false);
    const f = this.lastFocus as HTMLElement | null;
    if (f && typeof f.focus === 'function') f.focus();
  }

  run(it: Item): void {
    this.close();
    if (it.target === 'action:theme') this.theme.toggle();
    else if (it.target === 'action:email') this.toast.copy(this.site.email(), 'Email copied: ' + this.site.email());
    else if (it.target === 'action:cv') {
      const a = document.createElement('a');
      const cv = this.site.cvUrl();
      if (!cv) { this.toast.show('The CV will be available soon. Use the contact form meanwhile.'); return; }
      a.href = cv;
      document.body.appendChild(a); a.click(); a.remove();
    } else if (it.kind === 'link') window.open(it.target, '_blank', 'noopener');
    else this.router.navigateByUrl(it.target);
  }
}
