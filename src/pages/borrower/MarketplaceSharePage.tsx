import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useBorrowerFormContext } from '../../context/BorrowerFormContext';
import { StepTracker } from '../../components/borrower/StepTracker';
import { translations } from '../../i18n/translations';
import { formatIndianCurrency } from '../../utils/formatters';
import { Share2, CheckCircle2, UserCheck, Check } from 'lucide-react';

export const MarketplaceSharePage: React.FC = () => {
  const { language, currentBorrower } = useAppContext();
  const {
    isBroadcasting,
    broadcastDone,
    handleBroadcastToLenders,
    activeOffers,
    handleAcceptOffer
  } = useBorrowerFormContext();

  const t = translations[language] || translations.en;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
      <StepTracker currentStep={8} />

      <div className="space-y-6 rounded-2xl border border-theme-border bg-theme-surface p-6 shadow-xs">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-theme-soft text-theme-accent">
            <Share2 className="h-6 w-6" />
          </div>
          <h2 className="font-serif-lora text-2xl font-bold text-theme-primary">
            {t.market_title}
          </h2>
          <p className="text-xs text-theme-secondary leading-relaxed">
            {t.market_subtitle}
          </p>
        </div>

        {/* Broadcast Action Box */}
        <div className="rounded-2xl border border-theme-border bg-theme-bg p-6 text-center space-y-4">
          {broadcastDone ? (
            <div className="space-y-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-2xs">
                <CheckCircle2 className="w-4 h-4" />
                {t.shared_success}
              </div>
              <p className="text-sm font-semibold text-theme-primary leading-relaxed">
                Your application has been broadcast to all registered lenders.
              </p>
              <p className="text-xs text-theme-secondary">
                Lenders in the Cred0 Marketplace can now review your explainable Cred0 score and issue loan offers. You can track sanction status below or switch views anytime using the top navigation bar.
              </p>
            </div>
          ) : (
            <button
              onClick={handleBroadcastToLenders}
              disabled={isBroadcasting}
              className="w-full max-w-sm mx-auto rounded-xl bg-theme-accent py-4 text-sm font-bold text-white shadow-md hover:opacity-90 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              {isBroadcasting ? (
                <span>Broadcasting Application...</span>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Send Request to Lenders</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Active Loan Offers Section */}
        <div className="space-y-3 pt-4 border-t border-theme-border">
          <h3 className="font-serif-lora text-lg font-bold text-theme-primary flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-theme-accent" />
            {t.offers_title}
          </h3>

          {activeOffers.length === 0 ? (
            <div className="p-4 rounded-xl border border-theme-border bg-theme-bg text-center text-xs text-theme-secondary">
              {t.no_offers}
            </div>
          ) : (
            <div className="space-y-3">
              {activeOffers.map((off) => (
                <div
                  key={off.id}
                  className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/30"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-theme-primary flex items-center gap-2">
                      <span>{off.lenderName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-600 text-white font-extrabold uppercase">
                        Sanctioned
                      </span>
                    </div>
                    <p className="text-xs text-theme-secondary">
                      Sanctioned Amount: <span className="font-bold text-theme-primary">{formatIndianCurrency(off.amount)}</span> @ {off.interestRatePct}% p.a. for {off.tenureMonths} Months
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
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
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
      </div>
    </div>
  );
};
