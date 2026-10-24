import { Directive, ElementRef, effect, inject, input } from '@angular/core';

import { esc } from '../core/util';

/**
 * Word-by-word heading reveal.
 *   <h2 [appSplit]="'Production matters [[more than demos.]]'" appSplitTag="span"></h2>
 * Text inside [[ ]] is wrapped in <em> (or the tag given in appSplitTag).
 * The global motion layer adds .in when the heading scrolls into view.
 */
@Directive({
  selector: '[appSplit]',
  host: { class: 'split' }
})
export class SplitDirective {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly appSplit = input.required<string>();
  readonly appSplitTag = input<string>('em');

  constructor() {
    effect(() => {
      const text = this.appSplit() ?? '';
      const tag = /^[a-z]+$/.test(this.appSplitTag()) ? this.appSplitTag() : 'em';
      let wi = 0;
      const words = (s: string) => s.split(/(\s+)/).map((part) => {
        if (!part) return '';
        if (/^\s+$/.test(part)) return part;
        return '<span class="w" style="--wi:' + wi++ + '">' + esc(part) + '</span>';
      }).join('');
      const html = text.split(/(\[\[[^\]]*\]\])/).map((seg) =>
        seg.startsWith('[[') && seg.endsWith(']]') ? '<' + tag + '>' + words(seg.slice(2, -2)) + '</' + tag + '>' : words(seg)
      ).join('');
      this.el.nativeElement.innerHTML = html;
      this.el.nativeElement.setAttribute('aria-label', text.replace(/\[\[|\]\]/g, ''));
    });
  }
}
