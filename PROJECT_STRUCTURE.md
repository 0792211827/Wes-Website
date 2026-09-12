# Project Structure

```
wesley-nyamosi-site/
├── CLAUDE.md                      # rules Claude Code reads every session
├── README.md
├── .env.example
├── .claude/
│   ├── agents/
│   │   ├── case-study-writer.md
│   │   ├── lab-experiment-writer.md
│   │   ├── blog-writer.md
│   │   ├── seo-auditor.md
│   │   ├── architecture-diagram.md
│   │   └── code-reviewer.md
│   └── commands/
│       ├── new-case-study.md
│       ├── new-lab-experiment.md
│       └── new-blog-post.md
│
├── docs/
│   └── requirements.md            # paste the full requirements spec here
│
├── src/
│   ├── app/                                   # Next.js App Router
│   │   ├── layout.tsx                         # root layout, nav, footer
│   │   ├── page.tsx                            # Home
│   │   ├── about/page.tsx
│   │   ├── work/
│   │   │   ├── page.tsx                        # Work index / featured cards
│   │   │   └── [slug]/page.tsx                 # Case study detail
│   │   ├── consulting/page.tsx
│   │   ├── lab/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── writing/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── ask/page.tsx                        # "Ask Wesley's AI"
│   │   ├── contact/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── api/
│   │   │   ├── assistant/route.ts              # RAG chat endpoint
│   │   │   ├── contact/route.ts                # form submission + validation
│   │   │   └── github/route.ts                 # GitHub API proxy w/ fallback
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   │
│   ├── components/
│   │   ├── ui/                                 # buttons, cards, inputs, badges
│   │   ├── layout/                             # nav, footer, page shell
│   │   ├── sections/                           # hero, philosophy, expertise, etc.
│   │   │   └── diagrams/                       # architecture-diagram agent output
│   │   └── assistant/                          # chat widget (loads independently)
│   │
│   ├── content/                                # MDX, git-managed
│   │   ├── case-studies/
│   │   ├── lab/
│   │   ├── blog/
│   │   └── about/
│   │
│   ├── lib/
│   │   ├── content.ts                          # MDX loader/parser, frontmatter schema
│   │   ├── seo.ts                              # generateMetadata helpers
│   │   ├── analytics.ts                        # privacy-conscious analytics wrapper
│   │   ├── github.ts                            # GitHub API + fallback/cache
│   │   └── rag/
│   │       ├── ingest.ts                       # builds embeddings from src/content
│   │       ├── retrieve.ts                     # retrieval over approved content only
│   │       ├── embeddings.ts
│   │       └── provider.ts                     # provider-agnostic LLM call wrapper
│   │
│   ├── config/
│   │   ├── site.ts                             # nav, socials, site metadata
│   │   └── services.ts                         # consulting services data
│   │
│   ├── types/                                  # shared TS types (ContentItem, etc.)
│   └── styles/
│
├── public/
│   └── images/
│
├── scripts/
│   └── generate-embeddings.ts                  # run at build/deploy for RAG index
│
├── tests/
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Notes

- **Backend**: Next.js API routes for v1 (per requirements §22). `src/lib/rag/` is
  isolated on purpose so the AI assistant can be split into a separate service later
  without touching page code.
- **Content vs code**: nothing in `src/content` should require a code change to add —
  new case study/article/experiment = new `.mdx` file with frontmatter, nothing else.
- **AI assistant isolation**: `src/components/assistant` is the only place that talks
  to `/api/assistant`; it should be dynamically imported so it never blocks the main
  page's initial render (requirements §25).
- **`.claude/skills/`** isn't included yet — add it later only if a workflow emerges
  that's more complex than a single agent + slash command (e.g. a multi-step content
  migration or a repeatable eval process for the AI assistant).
