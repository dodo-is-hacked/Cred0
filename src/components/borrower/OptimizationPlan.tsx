import React from 'react';
import { OptimizationRecommendation, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { TrendingUp, ArrowRight, Zap, Check } from 'lucide-react';

interface OptimizationPlanProps {
  recommendations: OptimizationRecommendation[];
  language: Language;
  onApplyRecommendation: (actionKey: string) => void;
  appliedActions: string[];
}

export const OptimizationPlan: React.FC<OptimizationPlanProps> = ({
  recommendations,
  language,
  onApplyRecommendation,
  appliedActions,
}) => {
  const t = translations[language] || translations.en;

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="rounded-2xl border border-theme-border bg-theme-surface p-6 text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
          <Check className="h-6 w-6" />
        </div>
        <h3 className="font-serif-lora text-lg font-bold text-theme-primary">
          Profile Fully Optimized
        </h3>
        <p className="text-xs text-theme-secondary max-w-md mx-auto">
          Your profile contains all key Cred0 verification markers. Share your profile with active lenders in the marketplace.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-theme-border bg-theme-surface p-6">
      <div className="flex items-center justify-between border-b border-theme-border pb-4">
        <div>
          <h3 className="font-serif-lora text-xl font-bold text-theme-primary flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-theme-accent" />
            {t.opt_title}
          </h3>
          <p className="text-xs text-theme-secondary mt-0.5">
            {t.opt_subtitle}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {recommendations.map((rec) => {
          const isApplied = appliedActions.includes(rec.applyActionKey);

          return (
            <div
              key={rec.id}
              className={`flex flex-col justify-between p-4 rounded-xl border transition-all ${
                isApplied
                  ? 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/30'
                  : 'border-theme-border bg-theme-bg hover:border-theme-accent'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-theme-primary leading-snug">
                    {rec.title[language] || rec.title.en}
                  </h4>
                  <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-theme-accent text-white">
                    <Zap className="w-3 h-3 text-amber-300" />
                    +{rec.pointsToGain} {t.points}
                  </span>
                </div>

                <p className="text-xs text-theme-secondary leading-relaxed">
                  {rec.description[language] || rec.description.en}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-theme-border">
                <button
                  disabled={isApplied}
                  onClick={() => onApplyRecommendation(rec.applyActionKey)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold transition-all ${
                    isApplied
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-theme-accent text-white hover:opacity-90 shadow-xs active:scale-98'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Applied to Score
                    </>
                  ) : (
                    <>
                      <span>Simulate Action (+{rec.pointsToGain} pts)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
