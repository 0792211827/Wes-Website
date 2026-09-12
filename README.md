# Wesley Nyamosi — Website

Personal site: Next.js (App Router) + TypeScript + Tailwind CSS, MDX content,
git-managed. No headless CMS.

Read `CLAUDE.md` before making changes — it is the source of truth for brand
rules, stack decisions, repo conventions and build phases.
`PROJECT_STRUCTURE.md` documents the tree; `docs/requirements.md` holds the
full spec.

## Setup

```bash
npm install
cp .env.example .env.local   # optional; the site builds without any env vars
npm run dev                  # http://localhost:3000
```

## Scripts

| Command                       | What it does                              |
| ----------------------------- | ----------------------------------------- |
| `npm run dev`                 | Dev server                                |
| `npm run build`               | Production build                          |
| `npm start`                   | Serve the production build                |
| `npm run lint`                | ESLint                                    |
| `npm run typecheck`           | `tsc --noEmit`                            |
| `npm run generate-embeddings` | Build the RAG index (Phase 3, not yet implemented) |

## Adding content

Adding a case study, experiment or article never requires a code change — add
an `.mdx` file with valid frontmatter and it appears in the index, the detail
route and the sitemap.

Use the slash commands rather than hand-rolling the file, so no required
frontmatter field or section is missed:

- `/new-case-study <slug>` → `src/content/case-studies/<slug>.mdx`
- `/new-lab-experiment <slug>` → `src/content/lab/<slug>.mdx`
- `/new-blog-post <slug>` → `src/content/blog/<slug>.mdx`

The filename must match the frontmatter `slug`; a mismatch or an invalid
frontmatter field fails the build with a message naming the file.

Frontmatter schema and loaders: `src/lib/content.ts`.

## Before deploying

- Fill in every remaining `TODO:`-prefixed value in `src/config/site.ts` (site
  URL, GitHub, CV) — until then they render as plain text, not links.
  Email and LinkedIn are set.
- Add the consulting services in `src/config/services.ts`; `/consulting`
  currently renders an empty state.
- Set `NEXT_PUBLIC_SITE_URL` (or a real `url` in `src/config/site.ts`). A
  production build fails without it rather than silently shipping localhost
  canonicals and a localhost sitemap. To run a local production build before a
  domain is chosen: `ALLOW_PLACEHOLDER_SITE_URL=1 npm run build`.
- Favicon, Apple touch icon and the social share card are generated at build
  time from the design tokens (`src/app/{icon,apple-icon,opengraph-image}.tsx`).
  No asset to add; set `siteConfig.ogImage` only to override the card with a
  hand-designed image.
