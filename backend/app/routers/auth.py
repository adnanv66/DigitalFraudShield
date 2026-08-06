from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, AuditLog
from app.schemas import UserRegister, UserLogin, UserResetPassword, TokenResponse, UserResponse
from app.security import verify_password, get_password_hash, create_access_token, require_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    hashed_pwd = get_password_hash(user_in.password)
    new_user = User(
        name=user_in.name,
        email=user_in.email.lower(),
        hashed_password=hashed_pwd,
        language_preference=user_in.language_preference or "en"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Log audit
    audit = AuditLog(user_id=new_user.id, action="REGISTER", details="New account created")
    db.add(audit)
    db.commit()

    token = create_access_token(data={"sub": str(new_user.id)})
    return {"access_token": token, "token_type": "bearer", "user": new_user}

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email.lower()).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account disabled")

    # Log audit
    audit = AuditLog(user_id=user.id, action="LOGIN", details="Successful login")
    db.add(audit)
    db.commit()

    token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.post("/logout")
def logout(current_user: User = Depends(require_current_user), db: Session = Depends(get_db)):
    audit = AuditLog(user_id=current_user.id, action="LOGOUT", details="User logged out")
    db.add(audit)
    db.commit()
    return {"message": "Logged out successfully"}

@router.post("/reset-password")
def reset_password(data: UserResetPassword, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.lower()).first()
    if not user:
        # Avoid user enumeration, but return clean message
        return {"message": "If account exists, password has been reset"}
    
    user.hashed_password = get_password_hash(data.new_password)
    db.commit()

    audit = AuditLog(user_id=user.id, action="RESET_PASSWORD", details="Password reset completed")
    db.add(audit)
    db.commit()
    return {"message": "Password reset successfully"}
