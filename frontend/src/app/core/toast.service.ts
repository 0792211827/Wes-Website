import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal('');
  readonly visible = signal(false);
  private timer: ReturnType<typeof setTimeout> | undefined;

  show(msg: string): void {
    this.message.set(msg);
    this.visible.set(true);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.visible.set(false), 2400);
  }

  copy(text: string, msg = 'Copied to clipboard'): void {
    const done = () => this.show(msg);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, () => this.show('Copy failed: select and copy manually'));
      return;
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch { this.show('Copy failed'); }
    ta.remove();
  }
}
