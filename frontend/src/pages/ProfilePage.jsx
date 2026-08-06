import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Globe, Eye, Moon, Type, Save, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { user, updateProfile, logout } = useAuth();
  const { highContrast, toggleHighContrast, darkMode, toggleDarkMode, fontSize, setFontSize } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [langPref, setLangPref] = useState(user?.language_preference || i18n.language || 'en');
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSavedMsg('');
    const res = await updateProfile({
      name,
      language_preference: langPref
    });
    if (res.success) {
      i18n.changeLanguage(langPref);
      setSavedMsg('Preferences saved successfully!');
      setTimeout(() => setSavedMsg(''), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="space-y-1 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center sm:justify-start gap-3">
          <User className="h-7 w-7 text-brand-600" />
          <span>{t('profile.title')}</span>
        </h1>
        <p className="text-sm text-gray-500">
          Customize your display accessibility modes and account parameters
        </p>
      </div>

      {savedMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-sm font-bold text-emerald-700 dark:text-emerald-300 flex items-center space-x-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-800 space-y-6">
        
        {/* Name & Email Fields */}
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-gray-900 dark:text-white border-b pb-2 border-gray-100 dark:border-gray-800">
            Account Info
          </h3>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              {t('profile.nameLabel')}
            </label>
            <div className="relative">
              <User className="h-4 w-4 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              {t('profile.emailLabel')}
            </label>
            <div className="relative">
              <Mail className="h-4 w-4 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800/50 text-gray-500 text-sm cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Language Preference */}
        <div className="space-y-3">
          <h3 className="text-base font-extrabold text-gray-900 dark:text-white border-b pb-2 border-gray-100 dark:border-gray-800">
            Language Preference
          </h3>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-center space-x-1">
              <Globe className="h-3.5 w-3.5 text-brand-600" />
              <span>{t('profile.languageLabel')}</span>
            </label>
            <select
              value={langPref}
              onChange={(e) => setLangPref(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-brand-500"
            >
              <option value="en">English (Default)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>
        </div>

        {/* Accessibility & Visual Controls */}
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-gray-900 dark:text-white border-b pb-2 border-gray-100 dark:border-gray-800">
            {t('profile.accessibilitySection')}
          </h3>

          {/* High Contrast Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Eye className="h-5 w-5 text-yellow-500" />
              <div>
                <span className="text-sm font-extrabold text-gray-900 dark:text-white block">
                  {t('profile.highContrastLabel')}
                </span>
                <span className="text-xs text-gray-500">Optimized contrast ratio for low-vision users</span>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleHighContrast}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                highContrast ? 'bg-yellow-400 justify-end' : 'bg-gray-300 dark:bg-gray-700 justify-start'
              }`}
            >
              <span className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform" />
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Moon className="h-5 w-5 text-brand-600" />
              <div>
                <span className="text-sm font-extrabold text-gray-900 dark:text-white block">
                  {t('profile.darkModeLabel')}
                </span>
                <span className="text-xs text-gray-500">Dark background theme</span>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                darkMode ? 'bg-brand-600 justify-end' : 'bg-gray-300 dark:bg-gray-700 justify-start'
              }`}
            >
              <span className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform" />
            </button>
          </div>

          {/* Font Size Scaler */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center space-x-1">
              <Type className="h-3.5 w-3.5 text-brand-600" />
              <span>{t('profile.fontSizeLabel')}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFontSize('normal')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                  fontSize === 'normal'
                    ? 'bg-brand-600 text-white border-brand-600 shadow'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                }`}
              >
                Standard (100%)
              </button>
              <button
                type="button"
                onClick={() => setFontSize('large')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                  fontSize === 'large'
                    ? 'bg-brand-600 text-white border-brand-600 shadow'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                }`}
              >
                Large (115%)
              </button>
              <button
                type="button"
                onClick={() => setFontSize('xlarge')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                  fontSize === 'xlarge'
                    ? 'bg-brand-600 text-white border-brand-600 shadow'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                }`}
              >
                Extra Large (130%)
              </button>
            </div>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-2.5 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/40 rounded-xl hover:bg-red-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>{t('profile.logoutBtn')}</span>
          </button>

          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl shadow-lg shadow-brand-500/20 text-xs transition-all"
          >
            <Save className="h-4 w-4" />
            <span>{t('profile.saveBtn')}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
