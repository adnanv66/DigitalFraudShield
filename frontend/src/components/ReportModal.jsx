import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, X, CheckCircle2, Send, PhoneCall, Mail } from 'lucide-react';
import api from '../services/api';

export default function ReportModal({ isOpen, onClose, detectionData }) {
  const { t } = useTranslation();
  const [category, setCategory] = useState('UPI Fraud');
  const [reason, setReason] = useState('Demands UPI PIN or money transfer');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/reports', {
        detection_id: detectionData?.id || null,
        message_text: detectionData?.message_text || '',
        category,
        reason,
        notes
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      alert('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Close Modal"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
              {t('reportModal.successMsg')}
            </h3>
            <p className="text-sm text-gray-500">
              Admin review will process this report to update our public pattern database.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('reportModal.title')}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('reportModal.subtitle')}
                </p>
              </div>
            </div>

            {/* Message Preview Box */}
            {detectionData?.message_text && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-mono text-gray-700 dark:text-gray-300 max-h-24 overflow-y-auto">
                <span className="font-bold block text-gray-500 mb-1">Message Preview:</span>
                "{detectionData.message_text}"
              </div>
            )}

            {/* Category Select */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t('reportModal.categoryLabel')}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-brand-500"
              >
                <option value="UPI Fraud">UPI Fraud / VPA Impersonation</option>
                <option value="Electricity Scam">Fake Electricity Cut Off Threat</option>
                <option value="Banking Phishing">Bank Account / KYC Update Phishing</option>
                <option value="Lottery & Cashback">Fake Lottery Winner / Cashback Lure</option>
                <option value="SIM Block Threat">SIM Card Cancellation Scam</option>
                <option value="Other Scam">Other Financial Fraud</option>
              </select>
            </div>

            {/* Primary Reason */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t('reportModal.reasonLabel')}
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500"
                placeholder="e.g. Asks for UPI PIN to receive refund"
              />
            </div>

            {/* CERT-In National Cyber Helpline Integration */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl space-y-3">
              <h4 className="text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                <PhoneCall className="h-4 w-4 text-amber-600" />
                <span>Official India CERT-In & Cyber Crime Hotlines</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <a
                  href="tel:1800114949"
                  className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded-xl border border-amber-300 dark:border-amber-700 hover:bg-amber-100 font-extrabold text-amber-900 dark:text-amber-200 transition-colors"
                >
                  <PhoneCall className="h-3.5 w-3.5 text-amber-600" />
                  <span>CERT-In Toll-Free: 1800-11-4949</span>
                </a>
                <a
                  href="tel:01122902657"
                  className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded-xl border border-amber-300 dark:border-amber-700 hover:bg-amber-100 font-extrabold text-amber-900 dark:text-amber-200 transition-colors"
                >
                  <PhoneCall className="h-3.5 w-3.5 text-amber-600" />
                  <span>Direct Line: 011-2290-2657</span>
                </a>
                <a
                  href="mailto:incident@cert-in.org.in"
                  className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded-xl border border-amber-300 dark:border-amber-700 hover:bg-amber-100 font-extrabold text-amber-900 dark:text-amber-200 transition-colors col-span-1 sm:col-span-2"
                >
                  <Mail className="h-3.5 w-3.5 text-amber-600" />
                  <span>Report Incident Email: incident@cert-in.org.in</span>
                </a>
              </div>
            </div>

            {/* Additional Notes Textarea */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t('reportModal.notesLabel')}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
                placeholder={t('reportModal.notesPlaceholder')}
              />
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 transition-colors"
              >
                {t('reportModal.cancelBtn')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-5 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition-colors disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{loading ? 'Submitting...' : t('reportModal.submitBtn')}</span>
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
