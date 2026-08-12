import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useBorrowerFormContext } from '../../context/BorrowerFormContext';
import { StepTracker } from '../../components/borrower/StepTracker';
import { OptimizationPlan } from '../../components/borrower/OptimizationPlan';
import { translations } from '../../i18n/translations';
import { ArrowRight } from 'lucide-react';

export const OptimizationPage: React.FC = () => {
  const { language, scoreResult } = useAppContext();
  const { handleApplyRecommendation, appliedActions } = useBorrowerFormContext();

  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
      <StepTracker currentStep={7} />

      {scoreResult && (
        <div className="space-y-6">
          <OptimizationPlan
            recommendations={scoreResult.recommendations}
            language={language}
            onApplyRecommendation={handleApplyRecommendation}
            appliedActions={appliedActions}
          />

          <div className="flex justify-between pt-4">
            <button
              onClick={() => navigate('/borrower/score')}
              className="rounded-xl border border-theme-border bg-theme-surface px-4 py-2.5 text-xs font-bold text-theme-secondary hover:text-theme-primary"
            >
              {t.back}
            </button>
            <button
              onClick={() => navigate('/borrower/marketplace')}
              className="flex items-center gap-2 rounded-xl bg-theme-accent px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-90"
            >
              <span>Proceed to Marketplace Submission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
