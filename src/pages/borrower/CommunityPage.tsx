import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useBorrowerFormContext } from '../../context/BorrowerFormContext';
import { StepTracker } from '../../components/borrower/StepTracker';
import { translations } from '../../i18n/translations';
import { GroupType } from '../../types/types';
import { Check, ArrowRight } from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const { language } = useAppContext();
  const {
    communityActive,
    setCommunityActive,
    groupType,
    setGroupType,
    saveCurrentStep
  } = useBorrowerFormContext();

  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  const handleNext = async () => {
    await saveCurrentStep();
    navigate('/borrower/document');
  };

  const handleBack = () => {
    navigate('/borrower/assets');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
      <StepTracker currentStep={4} />

      <div className="space-y-6 rounded-2xl border border-theme-border bg-theme-surface p-6 shadow-xs">
        <div>
          <h2 className="font-serif-lora text-2xl font-bold text-theme-primary">
            {t.community_title}
          </h2>
          <p className="text-xs text-theme-secondary mt-1">
            {t.community_subtitle}
          </p>
        </div>

        {/* Toggle Member Switch */}
        <div className="flex items-center justify-between rounded-2xl border border-theme-border bg-theme-bg p-4">
          <span className="text-xs font-bold text-theme-primary max-w-xs sm:max-w-md">
            {t.community_toggle}
          </span>
          <button
            type="button"
            onClick={() => setCommunityActive(!communityActive)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              communityActive ? 'bg-theme-accent' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                communityActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Select Group Type if active */}
        {communityActive && (
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold uppercase text-theme-secondary">
              {t.group_type_label}
            </label>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {[
                { id: 'shg', label: t.group_shg },
                { id: 'cooperative', label: t.group_cooperative },
                { id: 'fpo', label: t.group_fpo },
                { id: 'union', label: t.group_union },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setGroupType(item.id as GroupType)}
                  className={`flex items-center justify-between rounded-xl border p-3.5 text-xs font-bold transition-all ${
                    groupType === item.id
                      ? 'border-2 border-theme-accent bg-theme-soft text-theme-accent'
                      : 'border-theme-border bg-theme-bg text-theme-primary hover:border-theme-accent'
                  }`}
                >
                  <span>{item.label}</span>
                  {groupType === item.id && <Check className="h-4 w-4 text-theme-accent" />}
                </button>
              ))}
            </div>
          </div>
        )}

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
