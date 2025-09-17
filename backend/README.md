# Backend (FastAPI) — Contracts RAG API

## Run locally
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # fill DATABASE_URL, JWT_SECRET
uvicorn main:app --reload --port 8000
```

## Database
- Use Supabase (recommended) or local Docker Postgres with pgvector.
- Apply `schema.sql` once.

## Endpoints
- `POST /api/signup` — {username, password} → JWT
- `POST /api/login` — {username, password} → JWT
- `POST /api/upload` — file (PDF/TXT/DOCX), Authorization: Bearer <JWT>
- `GET  /api/contracts` — list; supports `q`, `status`, `risk`, `page`, `page_size`
- `GET  /api/contracts/{doc_id}` — detail + mock insights/snippets
- `POST /api/ask` — {question} → mock answer + top chunks via pgvector

All endpoints are user-scoped with JWT. Store JWT in `localStorage` on the frontend.

## Deploy
- Render / Fly.io / Railway:
  - Set `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`.
  - Start command: `uvicorn main:app --host 0.0.0.0 --port 8000`
