# WesPortfolio API (Spring Boot)

Backend for **Wesley Nyamosi, AI Engineering**. It serves the site content, stores consulting leads,
answers "Ask Wesley's AI" questions from approved content, and proxies GitHub data. The Angular frontend (Vercel)
calls it under `/api`.

- Spring Boot 4.1.1, Java 17+ (the Docker image uses 21), package `com.WesPortfolio`
- PostgreSQL in production (Render); an in-memory H2 database for local runs (`local` profile)
- No secrets in Git: everything sensitive comes from environment variables or `secrets.properties`

## Run it locally

**Option A, no database install (H2, data resets on restart):**
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local        # Windows: mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

**Option B, local PostgreSQL:**
1. Create a database named `WesPortfolio`.
2. Copy `secrets.properties.example` to `secrets.properties` and fill in your database password (and anything else you need).
3. Run `./mvnw spring-boot:run`

The API listens on http://localhost:8087. Check http://localhost:8087/api/health and http://localhost:8087/api/projects.
On the first start the tables are created and filled with the starter content (case studies, AI Lab, articles,
Ask-AI knowledge base). Existing rows are never overwritten.

## Deploy on Render

**Monorepo note:** this API lives in the `backend/` folder. In Render set **Root Directory** to `backend`.

**Blueprint (easiest):** push the repo to GitHub, then in Render choose *New > Blueprint* and pick the repo.
`render.yaml` creates the PostgreSQL database and the web service (Docker), and wires `DATABASE_URL` automatically.
Fill in the variables marked "sync: false" (admin password, mail, AI key) in the Render dashboard.

**Manual:** create a PostgreSQL instance, then a Web Service:
- Runtime **Docker** (uses `Dockerfile`), or runtime **Java** with
  - Build command: `./mvnw -DskipTests package`
  - Start command: `java -jar target/WesPortfolio-0.0.1-SNAPSHOT.jar`
- Health check path: `/api/health`
- Environment variables: see the table below. Set `DATABASE_URL` to the database's *Internal Database URL*.

Render's `postgres://user:pass@host/db` URL is converted to JDBC at start-up (see `WesPortfolioApplication`),
so you do not need to rewrite it by hand.

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | on Render | Render Postgres URL (`postgres://...`), converted automatically |
| `SPRING_DATASOURCE_URL` / `_USERNAME` / `_PASSWORD` | alternative | JDBC settings (also accepted: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`) |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | yes | Admin dashboard login. There is no default password: without it, admin login is disabled. (Local profile: `admin` / `local-admin`.) |
| `TOKEN_SECRET` | yes | 32+ random characters; signs admin tokens |
| `IP_SALT` | recommended | Salt for hashing visitor IPs (raw IPs are never stored) |
| `CORS_ORIGINS` | yes | Comma-separated origins, patterns allowed: `https://wesleynyamosi.com,https://*.vercel.app` |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` | optional | SMTP for lead notifications (Gmail: use an App Password) |
| `MAIL_FROM`, `NOTIFY_EMAIL`, `MAIL_ACK` | optional | Sender, where leads are emailed, and whether visitors get an acknowledgement |
| `GITHUB_USERNAME`, `GITHUB_TOKEN` | optional | GitHub activity on the home page (token raises the rate limit). Unset = section hidden |
| `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL` | optional | Any OpenAI-compatible endpoint (Gemini `gemini-3.5-flash-lite` by default; key from Google AI Studio). Without a key, answers are extractive |
| `AI_REASONING_EFFORT`, `AI_MAX_TOKENS` | optional | Thinking level sent as `reasoning_effort` (default `minimal`; set empty for models that reject it) and the output cap, thinking included (default `1024`) |
| `PORT` | set by Render | HTTP port |

## Endpoints

Public:

| Method | Path | |
|---|---|---|
| GET | `/api/health` | Status |
| GET | `/api/projects`, `/api/projects/{slug}` | Case studies |
| GET | `/api/lab`, `/api/lab/{slug}` | AI Lab |
| GET | `/api/posts`, `/api/posts/{slug}` | Articles |
| POST | `/api/contact` | Contact form (5 per hour per visitor, honeypot `website`) |
| POST | `/api/ask` | Ask Wesley's AI (15 questions per hour per visitor) |
| GET | `/api/ask/suggestions` | Example questions |
| GET | `/api/github/repos`, `/api/github/contributions` | Cached GitHub data |

Admin (send `Authorization: Bearer <token>` from `POST /api/auth/login`):

| Method | Path | |
|---|---|---|
| GET | `/api/admin/me`, `/api/admin/stats` | Session check, dashboard numbers |
| GET / PATCH / DELETE | `/api/admin/leads`, `/api/admin/leads/{id}` | Leads (status: NEW, CONTACTED, QUALIFIED, PROPOSAL, WON, LOST, ARCHIVED; notes) |
| GET | `/api/admin/ask-logs` | Latest 200 questions, mode, score, fallback |
| PUT / DELETE | `/api/admin/projects`, `/api/admin/projects/{slug}` | Create or update a case study (by slug) |
| PUT / DELETE | `/api/admin/lab`, `/api/admin/lab/{slug}` | AI Lab entries |
| PUT / DELETE | `/api/admin/posts`, `/api/admin/posts/{slug}` | Articles |
| GET / PUT / DELETE | `/api/admin/knowledge`, `/api/admin/knowledge/{key}` | Ask-AI knowledge base |

## Editing content

The starter content is **sample content**. Replace it with Wesley's real work in one of two ways:

1. **Before the first deploy:** edit `src/main/java/com/WesPortfolio/config/SeedData.java`. It is only used when a table is empty.
2. **After deploy:** log in (`POST /api/auth/login`) and send the full JSON of a case study, lab entry, article or
   knowledge answer with `PUT` to the matching `/api/admin/...` endpoint. Same slug = update; new slug = new item.
   The JSON shape is exactly what the public `GET` endpoints return.

## How "Ask Wesley's AI" works

```
question -> privacy check -> retrieval over approved content -> answer + sources -> anonymous log
```
- Retrieval scores the knowledge base plus all case studies, lab entries and articles (IDF-weighted keywords).
- When nothing relevant is found, it says so (fallback) instead of guessing.
- Personal questions (salary, address, family...) are refused.
- With `AI_API_KEY` set, an LLM writes the answer **only** from the top retrieved documents; any failure falls back
  to the extractive answer. Without a key, the best approved answer is returned word for word.
- Questions are logged with a salted IP hash so quality can be monitored in the admin dashboard.

## Project layout

```
src/main/java/com/WesPortfolio/
  WesPortfolioApplication.java   entry point (+ Render DATABASE_URL conversion)
  config/      AppProperties (app.*), DataSeeder, SeedData (starter content)
  domain/      JPA entities: Project, LabEntry, Post, KnowledgeEntry, Lead, AskLog
  dto/         ContentDtos (public JSON), ApiDtos (requests/responses)
  repository/  Spring Data repositories
  security/    SecurityConfig, TokenService, TokenAuthFilter, RateLimiter, IpHasher
  service/     ContentService, ContactService, AskService, LlmClient, GithubService
  web/         REST controllers + error handling
```
