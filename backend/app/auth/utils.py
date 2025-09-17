import os, time, bcrypt, jwt
from typing import Optional

JWT_SECRET = os.getenv("JWT_SECRET","devsecret")
JWT_ALG = os.getenv("JWT_ALG","HS256")

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode(), hashed.encode())
    except Exception:
        return False

def make_jwt(user_id: str, username: str, expires_in: int = 60*60*24) -> str:
    payload = {"sub": user_id, "username": username, "exp": int(time.time()) + expires_in}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

def decode_jwt(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except Exception:
        return None
