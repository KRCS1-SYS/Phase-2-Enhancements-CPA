from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from app.auth.schemas import LoginRequest, LoginResponse, LogoutResponse
from app.auth.services import create_access_token, verify_password, save_session, revoke_session
from app.auth.dependencies import get_current_user
from app.database import SessionLocal
from app.models import User
from jose import JWTError, jwt
from app.config import settings

auth_router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@auth_router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    token = create_access_token({"id": user.user_id, "role": user.role})
    expiration_time = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    save_session(db, user.user_id, token, expiration_time)
    return {"status": "success", "message": "Login successful", "token": token}

@auth_router.post("/logout", response_model=LogoutResponse)
def logout(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        revoke_session(db, user['id'])
    except:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token or session not found")
    return {"status": "success", "message": "Logout successful"}
