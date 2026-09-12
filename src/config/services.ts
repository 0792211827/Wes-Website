/**
 * Consulting services shown on `/consulting`.
 *
 * TODO(Phase 1/2): populate from the requirements spec. Every service must
 * describe real, offered work — no aspirational or invented offerings, and no
 * invented outcomes or metrics (CLAUDE.md §2).
 */

export type Service = {
  slug: string;
  title: string;
  /** One line: what the client gets. */
  summary: string;
  /** Concrete deliverables, not adjectives. */
  deliverables: string[];
  /** Typical engagement shape, e.g. "2–4 weeks". */
  engagement?: string;
};

export const services: Service[] = [
  // TODO: add services once the consulting section of the spec is available.
];
