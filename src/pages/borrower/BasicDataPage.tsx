import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useBorrowerFormContext } from '../../context/BorrowerFormContext';
import { StepTracker } from '../../components/borrower/StepTracker';
import { translations } from '../../i18n/translations';
import { Occupation, Education } from '../../types/types';
import { Store, Truck, Sprout, Briefcase, Plus, Minus, ArrowRight } from 'lucide-react';

export const BasicDataPage: React.FC = () => {
  const { language } = useAppContext();
  const {
    occupation,
    setOccupation,
    age,
    setAge,
    education,
    setEducation,
    saveCurrentStep
  } = useBorrowerFormContext();

  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  const handleNext = async () => {
    await saveCurrentStep();
    navigate('/borrower/household');
  };

  const handleBack = () => {
    navigate('/borrower/auth');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
      <StepTracker currentStep={1} />

      <div className="space-y-6 rounded-2xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-xs">
        <div>
          <h2 className="font-serif-lora text-2xl sm:text-3xl font-bold text-theme-primary">
            {t.occupation_title}
          </h2>
          <p className="text-xs sm:text-sm text-theme-secondary mt-1">
            {t.occupation_subtitle}
          </p>
        </div>

        {/* Occupation Single Select Cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { id: 'street_vendor', label: t.occ_street_vendor, icon: Store },
            { id: 'gig_worker', label: t.occ_gig_worker, icon: Truck },
            { id: 'small_farmer', label: t.occ_small_farmer, icon: Sprout },
            { id: 'self_employed', label: t.occ_self_employed, icon: Briefcase },
          ].map((item) => {
            const IconComp = item.icon;
            const isSelected = occupation === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setOccupation(item.id as Occupation)}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'border-2 border-theme-accent bg-theme-soft text-theme-accent font-bold shadow-xs'
                    : 'border-theme-border bg-theme-bg text-theme-primary hover:border-theme-accent'
                }`}
              >
                <IconComp className="h-8 w-8 mb-2 text-theme-accent" />
                <span className="text-xs sm:text-sm font-bold leading-snug">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Age Input with Smooth Typing & Hidden Spin Arrows */}
<div className="space-y-2 rounded-2xl border border-theme-border bg-theme-bg p-4 sm:p-5">
  <label className="block text-xs font-bold uppercase text-theme-secondary">
    {t.age_label}
  </label>
  <div className="flex items-center justify-between gap-3">
    <button
      type="button"
      onClick={() => setAge(Math.max(18, age - 1))}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-theme-border bg-theme-surface text-theme-primary hover:border-theme-accent text-lg font-bold"
    >
      <Minus className="h-5 w-5" />
    </button>

    <input
      type="number"
      min={18}
      max={75}
      value={age === 0 ? '' : age}
      onChange={(e) => {
        const val = e.target.value;
        if (val === '') {
          setAge(0); // Allows clearing the box to type freely
          return;
        }
        const num = parseInt(val, 10);
        if (!isNaN(num)) {
          setAge(num);
        }
      }}
      onBlur={() => {
        // Clamp to valid range (18 to 75) when user finishes typing
        if (age < 18) setAge(18);
        if (age > 75) setAge(75);
      }}
      className="w-24 text-center font-serif-lora text-3xl font-extrabold rounded-xl border border-theme-border bg-theme-surface py-2 text-theme-primary focus:border-theme-accent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />

    <button
      type="button"
      onClick={() => setAge(Math.min(75, age + 1))}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-theme-border bg-theme-surface text-theme-primary hover:border-theme-accent text-lg font-bold"
    >
      <Plus className="h-5 w-5" />
    </button>
  </div>
</div>

          {/* Education Dropdown */}
          <div className="space-y-2 rounded-2xl border border-theme-border bg-theme-bg p-4 sm:p-5">
            <label className="block text-xs font-bold uppercase text-theme-secondary">
              {t.education_label}
            </label>
            <select
              value={education}
              onChange={(e) => setEducation(e.target.value as Education)}
              className="w-full h-[52px] rounded-xl border border-theme-border bg-theme-surface px-4 text-sm font-bold text-theme-primary focus:border-theme-accent focus:outline-none"
            >
              <option value="none">{t.edu_none}</option>
              <option value="primary">{t.edu_primary}</option>
              <option value="secondary">{t.edu_secondary}</option>
              <option value="graduate">{t.edu_graduate}</option>
            </select>
          </div>
        </div>

        {/* Nav buttons */}
        <div className="flex justify-between pt-4 border-t border-theme-border">
          <button
            onClick={handleBack}
            className="rounded-xl border border-theme-border bg-theme-bg px-5 py-3 text-xs sm:text-sm font-bold text-theme-secondary hover:text-theme-primary"
          >
            {t.back}
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 rounded-xl bg-theme-accent px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-sm hover:opacity-90"
          >
            <span>{t.next}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
  );
};
