from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Detection, User
from app.engine import FraudEngine
from app.security import get_current_user

router = APIRouter(prefix="/scan-upi", tags=["Automatic SMS & UPI Scanner"])

class DeviceSMSItem(BaseModel):
    sender: str
    message_text: str
    timestamp: str

class BatchScanRequest(BaseModel):
    messages: List[DeviceSMSItem]
    language: Optional[str] = "en"

class KeypadUSSDRequest(BaseModel):
    phone_number: str
    ussd_code_or_sms: str
    language: Optional[str] = "en"

@router.post("/auto-read")
def batch_scan_inbox(
    req: BatchScanRequest,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = []
    user_id = current_user.id if current_user else None

    for item in req.messages:
        score, risk_level, matched_rules, explanation = FraudEngine.analyze_message(
            item.message_text, req.language or "en"
        )
        
        detection = Detection(
            user_id=user_id,
            message_text=f"[{item.sender}] {item.message_text}",
            risk_score=score,
            risk_level=risk_level,
            matched_rules=matched_rules,
            explanation=explanation,
            language=req.language or "en",
            status="Auto-Scanned"
        )
        db.add(detection)
        db.commit()
        db.refresh(detection)

        results.append({
            "id": detection.id,
            "sender": item.sender,
            "message_text": item.message_text,
            "risk_score": score,
            "risk_level": risk_level,
            "matched_rules": matched_rules,
            "explanation": explanation
        })

    return {
        "scanned_count": len(results),
        "high_risk_count": sum(1 for r in results if r["risk_level"] == "High"),
        "results": results
    }

@router.post("/keypad-ussd")
def keypad_ussd_gateway(req: KeypadUSSDRequest):
    """Simulates 2G/3G Keypad Phone USSD & SMS Gateway response for basic feature phones."""
    lang = req.language or "en"
    text = req.ussd_code_or_sms.strip()

    # Check if USSD code dial
    if text.startswith("*") and text.endswith("#"):
        if lang == "ta":
            reply = "ஃப்ரார்டு ஷீல்டு USSD: 1.SMS சரிபார்க்க 2.சமீபத்திய மோசடிகள் 3.புகாரளிக்க. எண் அனுப்பவும்."
        elif lang == "hi":
            reply = "फ्रॉड शील्ड USSD: 1.SMS जांचें 2.हाल के स्कैम 3.रिपोर्ट करें। नंबर भेजें।"
        else:
            reply = "Fraud Shield USSD: 1.Check SMS 2.Recent Scams 3.Report Fraud. Reply with option number."
        return {
            "mode": "USSD_MENU",
            "code": text,
            "display_text": reply
        }

    # Otherwise process SMS text
    score, risk_level, matched_rules, explanation = FraudEngine.analyze_message(text, lang)

    # Format 160-char SMS response for keypad phone screens
    if lang == "ta":
        if risk_level == "High":
            sms_reply = f"[எச்சரிக்கை! மோசடி] ஆபத்து: {risk_level} ({score}/100). UPI PIN/OTP பகிர வேண்டாம்! காரணம்: {explanation[0]}"
        else:
            sms_reply = f"[ஃப்ரார்டு ஷீல்டு] ஆபத்து: {risk_level} ({score}/100). பாதுகாப்பான செய்தி."
    elif lang == "hi":
        if risk_level == "High":
            sms_reply = f"[चेतावनी! फ्रॉड] जोखिम: {risk_level} ({score}/100)। UPI PIN/OTP साझा न करें! कारण: {explanation[0]}"
        else:
            sms_reply = f"[फ्रॉड शील्ड] जोखिम: {risk_level} ({score}/100)। संदेश सुरक्षित प्रतीत होता है।"
    else:
        if risk_level == "High":
            sms_reply = f"[WARNING! SCAM] Risk: {risk_level} ({score}/100). NEVER enter UPI PIN! Reason: {explanation[0]}"
        else:
            sms_reply = f"[Fraud Shield] Risk: {risk_level} ({score}/100). Message looks relatively safe."

    return {
        "mode": "SMS_GATEWAY",
        "phone_number": req.phone_number,
        "risk_level": risk_level,
        "score": score,
        "sms_reply": sms_reply[:160] # Fit keypad phone SMS screen limit
    }
