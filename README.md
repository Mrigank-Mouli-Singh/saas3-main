# Contracts RAG SaaS — Prototype

A full-stack prototype showcasing:
- Multi-tenant auth (JWT)
- Upload & parse (mock LlamaCloud)
- Store chunks with embeddings (Postgres + pgvector)
- RAG-style query
- Business-friendly dashboard

## Tech
- Frontend: React + Tailwind (Vite)
- Backend: FastAPI
- DB: Postgres + pgvector (Supabase suggested)

## Quick Start
1. **Database**
   - Create a Postgres instance (Supabase works great).
   - Run `backend/schema.sql`.
2. **Backend**
   ```bash
   cd backend
   python -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env  # set DATABASE_URL, JWT_SECRET
   uvicorn main:app --reload --port 8000
   ```
3. **Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env  # set VITE_API_URL
   npm run dev
   ```

## Deploy
- **Backend**: Render/Fly.io/Heroku → Start command `uvicorn main:app --host 0.0.0.0 --port 8000`
- **Frontend**: Netlify/Vercel → Publish `dist`, set `VITE_API_URL`
- **DB**: Supabase with pgvector extension enabled

## ER Diagram
See `docs/er_diagram.png`. Tables:
- users(user_id, username, password_hash)
- documents(doc_id, user_id, filename, uploaded_on, expiry_date, status, risk_score, parties)
- chunks(chunk_id, doc_id, user_id, text_chunk, embedding, metadata)

## Notes
- Embedding dimension is 4 for a simple mock. Swap to real model dims later.
- All endpoints scope data by `user_id` derived from JWT.
- Upload accepts PDF/TXT/DOCX and simulates parsing.
