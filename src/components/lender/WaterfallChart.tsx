import React from 'react';
import { ScoreResult, Language } from '../../types/types';
import { translations } from '../../i18n/translations';
import { ShieldCheck } from 'lucide-react';

interface WaterfallChartProps {
  scoreResult: ScoreResult;
  language: Language;
}

export const WaterfallChart: React.FC<WaterfallChartProps> = ({ scoreResult, language }) => {
  const t = translations[language] || translations.en;

  const waterfallItems = scoreResult.shapFactors.map(sf => ({
    label: sf.feature,
    impact: sf.impact,
    explanation: sf.explanation[language] || sf.explanation.en
  }));

  return (
    <div className="p-5 rounded-2xl border border-theme-border bg-theme-bg space-y-3">
      <div>
        <h3 className="font-serif-lora text-lg font-bold text-theme-primary flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-theme-accent" />
          {t.waterfall_title}
        </h3>
        <p className="text-xs text-theme-secondary">
          {t.waterfall_sub}
        </p>
      </div>

      <div className="space-y-2 pt-2">
        {/* Base Score Row */}
        <div className="flex items-center text-xs">
          <div className="w-44 font-semibold text-theme-secondary truncate">{t.base_score}</div>
          <div className="flex-1 h-5 bg-theme-surface rounded-md border border-theme-border flex items-center px-2">
            <span className="font-mono font-bold text-theme-primary">300 pts</span>
          </div>
        </div>

        {/* Contributing SHAP Factor Rows */}
        {waterfallItems.map((item, idx) => (
          <div key={idx} className="flex items-center text-xs">
            <div className="w-44 font-medium text-theme-primary truncate" title={item.label}>
              {item.label}
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div
                className={`h-5 rounded-md flex items-center px-2 font-mono text-[11px] font-bold text-white transition-all ${
                  item.impact > 0 ? 'bg-emerald-600' : 'bg-slate-400 dark:bg-slate-700'
                }`}
                style={{ width: `${Math.max(12, Math.min(100, Math.abs(item.impact) * 2.5))}%` }}
              >
                {item.impact > 0 ? `+${item.impact}` : `0`}
              </div>
              <span className="text-[11px] text-theme-secondary line-clamp-1">
                {item.explanation}
              </span>
            </div>
          </div>
        ))}

        {/* Final Sum Row */}
        <div className="flex items-center text-xs pt-2 border-t border-theme-border">
          <div className="w-44 font-bold text-theme-primary">{t.final_score}</div>
          <div className="flex-1 h-7 bg-theme-accent text-white rounded-md flex items-center px-3 justify-between">
            <span className="font-serif-lora font-extrabold text-sm">{scoreResult.score} Points</span>
            <span className="text-[11px] font-bold uppercase tracking-wider">{scoreResult.zone} Zone</span>
          </div>
        </div>
      </div>
    </div>
  );
};
