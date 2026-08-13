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
    hasChildren,
    setHasChildren,
    childrenSchoolType,
    setChildrenSchoolType,
    headOfHouseholdGender,
    setHeadOfHouseholdGender,
    longTermIllness,
    setLongTermIllness,
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

        {/* Additional Family & Household Fields */}
        <div className="space-y-4 pt-2 border-t border-theme-border">
          
          {/* Has Children Toggle & School Type */}
          <div className="space-y-3 rounded-2xl border border-theme-border bg-theme-bg p-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs sm:text-sm font-bold text-theme-primary">
                {t.has_children_label}
              </span>
              <button
                type="button"
                onClick={() => setHasChildren(!hasChildren)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  hasChildren ? 'bg-theme-accent' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    hasChildren ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {hasChildren && (
              <div className="pt-2 border-t border-theme-border space-y-1.5 animate-in fade-in duration-200">
                <label className="block text-xs font-bold uppercase text-theme-secondary">
                  {t.children_school_type_label}
                </label>
                <select
                  value={childrenSchoolType || 'government'}
                  onChange={(e) => setChildrenSchoolType(e.target.value as any)}
                  className="w-full h-[46px] rounded-xl border border-theme-border bg-theme-surface px-3.5 text-sm font-bold text-theme-primary focus:border-theme-accent focus:outline-none"
                >
                  <option value="government">{t.school_government}</option>
                  <option value="private">{t.school_private}</option>
                  <option value="not_in_school">{t.school_not_in_school}</option>
                </select>
              </div>
            )}
          </div>

          {/* Gender of Head of Household Select */}
          <div className="space-y-1.5 rounded-2xl border border-theme-border bg-theme-bg p-5">
            <label className="block text-xs font-bold uppercase text-theme-secondary">
              {t.head_of_household_gender_label}
            </label>
            <select
              value={headOfHouseholdGender}
              onChange={(e) => setHeadOfHouseholdGender(e.target.value as any)}
              className="w-full h-[46px] rounded-xl border border-theme-border bg-theme-surface px-3.5 text-sm font-bold text-theme-primary focus:border-theme-accent focus:outline-none"
            >
              <option value="female">{t.gender_female}</option>
              <option value="male">{t.gender_male}</option>
              <option value="other">{t.gender_other}</option>
            </select>
          </div>

          {/* Long Term Illness Toggle */}
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-theme-border bg-theme-bg p-5">
            <span className="text-xs sm:text-sm font-bold text-theme-primary">
              {t.long_term_illness_label}
            </span>
            <button
              type="button"
              onClick={() => setLongTermIllness(!longTermIllness)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                longTermIllness ? 'bg-theme-accent' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  longTermIllness ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
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
