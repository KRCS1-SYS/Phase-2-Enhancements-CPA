from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.auth.services import decode_access_token
from app.models import Session as DBSession

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(Authorization: str = Header(...), db: Session = Depends(get_db)):
    # Extract the token
    if not Authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization header format"
        )
    token = Authorization.split(" ")[1]

    # Decode the token
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    # Verify the token against the Session table
    session = db.query(DBSession).filter(DBSession.Token == token).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session not found or token invalid"
        )

    # Return the user's identity from the payload
    return payload

def get_current_admin_user(user: dict = Depends(get_current_user)):
    if user.get("role") != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return user
