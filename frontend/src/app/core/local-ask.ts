import { KNOWLEDGE, POSTS, PROJECTS } from './data/content.data';
import { AskResponse, SourceLink } from './models';

/*
 * Offline copy of the assistant's retrieval (AskService on the server), used only when the API cannot
 * be reached. Same documents (curated answers, case studies, articles), same IDF-weighted keyword
 * scoring, same privacy refusal and fallback. Keep the two in step.
 */
const STOP = new Set(('a an the is are was were be to of in on for and or with about what which who whom how does do did can could would ' +
  'should his he him her she they them me my we our us you your i it its this that there their from at by as any some show tell give ' +
  'please much many has have').split(' '));
export const PRIVATE_RE = new RegExp('\\b(salary|salaries|how much does he earn|home address|where does he live|phone number|mobile number|' +
  'how old|his age|married|wife|husband|girlfriend|boyfriend|children|family|religion|password|' +
  'id number|passport|bank account|bank details|net worth)\\b', 'i');

const stem = (w: string) => w.replace(/(ing|ed|es|s)$/, '');
export const tokens = (s: string): string[] =>
  s.toLowerCase().split(/[^a-z0-9-]+/).filter((w) => w && !STOP.has(w)).map(stem).filter(Boolean);

interface Doc { key: string; answer: string; sources: SourceLink[]; keys: Set<string>; body: Set<string>; }

const DOCS: Doc[] = [
  ...KNOWLEDGE.map((e) => ({
    key: e.key, answer: e.answer, sources: e.sources,
    keys: new Set(tokens(e.keywords)), body: new Set(tokens(e.answer))
  })),
  ...PROJECTS.map((p) => ({
    key: 'project:' + p.slug,
    answer: 'The most relevant case study is ' + p.title + ' (' + p.category + ').\n\nProblem: ' + p.problem + '\n\nOutcome: ' + p.outcome +
      '\n\nThe case study covers the problem, its context, the architecture and the lessons learned.',
    sources: [{ label: p.title, url: '/work/' + p.slug }],
    keys: new Set(tokens([p.title, p.category, p.cat, ...p.tech].join(' '))),
    body: new Set(tokens([p.problem, p.outcome, p.overview].join(' ')))
  })),
  ...POSTS.map((p) => ({
    key: 'post:' + p.slug,
    answer: 'Wesley wrote about this in "' + p.title + '".\n\n' + p.excerpt,
    sources: [{ label: p.title, url: '/blogs/' + p.slug }],
    keys: new Set(tokens(p.title + ' ' + p.tags.join(' '))),
    body: new Set(tokens(p.excerpt))
  }))
];
const DF: Record<string, number> = {};
DOCS.forEach((d) => new Set([...d.keys, ...d.body]).forEach((t) => { DF[t] = (DF[t] || 0) + 1; }));
const idf = (t: string) => Math.log(1 + DOCS.length / (DF[t] || DOCS.length));

export function retrieve(q: string): Array<{ d: Doc; score: number }> {
  const qt = [...new Set(tokens(q))];
  if (!qt.length) return [];
  return DOCS.map((d) => {
    let s = 0;
    let keyMatch = false;
    qt.forEach((t) => {
      if (d.keys.has(t)) { s += idf(t); keyMatch = true; } else if (d.body.has(t)) s += 0.35 * idf(t);
    });
    if (!keyMatch) s *= 0.5; // a word mentioned only in passing is weak evidence
    if (s > 0 && !d.key.includes(':')) s *= 1.1; // curated answers win ties
    return { d, score: s / Math.sqrt(qt.length) };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
}

const CONTACT: SourceLink = { label: 'Contact', url: '/#contact' };

export function answerLocally(question: string, remaining: number): AskResponse {
  if (PRIVATE_RE.test(question)) {
    return {
      answer: 'I can only share Wesley\'s public, professional information, so I can\'t help with that. For anything else, you can reach him directly by email.',
      sources: [CONTACT, { label: 'Privacy notice', url: '/privacy' }],
      grounded: false, fallback: true, mode: 'refusal', trace: 'privacy check · not answered', remaining,
      followUps: followUpsFor(null, question)
    };
  }
  const hits = retrieve(question);
  if (!hits.length || hits[0].score < 0.5) {
    return {
      answer: 'I couldn\'t find anything about that in Wesley\'s public content, and I\'d rather not guess. Try asking about his work, background or approach, or ask Wesley directly.',
      sources: [CONTACT],
      grounded: false, fallback: true, mode: 'fallback', trace: 'retrieved 0 relevant documents · fallback answer', remaining,
      followUps: followUpsFor(null, question)
    };
  }
  const top = hits.slice(0, 4);
  const sources: SourceLink[] = [];
  top.forEach((h) => h.d.sources.forEach((s) => {
    if (sources.length < 4 && !sources.some((x) => x.url === s.url)) sources.push(s);
  }));
  return {
    answer: top[0].d.answer,
    sources,
    grounded: true, fallback: false, mode: 'extractive',
    trace: 'retrieved ' + Math.min(hits.length, 5) + ' documents · top score ' + Math.min(0.99, 1 - Math.exp(-top[0].score / 2.5)).toFixed(2) + ' · grounded (offline)',
    remaining,
    followUps: followUpsFor(top[0].d.key, question)
  };
}

/* Two suggested next questions per topic (same lists as the API's FollowUps). */
const GENERAL = [
  'What kind of AI systems does Wesley build?', 'Show me his work with RAG.', 'What is Wesley\'s background?',
  'Does Wesley deploy open-weight models?', 'Does Wesley offer consulting?', 'How can I contact Wesley?'
];
const BY_KEY: Record<string, string[]> = {
  'what-build': ['Show me his work with RAG.', 'Does Wesley deploy open-weight models?'],
  rag: ['How does Wesley evaluate AI systems?', 'Does Wesley deploy open-weight models?'],
  evaluate: ['Show me his work with RAG.', 'How can I contact Wesley?'],
  philosophy: ['What kind of AI systems does Wesley build?', 'What is Wesley\'s background?'],
  infra: ['Which tools does Wesley use?', 'How does Wesley evaluate AI systems?'],
  voice: ['How are agent actions kept safe?', 'Which tools does Wesley use?'],
  agents: ['Tell me about his voice agent.', 'How does Wesley evaluate AI systems?'],
  engage: ['How can I contact Wesley?', 'What kind of AI systems does Wesley build?'],
  contact: ['What kind of AI systems does Wesley build?', 'What is Wesley\'s background?'],
  stack: ['Does Wesley deploy open-weight models?', 'Show me his work with RAG.'],
  writing: ['Show me his work with RAG.', 'What does Wesley believe about production AI?'],
  about: ['What kind of AI systems does Wesley build?', 'Which tools does Wesley use?'],
  portfolio: ['Show me his work with RAG.', 'Tell me about his voice agent.']
};

export function followUpsFor(key: string | null, question: string): string[] {
  const q = question.trim().toLowerCase();
  const out: string[] = [];
  for (const s of [...(key ? BY_KEY[key] ?? GENERAL : GENERAL), ...GENERAL]) {
    if (out.length >= 2) break;
    if (s.toLowerCase() !== q && !out.includes(s)) out.push(s);
  }
  return out;
}
