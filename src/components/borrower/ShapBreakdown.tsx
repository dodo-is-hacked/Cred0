import React from 'react';
import { ShapFactor, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

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
    <div className="space-y-6 bg-theme-surface p-6 rounded-2xl border border-theme-border">
      
      {/* Header */}
      <div>
        <h3 className="font-serif-lora text-xl font-bold text-theme-primary flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-theme-accent" />
          {t.why_this_score}
        </h3>
        <p className="text-xs text-theme-secondary mt-1">
          Every point is calculated using transparent, non-discriminatory alternative indicators. No black-box algorithms.
        </p>
      </div>

      {/* AI Hybrid Insight if present */}
      {aiInsight && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 dark:border-blue-900/50 dark:bg-blue-950/40">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-1.5">
            <span>✨ Gemini AI Narrative Insight</span>
          </div>
          <p className="text-sm leading-relaxed text-blue-900 dark:text-blue-200">
            {aiInsight}
          </p>
        </div>
      )}

      {/* Positive Contributing Factors */}
      {positiveFactors.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4.5 h-4.5" />
            {t.shap_positive} ({positiveFactors.length})
          </h4>
          
          <div className="space-y-2.5">
            {positiveFactors.map((factor, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20"
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-theme-primary">
                    {factor.feature}
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
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
            <AlertCircle className="w-4.5 h-4.5" />
            {t.shap_negative} ({neutralOrOpportunities.length})
          </h4>

          <div className="space-y-2.5">
            {neutralOrOpportunities.map((factor, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl border border-theme-border bg-theme-bg"
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-theme-primary">
                    {factor.feature}
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
