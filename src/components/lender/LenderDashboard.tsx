import React, { useState } from 'react';
import { LoanApplication, Language, LenderProfile } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Building2,
  Search,
  Filter,
  ShieldCheck,
  MapPin,
  ChevronRight,
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  IndianRupee,
  Calendar,
  Percent,
  FileCheck
} from 'lucide-react';

interface LenderDashboardProps {
  applications: LoanApplication[];
  language: Language;
  onAuditApplication: (app: LoanApplication) => void;
  lenders: LenderProfile[];
  initialTab?: 'pending' | 'approved';
}

export const LenderDashboard: React.FC<LenderDashboardProps> = ({
  applications,
  language,
  onAuditApplication,
  initialTab = 'pending',
}) => {
  const t = translations[language] || translations.en;

  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [occFilter, setOccFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score_desc' | 'score_asc' | 'newest'>('score_desc');

  // Currency Formatter
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Classify Pending vs Approved Applications
  const pendingApps = applications.filter((app) => app.status === 'pending' && !app.offer);
  const approvedApps = applications.filter((app) => app.status === 'approved' || !!app.offer);

  const currentTabApps = activeTab === 'pending' ? pendingApps : approvedApps;

  // Filter & Sort Logic for currently active tab
  const filteredApps = currentTabApps.filter((app) => {
    const nameMatch = app.borrowerProfile.name.toLowerCase().includes(searchQuery.toLowerCase());
    const locMatch = app.borrowerProfile.location.toLowerCase().includes(searchQuery.toLowerCase());
    const queryMatches = searchQuery === '' || nameMatch || locMatch;

    const zoneMatches = zoneFilter === 'all' || app.scoreResult.zone === zoneFilter;
    const occMatches = occFilter === 'all' || app.borrowerProfile.occupation === occFilter;

    return queryMatches && zoneMatches && occMatches;
  }).sort((a, b) => {
    if (sortBy === 'score_desc') return b.scoreResult.score - a.scoreResult.score;
    if (sortBy === 'score_asc') return a.scoreResult.score - b.scoreResult.score;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-theme-border bg-theme-surface p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-theme-accent text-white shadow-sm">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-serif-lora text-2xl sm:text-3xl font-bold text-theme-primary">
              {t.lender_dash_title}
            </h1>
            <p className="text-xs sm:text-sm text-theme-secondary mt-0.5">
              {t.lender_dash_sub}
            </p>
          </div>
        </div>

        {/* Tab Badges summary */}
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-theme-border bg-theme-bg p-2 flex gap-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'pending'
                  ? 'bg-theme-accent text-white shadow-xs'
                  : 'text-theme-secondary hover:text-theme-primary'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Pending Applications</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === 'pending' ? 'bg-white/20 text-white' : 'bg-theme-soft text-theme-accent'
              }`}>
                {pendingApps.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('approved')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'approved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-theme-secondary hover:text-theme-primary'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approved Recipients</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === 'approved' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                {approvedApps.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="border-b border-theme-border flex gap-6 px-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'border-theme-accent text-theme-accent'
              : 'border-transparent text-theme-secondary hover:text-theme-primary'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pending Borrower Applications ({pendingApps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'approved'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-theme-secondary hover:text-theme-primary'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Approved Recipients ({approvedApps.length})</span>
        </button>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-theme-border bg-theme-surface p-4">
        
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-3 h-4 w-4 text-theme-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search_placeholder}
            className="w-full h-10 rounded-xl border border-theme-border bg-theme-bg pl-9 pr-3 text-xs font-medium text-theme-primary focus:border-theme-accent focus:outline-none"
          />
        </div>

        {/* Filter Zone */}
        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-theme-secondary" />
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="h-10 rounded-xl border border-theme-border bg-theme-bg px-3 text-xs font-bold text-theme-primary focus:outline-none"
          >
            <option value="all">{t.filter_zone}: {t.filter_all}</option>
            <option value="Trusted">Trusted (800+)</option>
            <option value="Good">Good (650-799)</option>
            <option value="Fair">Fair (500-649)</option>
            <option value="Building">Building (300-499)</option>
          </select>
        </div>

        {/* Filter Occupation */}
        <div>
          <select
            value={occFilter}
            onChange={(e) => setOccFilter(e.target.value)}
            className="h-10 rounded-xl border border-theme-border bg-theme-bg px-3 text-xs font-bold text-theme-primary focus:outline-none"
          >
            <option value="all">{t.filter_occ}: {t.filter_all}</option>
            <option value="street_vendor">{t.occ_street_vendor}</option>
            <option value="gig_worker">{t.occ_gig_worker}</option>
            <option value="small_farmer">{t.occ_small_farmer}</option>
            <option value="self_employed">{t.occ_self_employed}</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-10 rounded-xl border border-theme-border bg-theme-bg px-3 text-xs font-bold text-theme-primary focus:outline-none"
          >
            <option value="score_desc">Sort: Score (High to Low)</option>
            <option value="score_asc">Sort: Score (Low to High)</option>
            <option value="newest">Sort: Newest First</option>
          </select>
        </div>

      </div>

      {/* Applications Feed Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredApps.map((app) => {
          const b = app.borrowerProfile;
          const s = app.scoreResult;
          const isApproved = activeTab === 'approved' || !!app.offer || app.status === 'approved';

          return (
            <div
              key={app.id}
              className={`flex flex-col justify-between rounded-2xl border bg-theme-surface p-5 transition-all shadow-xs group ${
                isApproved
                  ? 'border-emerald-500/30 hover:border-emerald-500/60'
                  : 'border-theme-border hover:border-theme-accent'
              }`}
            >
              <div className="space-y-4">
                
                {/* Header Row: Borrower Name, Location & Zone Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif-lora text-lg font-bold text-theme-primary group-hover:text-theme-accent">
                      {b.name}
                    </h3>
                    <p className="text-xs text-theme-secondary flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-theme-accent" />
                      <span>{b.location}</span>
                    </p>
                  </div>

                  <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-extrabold border ${
                    isApproved
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-theme-soft text-theme-accent border-theme-border'
                  }`}>
                    {s.zone}
                  </span>
                </div>

                {/* Trust Score & Risk Tier Row */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-theme-bg border border-theme-border">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-theme-secondary block">
                      {t.borrower_card_score}
                    </span>
                    <span className="font-serif-lora text-2xl font-extrabold text-theme-primary">
                      {s.score}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-theme-secondary block">
                      {t.borrower_card_risk}
                    </span>
                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-md text-[11px] font-extrabold ${
                      s.riskCategory === 'Low'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : s.riskCategory === 'Moderate'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                    }`}>
                      {s.riskCategory} ({s.defaultRiskPercent}%)
                    </span>
                  </div>
                </div>

                {/* Key Attributes Tags */}
                <div className="space-y-1.5 text-xs text-theme-secondary">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-theme-accent" />
                    <span className="capitalize text-theme-primary font-medium">
                      {b.occupation.replace('_', ' ')} · Age {b.age}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-theme-accent" />
                    <span>
                      {b.communityTie.active
                        ? `Active ${b.communityTie.groupType?.toUpperCase() || 'SHG'} Group Member`
                        : 'No Group Tie'}
                    </span>
                  </div>

                  {b.documentVerified && (
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Document Verified</span>
                    </div>
                  )}
                </div>

                {/* Approved Recipient Loan Sanction Details (Tab 2) */}
                {isApproved && app.offer && (
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5" />
                        Sanctioned Loan Offer
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-600 text-white uppercase">
                        {app.offer.status || 'Sanctioned'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div>
                        <span className="text-[10px] text-theme-secondary flex items-center gap-1">
                          <IndianRupee className="w-3 h-3 text-emerald-600" /> Sanction Amount
                        </span>
                        <span className="font-extrabold text-theme-primary text-sm">
                          {formatINR(app.offer.amount)}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-theme-secondary flex items-center gap-1">
                          <Percent className="w-3 h-3 text-emerald-600" /> Interest Rate
                        </span>
                        <span className="font-extrabold text-theme-primary text-sm">
                          {app.offer.interestRatePct}% p.a.
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-theme-secondary flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-emerald-600" /> Tenure
                        </span>
                        <span className="font-bold text-theme-primary">
                          {app.offer.tenureMonths} Months
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-theme-secondary">Est. Monthly EMI</span>
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                          {app.offer.monthlyEmi ? formatINR(app.offer.monthlyEmi) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-theme-border">
                <button
                  onClick={() => onAuditApplication(app)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold shadow-xs hover:opacity-90 active:scale-98 ${
                    isApproved
                      ? 'bg-emerald-600 text-white'
                      : 'bg-theme-accent text-white'
                  }`}
                >
                  <span>{isApproved ? 'View Sanction & Audit Report' : t.audit_cta}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredApps.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-theme-border bg-theme-surface">
          <p className="text-sm font-bold text-theme-primary">
            No {activeTab === 'pending' ? 'pending borrower applications' : 'approved recipients'} found.
          </p>
          <p className="text-xs text-theme-secondary mt-1">
            {activeTab === 'pending'
              ? 'When borrowers broadcast their profile from Step 8, they will appear here.'
              : 'Underwrite and sanction loan offers to move applicants into this approved list.'}
          </p>
        </div>
      )}

    </div>
  );
};
