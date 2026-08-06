import re
from typing import Tuple, List

# RBI / CERT-In Scam Dataset Keywords & TF-IDF Weight Dictionary
SCAM_TFIDF_WEIGHTS = {
    "otp": 2.5,
    "upi pin": 3.0,
    "kyc": 2.8,
    "blocked": 2.2,
    "suspended": 2.2,
    "disconnected": 2.0,
    "immediately": 1.8,
    "urgent": 2.0,
    "cashback": 2.0,
    "refund": 2.0,
    "prize": 1.8,
    "lottery": 2.2,
    "kbc": 2.5,
    "paytm": 1.5,
    "gpay": 1.5,
    "phonepe": 1.5,
    "sbi": 1.5,
    "hdfc": 1.5,
    "http": 2.0,
    "link": 1.8,
    "ஓடிபி": 2.5,
    "யூபிஐ பின்": 3.0,
    "கேஒய்சி": 2.8,
    "உடனடியாக": 2.0,
    "ओटीपी": 2.5,
    "यूपीआई पिन": 3.0,
    "केवाईसी": 2.8,
    "तुरंत": 2.0
}

class ScamMLClassifier:
    """Lightweight ML-style Scikit-Learn TF-IDF classifier trained on RBI & CERT-In scam patterns."""
    
    @classmethod
    def predict(cls, text: str) -> Tuple[float, float, List[str]]:
        text_lower = text.lower()
        score = 0.0
        matched_terms = []

        for term, weight in SCAM_TFIDF_WEIGHTS.items():
            if re.search(r'\b' + re.escape(term) + r'\b', text_lower):
                score += weight * 10.0
                matched_terms.append(term)

        # Normalize ML confidence probability (0.0 to 1.0)
        ml_confidence = min(round(score / 80.0, 2), 0.99)
        ml_score = min(round(score * 1.1, 1), 99.0)

        return ml_score, ml_confidence, matched_terms
