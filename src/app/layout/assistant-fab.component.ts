import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UiStateService } from '../core/ui-state.service';
import { ChatComponent } from '../shared/chat.component';
import { IconComponent } from '../shared/icon.component';

/** Floating "Ask my AI" button and mini chat window, on every page except /ask and /admin. */
@Component({
  selector: 'app-assistant-fab',
  imports: [ChatComponent, IconComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-contents' },
  template: `
    <button class="fab" type="button" aria-controls="miniChat" [attr.aria-expanded]="ui.miniChatOpen()" (click)="toggle()">
      <app-icon name="chat" />
      <span class="lbl">Ask my AI</span>
    </button>
    <section class="window mini-chat" id="miniChat" [class.open]="ui.miniChatOpen()" aria-label="Ask Wesley's AI">
      <div class="window-bar">
        <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="grow">ask-wesley.ai — grounded on this site</span>
        <a class="copy-btn" routerLink="/ask" (click)="ui.miniChatOpen.set(false)">expand</a>
        <button class="copy-btn" type="button" aria-label="Close assistant" (click)="ui.miniChatOpen.set(false)">esc</button>
      </div>
      @if (opened()) {
        <app-chat [compact]="true" (navigated)="ui.miniChatOpen.set(false)" />
      }
    </section>
  `
})
export class AssistantFabComponent {
  readonly ui = inject(UiStateService);
  private chat = viewChild(ChatComponent);
  /** The chat is created the first time the window opens, then kept so the conversation survives closing. */
  readonly opened = signal(false);

  toggle(): void {
    const open = !this.ui.miniChatOpen();
    if (open) this.opened.set(true);
    this.ui.miniChatOpen.set(open);
    if (open) setTimeout(() => this.chat()?.focus(), 80);
  }
}
