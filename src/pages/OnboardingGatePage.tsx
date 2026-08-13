import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { translations } from '../i18n/translations';
import { Role } from '../types/types';
import { ShieldCheck, User, Building2, ArrowRight, CheckCircle2, Sparkles, Scale, Lock } from 'lucide-react';

export const OnboardingGatePage: React.FC = () => {
  const { language, setRole } = useAppContext();
  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  const [step, setStep] = useState<'welcome' | 'role_select'>('welcome');

  useEffect(() => {
    const seen = sessionStorage.getItem('trust_onboarding_seen');
    if (seen === 'true') {
      navigate('/borrower/auth', { replace: true });
    }
  }, [navigate]);

  const handleSelectRole = (selectedRole: Role) => {
    sessionStorage.setItem('trust_onboarding_seen', 'true');
    setRole(selectedRole);
    navigate('/borrower/auth');
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-primary flex flex-col justify-center items-center p-4 sm:p-6 transition-colors font-sans">
      <div className="w-full max-w-2xl space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-theme-accent text-white shadow-md">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="font-serif-lora text-3xl sm:text-4xl font-extrabold tracking-tight text-theme-primary">
              {t.brand_name}
            </h1>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-theme-secondary mt-0.5">
              Alternative Credit Engine
            </p>
          </div>
        </div>

        {/* Step 1: Welcome Screen */}
        {step === 'welcome' && (
          <div className="space-y-6 rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-xl animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <h2 className="font-serif-lora text-2xl sm:text-3xl font-bold text-theme-primary">
                {t.welcome_title}
              </h2>
              <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed max-w-lg mx-auto">
                {t.welcome_body}
              </p>
            </div>

            {/* Core Value Pillars */}
            <div className="grid gap-3 sm:grid-cols-3 pt-2">
              <div className="rounded-2xl border border-theme-border bg-theme-bg p-4 space-y-1.5 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-theme-soft text-theme-accent">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-bold text-theme-primary">Explainable Scoring</h3>
                <p className="text-[11px] text-theme-secondary leading-normal">
                  Transparent SHAP feature contributions without hidden black-box algorithms.
                </p>
              </div>

              <div className="rounded-2xl border border-theme-border bg-theme-bg p-4 space-y-1.5 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-theme-soft text-theme-accent">
                  <Scale className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-bold text-theme-primary">Zero Demographic Bias</h3>
                <p className="text-[11px] text-theme-secondary leading-normal">
                  Protected status fairness rules guarantee unbiased credit evaluation.
                </p>
              </div>

              <div className="rounded-2xl border border-theme-border bg-theme-bg p-4 space-y-1.5 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-theme-soft text-theme-accent">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-bold text-theme-primary">Alternative Data</h3>
                <p className="text-[11px] text-theme-secondary leading-normal">
                  Evaluates informal income, community ties, assets, and trade licenses.
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep('role_select')}
              className="w-full h-14 rounded-2xl bg-theme-accent text-base font-bold text-white shadow-md hover:opacity-90 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <span>{t.welcome_cta}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Role Selection Screen */}
        {step === 'role_select' && (
          <div className="space-y-6 rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-xl animate-in fade-in duration-300">
            <div className="text-center space-y-1.5">
              <h2 className="font-serif-lora text-2xl sm:text-3xl font-bold text-theme-primary">
                {t.role_select_title}
              </h2>
              <p className="text-xs sm:text-sm text-theme-secondary">
                {t.role_select_subtitle}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              {/* Borrower Login Card */}
              <button
                type="button"
                onClick={() => handleSelectRole('borrower')}
                className="group relative flex flex-col items-center justify-between p-6 rounded-2xl border-2 border-theme-border bg-theme-bg hover:border-theme-accent hover:bg-theme-soft transition-all text-center space-y-4 shadow-xs"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-theme-surface border border-theme-border text-theme-accent group-hover:scale-105 transition-transform shadow-xs">
                  <User className="h-8 w-8 text-theme-accent" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-serif-lora text-xl font-bold text-theme-primary group-hover:text-theme-accent">
                    {t.role_borrower_cta}
                  </h3>
                  <p className="text-xs text-theme-secondary leading-relaxed">
                    {t.role_borrower_desc}
                  </p>
                </div>

                <div className="w-full py-2.5 rounded-xl border border-theme-border bg-theme-surface text-xs font-bold text-theme-primary group-hover:bg-theme-accent group-hover:text-white transition-colors">
                  Continue as Borrower
                </div>
              </button>

              {/* Lender Login Card */}
              <button
                type="button"
                onClick={() => handleSelectRole('lender')}
                className="group relative flex flex-col items-center justify-between p-6 rounded-2xl border-2 border-theme-border bg-theme-bg hover:border-theme-accent hover:bg-theme-soft transition-all text-center space-y-4 shadow-xs"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-theme-surface border border-theme-border text-theme-accent group-hover:scale-105 transition-transform shadow-xs">
                  <Building2 className="h-8 w-8 text-theme-accent" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-serif-lora text-xl font-bold text-theme-primary group-hover:text-theme-accent">
                    {t.role_lender_cta}
                  </h3>
                  <p className="text-xs text-theme-secondary leading-relaxed">
                    {t.role_lender_desc}
                  </p>
                </div>

                <div className="w-full py-2.5 rounded-xl border border-theme-border bg-theme-surface text-xs font-bold text-theme-primary group-hover:bg-theme-accent group-hover:text-white transition-colors">
                  Continue as Lender
                </div>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
