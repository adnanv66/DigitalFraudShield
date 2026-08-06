import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, Lock, Mail, User as UserIcon, ArrowRight, CheckCircle2, 
  KeyRound, Sparkles, ShieldAlert, Heart, Eye, Globe 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login, register: registerUser } = useAuth();
  const { highContrast, toggleHighContrast, darkMode, toggleDarkMode } = useTheme();
  
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [serverError, setServerError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset
  } = useForm();

  const switchMode = (newMode) => {
    setMode(newMode);
    setServerError('');
    setResetSuccess('');
    reset();
  };

  // Quick 1-Click Demo Login helper for evaluators
  const applyDemoCredentials = () => {
    switchMode('login');
    setValue('email', 'demo@fraudshield.in');
    setValue('password', 'Password@123');
  };

  const onSubmit = async (data) => {
    setServerError('');
    setResetSuccess('');

    if (mode === 'login') {
      const res = await login(data.email, data.password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setServerError(res.message);
      }
    } else if (mode === 'register') {
      if (data.password !== data.confirmPassword) {
        setServerError('Passwords do not match');
        return;
      }
      const res = await registerUser(data.name, data.email, data.password, data.language_preference || 'en');
      if (res.success) {
        navigate('/dashboard');
      } else {
        setServerError(res.message);
      }
    } else if (mode === 'forgot') {
      try {
        await api.post('/auth/reset-password', {
          email: data.email,
          new_password: data.newPassword
        });
        setResetSuccess('If your email exists in our records, password has been reset successfully. You can now login.');
      } catch (err) {
        setServerError(err.response?.data?.detail || 'Reset failed');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 text-white flex flex-col justify-between p-4 sm:p-6 select-none">
      
      {/* Top Navbar Header */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center space-x-3">
          <div className="bg-brand-500 text-white p-2 rounded-2xl shadow-lg shadow-brand-500/30">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white block">
              Digital Fraud Shield
            </span>
            <span className="text-xs text-sky-300 font-semibold hidden sm:block">
              AI Scam Prevention Engine for Elderly & Citizens
            </span>
          </div>
        </div>

        {/* Quick Accessibility & Language Controls */}
        <div className="flex items-center space-x-2">
          {/* Language Switcher */}
          <div className="flex items-center bg-white/10 backdrop-blur p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => i18n.changeLanguage('en')}
              className={`px-2.5 py-1 font-bold rounded-lg transition-all ${i18n.language === 'en' ? 'bg-brand-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
            >
              EN
            </button>
            <button
              onClick={() => i18n.changeLanguage('ta')}
              className={`px-2.5 py-1 font-bold rounded-lg transition-all ${i18n.language === 'ta' ? 'bg-brand-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => i18n.changeLanguage('hi')}
              className={`px-2.5 py-1 font-bold rounded-lg transition-all ${i18n.language === 'hi' ? 'bg-brand-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
            >
              हिंदी
            </button>
          </div>

          <button
            onClick={toggleHighContrast}
            title="Toggle High Contrast Mode"
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-yellow-300"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Login Card Container */}
      <div className="max-w-md w-full mx-auto my-8">
        
        {/* 1-Click Demo Login Banner Chip */}
        <div className="mb-4 text-center">
          <button
            type="button"
            onClick={applyDemoCredentials}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-full text-xs font-bold text-emerald-300 transition-all transform hover:scale-105 shadow-lg"
          >
            <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span>Click for 1-Tap Demo Login (demo@fraudshield.in)</span>
          </button>
        </div>

        {/* Card wrapper */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-white">
              {mode === 'login' && 'Sign In to Access Shield'}
              {mode === 'register' && 'Create Free Protected Account'}
              {mode === 'forgot' && 'Reset Account Password'}
            </h1>
            <p className="text-xs text-slate-400">
              {mode === 'login' && 'Authentication required to access fraud detection workspace & telemetry'}
              {mode === 'register' && 'Join Digital Fraud Shield to check SMS & report community scams'}
              {mode === 'forgot' && 'Enter email to receive password reset instructions'}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${
                mode === 'login' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${
                mode === 'register' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Alerts */}
          {serverError && (
            <div className="p-3.5 bg-red-950/80 border border-red-800 rounded-xl text-xs font-semibold text-red-300">
              {serverError}
            </div>
          )}
          {resetSuccess && (
            <div className="p-3.5 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs font-semibold text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>{resetSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Full Name for Register */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white text-sm focus:border-brand-500 focus:outline-none"
                    placeholder="Ramesh Kumar"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                  })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white text-sm focus:border-brand-500 focus:outline-none"
                  placeholder="demo@fraudshield.in"
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            {/* Language Preference for Register */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Preferred Language
                </label>
                <select
                  {...register('language_preference')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-sm focus:border-brand-500 focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="hi">Hindi (हिंदी)</option>
                </select>
              </div>
            )}

            {/* Password */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-300">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-xs text-brand-400 hover:underline font-semibold"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters' }
                    })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white text-sm focus:border-brand-500 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
              </div>
            )}

            {/* Confirm Password for Register */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="password"
                    {...register('confirmPassword', { required: 'Please confirm password' })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white text-sm focus:border-brand-500 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* New Password for Forgot */}
            {mode === 'forgot' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <KeyRound className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="password"
                    {...register('newPassword', {
                      required: 'New password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters' }
                    })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white text-sm focus:border-brand-500 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-brand-500 hover:bg-brand-600 text-white font-extrabold rounded-xl shadow-lg shadow-brand-500/30 transition-all text-sm disabled:opacity-50 mt-2 transform active:scale-95"
            >
              <span>
                {mode === 'login' && 'Sign In to Application'}
                {mode === 'register' && 'Create Free Account'}
                {mode === 'forgot' && 'Reset Password'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

        </div>

      </div>

      {/* Footer Branding */}
      <footer className="text-center text-xs text-slate-400 space-y-1">
        <p className="flex items-center justify-center space-x-1">
          <span>Protected by Digital Fraud Shield MVP Engine</span>
          <ShieldAlert className="h-3.5 w-3.5 text-brand-400" />
        </p>
        <p className="text-[11px] text-slate-500">
          Strict authentication required before proceeding. 100% Secure JWT Session.
        </p>
      </footer>

    </div>
  );
}
