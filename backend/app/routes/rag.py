from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from app.db.database import get_db
from app.auth.deps import require_user
from app.models.models import Chunk
from app.services.mock import mock_embed

router = APIRouter()

class AskPayload(BaseModel):
    question: str

@router.post("/ask")
def ask(payload: AskPayload, user=Depends(require_user), db: Session = Depends(get_db)):
    qvec = mock_embed(payload.question)  # 4-d mock
    # pgvector cosine distance (smaller is closer). Using raw SQL for brevity.
    sql = text("""
        SELECT chunk_id, doc_id, user_id, text_chunk, metadata,
               1 - (embedding <#> :qvec) AS relevance
        FROM chunks
        WHERE user_id = :uid
        ORDER BY embedding <#> :qvec ASC
        LIMIT 5
    """)
    rows = db.execute(sql, {"qvec": qvec, "uid": user["user_id"]}).mappings().all()
    chunks = [dict(r) for r in rows]
    answer = "Based on your documents, here are the most relevant passages. (Mock answer for demo purposes.)"
    return {"answer": answer, "results": chunks}
