# Wesley Portfolio — API contract (Spring Boot ⇄ Angular)

Base path: `/api`. JSON everywhere. Errors use Spring `ProblemDetail` (`{title, detail, status, fields?}`).
In production Vercel rewrites `/api/*` to the Render backend, so the browser calls the same origin.

## Content (public, GET)
| Method | Path | Response |
|---|---|---|
| GET | /api/projects | `ProjectDto[]` (published, ordered by sortOrder) |
| GET | /api/projects/{slug} | `ProjectDto` or 404 |
| GET | /api/lab | `LabDto[]` |
| GET | /api/lab/{slug} | `LabDto` or 404 |
| GET | /api/posts | `PostDto[]` (newest first) |
| GET | /api/posts/{slug} | `PostDto` or 404 |
| GET | /api/health | `{ "status": "UP", "time": "<iso>" }` |

```ts
Pair       { label: string; value: string }
Decision   { title: string; body: string; tradeoff: string }
LabRow     { label: string; value: number; pct: number }
SourceLink { label: string; url: string }
ProjectDto { slug, title, category, cat, art, year, problem, outcome, metric: Pair, tech: string[], overview, context,
             requirements: string[], arch: string[], implementation, challenges: string[], decisions: Decision[],
             evaluation, results: Pair[], lessons: string[], resources: string[],
             body /* markdown long-form write-up; `## ` sections, `[[diagram:key]]` embeds a frontend diagram */, featured: boolean, sortOrder: number }
LabDto     { slug, type, color, date, status, title, question, method, env: Pair[], experiment, unit, rows: LabRow[],
             analysis, conclusion, code, sortOrder: number }
PostDto    { slug, track, date, readMinutes: number, title, tags: string[], excerpt, body }   // body = markdown-lite
KnowledgeDto { key, title, keywords, answer, sources: SourceLink[] }
```
Java: all of these are records nested in `com.WesPortfolio.dto.ContentDtos` (see SeedData.java for constructor order).

## Contact (public)
`POST /api/contact`
```json
{ "name": "…", "email": "…", "company": "…", "role": "…", "services": ["AI Strategy"],
  "problem": "…", "budget": "…|null", "timeline": "…|null", "website": "" }
```
Validation: name 2–120, email valid ≤160, services 1–9 items, problem 30–4000, company/role ≤120, budget/timeline ≤60.
`website` is a honeypot: when filled, return 202 without saving.
Rate limit: 5 per IP per hour → 429 ProblemDetail.
Response `201`: `{ "id": 12, "message": "Thanks, …" }`

## Ask Wesley's AI (public)
`POST /api/ask` → `{ "question": "…(1–500)", "sessionId": "optional" }`
Response:
```json
{ "answer": "markdown-lite text (paragraphs, '- ' bullets)",
  "sources": [{ "label": "Local RAG on Private Infrastructure", "url": "/work/local-rag-private-llm" }],
  "grounded": true, "fallback": false, "mode": "llm|extractive|refusal|fallback",
  "trace": "retrieved 4 documents · top score 0.82 · grounded", "remaining": 14,
  "followUps": ["two suggested next questions"] }
```
Rate limit: 15 questions per IP per hour → 429.
`GET /api/ask/suggestions` → `string[]`

## GitHub (public, cached server side)
`GET /api/github/repos` → GitHub REST repos JSON array (passed through)
`GET /api/github/contributions` → `{ total: { lastYear: n }, contributions: [{ date, count, level }] }` (passed through)
On failure: 503 ProblemDetail (the frontend hides the section).

## Site settings & files (public)
`GET /api/site` → `{ settings: Record<string,string>, photo: FileInfo|null, cv: FileInfo|null }`
(keys and defaults: `SiteService.DEFAULTS` ⇄ frontend `DEFAULT_SETTINGS`)
`GET /api/files/{key}` → the uploaded file (`photo` inline, `cv` downloads as `Wesley-Nyamosi-CV.pdf`) or 404
```ts
FileInfo { key, filename, contentType, size, updatedAt, url }   // url e.g. /api/files/photo?v=1729600000
```

## Visitor tracking (public)
`POST /api/track` → `{ visitorId?, sessionId?, type, path?, title?, referrer?, label?, screen?, language?, timezone?, refId?, durationMs? }`
Response: `{ id }`. `type` is `pageview`, `leave` (with `refId` + `durationMs`), `cv_download`, `outbound`, etc.

## Admin (Bearer token)
`POST /api/auth/login` `{ username, password }` → `{ token, expiresAt }` (5 attempts / 15 min per IP)
All below need `Authorization: Bearer <token>`:
| Method | Path | Notes |
|---|---|---|
| GET | /api/admin/me | `{ username }` (token check) |
| GET | /api/admin/stats | `{ leads, newLeads, questions, fallbackRate, projects, labEntries, posts }` |
| GET | /api/admin/leads | `LeadDto[]` newest first |
| PATCH | /api/admin/leads/{id} | `{ status?, notes? }` → `LeadDto` |
| DELETE | /api/admin/leads/{id} | 204 |
| GET | /api/admin/ask-logs | `AskLogDto[]` (latest 200) |
| PUT | /api/admin/projects | body `ProjectDto` upsert by slug |
| DELETE | /api/admin/projects/{slug} | 204 |
| PUT | /api/admin/lab | `LabDto` upsert |
| DELETE | /api/admin/lab/{slug} | 204 |
| PUT | /api/admin/posts | `PostDto` upsert |
| DELETE | /api/admin/posts/{slug} | 204 |
| GET | /api/admin/knowledge | `KnowledgeDto[]` |
| PUT | /api/admin/knowledge | `KnowledgeDto` upsert by key |
| DELETE | /api/admin/knowledge/{key} | 204 |
| GET / PUT / DELETE | /api/admin/site | read, update (`Record<string,string>`, known keys only), reset settings |
| POST | /api/admin/files/{key} | multipart `file`; key `photo` (≤5 MB image) or `cv` (≤10 MB PDF) → `FileInfo` |
| DELETE | /api/admin/files/{key} | 204 |
| GET | /api/admin/analytics/summary?days=30 | `Summary` (see `AnalyticsDtos.java`) |
| GET | /api/admin/analytics/sessions?days=30&limit=200&q= | `SessionDto[]` |
| GET | /api/admin/analytics/sessions/{sessionId} | `{ session, events, otherSessions }` |

```ts
LeadDto   { id, name, email, company, role, services: string[], problem, budget, timeline,
            status: 'NEW'|'CONTACTED'|'QUALIFIED'|'PROPOSAL'|'WON'|'LOST'|'ARCHIVED', notes, createdAt, updatedAt }
AskLogDto { id, question, mode, topKey, score, fallback, latencyMs, createdAt }
```
