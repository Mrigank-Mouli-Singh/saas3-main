# Render + Python 3.13.4 compatibility

If your build fails on Render due to `psycopg2-binary` wheels, use **psycopg v3**.

**What we changed in this patch**  
- Switched `psycopg2-binary==2.9.9` → `psycopg[binary]==3.2.1` in `backend/requirements.txt`

**Make sure your `DATABASE_URL` uses the psycopg v3 driver**  
```
postgresql+psycopg://USER:PASSWORD@HOST:5432/DB_NAME
```
(Supabase often shows `postgres://...`; change it to the above.)

**Render settings**
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Env vars: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS="[*]"`