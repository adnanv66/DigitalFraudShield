import React from 'react';
import { Shield, Heart, Lock, CheckCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-brand-600" />
            <span className="font-bold text-gray-900 dark:text-white text-base">
              Digital Fraud Shield MVP
            </span>
            <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
              100% Free & Open Engine
            </span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center space-x-1">
              <Lock className="h-3.5 w-3.5 text-brand-500" />
              <span>JWT & HTTPS Secure</span>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
              <span>Accessibility WCAG Compliant</span>
            </span>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="h-3.5 w-3.5 text-red-500 fill-current" />
            <span>for Citizens & Seniors across India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
