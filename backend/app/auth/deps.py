from fastapi import Header, HTTPException
from app.auth.utils import decode_jwt

def require_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    token = authorization.split(" ",1)[1]
    data = decode_jwt(token)
    if not data:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"user_id": data["sub"], "username": data["username"]}
