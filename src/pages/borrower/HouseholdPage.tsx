import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useBorrowerFormContext } from '../../context/BorrowerFormContext';
import { StepTracker } from '../../components/borrower/StepTracker';
import { translations } from '../../i18n/translations';
import { Plus, Minus, ArrowRight } from 'lucide-react';

export const HouseholdPage: React.FC = () => {
  const { language } = useAppContext();
  const {
    householdSize,
    setHouseholdSize,
    earningMembers,
    setEarningMembers,
    saveCurrentStep
  } = useBorrowerFormContext();

  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  const handleNext = async () => {
    await saveCurrentStep();
    navigate('/borrower/assets');
  };

  const handleBack = () => {
    navigate('/borrower/basic');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
      <StepTracker currentStep={2} />

      <div className="space-y-6 rounded-2xl border border-theme-border bg-theme-surface p-6 shadow-xs">
        <div>
          <h2 className="font-serif-lora text-2xl font-bold text-theme-primary">
            {t.household_title}
          </h2>
          <p className="text-xs text-theme-secondary mt-1">
            {t.household_subtitle}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Total Household Size Stepper */}
          <div className="space-y-2 rounded-2xl border border-theme-border bg-theme-bg p-5">
            <label className="block text-xs font-bold uppercase text-theme-secondary">
              {t.total_household_size}
            </label>
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setHouseholdSize(Math.max(1, householdSize - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-theme-border bg-theme-surface text-theme-primary hover:border-theme-accent"
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="font-serif-lora text-4xl font-extrabold text-theme-primary">
                {householdSize}
              </span>
              <button
                type="button"
                onClick={() => setHouseholdSize(Math.min(15, householdSize + 1))}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-theme-border bg-theme-surface text-theme-primary hover:border-theme-accent"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Earning Members Stepper */}
          <div className="space-y-2 rounded-2xl border border-theme-border bg-theme-bg p-5">
            <label className="block text-xs font-bold uppercase text-theme-secondary">
              {t.earning_members}
            </label>
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setEarningMembers(Math.max(0, earningMembers - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-theme-border bg-theme-surface text-theme-primary hover:border-theme-accent"
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="font-serif-lora text-4xl font-extrabold text-theme-accent">
                {earningMembers}
              </span>
              <button
                type="button"
                onClick={() => setEarningMembers(Math.min(householdSize, earningMembers + 1))}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-theme-border bg-theme-surface text-theme-primary hover:border-theme-accent"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t border-theme-border">
          <button
            onClick={handleBack}
            className="rounded-xl border border-theme-border bg-theme-bg px-4 py-2.5 text-xs font-bold text-theme-secondary hover:text-theme-primary"
          >
            {t.back}
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 rounded-xl bg-theme-accent px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-90"
          >
            <span>{t.next}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
