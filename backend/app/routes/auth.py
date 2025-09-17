from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import User
from app.auth.utils import hash_password, verify_password, make_jwt

router = APIRouter()

class SignUpIn(BaseModel):
    username: str
    password: str

@router.post("/signup")
def signup(payload: SignUpIn, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == payload.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    u = User(username=payload.username, password_hash=hash_password(payload.password))
    db.add(u); db.commit(); db.refresh(u)
    token = make_jwt(u.user_id, u.username)
    return {"token": token, "user": {"user_id": u.user_id, "username": u.username}}

@router.post("/login")
def login(payload: SignUpIn, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.username == payload.username).first()
    if not u or not verify_password(payload.password, u.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = make_jwt(u.user_id, u.username)
    return {"token": token, "user": {"user_id": u.user_id, "username": u.username}}
