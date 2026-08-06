from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Pattern, User, AuditLog
from app.schemas import PatternCreate, PatternResponse
from app.security import require_current_user

router = APIRouter(prefix="/patterns", tags=["Detection Patterns"])

@router.get("", response_model=List[PatternResponse])
def get_patterns(db: Session = Depends(get_db)):
    patterns = db.query(Pattern).filter(Pattern.is_active == True).all()
    return patterns

@router.post("", response_model=PatternResponse, status_code=status.HTTP_201_CREATED)
def create_pattern(
    pattern_in: PatternCreate,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin permissions required to create detection patterns")

    pattern = Pattern(
        pattern_name=pattern_in.pattern_name,
        pattern_type=pattern_in.pattern_type,
        regex_or_keyword=pattern_in.regex_or_keyword,
        weight=pattern_in.weight,
        category=pattern_in.category,
        description=pattern_in.description,
        is_active=True
    )
    db.add(pattern)
    db.commit()
    db.refresh(pattern)

    audit = AuditLog(user_id=current_user.id, action="CREATE_PATTERN", details=f"Pattern '{pattern.pattern_name}' created")
    db.add(audit)
    db.commit()

    return pattern
