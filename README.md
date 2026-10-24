# Wesley Nyamosi — website

| Folder | What | Hosted on |
|---|---|---|
| [`frontend/`](frontend/README.md) | Angular 20 site | Vercel (Root Directory: `frontend`) |
| [`backend/`](backend/README.md) | Spring Boot API + PostgreSQL | Render (Root Directory: `backend`) |
| [`docs/`](docs/) | API contract, source facts for site copy | |

## Run locally

```bash
# terminal 1: API on http://localhost:8087 (in-memory database, needs Java 17+)
cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=local

# terminal 2: site on http://localhost:4200 (forwards /api to the backend)
cd frontend && npm install && npm start
```

The site also runs without the backend: it falls back to bundled content.

See [`CLAUDE.md`](CLAUDE.md) for project rules and conventions.
