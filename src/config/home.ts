/**
 * Homepage section content.
 *
 * Copy lives here rather than inside the section components (CLAUDE.md §4).
 *
 * Everything below is traceable to Wesley's CV: the statistics background, the
 * two internships (predictive modelling, NLP sentiment analysis, data
 * pipelines, Git-based reproducibility) and the MLOps/deployment toolchain.
 * The principles are stated positions, not claims of past results.
 *
 * Expertise areas deliberately carry no `href` yet: CLAUDE.md §2 requires every
 * claim to point at real content, and no case studies or Lab experiments exist.
 * Add the link at the same time as the content it points to — not before.
 */

export const hero = {
  /** Traceable to CLAUDE.md §1. */
  headline: "AI engineer, builder, and independent AI consultant.",
  /** One or two sentences on what Wesley does and for whom. */
  subhead:
    "I build predictive models and NLP systems — and the pipelines that get them out of a notebook and into something a team can actually run.",
  primaryCta: { label: "See the work", href: "/work" },
  secondaryCta: { label: "Start a conversation", href: "/contact" },
} as const;

export const philosophy = {
  /** The north star from CLAUDE.md §2. */
  statement: "Production matters more than demos.",
  body: "A model that scores well on a held-out split has proven very little. What decides whether it is worth anything is how it behaves on data it has not seen, whether the pipeline that feeds it can be re-run, and whether someone other than its author can retrain it six months later.",
  /**
   * Supporting principles. Each should be defensible and specific; a principle
   * that could appear on any engineer's site is not worth the space.
   */
  principles: [
    {
      title: "Reproducible from the first commit",
      body: "Version control, pinned environments and deterministic preprocessing. An experiment that cannot be re-run has not produced a result — it has produced an anecdote.",
    },
    {
      title: "Measured against a baseline",
      body: "Every model gets compared to the obvious simple approach. A metric without something to compare it to is decoration, and often the simple approach wins.",
    },
    {
      title: "Built to hand over",
      body: "Tracked experiments, a documented deployment path, and code someone else can pick up. The work is finished when it no longer depends on me being in the room.",
    },
  ] as { title: string; body: string }[],
};

export type ExpertiseArea = {
  title: string;
  /** What Wesley actually does in this area, concretely. */
  body: string;
  /**
   * Optional pointer to evidence — a case study route, Lab experiment or repo.
   * Claims here should be backed by real content (CLAUDE.md §2).
   */
  href?: string;
};

export const expertise: ExpertiseArea[] = [
  {
    title: "Predictive modelling",
    body: "Forecasting and classification built on a statistics foundation rather than library defaults — starting from the assumptions the data actually supports.",
  },
  {
    title: "Natural language processing",
    body: "Turning unstructured text into something decidable: preprocessing, sentiment and entity extraction, and evaluation that accounts for how noisy real text is.",
  },
  {
    title: "Deployment and MLOps",
    body: "The work that starts where the notebook ends: containerising a model, tracking what was run, and leaving a path back to how a result was produced.",
  },
  {
    title: "Data pipelines",
    body: "Ingestion, cleaning and feature work — written to be re-run, on the assumption that the upstream data will not stay the way it looks today.",
  },
];

export const selectedWork = {
  title: "Selected work",
  description:
    "Case studies covering the problem, the architecture, the tradeoffs and what the evaluation actually showed.",
  /** How many featured case studies to surface on the homepage. */
  limit: 3,
};
