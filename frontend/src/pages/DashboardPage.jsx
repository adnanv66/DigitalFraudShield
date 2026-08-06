import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, Shield, AlertTriangle, AlertCircle, CheckCircle2, Flag, Target, 
  Search, Filter, RefreshCw, ChevronRight, MessageSquareText, MessageSquare, BarChart3,
  BookOpen, Eye, X, Send, Sparkles, SlidersHorizontal, PhoneCall, PieChart as PieChartIcon
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import api from '../services/api';
import ReportModal from '../components/ReportModal';


export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active Tab State: 'messages' | 'analytics' | 'patterns'
  const [activeTab, setActiveTab] = useState('messages');

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals State
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const openDetailModal = (item) => {
    setSelectedDetection(item);
    setIsDetailModalOpen(true);
  };

  const openReportModal = (item) => {
    setSelectedDetection(item);
    setIsReportOpen(true);
  };

  // Filter Table / Message Data
  const filteredDetections = (stats?.recent_detections || []).filter(item => {
    const matchesSearch = item.message_text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'All' || item.risk_level === riskFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesRisk && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <span>{t('dashboard.title')}</span>
            <ShieldCheck className="h-7 w-7 text-brand-600" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time telemetry, detected scam messages, and rule-based accuracy analytics
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Live Telemetry</span>
          </button>
        </div>
      </div>

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Total Detections */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-brand-600">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">{t('dashboard.totalDetections')}</span>
            <ShieldCheck className="h-5 w-5" />
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">
            {stats ? stats.total_detections.toLocaleString() : '...'}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full inline-block">
            +14% this week
          </span>
        </div>

        {/* High Risk */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-red-200 dark:border-red-950 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-red-600">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">{t('dashboard.highRisk')}</span>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <p className="text-2xl font-black text-red-600 dark:text-red-400">
            {stats ? stats.high_risk.toLocaleString() : '...'}
          </p>
          <span className="text-[10px] text-red-600 font-bold bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full inline-block">
            Critical Action Needed
          </span>
        </div>

        {/* Medium Risk */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-amber-200 dark:border-amber-950 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">{t('dashboard.mediumRisk')}</span>
            <AlertCircle className="h-5 w-5" />
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {stats ? stats.medium_risk.toLocaleString() : '...'}
          </p>
          <span className="text-[10px] text-amber-600 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full inline-block">
            Caution Advised
          </span>
        </div>

        {/* Low Risk */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-950 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">{t('dashboard.lowRisk')}</span>
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats ? stats.low_risk.toLocaleString() : '...'}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full inline-block">
            Safe Messages
          </span>
        </div>

        {/* Reported Scams */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">{t('dashboard.reportedScams')}</span>
            <Flag className="h-5 w-5" />
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">
            {stats ? stats.reported_scams.toLocaleString() : '...'}
          </p>
          <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full inline-block">
            Admin Moderated
          </span>
        </div>

        {/* Detection Accuracy */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-brand-600">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">{t('dashboard.accuracy')}</span>
            <Target className="h-5 w-5" />
          </div>
          <p className="text-2xl font-black text-brand-600 dark:text-brand-400">
            {stats ? `${stats.detection_accuracy}%` : '...'}
          </p>
          <span className="text-[10px] text-brand-600 font-bold bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-full inline-block">
            Rule Weighted Engine
          </span>
        </div>

      </div>

      {/* DASHBOARD FUNCTION TABS HEADER */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="flex space-x-8" aria-label="Dashboard Tabs">
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-extrabold text-sm transition-colors ${
              activeTab === 'messages'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Shield className="h-4 w-4 text-brand-600" />
            <span>Fraud Log</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-extrabold text-sm transition-colors ${
              activeTab === 'analytics'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <BarChart3 className="h-4 w-4 text-emerald-500" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('patterns')}
            className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-extrabold text-sm transition-colors ${
              activeTab === 'patterns'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <PieChartIcon className="h-4 w-4 text-purple-500" />
            <span>Scam Patterns</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-extrabold text-sm transition-colors ${
              activeTab === 'feedback'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <MessageSquare className="h-4 w-4 text-indigo-500" />
            <span>User Feedback & CERT-In Chatbot</span>
          </button>

          <button
            onClick={() => setActiveTab('heatmap')}
            className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-extrabold text-sm transition-colors ${
              activeTab === 'heatmap'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Target className="h-4 w-4 text-red-500" />
            <span>Regional Heatmap</span>
          </button>
        </nav>
      </div>


      {/* TAB 1: FRAUD DETECTED MESSAGES LOG */}
      {activeTab === 'messages' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden space-y-4">
          
          {/* Filters Bar */}
          <div className="p-6 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
                Detected Fraud Messages & Signals
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Click any message row to inspect rule explainability or report scam</p>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search message text..."
                  className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 w-48 sm:w-64 text-gray-900 dark:text-white"
                />
              </div>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="py-2 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-brand-500"
              >
                <option value="All">Risk: All Tiers</option>
                <option value="High">High Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="Low">Low Risk</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-brand-500"
              >
                <option value="All">Status: All</option>
                <option value="Reported">Reported</option>
                <option value="Analyzed">Analyzed</option>
                <option value="Safe">Safe</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-gray-800/50 text-[11px] uppercase tracking-wider text-gray-400 font-extrabold border-b border-gray-100 dark:border-gray-800">
                  <th className="py-3 px-6">Date & Time</th>
                  <th className="py-3 px-6">Message Preview</th>
                  <th className="py-3 px-6">Risk Score</th>
                  <th className="py-3 px-6">Language</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                {filteredDetections.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                      No detections found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredDetections.map((item) => (
                    <tr 
                      key={item.id} 
                      onClick={() => openDetailModal(item)}
                      className="hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-6 font-mono text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>

                      <td className="py-3.5 px-6 font-medium text-gray-900 dark:text-gray-200 max-w-md truncate group-hover:text-brand-600 transition-colors">
                        "{item.message_text}"
                      </td>

                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.risk_level === 'High'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                            : item.risk_level === 'Medium'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}>
                          <span>{item.risk_level} ({item.risk_score} pts)</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-6 font-bold uppercase text-gray-500 whitespace-nowrap">
                        {item.language}
                      </td>

                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          item.status === 'Reported'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            : item.status === 'Safe'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {item.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); openDetailModal(item); }}
                          className="px-3 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-bold rounded-lg text-xs transition-colors"
                        >
                          View Detail
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); openReportModal(item); }}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 text-gray-700 dark:text-gray-300 font-bold rounded-lg text-xs transition-colors"
                        >
                          Report
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: ANALYTICS & CHARTS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Risk Tier Distribution
              </h3>
              <p className="text-xs text-gray-500">Proportional risk tier breakdown of monitored messages</p>
            </div>
            <div className="h-64 my-4">
              {stats && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.risk_distribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.risk_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(val) => [`${val} Detections`, 'Count']} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Daily Fraud Detections (7-Day Trend)
              </h3>
              <p className="text-xs text-gray-500">Total detected messages vs High Risk scams detected over time</p>
            </div>
            <div className="h-64 my-4">
              {stats && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.daily_counts} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="count" name="Total Messages" stroke="#0284c7" fillOpacity={1} fill="url(#colorCount)" />
                    <Area type="monotone" dataKey="high_risk" name="High Risk Scams" stroke="#ef4444" fillOpacity={1} fill="url(#colorHigh)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCAM PATTERNS & RULE ENGINE */}
      {activeTab === 'patterns' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <SlidersHorizontal className="h-5 w-5 text-brand-600" />
              <span>Active Rule Weights & Pattern Engine</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Transparent weighted rules used by the AI engine to score SMS and UPI messages in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-1">
              <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950 px-2 py-0.5 rounded-full">
                +25 Points
              </span>
              <h4 className="font-extrabold text-sm text-gray-900 dark:text-white mt-1">Contains OTP Keyword</h4>
              <p className="text-xs text-gray-500">Asks for one-time passwords or secret verification codes</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-1">
              <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950 px-2 py-0.5 rounded-full">
                +20 Points
              </span>
              <h4 className="font-extrabold text-sm text-gray-900 dark:text-white mt-1">Contains UPI PIN Keyword</h4>
              <p className="text-xs text-gray-500">Demands entering UPI PIN to receive money or credit</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-1">
              <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950 px-2 py-0.5 rounded-full">
                +20 Points
              </span>
              <h4 className="font-extrabold text-sm text-gray-900 dark:text-white mt-1">Urgency Language</h4>
              <p className="text-xs text-gray-500">Fake disconnection, blocking, or immediate deadline threat</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-1">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                +15 Points
              </span>
              <h4 className="font-extrabold text-sm text-gray-900 dark:text-white mt-1">Suspicious Hyperlink</h4>
              <p className="text-xs text-gray-500">Contains unverified web links or short URLs</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-1">
              <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950 px-2 py-0.5 rounded-full">
                +20 Points
              </span>
              <h4 className="font-extrabold text-sm text-gray-900 dark:text-white mt-1">Unknown UPI Handle</h4>
              <p className="text-xs text-gray-500">Personal unverified VPA address (@paytm, @okaxis, etc.)</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-1">
              <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950 px-2 py-0.5 rounded-full">
                +20 Points
              </span>
              <h4 className="font-extrabold text-sm text-gray-900 dark:text-white mt-1">KYC Expiry Threat</h4>
              <p className="text-xs text-gray-500">Claims SIM card or bank account KYC has expired</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: USER FEEDBACK & CERT-IN CHATBOT ASSISTANT */}
      {activeTab === 'feedback' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
          <div className="border-b pb-4 border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-indigo-600" />
              <span>User Feedback & CERT-In Fraud Assistant</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Ask questions about suspicious SMS/UPI messages and view community scam feedback logs.
            </p>
          </div>

          {/* Official CERT-In Contact Strip */}
          <div className="p-4 bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-sm font-extrabold text-white flex items-center justify-center md:justify-start space-x-2">
                <PhoneCall className="h-4 w-4 text-yellow-300" />
                <span>India CERT-In National Cyber Incident Response</span>
              </h4>
              <p className="text-xs text-slate-300">
                Toll-Free: <code className="text-yellow-300 font-bold">1800-11-4949</code> | Direct: <code className="text-yellow-300 font-bold">011-2290-2657</code> | Email: <code className="text-yellow-300 font-bold">incident@cert-in.org.in</code>
              </p>
            </div>
            <a
              href="tel:1800114949"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs shadow flex items-center space-x-1.5 transition-transform transform active:scale-95"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Call Toll-Free 1800-11-4949</span>
            </a>
          </div>

          {/* In-App Chatbot Assistant Query Widget */}
          <div className="p-6 bg-slate-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
            <h4 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-brand-600" />
              <span>FraudShield AI Helpline Chatbot Assistant</span>
            </h4>
            <p className="text-xs text-gray-500">
              Type any question or paste a suspicious SMS below for instant plain-language advice:
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., Someone sent me an SMS asking for my UPI PIN to claim ₹2,500..."
                className="flex-1 p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                id="chatbot-query-input"
              />
              <button
                onClick={async () => {
                  const inputEl = document.getElementById('chatbot-query-input');
                  const ansEl = document.getElementById('chatbot-answer-box');
                  if (!inputEl || !inputEl.value.trim()) return;
                  try {
                    const res = await api.post('/chat', { query: inputEl.value });
                    if (ansEl) {
                      ansEl.innerHTML = `<strong>AI Advice:</strong> ${res.data.response_advice}<br/><br/><em class="text-xs text-gray-400">CERT-In Toll-Free Helpline: ${res.data.cert_in_helplines.toll_free}</em>`;
                      ansEl.classList.remove('hidden');
                    }
                  } catch (e) {
                    if (ansEl) ansEl.innerText = "Error connecting to chatbot server.";
                  }
                }}
                className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl text-xs shadow transition-colors"
              >
                Ask Assistant
              </button>
            </div>

            <div id="chatbot-answer-box" className="hidden p-4 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900 text-brand-900 dark:text-brand-200 rounded-xl text-xs leading-relaxed">
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: REGIONAL FRAUD HEATMAP & REGULATORS */}

      {activeTab === 'heatmap' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-gray-100 dark:border-gray-800">
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center space-x-2">
                <Target className="h-6 w-6 text-red-600" />
                <span>Regional Fraud Heatmap & Telecom Operator Telemetry</span>
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Regional scam density and category trends across Indian states (Useful for TRAI, NPCI & Telecom Operators).
              </p>
            </div>
            <span className="px-3 py-1 bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 font-extrabold text-xs rounded-full inline-block">
              Live Regional Interception Active
            </span>
          </div>

          {/* State-Wise Scam Density Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900 space-y-2">
              <div className="flex justify-between items-center text-xs font-black text-red-700 dark:text-red-300">
                <span>Tamil Nadu (TN Circle)</span>
                <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px]">HIGH DENSITY</span>
              </div>
              <p className="text-2xl font-black text-red-600">4,120 Scams</p>
              <span className="text-[11px] text-gray-600 dark:text-gray-400 font-medium block">
                Top Scam: Fake Electricity Cut & EB UPI VPA
              </span>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900 space-y-2">
              <div className="flex justify-between items-center text-xs font-black text-amber-700 dark:text-amber-300">
                <span>Maharashtra (MH)</span>
                <span className="px-2 py-0.5 bg-amber-500 text-white rounded text-[10px]">MEDIUM DENSITY</span>
              </div>
              <p className="text-2xl font-black text-amber-600">3,480 Scams</p>
              <span className="text-[11px] text-gray-600 dark:text-gray-400 font-medium block">
                Top Scam: Paytm Cashback & GPay Collect Request
              </span>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900 space-y-2">
              <div className="flex justify-between items-center text-xs font-black text-red-700 dark:text-red-300">
                <span>Uttar Pradesh (UP)</span>
                <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px]">HIGH DENSITY</span>
              </div>
              <p className="text-2xl font-black text-red-600">5,890 Scams</p>
              <span className="text-[11px] text-gray-600 dark:text-gray-400 font-medium block">
                Top Scam: SBI Bank KYC Block & SIM Card Expiry
              </span>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900 space-y-2">
              <div className="flex justify-between items-center text-xs font-black text-amber-700 dark:text-amber-300">
                <span>Karnataka (KA)</span>
                <span className="px-2 py-0.5 bg-amber-500 text-white rounded text-[10px]">MEDIUM DENSITY</span>
              </div>
              <p className="text-2xl font-black text-amber-600">2,940 Scams</p>
              <span className="text-[11px] text-gray-600 dark:text-gray-400 font-medium block">
                Top Scam: Fake Lottery Winner & KBC Scheme
              </span>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED MESSAGE EXPLANATION MODAL */}

      {isDetailModalOpen && selectedDetection && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 relative space-y-5">
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3">
              {selectedDetection.risk_level === 'High' && <AlertTriangle className="h-7 w-7 text-red-600" />}
              {selectedDetection.risk_level === 'Medium' && <AlertCircle className="h-7 w-7 text-amber-500" />}
              {selectedDetection.risk_level === 'Low' && <CheckCircle2 className="h-7 w-7 text-emerald-600" />}
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  Detection Record #{selectedDetection.id}
                </h3>
                <span className="text-xs text-gray-500">
                  {new Date(selectedDetection.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Text Preview */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs font-mono text-gray-800 dark:text-gray-200 leading-relaxed">
              <span className="font-bold block text-gray-500 mb-1">Full Message Content:</span>
              "{selectedDetection.message_text}"
            </div>

            {/* Score & Risk */}
            <div className="flex items-center justify-between p-3.5 bg-gray-100/70 dark:bg-gray-800/60 rounded-2xl text-xs font-bold">
              <span>Risk Score: <strong className="text-brand-600 text-sm">{selectedDetection.risk_score} / 100</strong></span>
              <span className={`px-3 py-1 rounded-full font-black uppercase text-xs text-white ${
                selectedDetection.risk_level === 'High' ? 'bg-red-600' :
                selectedDetection.risk_level === 'Medium' ? 'bg-amber-500' : 'bg-emerald-600'
              }`}>
                {selectedDetection.risk_level} Risk
              </span>
            </div>

            {/* Explainability Bullets */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase text-gray-400">Rule Explainability Analysis:</h4>
              <ul className="space-y-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                {selectedDetection.explanation.map((bullet, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => { setIsDetailModalOpen(false); openReportModal(selectedDetection); }}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow"
              >
                Report Scam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scam Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        detectionData={selectedDetection}
      />

    </div>
  );
}
