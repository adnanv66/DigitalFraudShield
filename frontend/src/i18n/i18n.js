import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        brand: "Digital Fraud Shield",
        dashboard: "Dashboard",
        detect: "Check SMS Fraud",
        profile: "My Profile",
        login: "Sign In",
        logout: "Sign Out",
        tagline: "Protecting Elderly & Citizens from Digital Scams"
      },
      dashboard: {
        title: "Fraud Shield Analytics",
        subtitle: "Real-time AI monitoring and scam detection statistics across India",
        totalDetections: "Total Detections",
        highRisk: "High Risk Detections",
        mediumRisk: "Medium Risk Detections",
        lowRisk: "Low Risk Detections",
        reportedScams: "Reported Scams",
        accuracy: "Engine Accuracy",
        riskDistribution: "Risk Category Breakdown",
        dailyTrend: "Daily Fraud Detections (Last 7 Days)",
        recentDetections: "Recent Detection Log",
        searchPlaceholder: "Search message preview...",
        filterRisk: "Risk Filter",
        filterStatus: "Status Filter",
        all: "All",
        tableCols: {
          date: "Date & Time",
          preview: "Message Preview",
          risk: "Risk Score",
          language: "Language",
          status: "Status",
          action: "Action"
        }
      },
      detect: {
        title: "SMS & UPI Fraud Analyzer",
        subtitle: "Paste any suspicious SMS, WhatsApp message, or payment request to check if it's a scam.",
        upiAccessTitle: "Get Access to UPI Messages (Automatic Reader)",
        upiAccessSubtitle: "Grant permission to automatically read all incoming UPI payment requests, bank alerts, and GPay/PhonePe SMS in real time.",
        upiAccessBtn: "Get Access to UPI Messages",
        upiAccessGranted: "UPI Message Access Granted (Auto-Reading Active)",
        upiAccessDenied: "UPI Access Required",
        simulateUpiBtn: "Simulate Incoming UPI Scam SMS",
        pastePlaceholder: "Paste suspicious SMS, WhatsApp message or UPI notification here...",
        quickSamplesTitle: "Try Sample Fraud Examples:",
        sampleSbi: "SBI KYC Block Scam",
        sampleElec: "Electricity Cut Scam",
        sampleUpi: "Paytm Cash Cashback Trap",
        sampleLegit: "Legitimate Bank Alert",
        analyzeBtn: "Analyze Message Now",
        clearBtn: "Clear Text",
        reportScamBtn: "Report This Scam",
        explainabilityHeader: "Explainability Analysis Panel",
        highRiskAlert: "HIGH RISK SCAM DETECTED",
        mediumRiskAlert: "MEDIUM RISK WARNING",
        lowRiskAlert: "LOW RISK / RELATIVELY SAFE",
        whyHigh: "This message is High Risk because:",
        whyMedium: "This message is Medium Risk because:",
        whyLow: "This message is Low Risk because:",
        listenVoiceBtn: "🔊 Listen Voice Alert",
        autoBlockedLink: "AUTO-BLOCKED UNSAFE LINK: Hyperlinks in this message have been disabled until verified safe by NPCI/Bank.",
        gpayInterceptorBtn: "GPay / PhonePe Interceptor",
        certInHelplineBtn: "📞 1-Tap Call Helpline 1930"
      },


      reportModal: {
        title: "Report Fraudulent SMS / UPI Scam",
        subtitle: "Help protect elderly users by submitting this scam to our public database.",
        categoryLabel: "Scam Category",
        reasonLabel: "Primary Reason for Reporting",
        notesLabel: "Additional Notes or Caller Phone Details",
        submitBtn: "Submit Report for Admin Verification",
        cancelBtn: "Cancel",
        successMsg: "Thank you! Your scam report has been submitted for admin approval."
      },
      profile: {
        title: "User Profile & Accessibility Settings",
        nameLabel: "Full Name",
        emailLabel: "Email Address",
        languageLabel: "Preferred Language",
        accessibilitySection: "Accessibility Options",
        highContrastLabel: "High Contrast Mode (Enhanced Readability)",
        darkModeLabel: "Dark Theme",
        fontSizeLabel: "Font Size Scaler",
        saveBtn: "Save Preferences",
        logoutBtn: "Log Out"
      },
      auth: {
        loginTitle: "Sign In to Digital Fraud Shield",
        registerTitle: "Create Free Account",
        resetTitle: "Reset Forgotten Password",
        email: "Email Address",
        password: "Password",
        name: "Full Name",
        confirmPassword: "Confirm Password",
        loginBtn: "Sign In",
        registerBtn: "Create Account",
        forgotBtn: "Send Password Reset Link",
        noAccount: "Don't have an account?",
        haveAccount: "Already have an account?",
        forgotLink: "Forgot Password?"
      }
    }
  },
  ta: {
    translation: {
      nav: {
        brand: "டிஜிட்டல் ஃப்ரார்டு ஷீல்டு",
        dashboard: "முகப்பு பலகை",
        detect: "SMS மோசடி சரிபார்க்க",
        profile: "என் கணக்கு",
        login: "உள்நுழைக",
        logout: "வெளியேறு",
        tagline: "முதியோர் & குடிமக்களை டிஜிட்டல் மோசடிகளிலிருந்து பாதுகாத்தல்"
      },
      dashboard: {
        title: "மோசடி தடுப்பு பகுப்பாய்வு",
        subtitle: "நிகழ்நேர AI கண்காணிப்பு மற்றும் இந்தியா முழுவதுமான மோசடி புள்ளிவிவரங்கள்",
        totalDetections: "மொத்த சோதனைகள்",
        highRisk: "அதிக ஆபத்து",
        mediumRisk: "மிதமான ஆபத்து",
        lowRisk: "குறைந்த ஆபத்து",
        reportedScams: "புகாரளிக்கப்பட்ட மோசடிகள்",
        accuracy: "துல்லியம்",
        riskDistribution: "ஆபத்து வகைகளின் விநியோகம்",
        dailyTrend: "தினசரி மோசடி கண்டறிதல்கள்",
        recentDetections: "சமீபத்திய சோதனைகள்",
        searchPlaceholder: "செய்தியைத் தேடுக...",
        filterRisk: "ஆபத்து வடிகட்டி",
        filterStatus: "நிலை வடிகட்டி",
        all: "அனைத்தும்",
        tableCols: {
          date: "தேதி & நேரம்",
          preview: "செய்தி முன்னோட்டம்",
          risk: "ஆபத்து மதிப்பெண்",
          language: "மொழி",
          status: "நிலை",
          action: "செயல்"
        }
      },
      detect: {
        title: "SMS & UPI மோசடி பகுப்பாய்வி",
        subtitle: "சந்தேகத்திற்குரிய SMS அல்லது UPI செய்தியை ஒட்டி அது மோசடியா என்று சரிபார்க்கவும்.",
        pastePlaceholder: "சந்தேகத்திற்குரிய செய்தியை இங்கே ஒட்டவும்...",
        quickSamplesTitle: "மாதிரி உதாரணங்களை சோதிக்க:",
        sampleSbi: "வங்கி KYC முடக்க மோசடி",
        sampleElec: "மின்சார இணைப்பு துண்டிப்பு மோசடி",
        sampleUpi: "கேஷ்பேக் ஆசை வலை",
        sampleLegit: "உண்மையான வங்கி செய்தி",
        analyzeBtn: "செய்தியை பகுப்பாய்வு செய்",
        clearBtn: "அழி",
        reportScamBtn: "மோசடியை புகாரளி",
        explainabilityHeader: "விளக்கக் குழு",
        highRiskAlert: "அதிக ஆபத்துள்ள மோசடி கண்டறியப்பட்டது",
        mediumRiskAlert: "மிதமான ஆபத்து எச்சரிக்கை",
        lowRiskAlert: "பாதுகாப்பான செய்தி",
        whyHigh: "இந்த செய்தி அதிக ஆபத்து கொண்டது ஏனெனில்:",
        whyMedium: "இந்த செய்தி மிதமான ஆபத்து கொண்டது ஏனெனில்:",
        whyLow: "இந்த செய்தி குறைந்த ஆபத்து கொண்டது ஏனெனில்:",
        listenVoiceBtn: "🔊 குரல் எச்சரிக்கையைக் கேள் (தமிழ்)",
        autoBlockedLink: "தானியங்கு தடுக்கப்பட்ட பாதுகாப்பற்ற இணைப்பு: இந்தச் செய்தியில் உள்ள இணையதள இணைப்புகள் தடுக்கப்பட்டுள்ளன.",
        gpayInterceptorBtn: "GPay / PhonePe இடைமறிப்பான்",
        certInHelplineBtn: "📞 1-தட்டு உதவி எண் 1930"
      },

      reportModal: {
        title: "மோசடி செய்தியை புகாரளிக்கவும்",
        subtitle: "மற்ற குடிமக்களைப் பாதுகாக்க இந்த மோசடியைப் புகாரளிக்கவும்.",
        categoryLabel: "மோசடி வகை",
        reasonLabel: "புகாரளிப்பதற்கான முக்கிய காரணம்",
        notesLabel: "கூடுதல் குறிப்புகள்",
        submitBtn: "புகாரை சமர்ப்பி",
        cancelBtn: "ரத்து செய்",
        successMsg: "நன்றி! உங்கள் புகார் சமர்ப்பிக்கப்பட்டது."
      },
      profile: {
        title: "பயனர் கணக்கு & அணுகல் அமைப்புகள்",
        nameLabel: "முழு பெயர்",
        emailLabel: "மின்னஞ்சல் முகவரி",
        languageLabel: "விரும்பிய மொழி",
        accessibilitySection: "அணுகல்தன்மை விருப்பங்கள்",
        highContrastLabel: "அதிக மாறுபட்ட பயன்முறை (High Contrast)",
        darkModeLabel: "இருண்ட தீம்",
        fontSizeLabel: "எழுத்து அளவு",
        saveBtn: "அமைப்புகளை சேமி",
        logoutBtn: "வெளியேறு"
      },
      auth: {
        loginTitle: "உள்நுழைக",
        registerTitle: "புதிய கணக்கு தொடங்க",
        resetTitle: "கடவுச்சொல்லை மீட்டமைக்க",
        email: "மின்னஞ்சல் முகவரி",
        password: "கடவுச்சொல்",
        name: "முழு பெயர்",
        confirmPassword: "கடவுச்சொல்லை உறுதிசெய்",
        loginBtn: "உள்நுழைக",
        registerBtn: "கணக்கு உருவாக்கு",
        forgotBtn: "இணைப்பு அனுப்பு",
        noAccount: "கணக்கு இல்லையா?",
        haveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
        forgotLink: "கடவுச்சொல் மறந்துவிட்டதா?"
      }
    }
  },
  hi: {
    translation: {
      nav: {
        brand: "डिजिटल फ्रॉड शील्ड",
        dashboard: "डैशबोर्ड",
        detect: "SMS फ्रॉड जांचें",
        profile: "मेरी प्रोफाइल",
        login: "साइन इन करें",
        logout: "साइन आउट",
        tagline: "बुजुर्गों और नागरिकों को डिजिटल धोखाधड़ी से बचाना"
      },
      dashboard: {
        title: "फ्रॉड शील्ड एनालिटिक्स",
        subtitle: "रियल-टाइम AI निगरानी और धोखाधड़ी जांच के आंकड़े",
        totalDetections: "कुल जांच",
        highRisk: "उच्च जोखिम",
        mediumRisk: "मध्यम जोखिम",
        lowRisk: "कम जोखिम",
        reportedScams: "रिपोर्ट किए गए स्कैम",
        accuracy: "इंजन सटीकता",
        riskDistribution: "जोखिम वितरण",
        dailyTrend: "दैनिक फ्रॉड जांच (पिछले 7 दिन)",
        recentDetections: "हाल की जांच लॉग",
        searchPlaceholder: "संदेश खोजें...",
        filterRisk: "जोखिम फ़िल्टर",
        filterStatus: "स्थिति फ़िल्टर",
        all: "सभी",
        tableCols: {
          date: "दिनांक और समय",
          preview: "संदेश पूर्वावलोकन",
          risk: "जोखिम स्कोर",
          language: "भाषा",
          status: "स्थिति",
          action: "कार्रवाई"
        }
      },
      detect: {
        title: "SMS और UPI फ्रॉड विश्लेषक",
        subtitle: "किसी भी संदिग्ध SMS या UPI संदेश को पेस्ट करें और जांचें कि यह स्कैम है या नहीं।",
        pastePlaceholder: "संदिग्ध संदेश यहाँ पेस्ट करें...",
        quickSamplesTitle: "नमूना स्कैम जांचें:",
        sampleSbi: "SBI KYC ब्लॉक स्कैम",
        sampleElec: "बिजली कट स्कैम",
        sampleUpi: "कैशबैक जाल",
        sampleLegit: "सच्चा बैंक अलर्ट",
        analyzeBtn: "संदेश का विश्लेषण करें",
        clearBtn: "साफ़ करें",
        reportScamBtn: "स्कैम रिपोर्ट करें",
        explainabilityHeader: "स्पष्टीकरण विश्लेषण पैनल",
        highRiskAlert: "उच्च जोखिम वाला स्कैम पाया गया",
        mediumRiskAlert: "मध्यम जोखिम चेतावनी",
        lowRiskAlert: "सुरक्षित संदेश",
        whyHigh: "यह संदेश उच्च जोखिम वाला है क्योंकि:",
        whyMedium: "यह संदेश मध्यम जोखिम वाला है क्योंकि:",
        whyLow: "यह संदेश कम जोखिम वाला है क्योंकि:"
      },
      reportModal: {
        title: "धोखाधड़ी संदेश की रिपोर्ट करें",
        subtitle: "अन्य नागरिकों की सुरक्षा के लिए इस स्कैम की रिपोर्ट करें।",
        categoryLabel: "स्कैम श्रेणी",
        reasonLabel: "रिपोर्ट करने का मुख्य कारण",
        notesLabel: "अतिरिक्त विवरण",
        submitBtn: "रिपोर्ट जमा करें",
        cancelBtn: "रद्द करें",
        successMsg: "धन्यवाद! आपकी रिपोर्ट जमा कर दी गई है।"
      },
      profile: {
        title: "उपयोगकर्ता प्रोफ़ाइल और पहुंच सेटिंग्स",
        nameLabel: "पूरा नाम",
        emailLabel: "ईमेल पता",
        languageLabel: "पसंदीदा भाषा",
        accessibilitySection: "पहुंच विकल्प (Accessibility)",
        highContrastLabel: "हाई कंट्रास्ट मोड (High Contrast)",
        darkModeLabel: "डार्क थीम",
        fontSizeLabel: "फ़ॉन्ट आकार",
        saveBtn: "सहेजें",
        logoutBtn: "लॉग आउट"
      },
      auth: {
        loginTitle: "साइन इन करें",
        registerTitle: "नया खाता बनाएं",
        resetTitle: "पासवर्ड रीसेट करें",
        email: "ईमेल पता",
        password: "पासवर्ड",
        name: "पूरा नाम",
        confirmPassword: "पासवर्ड की पुष्टि करें",
        loginBtn: "साइन इन करें",
        registerBtn: "खाता बनाएं",
        forgotBtn: "लिंक भेजें",
        noAccount: "खाता नहीं है?",
        haveAccount: "पहले से खाता है?",
        forgotLink: "पासवर्ड भूल गए?"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
