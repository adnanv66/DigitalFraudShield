import jwt
from datetime import timedelta
from typing import Optional
from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session


from app.database import get_db
from app.models import User
from app.security import (
    verify_password, get_password_hash, create_access_token, create_refresh_token, get_current_user
)
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

class UserRegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str
    language_preference: Optional[str] = "en"

class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class PasswordResetSchema(BaseModel):
    email: EmailStr
    new_password: str

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegisterSchema, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered.")
    
    hashed_pwd = get_password_hash(user_in.password)
    new_user = User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=hashed_pwd,
        language_preference=user_in.language_preference
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(data={"sub": new_user.email})
    refresh_token = create_refresh_token(data={"sub": new_user.email})

    return {
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "language_preference": new_user.language_preference
        },
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/login")
def login(login_in: UserLoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})

    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "language_preference": user.language_preference,
            "is_admin": user.is_admin
        },
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh")
def refresh_token_endpoint(req: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Validates 7-day Refresh Token and issues a new Access Token seamlessly."""
    try:
        payload = jwt.decode(req.refresh_token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token payload.")
    except Exception:
        raise HTTPException(status_code=401, detail="Expired or invalid refresh token.")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User associated with refresh token no longer exists.")

    new_access_token = create_access_token(data={"sub": user.email})
    new_refresh_token = create_refresh_token(data={"sub": user.email})

    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }


@router.post("/reset-password")
def reset_password(reset_in: PasswordResetSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == reset_in.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User with this email not found.")

    user.hashed_password = get_password_hash(reset_in.new_password)
    db.commit()
    return {"message": "Password reset successfully. Please login with your new password."}
