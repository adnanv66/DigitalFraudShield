import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle, CheckCircle2, 
  Trash2, Search, Flag, Globe, Info, Sparkles, Volume2, PhoneCall, Link2Off, CheckCheck, Wallet
} from 'lucide-react';
import api from '../services/api';
import ReportModal from '../components/ReportModal';
import PaymentAppInterceptorModal from '../components/PaymentAppInterceptorModal';
import VoiceFraudAlertModal from '../components/VoiceFraudAlertModal';
import { speakWarning, stopVoice } from '../utils/voiceAlerts';

const OFFICIAL_TRUSTED_SENDERS = ['SBIINB', 'HDFCBK', 'ICICIB', 'AXISBK', 'PAYTM', 'GPAY', 'PHONEPE', 'NPCI'];

const SAMPLE_MESSAGES = [
  {
    label: 'sampleSbi',
    text: 'URGENT: SBI NetBanking account blocked due to pending KYC update. Click http://sbi-netverify.com immediately to update Aadhar/PAN.'
  },
  {
    label: 'sampleElec',
    text: 'ELECTRICITY NOTICE: Connection cut tonight at 9:30 PM due to unpaid bill of Rs 1,450. Pay immediately to electricity officer UPI 9876543210@paytm.'
  },
  {
    label: 'sampleUpi',
    text: 'Congratulations! You won Rs 25,000 Paytm Cashback. Enter your UPI PIN at cashback-paytm.info to claim cash refund into bank account.'
  },
  {
    label: 'sampleLegit',
    text: 'Dear Customer, your electricity bill of Rs 480 for July has been generated successfully. Pay online via official EB website.'
  }
];

export default function DetectionPage() {
  const { t, i18n } = useTranslation();
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Automatic UPI Message Reading Permission State
  const [upiAccessGranted, setUpiAccessGranted] = useState(false);

  // Voice Pop-up Alert Modal State
  const [isVoiceAlertOpen, setIsVoiceAlertOpen] = useState(false);

  // Payment Interceptor Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentCollectData, setPaymentCollectData] = useState(null);

  // Report Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);


  // Spoken Voice Alert Handler
  const playVoiceAlert = (textToSpeak) => {
    speakWarning(textToSpeak, i18n.language || 'en');
  };

  const handleRequestUpiAccess = () => {
    const confirmPermission = window.confirm(
      "Digital Fraud Shield Permission Request:\n\nGet Access to UPI Messages (READ_SMS & RECEIVE_SMS Permissions)?\n\nThis will allow the app to automatically read incoming GPay, PhonePe, Paytm, and bank UPI payment request messages in real time."
    );
    if (confirmPermission) {
      setUpiAccessGranted(true);
      // Simulate automatic reading of incoming UPI message
      const incomingScam = "URGENT UPT: Paytm Cashback of Rs 2,500 credited! Enter your UPI PIN at cashback-verify.info to receive cash in bank.";
      setMessageText(incomingScam);
      analyzeMessageText(incomingScam);
    }
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    if (result) {
      analyzeMessage(lang);
    }
  };

  const analyzeMessageText = async (textToAnalyze, overrideLang) => {
    if (!textToAnalyze.trim()) return;
    setLoading(true);
    const targetLang = overrideLang || i18n.language || 'en';

    try {
      const res = await api.post('/detect', {
        message_text: textToAnalyze,
        language: targetLang
      });
      setResult(res.data);
      
      // Automatically trigger Pop-up Voice Fraud Alert for High or Medium Risk!
      if (res.data.risk_level === 'High' || res.data.risk_level === 'Medium') {
        setIsVoiceAlertOpen(true);
      }
    } catch (err) {
      alert('Error connecting to Detection Engine server.');
    } finally {
      setLoading(false);
    }
  };


  const analyzeMessage = async (overrideLang) => {
    analyzeMessageText(messageText, overrideLang);
  };


  const handleClear = () => {
    setMessageText('');
    setResult(null);
  };

  const applySample = (sampleText) => {
    setMessageText(sampleText);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex p-3 bg-brand-50 dark:bg-brand-950/60 rounded-2xl text-brand-600 dark:text-brand-400 mb-1">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          {t('detect.title')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('detect.subtitle')}
        </p>
      </div>

      {/* SECTION: GET ACCESS OF UPI MESSAGES (AUTOMATIC READER) */}
      <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/80 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-brand-500/20 text-brand-300 border border-brand-500/30 rounded-full text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-pulse" />
              <span>Real-Time UPI Payment Interceptor</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {t('detect.upiAccessTitle')}
            </h2>
            <p className="text-xs text-slate-300">
              {t('detect.upiAccessSubtitle')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {!upiAccessGranted ? (
              <button
                onClick={handleRequestUpiAccess}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-extrabold rounded-2xl shadow-lg shadow-brand-500/30 transition-all text-xs transform hover:scale-105"
              >
                <ShieldAlert className="h-4 w-4 text-yellow-300" />
                <span>{t('detect.upiAccessBtn')}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  const demoScam = "URGENT UPT: Power connection cut tonight at 9:30 PM. Pay Rs 1500 immediately to 9876543210@paytm or enter UPI PIN.";
                  setMessageText(demoScam);
                  analyzeMessageText(demoScam);
                }}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all text-xs"
              >
                <CheckCircle2 className="h-4 w-4 text-yellow-300 animate-bounce" />
                <span>{t('detect.simulateUpiBtn')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="p-3.5 bg-white/10 backdrop-blur rounded-2xl border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2.5">
            <span className={`h-2.5 w-2.5 rounded-full ${upiAccessGranted ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            <span className="font-extrabold text-white">
              {upiAccessGranted ? t('detect.upiAccessGranted') : t('detect.upiAccessDenied')}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-semibold hidden sm:block">
            {upiAccessGranted ? 'Background SMS Listener: ACTIVE' : 'Permissions: PENDING'}
          </span>
        </div>
      </div>

      {/* Main Workspace Card */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-800 space-y-6">

        
        {/* Quick Language Toggle Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-500">
            <Globe className="h-4 w-4 text-brand-600" />
            <span>Select Detection Explanation Language:</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                i18n.language === 'en'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange('ta')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                i18n.language === 'ta'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              தமிழ் (Tamil)
            </button>
            <button
              onClick={() => handleLanguageChange('hi')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                i18n.language === 'hi'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              हिंदी (Hindi)
            </button>
          </div>
        </div>

        {/* Quick Sample Chips */}
        <div className="space-y-2">
          <label className="block text-xs font-extrabold uppercase text-gray-400">
            {t('detect.quickSamplesTitle')}
          </label>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_MESSAGES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applySample(sample.text)}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950/60 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors flex items-center space-x-1"
              >
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span>{t(`detect.${sample.label}`)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Large Text Area input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
            Message Input Text
          </label>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows={5}
            placeholder={t('detect.pastePlaceholder')}
            className="w-full p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-base focus:border-brand-500 focus:bg-white dark:focus:bg-gray-800 transition-all focus:outline-none"
          />
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => analyzeMessage()}
              disabled={loading || !messageText.trim()}
              className="flex items-center space-x-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-2xl shadow-lg shadow-brand-500/25 transition-all text-sm disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
              <span>{loading ? 'Analyzing...' : t('detect.analyzeBtn')}</span>
            </button>

            <button
              onClick={handleClear}
              disabled={!messageText && !result}
              className="flex items-center space-x-1.5 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-bold rounded-2xl text-sm transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4 text-gray-400" />
              <span>{t('detect.clearBtn')}</span>
            </button>
          </div>

          {result && (
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center space-x-2 px-5 py-3 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/50 dark:hover:bg-red-900 font-extrabold rounded-2xl text-sm border border-red-200 dark:border-red-900 transition-colors"
            >
              <Flag className="h-4 w-4" />
              <span>{t('detect.reportScamBtn')}</span>
            </button>
          )}
        </div>

      </div>

      {/* Detection Engine Explainability Result Panel */}
      {result && (
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl space-y-6 animate-in slide-in-from-bottom-4 duration-300 ${
          result.risk_level === 'High'
            ? 'bg-red-50/90 dark:bg-red-950/40 border-red-200 dark:border-red-900'
            : result.risk_level === 'Medium'
            ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900'
            : 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900'
        }`}>
          
          {/* Header Banner */}
          <div className="flex items-center justify-between flex-wrap gap-4 border-b pb-4 border-gray-200/60 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              {result.risk_level === 'High' && <AlertTriangle className="h-8 w-8 text-red-600" />}
              {result.risk_level === 'Medium' && <AlertCircle className="h-8 w-8 text-amber-500" />}
              {result.risk_level === 'Low' && <CheckCircle2 className="h-8 w-8 text-emerald-600" />}

              <div>
                <h3 className={`text-xl font-black ${
                  result.risk_level === 'High' ? 'text-red-700 dark:text-red-300' :
                  result.risk_level === 'Medium' ? 'text-amber-700 dark:text-amber-300' :
                  'text-emerald-700 dark:text-emerald-300'
                }`}>
                  {result.risk_level === 'High' && t('detect.highRiskAlert')}
                  {result.risk_level === 'Medium' && t('detect.mediumRiskAlert')}
                  {result.risk_level === 'Low' && t('detect.lowRiskAlert')}
                </h3>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Calculated Risk Score: <span className="font-extrabold">{result.risk_score} / 100</span>
                </p>
              </div>
            </div>

            {/* Risk Badge */}
            <div className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider text-white shadow-md ${
              result.risk_level === 'High' ? 'bg-red-600' :
              result.risk_level === 'Medium' ? 'bg-amber-500' :
              'bg-emerald-600'
            }`}>
              {result.risk_level} Risk Tier
            </div>
          </div>

          {/* Result Action Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center space-x-2">
              {/* Spoken Voice Alert Button for Elderly Users */}
              <button
                type="button"
                onClick={() => {
                  const speechSummary = `${result.risk_level === 'High' ? 'அதிக ஆபத்து எச்சரிக்கை' : result.risk_level === 'Medium' ? 'மிதமான ஆபத்து எச்சரிக்கை' : 'பாதுகாப்பான செய்தி'}. ${result.explanation.join('. ')}`;
                  playVoiceAlert(speechSummary);
                }}
                className="flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-2xl shadow transition-all text-xs"
              >
                <Volume2 className="h-4 w-4 text-yellow-300 animate-pulse" />
                <span>{t('detect.listenVoiceBtn')}</span>
              </button>

              {/* Payment App Collect Request Interceptor Test */}
              <button
                type="button"
                onClick={() => {
                  setPaymentCollectData({
                    appName: 'Google Pay',
                    amount: 'Rs. 2,500',
                    requestedBy: 'cashback_trap@paytm'
                  });
                  setIsPaymentModalOpen(true);
                }}
                className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-extrabold rounded-2xl text-xs transition-colors"
              >
                <Wallet className="h-4 w-4 text-purple-600" />
                <span>{t('detect.gpayInterceptorBtn')}</span>
              </button>
            </div>

            {/* Emergency Helpline 1930 */}
            <a
              href="tel:1930"
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-2xl text-xs shadow transition-colors"
            >
              <PhoneCall className="h-4 w-4" />
              <span>{t('detect.certInHelplineBtn')}</span>
            </a>
          </div>

          {/* Auto-Block Suspicious Links Sanitizer Notice */}
          {result.matched_rules.includes('click_link') && (
            <div className="p-3.5 bg-red-100/80 dark:bg-red-950/80 border border-red-300 dark:border-red-800 rounded-2xl text-xs flex items-center justify-between text-red-900 dark:text-red-200">
              <div className="flex items-center space-x-2">
                <Link2Off className="h-4 w-4 text-red-600 flex-shrink-0" />
                <span className="font-extrabold">{t('detect.autoBlockedLink')}</span>
              </div>
              <span className="px-2 py-0.5 bg-red-600 text-white font-black text-[10px] rounded uppercase">DISABLED</span>
            </div>
          )}


          {/* Explainability Breakdown Panel */}
          <div className="space-y-3">
            <h4 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center space-x-2">
              <Info className="h-5 w-5 text-brand-600" />
              <span>
                {result.risk_level === 'High' && t('detect.whyHigh')}
                {result.risk_level === 'Medium' && t('detect.whyMedium')}
                {result.risk_level === 'Low' && t('detect.whyLow')}
              </span>
            </h4>

            <ul className="space-y-2.5 pl-2">
              {result.explanation.map((bullet, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  <span className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                    result.risk_level === 'High' ? 'bg-red-500' :
                    result.risk_level === 'Medium' ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`} />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}

      {/* Scam Reporting Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        detectionData={result}
      />

      {/* Payment App Interceptor Modal */}
      <PaymentAppInterceptorModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        collectData={paymentCollectData}
      />

      {/* Automatic Voice Pop-up Fraud Alert Modal */}
      <VoiceFraudAlertModal
        isOpen={isVoiceAlertOpen}
        onClose={() => setIsVoiceAlertOpen(false)}
        detectionData={result}
      />

    </div>
  );
}


