from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.auth.deps import require_user
from app.models.models import Document, Chunk
from app.services.mock import mock_llamacloud_parse

router = APIRouter()

ALLOWED = {"application/pdf","text/plain","application/vnd.openxmlformats-officedocument.wordprocessingml.document"}

@router.post("/upload")
async def upload(file: UploadFile = File(...), user=Depends(require_user), db: Session = Depends(get_db)):
    if file.content_type not in ALLOWED:
        raise HTTPException(status_code=400, detail="Only PDF/TXT/DOCX allowed")
    content = await file.read()
    parsed = mock_llamacloud_parse(file.filename, content)
    # Create Document
    doc = Document(user_id=user["user_id"], filename=file.filename, status="Active", risk_score="Medium")
    db.add(doc); db.commit(); db.refresh(doc)

    # Save chunks
    for ch in parsed["chunks"]:
        db.add(Chunk(
            chunk_id=ch["chunk_id"],
            doc_id=doc.doc_id,
            user_id=user["user_id"],
            text_chunk=ch["text"],
            embedding=ch["embedding"],
            meta=ch["metadata"]
        ))
    db.commit()
    return {"ok": True, "doc_id": doc.doc_id, "chunks_saved": len(parsed["chunks"])}
