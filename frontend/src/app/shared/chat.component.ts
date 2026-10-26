import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, input, output, signal, viewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AnalyticsService } from '../core/analytics.service';
import { ApiService, problemMessage } from '../core/api.service';
import { SUGGESTED } from '../core/data/site.data';
import { followUpsFor } from '../core/local-ask';
import { SourceLink } from '../core/models';
import { SiteService } from '../core/site.service';
import { markdown, prefersReducedMotion } from '../core/util';
import { IconComponent } from './icon.component';

interface Msg {
  id: number;
  who: 'user' | 'bot';
  text: string;
  shown: number;
  typing: boolean;
  streaming: boolean;
  sources: SourceLink[];
  trace: string;
  followUps: string[];
}

let nextId = 1;

function sessionId(): string {
  try {
    let id = sessionStorage.getItem('wn-sid');
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem('wn-sid', id);
    }
    return id;
  } catch {
    return 'anonymous';
  }
}

/**
 * Ask Wesley's AI chat, used on the /ask page and in the floating assistant.
 * - The welcome message offers four starter questions; after that, each answer offers two follow-ups.
 * - Suggestions only appear under the latest answer and stay hidden while an answer is being written.
 * - Answers stream in like a live model, then show their sources.
 */
@Component({
  selector: 'app-chat',
  imports: [FormsModule, RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-contents' },
  template: `
    <div class="chat-log" #log aria-live="polite">
      @for (m of messages(); track m.id; let last = $last) {
        <div class="cmsg" [class.me]="m.who === 'user'">
          @if (m.who === 'bot') {
            <span class="cav" aria-hidden="true"><app-icon name="bot" /></span>
          }
          <div class="cbody">
            <div class="cbubble">
              @if (m.typing) {
                <span class="typing" aria-label="Thinking"><i></i><i></i><i></i></span>
              } @else if (m.who === 'user') {
                {{ m.text }}
              } @else {
                <div class="cmd" [class.streaming]="m.streaming" [innerHTML]="html(m)"></div>
              }
            </div>
            @if (m.who === 'bot' && !m.typing && !m.streaming) {
              @if (m.sources.length) {
                <div class="csrc">
                  @for (s of m.sources; track $index) {
                    <a class="csrc-chip" [routerLink]="s.url.split('#')[0] || '/'" [fragment]="s.url.split('#')[1]" (click)="navigated.emit()">{{ s.label }}</a>
                  }
                </div>
              }
              @if (m.trace && !compact()) {
                <p class="ctrace">{{ m.trace }}</p>
              }
              @if (last && !busy() && m.followUps.length) {
                <div class="cfollow">
                  <span>{{ m.id === welcomeId ? 'Try asking' : 'Ask next' }}</span>
                  @for (q of m.followUps; track q) {
                    <button type="button" (click)="ask(q)">{{ q }}</button>
                  }
                </div>
              }
            }
          </div>
        </div>
      }
    </div>

    <div class="cquick">
      <a [href]="'mailto:' + site.email()"><app-icon name="mail" />Email</a>
      @if (site.whatsapp(); as wa) {
        <a [href]="wa" target="_blank" rel="noopener"><app-icon name="chat" />WhatsApp</a>
      }
      <a routerLink="/" fragment="contact" (click)="navigated.emit()"><app-icon name="send" />Contact</a>
    </div>

    <form class="ccomposer" (ngSubmit)="ask(draft)">
      <label class="sr" [attr.for]="inputId">Ask a question</label>
      <textarea #box [id]="inputId" name="question" rows="1" maxlength="500" [(ngModel)]="draft"
        [placeholder]="busy() ? 'Answering…' : 'Type a question…'" (keydown)="onKey($event)" (input)="grow()"></textarea>
      <button class="csend" type="submit" [disabled]="busy() || !draft.trim()" aria-label="Send">
        <app-icon name="send" />
      </button>
    </form>
    @if (!compact()) {
      <div class="chat-foot">
        <span>Answers come only from this website. Don't share confidential information.</span>
        <span>{{ api.askRemaining() }} / {{ api.askQuota }} questions left this hour</span>
      </div>
    }
  `
})
export class ChatComponent {
  readonly api = inject(ApiService);
  readonly site = inject(SiteService);
  private analytics = inject(AnalyticsService);
  readonly compact = input(false);
  readonly initialQuestion = input<string | null>(null);
  readonly navigated = output<void>();
  readonly busyChange = output<boolean>();

  readonly messages = signal<Msg[]>([]);
  readonly busy = signal(false);
  readonly inputId = 'ask-' + Math.random().toString(36).slice(2, 8);
  readonly welcomeId: number;
  draft = '';

  private log = viewChild<ElementRef<HTMLElement>>('log');
  private box = viewChild<ElementRef<HTMLTextAreaElement>>('box');
  private reduced = prefersReducedMotion();
  private timers: Array<ReturnType<typeof setTimeout>> = [];
  private sid = sessionId();

  constructor() {
    this.welcomeId = this.push({
      who: 'bot',
      text: 'Hi! I\'m Wesley\'s assistant. Ask me about his work, background or approach. I answer from this website only and link the pages I used.',
      followUps: SUGGESTED
    });
    afterNextRender(() => {
      const q = this.initialQuestion();
      if (q) this.timers.push(setTimeout(() => this.ask(q), 300));
    });
    inject(DestroyRef).onDestroy(() => this.timers.forEach((t) => clearTimeout(t)));
  }

  html(m: Msg): string {
    return markdown(m.text.slice(0, m.shown));
  }

  focus(): void {
    this.box()?.nativeElement.focus();
  }

  onKey(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.ask(this.draft);
    }
  }

  grow(): void {
    const el = this.box()?.nativeElement;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(120, el.scrollHeight) + 'px';
  }

  ask(raw: string): void {
    const q = (raw || '').trim();
    if (!q || this.busy()) return;
    this.draft = '';
    const box = this.box()?.nativeElement;
    if (box) box.style.height = '';
    this.push({ who: 'user', text: q });
    this.analytics.track('ask', q.slice(0, 200));

    if (this.api.askRemaining() <= 0) {
      this.push({
        who: 'bot',
        text: 'You\'ve reached the question limit for now. For anything else, please email Wesley.',
        sources: [{ label: 'Contact', url: '/#contact' }]
      });
      return;
    }

    this.setBusy(true);
    const botId = this.push({ who: 'bot', text: '', typing: true });
    const t0 = performance.now();
    this.api.ask(q, this.sid).subscribe({
      next: (res) => {
        const wait = Math.max(0, 550 - (performance.now() - t0));
        const next = res.followUps && res.followUps.length ? res.followUps : followUpsFor(null, q);
        this.timers.push(setTimeout(() => this.reply(botId, res.answer, res.sources ?? [], res.trace ?? '', next), wait));
      },
      error: (err: unknown) => {
        this.reply(botId, problemMessage(err, 'Sorry, something went wrong. Please try again, or email Wesley.'),
          [{ label: 'Contact', url: '/contact' }], '', []);
      }
    });
  }

  private reply(id: number, text: string, sources: SourceLink[], trace: string, followUps: string[]): void {
    this.update(id, {
      typing: false, text, shown: this.reduced ? text.length : 0, streaming: !this.reduced, sources, trace,
      followUps: followUps.slice(0, 2)
    });
    if (this.reduced) { this.setBusy(false); this.scroll(); return; }
    const tick = () => {
      const m = this.messages().find((x) => x.id === id);
      if (!m) return;
      if (m.shown >= m.text.length) {
        this.update(id, { streaming: false });
        this.setBusy(false);
        this.scroll();
        return;
      }
      this.update(id, { shown: Math.min(m.text.length, m.shown + 3) });
      this.scroll();
      this.timers.push(setTimeout(tick, 16));
    };
    tick();
  }

  private push(p: Partial<Msg> & { who: 'user' | 'bot'; text: string }): number {
    const id = nextId++;
    const m: Msg = {
      id, who: p.who, text: p.text, shown: p.text.length, typing: !!p.typing, streaming: false,
      sources: p.sources ?? [], trace: p.trace ?? '', followUps: p.followUps ?? []
    };
    this.messages.update((list) => [...list, m]);
    this.scroll();
    return id;
  }

  private update(id: number, patch: Partial<Msg>): void {
    this.messages.update((list) => list.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  private setBusy(v: boolean): void {
    this.busy.set(v);
    this.busyChange.emit(v);
  }

  private scroll(): void {
    requestAnimationFrame(() => {
      const el = this.log()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}