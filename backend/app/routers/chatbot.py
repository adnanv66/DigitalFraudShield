from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter

router = APIRouter(prefix="/chat", tags=["FraudShield AI Query Assistant"])

class ChatQueryRequest(BaseModel):
    query: str
    language: Optional[str] = "en"

CERT_IN_HELPLINE = {
    "toll_free": "1800-11-4949",
    "direct_line": "011-2290-2657",
    "fax": "1800-11-6969",
    "incident_email": "incident@cert-in.org.in",
    "info_email": "info@cert-in.org.in"
}

@router.post("")
def chatbot_query_assistant(req: ChatQueryRequest):
    query_lower = req.query.lower()
    lang = req.language or "en"

    # Automated advice generation
    if "upi" in query_lower or "pin" in query_lower:
        if lang == "ta":
            advice = "நினைவில் கொள்க: பணத்தைப் பெற UPI PIN பதிவு செய்யத் தேவையில்லை. யாராவது PIN கேட்டால் அது 100% மோசடி."
        elif lang == "hi":
            advice = "ध्यान दें: पैसे प्राप्त करने के लिए कभी UPI PIN दर्ज न करें। पैसे पाने के लिए PIN की आवश्यकता नहीं होती।"
        else:
            advice = "NEVER enter your UPI PIN to RECEIVE money. UPI PIN is only used to DEBIT money from your bank account."
    elif "kyc" in query_lower or "bank" in query_lower:
        if lang == "ta":
            advice = "வங்கி கணக்கு அல்லது KYC புதுப்பிப்புக்கு SMS மூலம் வரும் சந்தேகத்திற்குரிய இணைப்புகளைக் கிளிக் செய்ய வேண்டாம்."
        elif lang == "hi":
            advice = "बैंक या KYC अपडेट के लिए SMS में आए किसी भी अज्ञात लिंक पर क्लिक न करें। सीधे अपने बैंक शाखा से संपर्क करें।"
        else:
            advice = "Banks never ask for KYC updates via unofficial SMS links. Always visit your official bank branch or netbanking portal directly."
    else:
        if lang == "ta":
            advice = "சந்தேகத்திற்குரிய செய்திகளை ஃப்ரார்டு ஷீல்டு செயலி மூலம் சரிபார்க்கவும். அவசரத்திற்கு CERT-In உதவி எண் 1800-11-4949-ஐ அழைக்கவும்."
        elif lang == "hi":
            advice = "किसी भी संदिग्ध संदेश की जांच फ्रॉड शील्ड में करें। साइबर सहायता के लिए CERT-In हेल्पलाइन 1800-11-4949 पर कॉल करें।"
        else:
            advice = "Always check suspicious SMS in FraudShield before taking action. For cyber crime incidents, report immediately to CERT-In Helpline 1800-11-4949."

    return {
        "query": req.query,
        "language": lang,
        "response_advice": advice,
        "cert_in_helplines": CERT_IN_HELPLINE
    }
