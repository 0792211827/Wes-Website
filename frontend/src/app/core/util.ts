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
 * Markdown-lite used for articles, case studies and AI answers:
 * "## heading", "### subheading", paragraphs, "- bullets", "1. steps", "> quote", "| pipe | tables |" and ``` fenced code.
 */
export function markdown(text: string): string {
  const lines = (text || '').replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let ordered = false;
  let table: string[][] = [];
  let code: string[] | null = null;
  const flushPara = () => { if (para.length) { out.push('<p>' + inline(para.join(' ')) + '</p>'); para = []; } };
  const flushList = () => {
    if (!list.length) return;
    const tag = ordered ? 'ol' : 'ul';
    out.push('<' + tag + '>' + list.map((li) => '<li>' + inline(li) + '</li>').join('') + '</' + tag + '>');
    list = [];
  };
  const flushTable = () => {
    if (!table.length) return;
    const [head, ...rows] = table;
    out.push('<div class="table-scroll"><table><thead><tr>' + head.map((c) => '<th>' + inline(c) + '</th>').join('') + '</tr></thead><tbody>' +
      rows.map((r) => '<tr>' + r.map((c) => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>');
    table = [];
  };
  const flushAll = () => { flushPara(); flushList(); flushTable(); };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (code) {
      if (line.trim().startsWith('```')) {
        out.push('<div class="codeblock"><pre>' + highlight(code.join('\n')) + '</pre></div>');
        code = null;
      } else code.push(raw);
      continue;
    }
    if (line.trim().startsWith('```')) { flushAll(); code = []; continue; }
    if (!line.trim()) { flushAll(); continue; }
    if (line.trim().startsWith('|')) {
      flushPara(); flushList();
      const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) table.push(cells);
      continue;
    }
    flushTable();
    if (line.startsWith('### ')) { flushPara(); flushList(); out.push('<h3>' + inline(line.slice(4)) + '</h3>'); continue; }
    if (line.startsWith('## ')) { flushPara(); flushList(); out.push('<h2>' + inline(line.slice(3)) + '</h2>'); continue; }
    if (line.startsWith('> ')) { flushPara(); flushList(); out.push('<blockquote>' + inline(line.slice(2)) + '</blockquote>'); continue; }
    const li = line.match(/^(- |\d+\. )(.*)$/);
    if (li) {
      flushPara();
      const isOl = li[1] !== '- ';
      if (list.length && isOl !== ordered) flushList();
      ordered = isOl;
      list.push(li[2]);
      continue;
    }
    flushList();
    para.push(line.trim());
  }
  if (code) out.push('<div class="codeblock"><pre>' + highlight(code.join('\n')) + '</pre></div>');
  flushAll();
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
