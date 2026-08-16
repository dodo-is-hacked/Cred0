import React from 'react';
import { ShapFactor, Language } from '../../types/types';
import { translations } from '../../i18n/translations';
import { CheckCircle2, AlertCircle, HelpCircle, Sparkles } from 'lucide-react';

interface ShapBreakdownProps {
  factors: ShapFactor[];
  language: Language;
  aiInsight?: string;
}

export const ShapBreakdown: React.FC<ShapBreakdownProps> = ({ factors = [], language, aiInsight }) => {
  const t = translations[language] || translations.en;
  
  // Safe array fallback using optional chaining / default empty array
  const safeFactors = Array.isArray(factors) ? factors : [];
  const positiveFactors = safeFactors.filter(f => f && f.impact > 0);
  const neutralOrOpportunities = safeFactors.filter(f => f && f.impact <= 0);

  return (
    <div className="space-y-6 bg-theme-surface p-6 sm:p-8 rounded-3xl border border-theme-border shadow-xs">
      
      {/* Header */}
      <div>
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-theme-accent mb-1 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t.score_breakdown_eyebrow || 'EXPLAINABLE SIGNALS'}</span>
        </div>
        <h3 className="font-sans text-xl sm:text-2xl font-bold text-theme-primary">
          {t.why_this_score}
        </h3>
        <p className="text-xs sm:text-sm text-theme-secondary mt-1 max-w-2xl leading-relaxed">
          Every point is calculated using transparent, non-discriminatory alternative indicators. No black-box algorithms or hidden variables.
        </p>
      </div>

      {/* AI Hybrid Insight if present */}
      {aiInsight && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 dark:border-blue-900/50 dark:bg-blue-950/40 space-y-1.5">
          <div className="text-xs font-extrabold uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Gemini AI Narrative Insight</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-blue-950 dark:text-blue-100 font-medium">
            {aiInsight}
          </p>
        </div>
      )}

      {/* Positive Contributing Factors */}
      {positiveFactors.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.shap_positive} ({positiveFactors.length})</span>
          </h4>
          
          <div className="grid gap-3 sm:grid-cols-2">
            {positiveFactors.map((factor, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20"
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-theme-primary truncate">
                      {factor.feature}
                    </span>
                    <span className="shrink-0 text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                      +{factor.impact} {t.points}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-theme-secondary font-medium">
                    {factor.explanation[language] || factor.explanation.en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Neutral / Missing Opportunities */}
      {neutralOrOpportunities.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            <span>{t.shap_negative} ({neutralOrOpportunities.length})</span>
          </h4>

          <div className="grid gap-3 sm:grid-cols-2">
            {neutralOrOpportunities.map((factor, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-2xl border border-theme-border bg-theme-bg/60"
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-theme-primary truncate">
                      {factor.feature}
                    </span>
                    <span className="shrink-0 text-xs font-extrabold text-theme-secondary">
                      {factor.impact} {t.points}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-theme-secondary font-medium">
                    {factor.explanation[language] || factor.explanation.en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
