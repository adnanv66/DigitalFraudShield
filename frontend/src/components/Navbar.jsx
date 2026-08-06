import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, LayoutDashboard, SearchCode, User, LogOut, Sun, Moon, Eye, Radio } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { highContrast, toggleHighContrast, darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-1">
            <div className="bg-brand-600 text-white p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform">
              <Shield className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white block">
                {t('nav.brand')}
              </span>
              <span className="text-xs text-brand-600 dark:text-brand-400 font-medium hidden md:block">
                {t('nav.tagline')}
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/dashboard')
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>{t('nav.dashboard')}</span>
            </Link>

            <Link
              to="/scanner"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/scanner')
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Radio className="h-4 w-4 text-brand-600 animate-pulse" />
              <span>Auto SMS Scanner</span>
            </Link>

            <Link
              to="/detect"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/detect')
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <SearchCode className="h-4 w-4" />
              <span>{t('nav.detect')}</span>
            </Link>

            {user && (
              <Link
                to="/profile"
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/profile')
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <User className="h-4 w-4" />
                <span>{t('nav.profile')}</span>
              </Link>
            )}
          </nav>


          {/* Actions & Language Switcher */}
          <div className="flex items-center space-x-3">
            
            {/* Language Switcher */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => changeLang('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  i18n.language === 'en'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => changeLang('ta')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  i18n.language === 'ta'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
                aria-label="Switch to Tamil"
              >
                தமிழ்
              </button>
              <button
                onClick={() => changeLang('hi')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  i18n.language === 'hi'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
                aria-label="Switch to Hindi"
              >
                हिंदी
              </button>
            </div>

            {/* Accessibility High Contrast Toggle */}
            <button
              onClick={toggleHighContrast}
              title="Toggle High Contrast Mode for Accessibility"
              className={`p-2 rounded-lg border transition-colors ${
                highContrast
                  ? 'bg-yellow-400 text-black border-yellow-500 font-bold ring-2 ring-yellow-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-200'
              }`}
              aria-label="Toggle High Contrast Mode"
            >
              <Eye className="h-4 w-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              title="Toggle Dark Mode"
              className="p-2 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* User Auth state */}
            {user ? (
              <button
                onClick={logout}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg hover:bg-red-100 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{t('nav.logout')}</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-colors"
              >
                {t('nav.login')}
              </Link>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
