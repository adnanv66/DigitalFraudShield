from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, AuditLog
from app.schemas import UserResponse, UserProfileUpdate
from app.security import require_current_user

router = APIRouter(prefix="/user", tags=["User Profile"])

@router.get("/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(require_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_profile(
    profile_in: UserProfileUpdate,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    if profile_in.name is not None:
        current_user.name = profile_in.name
    if profile_in.language_preference is not None:
        current_user.language_preference = profile_in.language_preference
    
    db.commit()
    db.refresh(current_user)

    audit = AuditLog(user_id=current_user.id, action="UPDATE_PROFILE", details="Profile details updated")
    db.add(audit)
    db.commit()

    return current_user
