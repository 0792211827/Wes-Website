# CLAUDE.md — Wesley Nyamosi Website

This file is the source of truth for any Claude Code session working in this repo.
Read it fully before making changes. When it conflicts with a person's casual instruction
mid-task, prefer this file unless they explicitly say to override it.

## 1. What this project is

Personal site for Wesley Nyamosi: an early-career AI / data engineer building toward
AI engineering and consulting work. Pages: Home, About, Work (case studies), Consulting,
AI Lab (experiments), Writing, Ask Wesley's AI, Contact, Privacy, plus a hidden `/admin`.

North star: **"Production matters more than demos."** That is a stated *value*, not a
claim that Wesley has shipped production systems. Every page should answer: *does this
strengthen Wesley's credibility as someone who can solve real problems with AI?* If a
section doesn't serve that, cut it.

**Current goal:** the code is built (all four original phases exist in some form). The
work now is (1) making every claim true, (2) tightening the UI, (3) hardening for launch.
See §8.

## 2. Truth rules (non-negotiable)

- **Every claim about Wesley must be traceable** to `docs/source-material.md` or to
  something Wesley confirmed in the session. Never invent metrics, clients, employers,
  testimonials, years of experience, GitHub stars or project outcomes.
- The case studies, Lab entries and articles shipped with the code are **sample content**
  written by the original developer. Treat them as placeholders, not facts. Don't add
  more sample content; replace it with real work when Wesley provides it.
- Don't describe Wesley's own work as "in production" or "at scale" unless sourced.
  His two roles so far were **internships** — never drop that word.
- Never mention "Cassava AI" anywhere in content, copy, or metadata.
- Don't tie the brand to a single employer, job title, tech stack, or AI model/provider.
- Don't publish Wesley's phone number. `Wesley_Nyamosi_Resume.pdf` at the repo root is
  gitignored for that reason; never commit it or copy it into `frontend/public`.
- No fake data presented as real: if a live source (GitHub, analytics) fails, hide the
  section or label the fallback clearly. Never show invented numbers as Wesley's.

## 3. Brand & design

- Voice: technical, confident, precise, understated. No hype ("world-class",
  "revolutionary", "cutting-edge"). Show evidence, don't assert authority.
- Dark-first, terminal-inspired design (monospace headings, green accent). Light theme exists.
- Animation communicates systems/data flow, not decoration: no particles, no "AI brain"
  imagery, no heavy 3D, no ambient looping decoration.
- **Exception:** pointer-reactive motion (magnetic buttons, hover glow, card tilt) is
  wanted. Keep it subtle and inert on touch devices and under `prefers-reduced-motion`.

## 4. Architecture

One git repo, two apps:

```
frontend/   Angular 20 (standalone components, signals, zoneless) — deployed on Vercel
backend/    Spring Boot 4, Java 17 (Docker image uses 21) — deployed on Render with PostgreSQL
docs/       API_CONTRACT.md (the frontend ⇄ backend contract), source-material.md (facts about Wesley)
```

- The browser calls the API on the same origin under `/api/*`.
  - Dev: `frontend/proxy.conf.json` forwards `/api` to `http://localhost:8087`.
  - Prod: `frontend/vercel.json` rewrites `/api/*` to the Render service.
- The frontend **must keep working when the API is down** (Render sleeps): content renders
  from the bundled copy, Ask-AI answers from the offline knowledge base, settings fall back
  to defaults. Only the contact form and admin truly need the API.
- The backend's database is the live source of content; Wesley edits it through `/admin`.

### Run locally

```bash
cd backend  && ./mvnw spring-boot:run -Dspring-boot.run.profiles=local   # H2 in-memory, port 8087
cd frontend && npm install && npm start                                  # http://localhost:4200
cd frontend && npm run build                                             # must pass before calling work done
```

Java must be installed for the backend. If it isn't, run the frontend alone (it falls
back to bundled data), or point a temporary proxy config at the live API for review.

### Deploy

Vercel and Render must use **Root Directory** `frontend` and `backend` respectively.
Secrets (admin password, token secret, DB, mail, AI key) live only in Render env vars;
see `backend/README.md`.

## 5. Where things live

**Frontend (`frontend/src`)**
- `styles.css` — the whole design system (tokens, components, motion, responsive). Numbered sections.
- `app/app.routes.ts` — lazy-loaded pages. `app/pages/` — one file per page (`home/` has its own components).
- `app/layout/` — top bar, footer, boot intro, command palette, floating assistant.
- `app/shared/` — cards, section heads, chat, TOC, icons, SVG art, directives.
- `app/core/` — services (`api`, `content`, `site`, `seo`, `analytics`, `motion`, `admin`), `models.ts`.
- `app/core/data/` — bundled fallback content (`content.data.ts`), site copy (`site.data.ts`).

**Backend (`backend/src/main/java/com/WesPortfolio`)**
- `web/` controllers, `service/` logic, `domain/` JPA entities, `dto/` JSON records,
  `security/` token auth + rate limits, `config/` properties + `SeedData.java` (starter content).

## 6. Rules that keep the two apps in sync

Data is duplicated on purpose (offline fallback). When you change one copy, change all of them:

| What | Copies to keep identical |
|---|---|
| API shapes | `backend/.../dto/*.java` ⇄ `frontend/src/app/core/models.ts` ⇄ `docs/API_CONTRACT.md` |
| Case studies, Lab, articles, Ask-AI knowledge | `backend/.../config/SeedData.java` ⇄ `frontend/src/app/core/data/content.data.ts` |
| Default site settings (headline, links, section toggles…) | `backend/.../service/SiteService.java` `DEFAULTS` ⇄ `frontend/src/app/core/site.service.ts` `DEFAULT_SETTINGS` |

Seed data only fills **empty** tables, so editing `SeedData.java` does not change the
live database. Tell Wesley when a change also needs to be made in `/admin`.

## 7. Conventions

- Match the surrounding code: standalone components with inline templates, signals,
  `inject()`, the existing CSS classes and tokens in `styles.css`. Don't add a CSS framework
  or UI library without asking.
- Every page sets title, description and canonical URL via `SeoService.set()`.
- Accessibility is not optional: keyboard navigation, visible focus, contrast, labeled
  controls, accessible forms, `prefers-reduced-motion` support. Check before calling UI done.
- Responsive at mobile (390px), tablet, laptop, desktop. No horizontal overflow or clipping.
- Performance: pages stay lazy-loaded; the assistant widget must never block first paint.
- Any GitHub call needs a graceful fallback; a GitHub failure must never break render.
- No secrets in committed files. Backend secrets come from env vars or a gitignored
  `secrets.properties`. Never commit real default passwords in `application.properties`.
- LLM calls happen only in the backend (`LlmClient`, any OpenAI-compatible endpoint), so the
  provider can change by config. The frontend never calls a model provider.

## 8. Open work (update this list as items close)

1. Live site serves another person's photo and CV — Wesley must upload his own in `/admin`.
2. GitHub: no real username yet, so GitHub links and the activity section are hidden. When known, set
   `github`/`githubUser` defaults (both §6 copies) and Render env `GITHUB_USERNAME`.
3. Replace sample case studies / Lab / articles with real, sourced work (§2).
4. Home page is too long and repetitive; tighten it.
5. Domain `wesleynyamosi.com` does not exist (NXDOMAIN) but is used for canonical URLs, sitemap and
   CORS. Replace with the real domain or the Vercel URL once decided.
6. Admin password, DB password and old admin default were committed in git history: rotate them on Render.

## 9. Subagents

See `.claude/agents/`. Use them for their named job:

- `content-writer` — drafts/edits case studies, Lab entries, articles and Ask-AI knowledge in both data copies (§6)
- `code-reviewer` — reviews diffs against this file before commit
- `seo-auditor` — checks titles, descriptions, canonicals, sitemap and robots

## 10. Definition of done

- `npm run build` in `frontend/` passes (and the backend compiles, if touched and Java is available).
- Checked in a browser at mobile and desktop widths.
- Accessibility checklist in §7 passes.
- §6 copies are in sync; `docs/API_CONTRACT.md` updated if an endpoint changed.
- No invented claims (§2).
