# CLAUDE.md — Wesley Nyamosi Website

This file is the source of truth for any Claude Code session working in this repo.
Read it fully before making changes. When it conflicts with a person's casual instruction
mid-task, prefer this file unless they explicitly say to override it.

## 1. What this project is

Personal site for Wesley Nyamosi: an early-career AI / data engineer building toward
AI engineering work. Pages: Home, Work (case studies), Blogs, Ask Wesley's AI, Privacy,
plus a hidden `/admin`. (Consulting, AI Lab, About and Contact pages were removed 2026-10-25;
old URLs redirect. Contact is the closing section of Home (`/#contact`, an email link). Lab data,
its API and admin tab, and the `POST /api/contact` endpoint still exist but are not used by the site.)

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
- Don't publish Wesley's phone number. (Exception Wesley chose on 2026-10-25: his GitHub username
  `0792211827` is the same digits; he asked to link it anyway. Don't publish the number in any other form.) `Wesley_Nyamosi_Resume.pdf` at the repo root is
  gitignored for that reason; never commit it or copy it into `frontend/public`.
- No fake data presented as real: if a live source (GitHub, analytics) fails, hide the
  section or label the fallback clearly. Never show invented numbers as Wesley's.

## 3. Brand & design

- Voice: technical, confident, precise, understated. No hype ("world-class",
  "revolutionary", "cutting-edge"). Show evidence, don't assert authority.
- Dark-first, terminal-inspired design (monospace headings, green accent). Light theme exists.
  Dark is always the default. Surfaces and text are neutral (Wesley, 2026-10-26): dark = black
  background with white text, light = white background with black text. No tinted (olive, cream,
  beige) backgrounds or text.
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
  to defaults. Only the admin truly needs the API.
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

## 6. Rules that keep the two apps in sync

Data is duplicated on purpose (offline fallback). When you change one copy, change all of them:

| What | Copies to keep identical |
|---|---|
| API shapes | `backend/.../dto/*.java` ⇄ `frontend/src/app/core/models.ts` ⇄ `docs/API_CONTRACT.md` |
| Case studies, Lab, articles, Ask-AI knowledge | `backend/.../config/SeedData.java` ⇄ `frontend/src/app/core/data/content.data.ts` |
| Default site settings (headline, links, section toggles…) | `backend/.../service/SiteService.java` `DEFAULTS` ⇄ `frontend/src/app/core/site.service.ts` `DEFAULT_SETTINGS` |

Case-study diagrams are frontend-only: SVG in `frontend/src/app/core/data/diagrams/`, referenced from a project's
markdown `body` by a `[[diagram:key]]` line (the API never carries SVG).

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
2. GitHub is `0792211827` (set in both §6 defaults 2026-10-25). Still to do: set Render env
   `GITHUB_USERNAME=0792211827` and update `github`/`githubUser`/`x` in `/admin` (seed defaults don't change the live DB).
3. Case studies replaced with Wesley's three real projects (2026-10-25). `DataSeeder` swaps the five old samples out of
   an existing DB on the next deploy. Lab entries and articles are still sample content (§2).
   Trimmed 2026-10-26 to Overview → Problem → Context → Architecture (animated diagrams) → Lessons; each `body` is now
   just `## Architecture` + `[[diagram:…]]` lines. The detail page renders only those diagram lines from `body`
   (other text is ignored), so a DB still holding the old long bodies shows the same five sections.
4. Home page trimmed (2026-10-24, short about dropped 2026-10-25) to hero → AI Engineering areas → philosophy → Ask teaser → CTA
   (~5,800px on mobile, was ~12,900px). The system trace moved to Work; "What I build" was removed 2026-10-25. The hero image defaults to
   a stock Unsplash photo (not a person) until Wesley uploads his own in `/admin`.
5. Domain `wesleynyamosi.com` does not exist (NXDOMAIN) but is used for canonical URLs, sitemap and
   CORS. Replace with the real domain or the Vercel URL once decided.
6. Admin password, DB password and old admin default were committed in git history: rotate them on Render.
8. Ask-AI knowledge base rewritten to sourced facts (2026-10-26): no engagement steps, pricing, sprint lengths,
   workshops or reply times; the "training" entry was removed; sources point at `/#contact`. `DataSeeder` replaces
   entries in an existing DB that still carry the old phrases, so it needs a deploy, not an `/admin` edit.
7. Render keeps existing env values: check `NOTIFY_EMAIL` is unset or the real address (else lead emails
   go to the dead domain) and replace `GITHUB_USERNAME=wesleynyamosi` with `0792211827`. For Ask-AI on Gemini (2026-10-26): set
   `AI_API_KEY`, `AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai`, `AI_MODEL=gemini-3.5-flash-lite`,
   `AI_REASONING_EFFORT=minimal` (the old Groq/Llama values stay until replaced).

## 10. Definition of done

- `npm run build` in `frontend/` passes (and the backend compiles, if touched and Java is available).
- Checked in a browser at mobile and desktop widths.
- Accessibility checklist in §7 passes.
- §6 copies are in sync; `docs/API_CONTRACT.md` updated if an endpoint changed.
- No invented claims (§2).
