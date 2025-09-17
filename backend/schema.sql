-- Enable pgvector (on Supabase: enabled by default; otherwise run CREATE EXTENSION)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
  doc_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  uploaded_on TIMESTAMP DEFAULT NOW(),
  expiry_date TIMESTAMP NULL,
  status TEXT NULL,
  risk_score TEXT NULL,
  parties TEXT NULL
);

-- 4-d vectors for mock; swap to larger dims for real models (e.g., 1536)
CREATE TABLE IF NOT EXISTS chunks (
  chunk_id TEXT PRIMARY KEY,
  doc_id TEXT NOT NULL REFERENCES documents(doc_id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  text_chunk TEXT NOT NULL,
  embedding vector(4) NOT NULL,
  metadata JSONB
);

-- Helpful index for vector search
CREATE INDEX IF NOT EXISTS idx_chunks_user ON chunks(user_id);
CREATE INDEX IF NOT EXISTS idx_chunks_vec ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
