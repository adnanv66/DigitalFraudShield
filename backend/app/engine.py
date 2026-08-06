import re
from typing import List, Dict, Any, Tuple

# Multi-lingual explainability rule templates
RULE_EXPLANATIONS = {
    "contains_otp": {
        "en": "It asks for your secret OTP (One Time Password). Never share your OTP with anyone.",
        "ta": "இது உங்களின் ரகசிய OTP எண்ணை கேட்கிறது. OTP-ஐ யாருடனும் பகிர வேண்டாம்.",
        "hi": "यह आपका गुप्त OTP (वन टाइम पासवर्ड) मांग रहा है। अपना OTP किसी के साथ साझा न करें।"
    },
    "contains_upi_pin": {
        "en": "It asks for your UPI PIN. Remember: You NEVER enter a UPI PIN to receive money.",
        "ta": "இது உங்கள் UPI PIN-ஐ கேட்கிறது. நினைவில் கொள்க: பணத்தைப் பெற UPI PIN தேவையில்லை.",
        "hi": "यह आपका UPI PIN मांग रहा है। ध्यान दें: पैसे प्राप्त करने के लिए कभी UPI PIN दर्ज नहीं करना पड़ता।"
    },
    "urgency_words": {
        "en": "Uses high-pressure, urgent language threatening immediate account closure or electricity cut.",
        "ta": "உடனடி கணக்கு முடக்கம் அல்லது மின்சாரத் துண்டிப்பு என அவசரப்படுத்தும் மொழியைப் பயன்படுத்துகிறது.",
        "hi": "अकाउंट ब्लॉक या बिजली काटने की तुरंत धमकी देने वाली आपातकालीन भाषा का उपयोग करता है।"
    },
    "click_link": {
        "en": "Contains a suspicious unverified website link or URL.",
        "ta": "சந்தேகத்திற்குரிய அல்லது சரிபார்க்கப்படாத இணையதள இணைப்பைக் கொண்டுள்ளது.",
        "hi": "इसमें एक संदिग्ध या असत्यापित वेबसाइट लिंक शामिल है।"
    },
    "unknown_upi": {
        "en": "Directs payment to an unknown personal UPI ID or VPA handle.",
        "ta": "தெரியாத தனிநபர் UPI முகவரிக்கு பணம் செலுத்த தூண்டுகிறது.",
        "hi": "अज्ञात व्यक्तिगत UPI आईडी या VPA पर भुगतान करने के लिए प्रेरित करता है।"
    },
    "prize_claim": {
        "en": "Claims you won prize money or rewards from an unverified contest.",
        "ta": "நீங்கள் சரிபார்க்கப்படாத போட்டியில் பரிசு தொகை வென்றதாகக் கூறுகிறது.",
        "hi": "दावा करता है कि आपने किसी असत्यापित प्रतियोगिता में पुरस्कार राशि जीती है।"
    },
    "refund_claim": {
        "en": "Promises instant cashback or refund credit, which is a common payment trap.",
        "ta": "உடனடி ரீஃபண்ட் அல்லது கேஷ்பேக் வழங்குவதாக பொய்யான வாக்குறுதி அளிக்கிறது.",
        "hi": "तुरंत कैशबैक या रिफंड का वादा करता है, जो एक आम धोखाधड़ी जाल है।"
    },
    "kyc_suspension": {
        "en": "Claims your bank account or SIM card KYC has expired and threatens account block.",
        "ta": "உங்கள் வங்கி கணக்கு அல்லது சிம் கார்டு KYC முடிவடைந்ததாகக் கூறி பயமுறுத்துகிறது.",
        "hi": "दावा करता है कि आपका बैंक खाता या सिम कार्ड KYC समाप्त हो गया है।"
    },
    "lottery_winner": {
        "en": "Claims you won a lottery or lucky draw you never entered.",
        "ta": "நீங்கள் பங்கேற்காத அதிர்ஷ்டக் குலுக்கலில் லொட்டரி வென்றதாகக் கூறுகிறது.",
        "hi": "दावा करता है कि आपने एक लॉटरी जीती है जिसमें आपने भाग भी नहीं लिया था।"
    }
}

class FraudEngine:
    @staticmethod
    def analyze_message(text: str, lang: str = "en") -> Tuple[int, str, List[str], List[str]]:
        text_lower = text.lower()
        score = 0
        matched_rules: List[str] = []

        # Rule 1: Contains OTP (+25)
        if re.search(r'\b(otp|one time password|verification code|அமைப்புக் குறியீடு|ओटीपी)\b', text_lower):
            score += 25
            matched_rules.append("contains_otp")

        # Rule 2: Contains UPI PIN (+20)
        if re.search(r'\b(upi pin|pin|enter pin|google pay pin|phonepe pin|யூபிஐ பின்|यूपीआई पिन)\b', text_lower):
            score += 20
            matched_rules.append("contains_upi_pin")

        # Rule 3: Urgency words (+20)
        if re.search(r'\b(urgent|immediately|within 24 hours|tonight|blocked|suspended|disconnected|இன்றிரவு|உடனடியாக|तुरंत|आपातकालीन|ब्लॉक)\b', text_lower):
            score += 20
            matched_rules.append("urgency_words")

        # Rule 4: Click Link (+15)
        if re.search(r'https?://[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(xyz|top|info|site|net|co|in/link|bit\.ly|tinyurl)', text_lower):
            score += 15
            matched_rules.append("click_link")

        # Rule 5: Unknown UPI Handle (+20)
        if re.search(r'[a-zA-Z0-9.\-_]+@(ybl|paytm|okaxis|icici|apl|sbi|postbank|gpay)', text_lower):
            score += 20
            matched_rules.append("unknown_upi")

        # Rule 6: Prize (+15)
        if re.search(r'\b(prize|reward|gift|won|பரிசு|पुरस्कार|जीता)\b', text_lower):
            score += 15
            matched_rules.append("prize_claim")

        # Rule 7: Refund (+15)
        if re.search(r'\b(refund|cashback|credit|ரீஃபண்ட்|ரிஃபண்ட்|रिफंड|कैशबैक)\b', text_lower):
            score += 15
            matched_rules.append("refund_claim")

        # Rule 8: KYC (+20)
        if re.search(r'\b(kyc|sim block|pan card update|bank verification|கேஒய்சி|केवाईसी)\b', text_lower):
            score += 20
            matched_rules.append("kyc_suspension")

        # Rule 9: Lottery (+15)
        if re.search(r'\b(lottery|lucky draw|kbc|லொட்டரி|लॉटरी)\b', text_lower):
            score += 15
            matched_rules.append("lottery_winner")

        # Determine Risk Level
        if score <= 30:
            risk_level = "Low"
        elif score <= 60:
            risk_level = "Medium"
        else:
            risk_level = "High"

        # Generate Explainability List
        explanations = []
        target_lang = lang if lang in ["en", "ta", "hi"] else "en"

        for rule in matched_rules:
            if rule in RULE_EXPLANATIONS:
                explanations.append(RULE_EXPLANATIONS[rule][target_lang])

        if not explanations:
            if target_lang == "ta":
                explanations.append("இந்தச் செய்தியில் பெரிய அளவிலான மோசடி அறிகுறிகள் ஏதும் கண்டறியப்படவில்லை.")
            elif target_lang == "hi":
                explanations.append("इस संदेश में कोई बड़ा धोखाधड़ी जोखिम पैटर्न नहीं पाया गया।")
            else:
                explanations.append("No major high-risk fraud triggers detected in this message. Looks relatively safe.")

        return score, risk_level, matched_rules, explanations
