# Wesley Nyamosi — Portfolio (Angular frontend)

The website for **Wesley Nyamosi, AI Engineering & Consulting**, built from the approved `index.html` design.
Angular 20 (standalone components, signals, zoneless), deployed on **Vercel**, talking to the Spring Boot API
(`WesPortfolio`, deployed on **Render**) under `/api`.

## Run it locally

Requirements: Node.js 20.19+ (or 22+), npm.

```bash
npm install
npm start            # http://localhost:4200
```

`npm start` forwards every `/api/*` call to `http://localhost:8087` (see `proxy.conf.json`), so start the backend too:

```bash
# from the repo root
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local      # Windows: mvnw.cmd ...
```

The site still works **without the backend**: content falls back to the bundled copy, the AI assistant answers from
its offline knowledge base, and the GitHub section is hidden. Only the contact form needs the API.

## Build

```bash
npm run build        # output: dist/wes-portfolio/browser
```

## Deploy on Vercel

1. Import the repo in Vercel and set **Root Directory** to `frontend` (framework: Angular is detected; settings come from `vercel.json`).
2. In `vercel.json`, change the `/api/:path*` rewrite destination to your Render API URL
   (default `https://wesportfolio-api.onrender.com`). The browser then calls the API on the same domain: no CORS setup needed.
3. Add the custom domain (e.g. `wesleynyamosi.com`) in Vercel, and make sure the same domain is in the API's `CORS_ORIGINS`.

`vercel.json` also sends every other path to `index.html` (deep links like `/work/enterprise-knowledge-assistant`
work on refresh), caches hashed assets for a year and sets security headers.

## Before launch

- `public/assets/wesley.jpg`: Wesley's photo. The home page turns it into the animated ASCII portrait (a silhouette is drawn until it exists).
- `public/assets/wesley-nyamosi-cv.pdf`: the CV.
- `src/app/core/data/site.data.ts`: email, GitHub (empty = GitHub links and section hidden), LinkedIn, `githubUser`, timeline, services copy.
- Case studies, AI Lab entries and articles are **sample content**. Edit them in the database through the admin API
  (preferred, no redeploy) or in `src/app/core/data/content.data.ts` (the bundled fallback).
- Update `public/sitemap.xml` and the canonical domain in `src/index.html` if the domain differs.

## Where things are

```
src/
  index.html            meta tags, fonts, theme pre-paint
  styles.css            the whole design system (tokens, components, motion, responsive)
  environments/         apiUrl (empty = same origin via proxy / Vercel rewrite)
  app/
    app.ts / app.html   shell: top bar, router outlet, footer, overlays
    app.config.ts       zoneless, router (view transitions, input binding, anchor scrolling), HTTP
    app.routes.ts       lazy-loaded pages
    core/               models, API + content services, motion layer, theme, SEO, admin auth
      data/             content.data.ts (projects, lab, posts, knowledge), site.data.ts (site copy), icons.ts
    layout/             top bar, footer, boot intro, command palette, floating assistant, back-to-top
    shared/             cards, page/section heads, chat, TOC, icons, word-split + count-up directives, SVG art
    pages/              home (+ ASCII portrait, live system trace, GitHub activity, pipeline), about, work,
                        case study, consulting, lab, experiment, writing, article, ask, contact, privacy, 404, admin
```

## Animation layer

All motion is purposeful (data flow, terminal typing, reveals) and is switched off automatically for visitors
who set *reduce motion* in their operating system.

- Terminal boot intro on the first visit (any key or click skips it)
- Name decodes from random glyphs; headings reveal word by word; "open to engagements" stamp lands
- ASCII portrait types in row by row and lights up around the pointer
- Live (simulated) request trace through a RAG system with metrics and log
- GitHub calendar cells wave in; numbers count up; bars grow
- Case-study architecture diagrams and project illustrations draw themselves
- Grid lights up around the pointer; magnetic buttons; subtle card tilt and spotlight
- Tech marquee, scroll progress bar, back-to-top ring, page transitions (View Transitions API)
- AI answers stream in like a live model response, then show their sources

## Admin

`/admin` (not linked anywhere, blocked in `robots.txt`): sign in with the API's `ADMIN_USERNAME` / `ADMIN_PASSWORD`
to see consulting leads (status + notes) and what visitors ask the AI assistant.
