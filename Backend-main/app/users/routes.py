from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User
from app.users.schemas import UserResponse, AddUserRequest, AddUserResponse, CurrentUserResponse, ChangePasswordRequest
from app.auth.services import get_password_hash, verify_password
from app.auth.dependencies import get_current_user, get_current_admin_user
from app.utils.logger import log_action

router = APIRouter()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/list", response_model=list[UserResponse])
def get_Users_list(user: dict = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [{"UserId": user.user_id, "Name": user.fullname, "Email": user.email, "Role": user.role} for user in users]

@router.get("/me", response_model=CurrentUserResponse)
def get_user_details(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    # Fetch the user from the database
    user = db.query(User).filter(User.user_id == user['id']).first()
    return {
        "Name": user.fullname,
        "Email": user.email,
        "Role": user.role,
    }

@router.post("/", response_model=AddUserResponse)
def add_user(request: AddUserRequest, db: Session = Depends(get_db), user: dict = Depends(get_current_admin_user)):
    # Check if the email already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        log_action(db, action="Add user", action_data="Email already exists", username=user['id'], log_type="ERROR")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )

    # Add new user
    new_user = User(
        fullname=request.name,
        email=request.email,
        password_hash=get_password_hash(request.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    log_action(db, action="Add User", action_data=f"User with ID {new_user.user_id} has been added", username=user['id'])
    return {
        "status": "success",
        "message": "User added successfully",
        "UserId": new_user.user_id
    }

@router.put("/change-password")
def change_password(
    request: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Fetch the current user from the database
    user = db.query(User).filter(User.user_id == current_user['id']).first()

    if not user:
        log_action(db, action="Change Password", action_data="User not found", username=current_user['id'], log_type="WARNING")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Validate the old password
    if not verify_password(request.old_password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Old password is incorrect"
        )

    # Hash the new password
    new_password_hash = get_password_hash(request.new_password)

    # Update the user's password
    user.password_hash = new_password_hash
    db.commit()

    return {"status": "success", "message": "Password changed successfully"}

@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_admin_user)
):
    # Fetch the user to be deleted
    user = db.query(User).filter(User.user_id == user_id).first()

    if not user:
        log_action(db, action="Delete User", action_data="User not found", username=current_user['id'], log_type="WARNING")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Delete the user
    db.delete(user)
    db.commit()

    log_action(db, action="Delete User", action_data=f"User with ID {user_id} has been deleted", username=current_user['id'])
    return {"status": "success", "message": f"User with ID {user_id} has been deleted"}
