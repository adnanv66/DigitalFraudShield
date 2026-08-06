import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertOctagon, Volume2, X, PhoneCall, ShieldAlert, AlertTriangle } from 'lucide-react';
import { speakWarning, stopVoice } from '../utils/voiceAlerts';

export default function VoiceFraudAlertModal({ isOpen, onClose, detectionData }) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (isOpen && detectionData) {
      // Build clear spoken voice text explaining why it is fraud and what is suspicious
      const lang = i18n.language || 'en';
      let spokenMsg = "";

      if (lang === 'ta') {
        spokenMsg = `எச்சரிக்கை! இது ${detectionData.risk_level} நிலை மோசடிச் செய்தி. `;
        if (detectionData.explanation && detectionData.explanation.length > 0) {
          spokenMsg += `காரணம்: ${detectionData.explanation.join('. ')}`;
        }
      } else if (lang === 'hi') {
        spokenMsg = `चेतावनी! यह एक ${detectionData.risk_level} जोखिम धोखाधड़ी संदेश है। `;
        if (detectionData.explanation && detectionData.explanation.length > 0) {
          spokenMsg += `कारण: ${detectionData.explanation.join('. ')}`;
        }
      } else {
        spokenMsg = `Warning! High Risk Fraud Detected. Risk score: ${detectionData.risk_score} out of 100. `;
        if (detectionData.explanation && detectionData.explanation.length > 0) {
          spokenMsg += `Why it is fraud: ${detectionData.explanation.join('. ')}`;
        }
      }

      // Automatically trigger voice speech out loud
      speakWarning(spokenMsg, lang);
    }
    return () => {
      stopVoice();
    };
  }, [isOpen, detectionData, i18n.language]);

  if (!isOpen || !detectionData) return null;

  const isHighRisk = detectionData.risk_level === 'High';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6 animate-in zoom-in duration-200 border-2 ${
        isHighRisk ? 'bg-slate-900 border-red-500' : 'bg-slate-900 border-amber-500'
      }`}>
        
        {/* Close Button */}
        <button
          onClick={() => { stopVoice(); onClose(); }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Header Badge */}
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className={`p-3 rounded-2xl ${isHighRisk ? 'bg-red-600/20 text-red-500 animate-bounce' : 'bg-amber-600/20 text-amber-500'}`}>
            <AlertOctagon className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white ${
                isHighRisk ? 'bg-red-600' : 'bg-amber-600'
              }`}>
                {detectionData.risk_level} RISK ({detectionData.risk_score}/100 PTS)
              </span>
              <span className="text-xs font-bold text-yellow-300 flex items-center space-x-1">
                <Volume2 className="h-3.5 w-3.5 animate-pulse" />
                <span>SPEAKING OUT LOUD...</span>
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-1">
              AUTOMATIC VOICE FRAUD ALERT
            </h3>
          </div>
        </div>

        {/* Suspicious Message Preview */}
        <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700 space-y-1">
          <span className="text-[11px] font-bold uppercase text-slate-400">Suspicious SMS Text Analyzed:</span>
          <p className="text-xs font-mono font-semibold text-red-300 leading-relaxed">
            "{detectionData.message_text}"
          </p>
        </div>

        {/* WHY IT IS FRAUD & SUSPICIOUS DETAILS */}
        <div className="p-4 bg-red-950/80 border border-red-800/80 rounded-2xl space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-red-400 flex items-center space-x-2">
            <ShieldAlert className="h-4 w-4 text-red-400" />
            <span>Why This Message Is Fraudulent & What Is Suspicious:</span>
          </h4>
          
          <ul className="space-y-2 text-xs text-slate-200">
            {detectionData.explanation && detectionData.explanation.map((reason, idx) => (
              <li key={idx} className="flex items-start space-x-2 font-medium">
                <span className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* Replay Spoken Voice Warning */}
          <button
            onClick={() => {
              const lang = i18n.language || 'en';
              const textToSpeak = `${detectionData.risk_level} Risk Fraud Warning. Why it is fraud: ${detectionData.explanation.join('. ')}`;
              speakWarning(textToSpeak, lang);
            }}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-brand-600 hover:bg-brand-500 text-white font-extrabold rounded-2xl shadow text-xs transition-transform transform active:scale-95"
          >
            <Volume2 className="h-4 w-4 text-yellow-300 animate-pulse" />
            <span>🔊 Replay Spoken Voice Explanation ({i18n.language.toUpperCase()})</span>
          </button>

          {/* Emergency Helpline Call Button */}
          <a
            href="tel:1800114949"
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-2xl shadow text-xs transition-colors"
          >
            <PhoneCall className="h-4 w-4 text-white" />
            <span>📞 Call CERT-In National Cyber Helpline (1800-11-4949)</span>
          </a>

          {/* Dismiss */}
          <button
            onClick={() => { stopVoice(); onClose(); }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-xs"
          >
            Dismiss Alert
          </button>
        </div>

      </div>
    </div>
  );
}
