import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useBorrowerFormContext } from '../../context/BorrowerFormContext';
import { StepTracker } from '../../components/borrower/StepTracker';
import { translations } from '../../i18n/translations';
import { Occupation, Education } from '../../types/types';
import { Store, Truck, Sprout, Briefcase, Plus, Minus, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export const BasicDataPage: React.FC = () => {
  const { language } = useAppContext();
  const {
    name,
    setName,
    gender,
    setGender,
    maritalStatus,
    setMaritalStatus,
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

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!name || name.trim().length === 0) {
      setError('Please enter your full name');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // 1. Save step to AppContext & sync to Firestore
      await saveCurrentStep();
      // 2. Advance to the next form step
      navigate('/borrower/household');
    } catch (err) {
      console.error('Error saving step to Firestore:', err);
      setError('Failed to save details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Navigate back to the onboarding gate welcome screen
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
      <StepTracker currentStep={0} />

      <div className="space-y-6 rounded-2xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-xs">
        
        {/* Error Notification */}
        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl border border-red-300 bg-red-50 text-red-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Borrower Demographics: Name, Gender, Marital Status */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Full Name */}
          <div className="space-y-1.5 rounded-2xl border border-theme-border bg-theme-bg p-4">
            <label className="block text-xs font-bold uppercase text-theme-secondary">
              {t.name_label || 'Full Name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder={t.name_placeholder || 'e.g. Anjali Sharma'}
              className="w-full h-[46px] rounded-xl border border-theme-border bg-theme-surface px-3.5 text-sm font-bold text-theme-primary focus:border-theme-accent focus:outline-none"
            />
          </div>

          {/* Gender Select */}
          <div className="space-y-1.5 rounded-2xl border border-theme-border bg-theme-bg p-4">
            <label className="block text-xs font-bold uppercase text-theme-secondary">
              {t.gender_label || 'Gender'}
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full h-[46px] rounded-xl border border-theme-border bg-theme-surface px-3 text-sm font-bold text-theme-primary focus:border-theme-accent focus:outline-none"
            >
              <option value="female">{t.gender_female || 'Female'}</option>
              <option value="male">{t.gender_male || 'Male'}</option>
              <option value="other">{t.gender_other || 'Other'}</option>
            </select>
          </div>

          {/* Marital Status Select */}
          <div className="space-y-1.5 rounded-2xl border border-theme-border bg-theme-bg p-4">
            <label className="block text-xs font-bold uppercase text-theme-secondary">
              {t.marital_status_label || 'Marital Status'}
            </label>
            <select
              value={maritalStatus}
              onChange={(e) => setMaritalStatus(e.target.value as any)}
              className="w-full h-[46px] rounded-xl border border-theme-border bg-theme-surface px-3 text-sm font-bold text-theme-primary focus:border-theme-accent focus:outline-none"
            >
              <option value="married">{t.marital_married || 'Married'}</option>
              <option value="single">{t.marital_single || 'Single'}</option>
              <option value="widowed">{t.marital_widowed || 'Widowed'}</option>
              <option value="divorced">{t.marital_divorced || 'Divorced'}</option>
            </select>
          </div>
        </div>

        <div>
          <h2 className="font-serif-lora text-2xl sm:text-3xl font-bold text-theme-primary">
            {t.occupation_title || 'Primary Occupation'}
          </h2>
          <p className="text-xs sm:text-sm text-theme-secondary mt-1">
            {t.occupation_subtitle || 'Select your main source of informal or formal income'}
          </p>
        </div>

        {/* Occupation Single Select Cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { id: 'street_vendor', label: t.occ_street_vendor || 'Street Vendor / Merchant', icon: Store },
            { id: 'gig_worker', label: t.occ_gig_worker || 'Gig Worker / Delivery', icon: Truck },
            { id: 'small_farmer', label: t.occ_small_farmer || 'Small Farmer / Cultivator', icon: Sprout },
            { id: 'self_employed', label: t.occ_self_employed || 'Self-Employed / Artisan', icon: Briefcase },
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

        {/* Age Input with Steppers */}
        <div className="space-y-2 rounded-2xl border border-theme-border bg-theme-bg p-4 sm:p-5">
          <label className="block text-xs font-bold uppercase text-theme-secondary">
            {t.age_label || 'Age'}
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
                  setAge(0);
                  return;
                }
                const num = parseInt(val, 10);
                if (!isNaN(num)) {
                  setAge(num);
                }
              }}
              onBlur={() => {
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
            {t.education_label || 'Education Level'}
          </label>
          <select
            value={education}
            onChange={(e) => setEducation(e.target.value as Education)}
            className="w-full h-[52px] rounded-xl border border-theme-border bg-theme-surface px-4 text-sm font-bold text-theme-primary focus:border-theme-accent focus:outline-none"
          >
            <option value="none">{t.edu_none || 'No Formal Education'}</option>
            <option value="primary">{t.edu_primary || 'Primary School'}</option>
            <option value="secondary">{t.edu_secondary || 'Secondary School (10th)'}</option>
            <option value="graduate">{t.edu_graduate || 'Higher Secondary / Graduate'}</option>
          </select>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t border-theme-border">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-xl border border-theme-border bg-theme-bg px-5 py-3 text-xs sm:text-sm font-bold text-theme-secondary hover:text-theme-primary transition-colors"
          >
            {t.back || 'Back'}
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-theme-accent px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>{t.next || 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};