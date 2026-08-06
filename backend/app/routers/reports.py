from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Report, Detection, User, AuditLog
from app.schemas import ReportCreate, ReportResponse
from app.security import get_current_user

router = APIRouter(prefix="/reports", tags=["Scam Reports"])

@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(
    report_in: ReportCreate,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.id if current_user else None

    # If detection_id provided, update detection status to 'Reported'
    if report_in.detection_id:
        detection = db.query(Detection).filter(Detection.id == report_in.detection_id).first()
        if detection:
            detection.status = "Reported"
            db.commit()

    report = Report(
        user_id=user_id,
        detection_id=report_in.detection_id,
        message_text=report_in.message_text,
        category=report_in.category,
        reason=report_in.reason,
        notes=report_in.notes,
        status="Pending Review"
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    if user_id:
        audit = AuditLog(user_id=user_id, action="SUBMIT_REPORT", details=f"Report #{report.id} created")
        db.add(audit)
        db.commit()

    return report

@router.get("", response_model=List[ReportResponse])
def get_reports(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    reports = db.query(Report).order_by(Report.created_at.desc()).offset(offset).limit(limit).all()
    return reports
