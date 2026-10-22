import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, input, output, signal, viewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ApiService, problemMessage } from '../core/api.service';
import { SUGGESTED } from '../core/data/site.data';
import { SourceLink } from '../core/models';
import { markdown, prefersReducedMotion } from '../core/util';

interface Msg {
  id: number;
  who: 'user' | 'bot';
  text: string;
  shown: number;
  typing: boolean;
  streaming: boolean;
  sources: SourceLink[];
  trace: string;
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
 * Answers stream in like a live model response, then show their cited sources.
 */
@Component({
  selector: 'app-chat',
  imports: [FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-contents' },
  template: `
    <div class="chat-log" #log aria-live="polite">
      @for (m of messages(); track m.id) {
        <div class="msg" [class.user]="m.who === 'user'" [class.bot]="m.who === 'bot'">
          <span class="avatar" aria-hidden="true">{{ m.who === 'user' ? 'you' : 'wn' }}</span>
          <div class="bubble">
            <div class="who">{{ m.who === 'user' ? 'you' : 'wesley.ai' }}</div>
            @if (m.typing) {
              <span class="typing" aria-label="Thinking"><i></i><i></i><i></i></span>
            } @else if (m.who === 'user') {
              <p>{{ m.text }}</p>
            } @else {
              <div [class.streaming]="m.streaming" [innerHTML]="html(m)"></div>
              @if (!m.streaming && m.sources.length) {
                <div class="sources">
                  @for (s of m.sources; track $index) {
                    <a class="source" [routerLink]="s.url" (click)="navigated.emit()"><i>[{{ $index + 1 }}]</i> {{ s.label }}</a>
                  }
                </div>
              }
              @if (!m.streaming && m.trace) {
                <p class="trace">{{ m.trace }}</p>
              }
            }
          </div>
        </div>
      }
    </div>
    <div class="suggest">
      @for (q of suggestions; track q) {
        <button type="button" (click)="ask(q)" [disabled]="busy()">{{ q }}</button>
      }
    </div>
    <form class="composer" (ngSubmit)="ask(draft)">
      <label class="sr" [attr.for]="inputId">Ask a question</label>
      <textarea #box [id]="inputId" name="question" rows="1" maxlength="500" [(ngModel)]="draft"
        [placeholder]="compact() ? 'Ask about Wesley’s work…' : 'e.g. Can Wesley help us deploy an open-weight model?'"
        (keydown)="onKey($event)" (input)="grow()"></textarea>
      <button class="btn btn-primary" type="submit" [disabled]="busy()" aria-label="Send">{{ compact() ? '↵' : 'Ask ↵' }}</button>
    </form>
    @if (!compact()) {
      <div class="chat-foot">
        <span>Don't share confidential information. Questions are logged anonymously to improve answers.</span>
        <span>{{ api.askRemaining() }} / {{ api.askQuota }} questions left this hour</span>
      </div>
    }
  `
})
export class ChatComponent {
  readonly api = inject(ApiService);
  readonly compact = input(false);
  readonly initialQuestion = input<string | null>(null);
  readonly navigated = output<void>();
  readonly busyChange = output<boolean>();

  readonly messages = signal<Msg[]>([]);
  readonly busy = signal(false);
  readonly suggestions = SUGGESTED;
  readonly inputId = 'ask-' + Math.random().toString(36).slice(2, 8);
  draft = '';

  private log = viewChild<ElementRef<HTMLElement>>('log');
  private box = viewChild<ElementRef<HTMLTextAreaElement>>('box');
  private reduced = prefersReducedMotion();
  private timers: Array<ReturnType<typeof setTimeout>> = [];
  private sid = sessionId();

  constructor() {
    this.push({
      who: 'bot',
      text: 'Hi, I\'m Wesley\'s assistant. I answer questions about his work, services and approach using only this website\'s approved content, and I\'ll link the pages I used.'
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
    el.style.height = Math.min(140, el.scrollHeight) + 'px';
  }

  ask(raw: string): void {
    const q = (raw || '').trim();
    if (!q || this.busy()) return;
    this.draft = '';
    const box = this.box()?.nativeElement;
    if (box) box.style.height = '';
    this.push({ who: 'user', text: q });

    if (this.api.askRemaining() <= 0) {
      this.push({
        who: 'bot',
        text: 'You\'ve reached the question limit for now. For anything else, please use the contact form; Wesley replies within two working days.',
        sources: [{ label: 'Contact', url: '/contact' }]
      });
      return;
    }

    this.setBusy(true);
    const botId = this.push({ who: 'bot', text: '', typing: true });
    const t0 = performance.now();
    this.api.ask(q, this.sid).subscribe({
      next: (res) => {
        const wait = Math.max(0, 550 - (performance.now() - t0));
        this.timers.push(setTimeout(() => this.reply(botId, res.answer, res.sources ?? [], res.trace ?? ''), wait));
      },
      error: (err: unknown) => {
        this.reply(botId, problemMessage(err, 'Sorry, something went wrong. Please try again, or use the contact form.'),
          [{ label: 'Contact', url: '/contact' }], '');
      }
    });
  }

  private reply(id: number, text: string, sources: SourceLink[], trace: string): void {
    this.update(id, { typing: false, text, shown: this.reduced ? text.length : 0, streaming: !this.reduced, sources, trace });
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
      sources: p.sources ?? [], trace: p.trace ?? ''
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
