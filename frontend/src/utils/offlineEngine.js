/**
 * Offline Fraud Detection Engine & Report Sync Queue
 * Enables 100% offline fraud checking without internet connection.
 */

export const analyzeMessageOffline = (text, lang = 'en') => {
  const textLower = text.toLowerCase();
  let score = 0;
  const matchedRules = [];
  const explanation = [];

  // Rule 1: OTP (+25)
  if (/otp|one time password|verification code|அமைப்புக் குறியீடு|ओटीपी/.test(textLower)) {
    score += 25;
    matchedRules.push("contains_otp");
    explanation.push(
      lang === 'ta' ? "இது உங்களின் ரகசிய OTP எண்ணை கேட்கிறது. யாருடனும் பகிர வேண்டாம்." :
      lang === 'hi' ? "यह आपका गुप्त OTP मांग रहा है। इसे किसी के साथ साझा न करें।" :
      "It asks for your secret OTP code. Never share this with anyone."
    );
  }

  // Rule 2: UPI PIN (+20)
  if (/upi pin|pin|google pay pin|phonepe pin|யூபிஐ பின்|यूपीआई पिन/.test(textLower)) {
    score += 20;
    matchedRules.push("contains_upi_pin");
    explanation.push(
      lang === 'ta' ? "இது உங்கள் UPI PIN-ஐ கேட்கிறது. பணத்தைப் பெற PIN தேவையில்லை." :
      lang === 'hi' ? "यह आपका UPI PIN मांग रहा है। पैसे लेने के लिए PIN दर्ज न करें।" :
      "It asks for your UPI PIN. Remember: You NEVER enter a PIN to receive money."
    );
  }

  // Rule 3: Urgency (+20)
  if (/urgent|immediately|tonight|blocked|suspended|Disconnected|இன்றிரவு|உடனடியாக|तुरंत|ब्लॉक/.test(textLower)) {
    score += 20;
    matchedRules.push("urgency_words");
    explanation.push(
      lang === 'ta' ? "உடனடி கணக்கு முடக்கம் அல்லது மின்சாரத் துண்டிப்பு என பயமுறுத்துகிறது." :
      lang === 'hi' ? "तुरंत अकाउंट ब्लॉक या बिजली काटने की धमकी देता है।" :
      "Uses high-pressure urgent language threatening immediate account block or disconnection."
    );
  }

  // Rule 4: Suspicious Link (+15)
  if (/https?:\/\/[^\s]+|www\.[^\s]+/.test(textLower)) {
    score += 15;
    matchedRules.push("click_link");
    explanation.push(
      lang === 'ta' ? "சந்தேகத்திற்குரிய இணைப்பைக் கொண்டுள்ளது." :
      lang === 'hi' ? "इसमें एक संदिग्ध लिंक शामिल है।" :
      "Contains a suspicious unverified website link."
    );
  }

  // Rule 5: Unknown VPA (+20)
  if (/[a-zA-Z0-9.\-_]+@(ybl|paytm|okaxis|icici|apl|sbi|postbank)/.test(textLower)) {
    score += 20;
    matchedRules.push("unknown_upi");
    explanation.push(
      lang === 'ta' ? "தெரியாத தனிநபர் UPI முகவரிக்கு பணம் செலுத்த தூண்டுகிறது." :
      lang === 'hi' ? "अज्ञात व्यक्तिगत UPI आईडी पर भुगतान करने के लिए प्रेरित करता है।" :
      "Directs payment to an unverified personal UPI handle."
    );
  }

  let riskLevel = "Low";
  if (score > 60) riskLevel = "High";
  else if (score > 30) riskLevel = "Medium";

  if (explanation.length === 0) {
    explanation.push(
      lang === 'ta' ? "இந்தச் செய்தியில் ஆபத்தான மோசடி அறிகுறிகள் ஏதும் இல்லை." :
      lang === 'hi' ? "इस संदेश में कोई बड़ा धोखाधड़ी जोखिम नहीं पाया गया।" :
      "No major high-risk fraud triggers detected in this message."
    );
  }

  return {
    id: Date.now(),
    message_text: text,
    risk_score: score,
    risk_level: riskLevel,
    matched_rules: matchedRules,
    explanation: explanation,
    language: lang,
    status: "Offline-Analyzed",
    created_at: new Date().toISOString()
  };
};

export const saveOfflineReport = (reportData) => {
  const existing = JSON.parse(localStorage.getItem('offline_reports') || '[]');
  existing.push({ ...reportData, queuedAt: new Date().toISOString() });
  localStorage.setItem('offline_reports', JSON.stringify(existing));
};

export const getPendingOfflineReports = () => {
  return JSON.parse(localStorage.getItem('offline_reports') || '[]');
};

export const clearOfflineReports = () => {
  localStorage.removeItem('offline_reports');
};
