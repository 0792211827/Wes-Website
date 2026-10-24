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
    <button class="fab" [class.fab-open]="ui.miniChatOpen()" type="button" aria-controls="miniChat"
      [attr.aria-expanded]="ui.miniChatOpen()" (click)="toggle()">
      <app-icon [name]="ui.miniChatOpen() ? 'close' : 'chat'" />
      <span class="lbl">{{ ui.miniChatOpen() ? 'Close' : 'Ask my AI' }}</span>
    </button>
    <section class="window mini-chat" id="miniChat" [class.open]="ui.miniChatOpen()" aria-label="Ask Wesley's AI">
      <div class="mc-head">
        <span class="mc-av" aria-hidden="true"><app-icon name="bot" /></span>
        <div class="mc-title">
          <b>Ask about Wesley</b>
          <span class="mc-status"><i aria-hidden="true"></i> Online now · replies instantly</span>
        </div>
        <a class="mc-btn" routerLink="/ask" (click)="ui.miniChatOpen.set(false)" title="Open full page" aria-label="Open the full chat page">⤢</a>
        <button class="mc-btn" type="button" aria-label="Close assistant" (click)="ui.miniChatOpen.set(false)"><app-icon name="close" /></button>
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
