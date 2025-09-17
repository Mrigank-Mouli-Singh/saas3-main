import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, contracts, rag, upload
from app.db.database import Base, engine

app = FastAPI(title="Contracts RAG API", version="0.1.0")

origins = os.getenv("CORS_ORIGINS","[\"*\"]")
try:
    import json
    origins = json.loads(origins)
except Exception:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables (for demo/dev)
Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/api")
app.include_router(upload.router, prefix="/api")
app.include_router(contracts.router, prefix="/api")
app.include_router(rag.router, prefix="/api")

@app.get("/")
def health():
    return {"ok": True, "service": "contracts-rag", "version": "0.1.0"}
