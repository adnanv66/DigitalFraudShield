from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Detection, User
from app.schemas import DetectionRequest, DetectionResponse
from app.engine import FraudEngine
from app.security import get_current_user

router = APIRouter(tags=["Fraud Detection Engine"])

@router.post("/detect", response_model=DetectionResponse)
def detect_fraud(
    req: DetectionRequest,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    score, risk_level, matched_rules, explanation = FraudEngine.analyze_message(
        req.message_text, req.language or "en"
    )

    user_id = current_user.id if current_user else None

    detection = Detection(
        user_id=user_id,
        message_text=req.message_text,
        risk_score=score,
        risk_level=risk_level,
        matched_rules=matched_rules,
        explanation=explanation,
        language=req.language or "en",
        status="Analyzed"
    )
    db.add(detection)
    db.commit()
    db.refresh(detection)

    return detection

@router.get("/detections", response_model=List[DetectionResponse])
def get_detections(
    risk_level: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    query = db.query(Detection)

    if risk_level and risk_level != "All":
        query = query.filter(Detection.risk_level == risk_level)

    if status_filter and status_filter != "All":
        query = query.filter(Detection.status == status_filter)

    if search:
        query = query.filter(Detection.message_text.ilike(f"%{search}%"))

    detections = query.order_by(Detection.created_at.desc()).offset(offset).limit(limit).all()
    return detections

@router.get("/detections/{id}", response_model=DetectionResponse)
def get_detection_by_id(id: int, db: Session = Depends(get_db)):
    detection = db.query(Detection).filter(Detection.id == id).first()
    if not detection:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Detection record not found")
    return detection
