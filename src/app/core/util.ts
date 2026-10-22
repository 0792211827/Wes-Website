/* Small helpers shared by components (formatting, escaping, markdown-lite, code highlighting). */

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function esc(s: unknown): string {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function fmtDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return iso;
  return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

export function fmtVal(v: number): string {
  return v < 1 ? v.toFixed(2) : Number(v).toLocaleString('en-US');
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Inline markdown: **bold** and `code` (input is escaped first). */
function inline(s: string): string {
  return esc(s)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

/**
 * Markdown-lite used for articles and AI answers:
 * "## heading", paragraphs, "- bullets", "> quote" and ``` fenced code.
 */
export function markdown(text: string): string {
  const lines = (text || '').replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let code: string[] | null = null;
  const flushPara = () => { if (para.length) { out.push('<p>' + inline(para.join(' ')) + '</p>'); para = []; } };
  const flushList = () => { if (list.length) { out.push('<ul>' + list.map((li) => '<li>' + inline(li) + '</li>').join('') + '</ul>'); list = []; } };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (code) {
      if (line.trim().startsWith('```')) {
        out.push('<div class="codeblock"><pre>' + highlight(code.join('\n')) + '</pre></div>');
        code = null;
      } else code.push(raw);
      continue;
    }
    if (line.trim().startsWith('```')) { flushPara(); flushList(); code = []; continue; }
    if (!line.trim()) { flushPara(); flushList(); continue; }
    if (line.startsWith('## ')) { flushPara(); flushList(); out.push('<h2>' + inline(line.slice(3)) + '</h2>'); continue; }
    if (line.startsWith('> ')) { flushPara(); flushList(); out.push('<blockquote>' + inline(line.slice(2)) + '</blockquote>'); continue; }
    if (line.startsWith('- ')) { flushPara(); list.push(line.slice(2)); continue; }
    flushList();
    para.push(line.trim());
  }
  if (code) out.push('<div class="codeblock"><pre>' + highlight(code.join('\n')) + '</pre></div>');
  flushPara(); flushList();
  return out.join('');
}

/** Tiny Python-ish highlighter for the lab and article code blocks. */
export function highlight(code: string): string {
  return code.split('\n').map((line) => {
    let comment = '';
    const h = line.indexOf('#');
    if (h > -1) { comment = '<span class="c">' + esc(line.slice(h)) + '</span>'; line = line.slice(0, h); }
    const body = esc(line).replace(
      /(&quot;[^&]*?&quot;|"[^"]*")|\b(import|from|def|return|for|in|if|else|async|await|print|raise|True|False|None)\b|\b(\d+(?:\.\d+)?)\b|\b([a-z_]+)(?=\()/g,
      (m: string, s?: string, k?: string, n?: string, f?: string) =>
        s ? '<span class="s">' + m + '</span>' : k ? '<span class="k">' + m + '</span>' : n ? '<span class="n">' + m + '</span>' : f ? '<span class="f">' + m + '</span>' : m);
    return body + comment;
  }).join('\n');
}

/** Seeded random numbers, so sample charts look the same on every visit. */
export function mulberry32(a: number): () => number {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
