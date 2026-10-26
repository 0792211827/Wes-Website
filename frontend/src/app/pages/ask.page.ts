import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../core/api.service';
import { SeoService } from '../core/seo.service';
import { ChatComponent } from '../shared/chat.component';
import { PageHeadComponent } from '../shared/page-head.component';

const FLOW = ['your question', 'retrieval', 'approved website knowledge', 'llm', 'answer + sources'];

@Component({
  selector: 'app-ask-page',
  imports: [RouterLink, PageHeadComponent, ChatComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    <app-page-head [crumbs]="[{ label: 'ask' }]" title="Ask Wesley's AI"
      lede="Ask about Wesley's work, services and approach. Answers come only from this website's approved content, and every answer links to its sources." />
    <div class="wrap ask-layout">
      <section class="window chat" aria-label="Chat with Wesley's AI">
        <div class="window-bar">
          <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="grow">ask-wesley.ai — grounded on approved site content</span>
          <span class="status-dot" aria-hidden="true"></span><span>online</span>
        </div>
        <app-chat [initialQuestion]="q() ?? null" (busyChange)="onBusy($event)" />
      </section>
      <aside class="ask-side">
        <div class="card">
          <h3>How it works</h3>
          <div class="flow-mini">
            @for (f of flow; track f; let i = $index; let last = $last) {
              <span [class.on]="step() === i">{{ f }}</span>
              @if (!last) { <em>↓</em> }
            }
          </div>
        </div>
        <div class="card">
          <h3>What it will do</h3>
          <ul>
            <li>Answer from public, approved content only</li>
            <li>Cite and link the pages it used</li>
            <li>Say clearly when it doesn't know</li>
            <li>Never invent experience or share private details</li>
          </ul>
        </div>
        <div class="card quota">
          <h3>Usage</h3>
          <span>{{ api.askRemaining() }} / {{ api.askQuota }} questions left this hour</span>
          <div class="bar-mini"><i [style.width.%]="(api.askRemaining() / api.askQuota) * 100"></i></div>
          <p style="margin-top:10px">Limited per visitor to keep the service fair. <a routerLink="/privacy" style="color:var(--accent)">Privacy notice</a></p>
        </div>
      </aside>
    </div>
  `
})
export class AskPage {
  readonly api = inject(ApiService);
  /** ?q=… from the home page suggestions */
  readonly q = input<string | undefined>(undefined);
  readonly flow = FLOW;
  readonly step = signal(-1);
  private timer: ReturnType<typeof setInterval> | undefined;

  constructor() {
    inject(SeoService).set('Ask Wesley\'s AI', 'An assistant grounded on this website: ask about Wesley\'s work, services and approach, with cited sources.', '/ask');
    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
  }

  /** Light up the retrieval pipeline while the assistant is thinking. */
  onBusy(busy: boolean): void {
    clearInterval(this.timer);
    if (!busy) { this.step.set(-1); return; }
    this.step.set(0);
    this.timer = setInterval(() => this.step.set((this.step() + 1) % FLOW.length), 260);
  }
}
