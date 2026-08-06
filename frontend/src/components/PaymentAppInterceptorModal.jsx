import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertOctagon, X, PhoneCall, Volume2, ShieldAlert, CheckCircle } from 'lucide-react';
import { speakWarning, stopVoice } from '../utils/voiceAlerts';

export default function PaymentAppInterceptorModal({ isOpen, onClose, collectData }) {
  const { t, i18n } = useTranslation();

  if (!isOpen) return null;

  const appName = collectData?.appName || 'Google Pay / PhonePe';
  const amount = collectData?.amount || 'Rs. 2,500';
  const requestedBy = collectData?.requestedBy || 'unverified_merchant@paytm';

  const warningText = i18n.language === 'ta'
    ? `எச்சரிக்கை! ${appName} பயன்பாட்டில் பணத்தைப் பெற UPI PIN பதிவு செய்ய வேண்டாம்! இது உங்கள் கணக்கிலிருந்து பணத்தை எடுக்கும்!`
    : i18n.language === 'hi'
    ? `चेतावनी! ${appName} में पैसे लेने के लिए UPI PIN न डालें! यह आपके खाते से पैसे काट लेगा!`
    : `WARNING! In ${appName}, NEVER enter your UPI PIN to RECEIVE money! Entering PIN will DEDUCT money from your bank account!`;

  const handlePlayVoice = () => {
    speakWarning(warningText, i18n.language || 'en');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-red-500 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl relative space-y-5 animate-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => { stopVoice(); onClose(); }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Warning Banner */}
        <div className="flex items-center space-x-3 text-red-500 border-b border-slate-800 pb-3">
          <AlertOctagon className="h-8 w-8 text-red-500 animate-bounce flex-shrink-0" />
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-red-400 block">
              PAYMENT APP INTERCEPTOR WARNING
            </span>
            <h3 className="text-lg font-black text-white">
              Suspicious Collect Request Intercepted
            </h3>
          </div>
        </div>

        {/* Intercepted Details Box */}
        <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2 text-xs">
          <div className="flex justify-between text-slate-300">
            <span>Payment App:</span>
            <strong className="text-white font-mono">{appName}</strong>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Requested Amount:</span>
            <strong className="text-red-400 font-extrabold text-sm">{amount}</strong>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Requested By (VPA):</span>
            <strong className="text-yellow-300 font-mono">{requestedBy}</strong>
          </div>
        </div>

        {/* Highlight Warning */}
        <div className="p-4 bg-red-950/80 border border-red-800 rounded-2xl space-y-2">
          <h4 className="text-sm font-extrabold text-red-300 flex items-center space-x-2">
            <ShieldAlert className="h-4 w-4 text-red-400" />
            <span>CRITICAL FRAUD RULE:</span>
          </h4>
          <p className="text-xs font-bold text-white leading-relaxed">
            {warningText}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {/* Voice Alert Speaker */}
          <button
            onClick={handlePlayVoice}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-brand-600 hover:bg-brand-500 text-white font-extrabold rounded-xl shadow text-xs transition-transform transform active:scale-95"
          >
            <Volume2 className="h-4 w-4 text-yellow-300 animate-pulse" />
            <span>🔊 Listen to Spoken Voice Alert ({i18n.language.toUpperCase()})</span>
          </button>

          {/* Emergency 1-Tap Helpline */}
          <a
            href="tel:1930"
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow text-xs transition-colors"
          >
            <PhoneCall className="h-4 w-4 text-white" />
            <span>📞 Emergency 1-Tap Call Cyber Helpline (1930)</span>
          </a>

          {/* Decline & Block */}
          <button
            onClick={() => { stopVoice(); onClose(); }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
          >
            Decline Request & Block Sender
          </button>
        </div>

      </div>
    </div>
  );
}
