# CLAUDE.md — Wesley Nyamosi Website

This file is the source of truth for any Claude Code session working in this repo.
Read it fully before making changes. When it conflicts with a person's casual instruction
mid-task, prefer this file unless they explicitly say to override it.

## 1. What this project is

Personal site for Wesley Nyamosi: AI engineer, builder, independent AI consultant.
Full spec: `/docs/requirements.md` (paste the requirements doc here before Phase 1 starts).

North star: **"Production matters more than demos."**
Every page should answer, in some way: *does this strengthen Wesley's credibility as someone
who can solve real problems with AI?* If a component/section doesn't serve that, cut it.

## 2. Brand & content rules (non-negotiable)

- Voice: technical, confident, precise, understated. No hype language ("world-class",
  "revolutionary", "cutting-edge" as filler). Show evidence, don't assert authority.
- Never mention "Cassava AI" anywhere in content, copy, or metadata.
- Don't tie the brand to a single employer, job title, tech stack, or AI model/provider.
- Dark-first visual design. Animation communicates systems/data flow, not decoration —
  no particle effects, no generic "AI brain" imagery, no heavy 3D.
- Every claim about Wesley's work must be traceable to real content (case study, repo,
  article). Never invent metrics, testimonials, or experience.

## 3. Tech stack (do not swap without asking)

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Content: MDX/Markdown, Git-managed, no headless CMS in v1
- Hosting/backend: Next.js server + API routes; split into a separate service only if
  the AI assistant's load genuinely requires it
- AI: provider-agnostic wrapper — never hardcode a single LLM SDK call outside
  `src/lib/rag/`. All model calls go through one abstraction so the provider can change.

## 4. Repo conventions

- Content lives in `src/content/**`, never hardcoded into components. Every content
  item needs frontmatter: `title, slug, description, date, category, tags, featured,
  image, github, demo` (omit fields that don't apply, don't invent values).
- Components: `src/components/ui` (primitives), `src/components/sections` (page
  sections), `src/components/layout`, `src/components/assistant`.
- Path aliases: `@/components`, `@/lib`, `@/content`, `@/config`.
- No secrets in frontend code or committed files. Env vars via `.env.local`, documented
  in `.env.example`.
- Every page needs: unique title, meta description, canonical URL, OG + Twitter
  metadata, semantic HTML, proper heading hierarchy. Use `src/lib/seo.ts` helpers,
  don't hand-roll metadata per page.
- Accessibility is not optional: keyboard nav, contrast, reduced-motion support,
  accessible forms, labeled interactive elements — check this before calling any
  UI task done.
- Performance: prefer server components / static generation by default; only use
  client components where interactivity requires it. The AI assistant widget must
  load independently and never block first paint of the rest of the page.

## 5. GitHub integration rule

Any GitHub API call (featured repos, stars, activity) must have a graceful fallback
(cached/static data) if the API fails or rate-limits. Never let a GitHub API failure
break page render.

## 6. Working in phases

Build in the order below. Don't jump ahead to later phases' polish (e.g. don't wire
the AI assistant's real retrieval before Phase 1 pages exist) unless explicitly asked.

1. **Phase 1 — Core website**: Home, About, Work, Consulting, AI Lab, Writing, Contact,
   nav/footer, responsive layout, SEO scaffolding, analytics scaffolding.
2. **Phase 2 — Content**: populate 3–5 case studies, 3–5 Lab experiments, initial
   articles, bio, consulting services content.
3. **Phase 3 — AI**: "Ask Wesley's AI" — RAG over approved public content only.
4. **Phase 4 — Advanced**: GitHub integration, interactive architecture diagrams,
   deeper analytics, newsletter, booking, testimonials.

## 7. Subagents available

See `.claude/agents/`. Use them proactively for their named job rather than doing the
work inline:

- `case-study-writer` — drafts/edits pages under `src/content/case-studies`
- `lab-experiment-writer` — drafts/edits pages under `src/content/lab`
- `blog-writer` — drafts/edits articles under `src/content/blog`
- `seo-auditor` — checks metadata/structured data completeness across content
- `architecture-diagram` — produces diagram specs/SVGs for case studies & Lab posts
- `code-reviewer` — reviews diffs against the conventions in this file before merge

## 8. Slash commands available

See `.claude/commands/`: `/new-case-study`, `/new-lab-experiment`, `/new-blog-post`
scaffold a correctly-structured content file with frontmatter and required section
headers so nothing is missed.

## 9. Definition of done for any page/section

- Matches required structure from the spec (e.g. case studies need Overview, Problem,
  Business Context, Requirements, Architecture, Implementation, Challenges, Tradeoffs,
  Evaluation, Results, Lessons, Resources — no skipping sections, empty ones are fine
  as placeholders during Phase 1/2).
- Responsive at mobile/tablet/laptop/desktop.
- Passes the accessibility checklist in §4.
- SEO metadata present.
- No hardcoded content that belongs in `src/content`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
