import { KNOWLEDGE } from './data/content.data';
import { AskResponse, KnowledgeEntry } from './models';

/*
 * Offline copy of the assistant's retrieval, used only when the API cannot be reached.
 * Same idea as the server: curated knowledge, IDF-weighted keyword scoring, cited sources,
 * an honest fallback and a refusal for private questions.
 */
const STOP = new Set(('a an the is are was were be to of in on for and or with about what which who whom how does do did can could would ' +
  'should his he him her she they them me my we our us you your i it its this that there their from at by as any some show tell give ' +
  'please much many has have').split(' '));
export const PRIVATE_RE = /\b(salary|phone number|home address|address|age|married|wife|husband|family|religion|password|id number|bank|net worth|where does he live)\b/i;

const stem = (w: string) => w.replace(/(ing|ed|es|s)$/, '');
export const tokens = (s: string): string[] =>
  s.toLowerCase().split(/[^a-z0-9-]+/).filter((w) => w && !STOP.has(w)).map(stem);

interface Indexed { e: KnowledgeEntry; keys: Set<string>; body: Set<string>; }

const INDEX: Indexed[] = KNOWLEDGE.map((e) => ({ e, keys: new Set(tokens(e.keywords)), body: new Set(tokens(e.answer)) }));
const DF: Record<string, number> = {};
INDEX.forEach((d) => new Set([...d.keys, ...d.body]).forEach((t) => { DF[t] = (DF[t] || 0) + 1; }));
const idf = (t: string) => Math.log(1 + INDEX.length / (DF[t] || INDEX.length));

export function retrieve(q: string): Array<{ e: KnowledgeEntry; score: number }> {
  const qt = tokens(q);
  if (!qt.length) return [];
  return INDEX.map((d) => {
    let s = 0;
    qt.forEach((t) => { if (d.keys.has(t)) s += idf(t); else if (d.body.has(t)) s += 0.35 * idf(t); });
    return { e: d.e, score: s / Math.sqrt(qt.length) };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
}

export function answerLocally(question: string, remaining: number): AskResponse {
  if (PRIVATE_RE.test(question)) {
    return {
      answer: 'I can only share Wesley\'s public, professional information, so I can\'t help with that. For anything else, you can reach him directly.',
      sources: [{ label: 'Contact', url: '/contact' }, { label: 'Privacy notice', url: '/privacy' }],
      grounded: false, fallback: true, mode: 'refusal', trace: 'privacy filter · no retrieval', remaining
    };
  }
  const hits = retrieve(question);
  if (!hits.length || hits[0].score < 0.5) {
    return {
      answer: 'I couldn\'t find anything about that in Wesley\'s public content, and I\'d rather not guess. Try one of the suggested questions, or ask Wesley directly.',
      sources: [{ label: 'Contact', url: '/contact' }],
      grounded: false, fallback: true, mode: 'fallback', trace: 'retrieved 0 relevant documents · fallback answer', remaining
    };
  }
  const best = hits[0];
  return {
    answer: best.e.answer,
    sources: best.e.sources,
    grounded: true, fallback: false, mode: 'extractive',
    trace: 'retrieved ' + Math.min(hits.length, 5) + ' documents · top score ' + Math.min(0.99, best.score / 2 + 0.45).toFixed(2) + ' · grounded (offline)',
    remaining
  };
}
