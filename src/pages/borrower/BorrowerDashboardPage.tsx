import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useBorrowerFormContext } from '../../context/BorrowerFormContext';
import { ScoreGauge } from '../../components/borrower/ScoreGauge';
import { ShapBreakdown } from '../../components/borrower/ShapBreakdown';
import { OptimizationPlan } from '../../components/borrower/OptimizationPlan';
import { translations } from '../../i18n/translations';
import { formatIndianCurrency } from '../../utils/formatters';
import {
  UserCheck,
  Check,
  Send,
  Sparkles,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  FileCheck,
  Landmark,
  Layers,
  Award,
  ArrowRight
} from 'lucide-react';

export const BorrowerDashboardPage: React.FC = () => {
  const { language, scoreResult, currentBorrower } = useAppContext();
  const {
    activeOffers,
    handleAcceptOffer,
    handleApplyRecommendation,
    appliedActions,
    broadcastDone
  } = useBorrowerFormContext();

  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  const isShared = broadcastDone || currentBorrower?.sharedWithMarketplace;

  // Format occupation name
  const formatOccupation = (occ?: string) => {
    if (!occ) return 'Informal Micro-Merchant';
    switch (occ) {
      case 'street_vendor':
        return t.occ_street_vendor || 'Street Vendor / Market Trader';
      case 'gig_worker':
        return t.occ_gig_worker || 'Gig Delivery Rider / Driver';
      case 'small_farmer':
        return t.occ_small_farmer || 'Small / Marginal Farmer';
      case 'self_employed':
        return t.occ_self_employed || 'Self-Employed / Artisan';
      default:
        return occ.replace('_', ' ');
    }
  };

  // Derive dynamic signal strength bars based on actual borrower attributes & score factors
  const getSignalMetrics = () => {
    const hasUpi = (currentBorrower?.upiTransactionCount || 0) > 0;
    const upiCount = currentBorrower?.upiTransactionCount || 0;
    const assetsCount = currentBorrower?.assets?.length || 0;
    const isCommunity = currentBorrower?.communityTie?.active;
    const isDoc = currentBorrower?.documentVerified;

    const cashFlowScore = hasUpi ? Math.min(98, 70 + upiCount * 3) : 68;
    const assetScore = Math.min(95, 60 + assetsCount * 12);
    const educationScore = isDoc ? 92 : (currentBorrower?.education === 'graduate' ? 86 : 74);
    const socialScore = isCommunity ? 94 : 65;

    return [
      { label: 'Cash Flow & Income Regularity', score: cashFlowScore },
      { label: 'Operational Assets Stability', score: assetScore },
      { label: 'Identity & Document Verification', score: educationScore },
      { label: 'Social & Community Accountability', score: socialScore },
    ];
  };

  const signalMetrics = getSignalMetrics();

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
      
      {/* ─────────────────────────────────────────────────────────────
          SECTION A: HERO SPLIT LAYOUT (Matches Reference Top Pattern)
          ───────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
        
        {/* Left Column: Bold Headline & Contextual Narrative */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase bg-theme-soft text-theme-accent border border-theme-border">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.dashboard_eyebrow}</span>
          </div>

          <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-theme-primary leading-[1.15]">
            {t.dashboard_title_welcome}{' '}
            <span className="text-theme-accent">{currentBorrower?.name || 'Borrower'}</span>
          </h1>

          <p className="text-sm sm:text-base text-theme-secondary leading-relaxed max-w-xl font-medium">
            {t.dashboard_hero_subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => navigate('/borrower/basic')}
              className="inline-flex items-center gap-2 rounded-xl border border-theme-border bg-theme-surface px-4 py-2.5 text-xs font-bold text-theme-primary shadow-xs hover:border-theme-accent hover:text-theme-accent transition-all active:scale-98"
            >
              <RefreshCw className="w-3.5 h-3.5 text-theme-accent" />
              <span>{t.update_profile_data}</span>
            </button>

            {isShared ? (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <Check className="w-3.5 h-3.5" />
                <span>{t.broadcasting_pill}</span>
              </div>
            ) : (
              <Link
                to="/borrower/document"
                className="inline-flex items-center gap-2 rounded-xl bg-theme-accent px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-90 active:scale-98 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.send_request_btn}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Right Column: Untouched ScoreGauge Component */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-md">
            {scoreResult && (
              <ScoreGauge scoreResult={scoreResult} language={language} />
            )}
          </div>
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION B: "WHY THIS SCORE" EXPLAINABILITY (ShapBreakdown)
          ───────────────────────────────────────────────────────────── */}
      {scoreResult && (
        <section className="space-y-4">
          <ShapBreakdown
            factors={scoreResult.shapFactors}
            language={language}
            aiInsight={scoreResult.aiInsight}
          />
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION C: SCORE OPTIMIZATION (Repurposed 2-Column Pattern)
          ───────────────────────────────────────────────────────────── */}
      {scoreResult && (
        <section className="space-y-6">
          
          {/* Section Heading with Eyebrow */}
          <div className="text-center sm:text-left space-y-1">
            <div className="text-xs font-extrabold uppercase tracking-widest text-theme-accent">
              {t.opt_eyebrow}
            </div>
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-theme-primary tracking-tight">
              {t.opt_heading}
            </h2>
            <p className="text-xs sm:text-sm text-theme-secondary max-w-2xl">
              {t.opt_subheading}
            </p>
          </div>

          {/* Two-Column Master Card (Matching Reference Layout) */}
          <div className="rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Borrower Profile Header + Active Verifications */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Compact Borrower Profile Tile */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-theme-bg border border-theme-border">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-theme-accent text-white font-extrabold text-lg shadow-sm">
                    {(currentBorrower?.name || 'B').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-theme-primary truncate">
                      {currentBorrower?.name || 'Informal Borrower'}
                    </h3>
                    <p className="text-xs text-theme-secondary font-medium truncate">
                      {formatOccupation(currentBorrower?.occupation)} · Age {currentBorrower?.age || 30}
                    </p>
                  </div>
                </div>

                {/* Stacked Recommendation Status Rows */}
                <div className="space-y-3">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-theme-secondary">
                    {t.active_verifications}
                  </div>

                  <div className="space-y-2.5">
                    {scoreResult.recommendations.map((rec) => {
                      const isApplied = appliedActions.includes(rec.applyActionKey);

                      return (
                        <div
                          key={rec.id}
                          className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-theme-border bg-theme-bg/60 hover:bg-theme-bg transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-theme-primary truncate">
                              {rec.title[language] || rec.title.en}
                            </div>
                            <div className="text-[11px] text-theme-secondary font-medium">
                              +{rec.pointsToGain} {t.points} score potential
                            </div>
                          </div>

                          <span
                            className={`shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold border ${
                              isApplied
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800'
                                : 'bg-theme-surface border-theme-border text-theme-secondary'
                            }`}
                          >
                            {isApplied ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                <span>{t.status_applied}</span>
                              </>
                            ) : (
                              <span>{t.status_available}</span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: Labeled Progress Bars */}
              <div className="lg:col-span-6 space-y-6 lg:border-l lg:border-theme-border lg:pl-8 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-theme-secondary mb-4">
                    {t.credit_signals_title}
                  </div>

                  <div className="space-y-4">
                    {signalMetrics.map((metric, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-theme-primary">{metric.label}</span>
                          <span className="text-theme-accent font-mono">{metric.score}/100</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-theme-bg overflow-hidden border border-theme-border">
                          <div
                            className="h-full bg-theme-accent rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${metric.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Positive Cred0 validation callout */}
                <div className="p-4 rounded-2xl bg-theme-soft/50 border border-theme-border flex items-center gap-3">
                  <Award className="w-5 h-5 text-theme-accent shrink-0" />
                  <p className="text-xs text-theme-secondary font-medium leading-relaxed">
                    Higher verification consistency translates directly into higher loan approval ceilings and preferential interest rates from registered lenders.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Interactive Simulation Cards */}
          <OptimizationPlan
            recommendations={scoreResult.recommendations}
            language={language}
            onApplyRecommendation={handleApplyRecommendation}
            appliedActions={appliedActions}
          />

        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION D: LENDER OFFER ACCEPTANCE & MARKETPLACE
          ───────────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-theme-accent">
              {t.marketplace_eyebrow}
            </div>
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-theme-primary tracking-tight flex items-center gap-2.5">
              <Landmark className="w-6 h-6 text-theme-accent" />
              <span>{t.marketplace_title}</span>
            </h2>
          </div>

          {isShared && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 self-start sm:self-center">
              <Check className="w-3.5 h-3.5" />
              <span>{t.broadcasting_pill}</span>
            </span>
          )}
        </div>

        {!isShared ? (
          /* Borrower skipped broadcast in Step 5: Clean prompt card */
          <div className="rounded-3xl border border-theme-border bg-theme-surface p-8 sm:p-10 text-center space-y-5 shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-theme-soft text-theme-accent">
              <Send className="h-7 w-7" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h3 className="font-sans text-xl font-bold text-theme-primary">
                {t.ready_to_request}
              </h3>
              <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed font-medium">
                {t.ready_to_request_desc}
              </p>
            </div>

            <div>
              <Link
                to="/borrower/document"
                className="inline-flex items-center gap-2 rounded-2xl bg-theme-accent px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:opacity-90 active:scale-98 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{t.send_request_btn}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Active Marketplace Offers State */
          <div className="rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Requested Credit Summary Bar */}
            {currentBorrower?.requestedLoanAmount && (
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-theme-bg border border-theme-border">
                <span className="text-xs font-bold text-theme-secondary">
                  {t.requested_credit_amount}:
                </span>
                <span className="font-sans text-base sm:text-lg font-extrabold text-theme-primary">
                  {formatIndianCurrency(currentBorrower.requestedLoanAmount)}
                </span>
              </div>
            )}

            {activeOffers.length === 0 ? (
              /* Waiting for lenders empty state */
              <div className="p-8 rounded-2xl border border-dashed border-theme-border bg-theme-bg text-center space-y-2">
                <p className="text-sm font-bold text-theme-primary">{t.no_offers}</p>
                <p className="text-xs text-theme-secondary max-w-md mx-auto leading-relaxed">
                  {t.market_live_desc}
                </p>
              </div>
            ) : (
              /* Offers List - Clean row cards matching the design system */
              <div className="space-y-4">
                {activeOffers.map((off) => {
                  const isAccepted = off.status === 'accepted';

                  return (
                    <div
                      key={off.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-5 sm:p-6 rounded-2xl border transition-all ${
                        isAccepted
                          ? 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/30 shadow-xs'
                          : 'border-theme-border bg-theme-surface hover:border-theme-accent shadow-xs'
                      }`}
                    >
                      {/* Left: Lender details & loan metrics */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <span className="font-sans text-base font-bold text-theme-primary">
                            {off.lenderName}
                          </span>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-extrabold uppercase">
                            {t.sanctioned_pill}
                          </span>
                        </div>

                        <div className="text-xs text-theme-secondary font-medium">
                          Sanctioned Amount:{' '}
                          <span className="font-bold text-theme-primary">
                            {formatIndianCurrency(off.amount)}
                          </span>{' '}
                          @ <span className="font-bold text-theme-primary">{off.interestRatePct}% p.a.</span> for{' '}
                          <span className="font-bold text-theme-primary">{off.tenureMonths} Months</span>
                        </div>

                        {off.monthlyEmi && (
                          <div className="text-xs font-mono font-semibold text-theme-accent flex items-center gap-1.5">
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>
                              {t.est_monthly_emi}: {formatIndianCurrency(off.monthlyEmi)} / month
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Right: Accept Button / Confirmed Badge */}
                      <div className="shrink-0">
                        {isAccepted ? (
                          <div className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs">
                            <Check className="w-4 h-4" />
                            <span>{t.offer_accepted_badge}</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAcceptOffer(`app_${currentBorrower?.id}`)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-xs font-bold text-white shadow-xs active:scale-98 transition-all"
                          >
                            <Check className="w-4 h-4" />
                            <span>{t.accept_offer}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </section>

    </div>
  );
};
