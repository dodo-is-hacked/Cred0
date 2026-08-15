import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useBorrowerFormContext } from '../../context/BorrowerFormContext';
import { ScoreGauge } from '../../components/borrower/ScoreGauge';
import { ShapBreakdown } from '../../components/borrower/ShapBreakdown';
import { OptimizationPlan } from '../../components/borrower/OptimizationPlan';
import { translations } from '../../i18n/translations';
import { formatIndianCurrency } from '../../utils/formatters';
import { UserCheck, Check, Send, Sparkles, RefreshCw, Layers } from 'lucide-react';

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

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-6 sm:px-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-theme-border bg-theme-surface p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-theme-accent uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            Borrower Credit Dashboard
          </div>
          <h1 className="font-serif-lora text-2xl font-bold text-theme-primary">
            Welcome, {currentBorrower?.name || 'Borrower'}
          </h1>
          <p className="text-xs text-theme-secondary mt-1">
            View your real-time Cred0 score, score improvement plan, and active lender loan sanctions.
          </p>
        </div>

        <button
          onClick={() => navigate('/borrower/basic')}
          className="inline-flex items-center gap-1.5 rounded-xl border border-theme-border bg-theme-bg px-3.5 py-2 text-xs font-bold text-theme-secondary hover:text-theme-primary transition-all self-start sm:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Update Data</span>
        </button>
      </div>

      {/* 1. Score Section */}
      {scoreResult && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-theme-accent" />
            <h2 className="font-serif-lora text-xl font-bold text-theme-primary">
              Credit Score & Analysis
            </h2>
          </div>

          <ScoreGauge scoreResult={scoreResult} language={language} />

          <ShapBreakdown
            factors={scoreResult.shapFactors}
            language={language}
            aiInsight={scoreResult.aiInsight}
          />
        </section>
      )}

      {/* 2. Optimization Section */}
      {scoreResult && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-theme-accent" />
            <h2 className="font-serif-lora text-xl font-bold text-theme-primary">
              Score Improvement Plan
            </h2>
          </div>

          <OptimizationPlan
            recommendations={scoreResult.recommendations}
            language={language}
            onApplyRecommendation={handleApplyRecommendation}
            appliedActions={appliedActions}
          />
        </section>
      )}

      {/* 3. Loan Status & Offers Section */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-lora text-xl font-bold text-theme-primary flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-theme-accent" />
            Loan Sanctions & Marketplace Status
          </h2>
          {isShared && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
              <Check className="w-3.5 h-3.5" />
              Broadcasting to Lenders
            </span>
          )}
        </div>

        {!isShared ? (
          /* Borrower skipped request in Step 5: Show prompt to send request */
          <div className="rounded-2xl border border-theme-border bg-theme-surface p-6 text-center space-y-4 shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-theme-soft text-theme-accent">
              <Send className="h-6 w-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-serif-lora text-lg font-bold text-theme-primary">
                Ready to request credit from lenders?
              </h3>
              <p className="text-xs text-theme-secondary leading-relaxed">
                You skipped broadcasting your loan request during onboarding. You can send a request to lenders anytime to receive competitive micro-credit offers.
              </p>
            </div>

            <Link
              to="/borrower/document"
              className="inline-flex items-center gap-2 rounded-xl bg-theme-accent px-6 py-3 text-xs font-bold text-white shadow-md hover:opacity-90 active:scale-98 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Request to Lenders (Step 5)</span>
            </Link>
          </div>
        ) : (
          /* Offers list or pending state */
          <div className="rounded-2xl border border-theme-border bg-theme-surface p-6 shadow-xs space-y-4">
            {currentBorrower?.requestedLoanAmount && (
              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-theme-bg border border-theme-border">
                <span className="text-theme-secondary font-medium">Requested Credit Amount:</span>
                <span className="font-bold text-theme-primary text-sm">
                  {formatIndianCurrency(currentBorrower.requestedLoanAmount)}
                </span>
              </div>
            )}

            {activeOffers.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-theme-border bg-theme-bg text-center space-y-2">
                <p className="text-xs font-bold text-theme-primary">{t.no_offers}</p>
                <p className="text-[11px] text-theme-secondary max-w-sm mx-auto">
                  Your profile and Cred0 score are live in the lender marketplace. Lenders will evaluate your application and issue loan offers shortly.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeOffers.map((off) => (
                  <div
                    key={off.id}
                    className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/30 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-theme-primary flex items-center gap-2">
                        <span>{off.lenderName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-600 text-white font-extrabold uppercase">
                          Sanctioned
                        </span>
                      </div>
                      <p className="text-xs text-theme-secondary">
                        Sanctioned Amount:{' '}
                        <span className="font-bold text-theme-primary">
                          {formatIndianCurrency(off.amount)}
                        </span>{' '}
                        @ {off.interestRatePct}% p.a. for {off.tenureMonths} Months
                      </p>
                      {off.monthlyEmi && (
                        <p className="text-xs font-mono font-semibold text-theme-accent">
                          Estimated Monthly EMI: {formatIndianCurrency(off.monthlyEmi)}
                        </p>
                      )}
                    </div>

                    <div>
                      {off.status === 'accepted' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold">
                          <Check className="w-4 h-4" />
                          Offer Accepted
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAcceptOffer(`app_${currentBorrower?.id}`)}
                          className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs active:scale-98 transition-all"
                        >
                          {t.accept_offer}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
