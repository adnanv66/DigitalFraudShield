import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Smartphone, ShieldAlert, CheckCircle2, AlertTriangle, Radio, PhoneCall, 
  MessageSquare, Lock, Unlock, Play, RefreshCw, Send, Zap, Info, BellRing, Sparkles
} from 'lucide-react';
import api from '../services/api';
import VoiceFraudAlertModal from '../components/VoiceFraudAlertModal';

const MOCK_DEVICE_SMS_LIST = [

  {
    sender: 'VM-SBIINB',
    message_text: 'URGENT: Your SBI account has been locked due to pending KYC update. Click http://sbi-netverify.com immediately.',
    timestamp: 'Just now'
  },
  {
    sender: 'VK-PAYTM',
    message_text: 'You won Cashback of Rs 2,500! Enter your UPI PIN at link to receive instant credit.',
    timestamp: '2 mins ago'
  },
  {
    sender: 'AD-EBNOTC',
    message_text: 'ELECTRICITY NOTICE: Connection cut at 9:30 PM today due to unpaid bill. Send Rs 1400 via UPI to 9876543210@paytm.',
    timestamp: '15 mins ago'
  },
  {
    sender: 'AX-HDFCBK',
    message_text: 'Dear Customer, your credit card statement of Rs 1,240 for July is ready. View in netbanking.',
    timestamp: '1 hour ago'
  }
];

export default function ScannerPage() {
  const { t, i18n } = useTranslation();
  
  // Permission & Real-Time Auto-Intercept State
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isAutoInterceptActive, setIsAutoInterceptActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scannedResults, setScannedResults] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);

  // Voice Pop-up Alert Modal State
  const [isVoiceAlertOpen, setIsVoiceAlertOpen] = useState(false);
  const [voiceAlertData, setVoiceAlertData] = useState(null);

  // Keypad Phone Feature Simulator State
  const [keypadInput, setKeypadInput] = useState('*99*786#');
  const [keypadScreenText, setKeypadScreenText] = useState('NOKIA / JIOPHONE 2G GATEWAY\nEnter USSD Code or SMS text below and press SEND.');
  const [keypadLoading, setKeypadLoading] = useState(false);
  const [keypadLang, setKeypadLang] = useState(i18n.language || 'en');

  // Request SMS Permissions Prompt Simulation
  const handleRequestPermission = () => {
    const confirmAccess = window.confirm(
      "Digital Fraud Shield Requests Permission:\n\nAllow app to access and read device SMS inbox (READ_SMS & RECEIVE_SMS permissions)?\n\nThis enables automatic background interception of UPI scam messages."
    );
    if (confirmAccess) {
      setPermissionGranted(true);
      setIsAutoInterceptActive(true);
      runAutoScan(MOCK_DEVICE_SMS_LIST);
    }
  };

  // Run Batch Scan against Backend API
  const runAutoScan = async (smsList) => {
    setScanning(true);
    try {
      const res = await api.post('/scan-upi/auto-read', {
        messages: smsList,
        language: i18n.language || 'en'
      });
      setScannedResults(res.data.results || []);

      // If any High Risk found, trigger top alert toast AND Voice Pop-up Alert Modal!
      const highRiskItem = res.data.results.find(r => r.risk_level === 'High');
      if (highRiskItem) {
        setActiveAlert(highRiskItem);
        setVoiceAlertData(highRiskItem);
        setIsVoiceAlertOpen(true);
      }
    } catch (err) {
      console.error("Scanner API error:", err);
    } finally {
      setScanning(false);
    }
  };


  // Simulate Incoming Live UPI Scam SMS Event
  const simulateIncomingScamSMS = () => {
    if (!permissionGranted) {
      alert("Please grant device SMS permissions first to enable real-time interception!");
      return;
    }
    const incomingItem = {
      sender: 'AX-EBOFFC',
      message_text: 'URGENT UPT: Power supply will be disconnected tonight at 9:30 PM. Send Rs 1800 immediately to 9876543210@paytm or enter UPI PIN.',
      timestamp: 'NOW'
    };
    runAutoScan([incomingItem, ...MOCK_DEVICE_SMS_LIST]);
  };

  // Keypad Phone Button Handlers
  const handleKeypadPress = (val) => {
    setKeypadInput(prev => prev + val);
  };

  const handleKeypadClear = () => {
    setKeypadInput('');
  };

  const handleKeypadSend = async () => {
    if (!keypadInput.trim()) return;
    setKeypadLoading(true);
    try {
      const res = await api.post('/scan-upi/keypad-ussd', {
        phone_number: "+91 9876543210",
        ussd_code_or_sms: keypadInput,
        language: keypadLang
      });
      if (res.data.mode === "USSD_MENU") {
        setKeypadScreenText(`[USSD REPLY]\n${res.data.display_text}`);
      } else {
        setKeypadScreenText(`[INCOMING SMS WARNING]\n${res.data.sms_reply}`);
      }
    } catch (err) {
      setKeypadScreenText("Error connecting to USSD Gateway.");
    } finally {
      setKeypadLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            <Radio className="h-8 w-8 text-brand-600 animate-pulse" />
            <span>Automatic SMS & UPI Scanner</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time background inbox reading, permission management, and Keypad Feature Phone USSD gateway
          </p>
        </div>

        {/* Live Intercept Badge */}
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold ${
            permissionGranted
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
          }`}>
            <span className={`h-2 w-2 rounded-full ${permissionGranted ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
            <span>{permissionGranted ? 'Auto Intercept Active' : 'Permission Required'}</span>
          </span>
        </div>
      </div>

      {/* Real-time High Risk Scam Toast Alert */}
      {activeAlert && (
        <div className="p-4 bg-red-600 text-white rounded-2xl shadow-xl flex items-center justify-between animate-bounce">
          <div className="flex items-center space-x-3">
            <BellRing className="h-6 w-6 flex-shrink-0 text-yellow-300" />
            <div>
              <h4 className="font-extrabold text-sm uppercase">HIGH RISK UPI SCAM INTERCEPTED AUTOMATICALLY!</h4>
              <p className="text-xs text-red-100 font-mono mt-0.5">"{activeAlert.message_text}"</p>
            </div>
          </div>
          <button
            onClick={() => setActiveAlert(null)}
            className="px-3 py-1 bg-white text-red-700 font-bold rounded-lg text-xs hover:bg-red-50"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* SECTION 1: DEVICE SMS PERMISSION BANNER & CONTROL PANEL */}
      <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-sky-300">
              <Smartphone className="h-4 w-4" />
              <span>Android / iOS / KaiOS Device Interceptor</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Grant Mobile SMS Access Permissions
            </h2>
            <p className="text-xs text-slate-300">
              To automatically scan incoming UPI payment requests and SMS notifications, Digital Fraud Shield requires <code className="text-yellow-300 font-bold">READ_SMS</code> & <code className="text-yellow-300 font-bold">RECEIVE_SMS</code> permissions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {!permissionGranted ? (
              <button
                onClick={handleRequestPermission}
                className="flex items-center space-x-2 px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold rounded-2xl shadow-lg shadow-brand-500/30 transition-all text-sm transform hover:scale-105"
              >
                <Unlock className="h-4 w-4" />
                <span>Grant SMS Access Permission</span>
              </button>
            ) : (
              <button
                onClick={simulateIncomingScamSMS}
                className="flex items-center space-x-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all text-sm"
              >
                <Zap className="h-4 w-4 text-yellow-300 animate-bounce" />
                <span>Simulate Incoming Scam SMS</span>
              </button>
            )}
          </div>
        </div>

        {/* Permission Status Box */}
        <div className="p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            {permissionGranted ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            ) : (
              <Lock className="h-5 w-5 text-amber-400" />
            )}
            <div>
              <span className="font-extrabold text-white block">
                {permissionGranted ? 'Device SMS Permission Granted' : 'Device SMS Permission Not Granted'}
              </span>
              <span className="text-slate-300">
                {permissionGranted ? 'Background listener is scanning all incoming UPI messages.' : 'Click grant permission to enable real-time reading.'}
              </span>
            </div>
          </div>
          
          {permissionGranted && (
            <button
              onClick={() => runAutoScan(MOCK_DEVICE_SMS_LIST)}
              disabled={scanning}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold text-white transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${scanning ? 'animate-spin' : ''}`} />
              <span>Rescan Inbox</span>
            </button>
          )}
        </div>
      </div>

      {/* SECTION 2: LIVE SCANNED MESSAGES FEED */}
      {permissionGranted && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-brand-600" />
                <span>Auto-Intercepted Inbox Messages ({scannedResults.length})</span>
              </h3>
              <p className="text-xs text-gray-500">Messages scanned automatically from device inbox stream</p>
            </div>
          </div>

          <div className="space-y-3">
            {scannedResults.map((item, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  item.risk_level === 'High'
                    ? 'bg-red-50/80 dark:bg-red-950/40 border-red-200 dark:border-red-900'
                    : item.risk_level === 'Medium'
                    ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900'
                    : 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-xs text-gray-900 dark:text-white font-mono bg-white/80 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                      Sender: {item.sender}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white ${
                      item.risk_level === 'High' ? 'bg-red-600' :
                      item.risk_level === 'Medium' ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}>
                      {item.risk_level} Risk ({item.risk_score} pts)
                    </span>
                  </div>
                </div>

                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-relaxed font-mono">
                  "{item.message_text}"
                </p>

                {item.explanation && item.explanation.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-200/50 dark:border-gray-800 text-[11px] text-gray-600 dark:text-gray-400">
                    <strong className="block mb-1 text-gray-700 dark:text-gray-300">Rule Explainability:</strong>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {item.explanation.map((exp, i) => (
                        <li key={i}>{exp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: KEYPAD PHONE / FEATURE PHONE (USSD & SMS GATEWAY) SIMULATOR */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-xl space-y-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full text-xs font-bold mb-2">
            <PhoneCall className="h-3.5 w-3.5" />
            <span>2G / 3G Keypad & Feature Phone (Nokia / JioPhone) Gateway</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white">
            Keypad Phone USSD & SMS Scanner Simulator
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Elderly citizens without smartphones can dial USSD codes (e.g. <code className="font-bold text-brand-600">*99*786#</code>) or send SMS to check fraud on basic keypad phones.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Retro Keypad Phone Device Shell */}
          <div className="mx-auto bg-slate-900 p-6 rounded-[40px] shadow-2xl border-4 border-slate-700 w-full max-w-xs space-y-4">
            
            {/* Nokia / Jio Screen */}
            <div className="bg-emerald-950 text-emerald-300 font-mono p-4 rounded-2xl border-2 border-emerald-700 min-h-[140px] shadow-inner text-xs space-y-2 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[10px] text-emerald-500 border-b border-emerald-800 pb-1">
                <span>NOKIA 2G USSD</span>
                <span>SIGNAL: 4G 📶</span>
              </div>
              <p className="whitespace-pre-line leading-tight text-[11px]">
                {keypadScreenText}
              </p>
              <div className="pt-2 border-t border-emerald-900 text-emerald-400 font-extrabold text-xs truncate">
                INPUT: {keypadInput || '_'}
              </div>
            </div>

            {/* Feature Phone Buttons */}
            <div className="space-y-3 pt-2">
              
              {/* Send / Clear Action buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleKeypadSend}
                  disabled={keypadLoading}
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center justify-center space-x-1 shadow"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{keypadLoading ? 'DIALING...' : 'SEND / DIAL'}</span>
                </button>
                <button
                  onClick={handleKeypadClear}
                  className="py-2.5 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs"
                >
                  CLEAR
                </button>
              </div>

              {/* Keypad Grid 0-9, *, # */}
              <div className="grid grid-cols-3 gap-2 text-white font-bold text-sm text-center">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleKeypadPress(val)}
                    className="py-2 bg-slate-800 hover:bg-slate-700 active:bg-brand-600 rounded-xl border border-slate-700 transition-colors"
                  >
                    {val}
                  </button>
                ))}
              </div>

            </div>

          </div>

          {/* Keypad Phone Options & Quick Presets */}
          <div className="space-y-5">
            
            {/* Language Selector for Keypad Reply */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Select Feature Phone SMS Reply Language:
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setKeypadLang('en')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${keypadLang === 'en' ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                >
                  English
                </button>
                <button
                  onClick={() => setKeypadLang('ta')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${keypadLang === 'ta' ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                >
                  தமிழ் (Tamil)
                </button>
                <button
                  onClick={() => setKeypadLang('hi')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${keypadLang === 'hi' ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                >
                  हिंदी (Hindi)
                </button>
              </div>
            </div>

            {/* Preset Test Buttons for Keypad Phone */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase text-gray-400">
                Quick Test Keypad Phone Scenarios:
              </label>
              
              <div className="space-y-2">
                <button
                  onClick={() => setKeypadInput('*99*786#')}
                  className="w-full text-left p-3 bg-gray-50 dark:bg-gray-800/60 hover:bg-brand-50 dark:hover:bg-brand-950/60 rounded-xl border border-gray-200 dark:border-gray-700 text-xs transition-colors flex items-center justify-between"
                >
                  <div>
                    <strong className="block text-gray-900 dark:text-white font-mono">*99*786#</strong>
                    <span className="text-gray-500">Dial National USSD Fraud Prevention Menu</span>
                  </div>
                  <Play className="h-4 w-4 text-brand-600" />
                </button>

                <button
                  onClick={() => setKeypadInput('SBI account blocked. Click http://sbi-netverify.com and enter UPI PIN.')}
                  className="w-full text-left p-3 bg-gray-50 dark:bg-gray-800/60 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-xl border border-gray-200 dark:border-gray-700 text-xs transition-colors flex items-center justify-between"
                >
                  <div>
                    <strong className="block text-gray-900 dark:text-white">Forward High Risk SBI Phishing SMS</strong>
                    <span className="text-gray-500">Simulate forwarding suspicious SMS from 2G phone</span>
                  </div>
                  <Play className="h-4 w-4 text-red-600" />
                </button>

                <button
                  onClick={() => setKeypadInput('Paytm Cashback won! Enter UPI PIN to claim refund.')}
                  className="w-full text-left p-3 bg-gray-50 dark:bg-gray-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/60 rounded-xl border border-gray-200 dark:border-gray-700 text-xs transition-colors flex items-center justify-between"
                >
                  <div>
                    <strong className="block text-gray-900 dark:text-white">Forward Paytm UPI PIN Cashback Trap</strong>
                    <span className="text-gray-500">Check automated 160-char SMS response back to phone</span>
                  </div>
                  <Play className="h-4 w-4 text-amber-600" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Automatic Voice Pop-up Fraud Alert Modal */}
      <VoiceFraudAlertModal
        isOpen={isVoiceAlertOpen}
        onClose={() => setIsVoiceAlertOpen(false)}
        detectionData={voiceAlertData}
      />

    </div>
  );
}

