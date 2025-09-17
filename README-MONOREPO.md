# Monorepo Deployment (Render + Netlify)

This repository contains both **backend/** (FastAPI) and **frontend/** (React + Vite + Tailwind).

## 1) Push to GitHub
- Keep the current structure:
  - `backend/` (FastAPI app with `main.py`, `requirements.txt`, `schema.sql`)
  - `frontend/` (Vite React app with `package.json`, `vite.config.js`)
  - `render.yaml` (Render IaC for backend)
  - `netlify.toml` (Netlify config for frontend)

## 2) Database (Supabase)
- Create a Supabase project
- Run `backend/schema.sql` in the SQL editor (pgvector enabled)

## 3) Backend on Render (monorepo setup)
**Option A: One‑click IaC** (recommended)
- In Render, choose **New > Blueprint** and point it to your repo (with `render.yaml` in root)
- After import, open the service and set Environment Variables:
  - `DATABASE_URL` = your Supabase Postgres connection string
  - `JWT_SECRET` = any strong secret
  - `CORS_ORIGINS` = `["https://<your-netlify-site>.netlify.app"]`
- Deploy. Your backend URL will be like `https://<service>.onrender.com`

**Option B: Manual web service**
- New Web Service → Connect repo
- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Add the same env vars as above

## 4) Frontend on Netlify (monorepo setup)
- Netlify → **Add new site → Import from Git** → choose this repo
- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/dist`
- Environment variable:
  - `VITE_API_URL` = `https://<your-backend>.onrender.com/api`

> You can also set `VITE_API_URL` in `netlify.toml` (temporary), but using the UI is cleaner for secret management.

## 5) Final checks
- On Render, ensure `CORS_ORIGINS` includes your exact Netlify URL.
- On Netlify, ensure `VITE_API_URL` matches your Render backend + `/api`.
- Visit Netlify site → Sign up → Upload a file → Query on **Ask** page.

## 6) Optional tweaks
- Lock CORS to only production URL (remove localhost if not needed)
- Add preview environments: set `VITE_API_URL` per-branch in Netlify
- Increase embedding dims when moving off mock embeddings (update `Vector(dim)` and the index in `schema.sql`)
