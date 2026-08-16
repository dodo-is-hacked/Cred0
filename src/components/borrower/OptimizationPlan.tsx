import React from 'react';
import { OptimizationRecommendation, Language } from '../../types/types';
import { translations } from '../../i18n/translations';
import { TrendingUp, ArrowRight, Zap, Check, Sparkles } from 'lucide-react';

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
      <div className="rounded-3xl border border-theme-border bg-theme-surface p-8 text-center space-y-3 shadow-xs">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          <Check className="h-6 w-6" />
        </div>
        <h3 className="font-sans text-lg font-bold text-theme-primary">
          {t.profile_optimized_title}
        </h3>
        <p className="text-xs sm:text-sm text-theme-secondary max-w-md mx-auto leading-relaxed">
          {t.profile_optimized_desc}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-sans text-base font-bold text-theme-primary flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-theme-accent" />
            <span>Interactive Score Boost Actions</span>
          </h4>
          <p className="text-xs text-theme-secondary mt-0.5">
            {t.opt_subtitle}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {recommendations.map((rec) => {
          const isApplied = appliedActions.includes(rec.applyActionKey);

          return (
            <div
              key={rec.id}
              className={`flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 ${
                isApplied
                  ? 'border-emerald-300/80 bg-emerald-50/40 dark:border-emerald-800/60 dark:bg-emerald-950/20'
                  : 'border-theme-border bg-theme-surface hover:border-theme-accent shadow-xs'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <h5 className="text-sm font-bold text-theme-primary leading-snug">
                    {rec.title[language] || rec.title.en}
                  </h5>
                  <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-theme-soft text-theme-accent border border-theme-border">
                    <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                    +{rec.pointsToGain} {t.points}
                  </span>
                </div>

                <p className="text-xs text-theme-secondary leading-relaxed">
                  {rec.description[language] || rec.description.en}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-theme-border">
                <button
                  type="button"
                  disabled={isApplied}
                  onClick={() => onApplyRecommendation(rec.applyActionKey)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all ${
                    isApplied
                      ? 'bg-emerald-600 text-white cursor-default shadow-xs'
                      : 'bg-theme-accent text-white hover:opacity-90 shadow-xs active:scale-98'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t.status_applied} to Score</span>
                    </>
                  ) : (
                    <>
                      <span>{t.simulate_action} (+{rec.pointsToGain} {t.points})</span>
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
