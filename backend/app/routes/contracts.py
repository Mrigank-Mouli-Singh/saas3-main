from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.db.database import get_db
from app.auth.deps import require_user
from app.models.models import Document, Chunk
from sqlalchemy import or_

router = APIRouter()

@router.get("/contracts")
def list_contracts(q: Optional[str] = None, status: Optional[str] = None, risk: Optional[str] = None, page: int = 1, page_size: int = 10, user=Depends(require_user), db: Session = Depends(get_db)):
    query = db.query(Document).filter(Document.user_id == user["user_id"])
    if q:
        pattern = f"%{q}%"
        query = query.filter(or_(Document.filename.ilike(pattern), Document.parties.ilike(pattern)))
    if status:
        query = query.filter(Document.status == status)
    if risk:
        query = query.filter(Document.risk_score == risk)
    total = query.count()
    docs = query.order_by(Document.uploaded_on.desc()).offset((page-1)*page_size).limit(page_size).all()
    results = [
        {
            "doc_id": d.doc_id,
            "filename": d.filename,
            "uploaded_on": d.uploaded_on.isoformat() if d.uploaded_on else None,
            "expiry_date": d.expiry_date.isoformat() if d.expiry_date else None,
            "status": d.status,
            "risk_score": d.risk_score,
            "parties": d.parties or "—",
        } for d in docs
    ]
    return {"items": results, "total": total, "page": page, "page_size": page_size}

@router.get("/contracts/{doc_id}")
def get_contract(doc_id: str, user=Depends(require_user), db: Session = Depends(get_db)):
    d = db.query(Document).filter(Document.doc_id==doc_id, Document.user_id==user["user_id"]).first()
    if not d: raise HTTPException(status_code=404, detail="Not found")
    chunks = db.query(Chunk).filter(Chunk.doc_id==doc_id, Chunk.user_id==user["user_id"]).limit(20).all()
    clauses = []
    # Very simple heuristic for demo
    for c in chunks:
        if ":" in c.text_chunk:
            title = c.text_chunk.split(":",1)[0]
            short = c.text_chunk[:120]
            clauses.append({"title": title, "text": short, "confidence": 92})
    insights = [
        {"risk": "Renewal notice periods may be tight.", "recommendation": "Set reminders 120 days prior to expiry."},
        {"risk": "Liability cap may be low for enterprise deals.", "recommendation": "Negotiate higher cap for critical workloads."},
    ]
    return {
        "contract": {
            "doc_id": d.doc_id,
            "filename": d.filename,
            "uploaded_on": d.uploaded_on.isoformat() if d.uploaded_on else None,
            "expiry_date": d.expiry_date.isoformat() if d.expiry_date else None,
            "status": d.status,
            "risk_score": d.risk_score,
            "parties": d.parties or "—",
        },
        "clauses": clauses,
        "insights": insights,
        "snippets": [
            {"text": c.text_chunk, "page": (c.meta or {}).get("page"), "relevance": 0.85}
        ]
    }
