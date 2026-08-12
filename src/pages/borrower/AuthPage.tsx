import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useBorrowerFormContext } from '../../context/BorrowerFormContext';
import { StepTracker } from '../../components/borrower/StepTracker';
import { translations } from '../../i18n/translations';
import { Smartphone, ArrowRight, ShieldAlert } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { language } = useAppContext();
  const {
    phone,
    setPhone,
    otp,
    setOtp,
    otpSent,
    setOtpSent,
    setOtpVerified,
    saveCurrentStep
  } = useBorrowerFormContext();

  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  const handleContinue = async () => {
    await saveCurrentStep();
    navigate('/borrower/basic');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
      <StepTracker currentStep={0} />

      <div className="space-y-6 rounded-2xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-xs">
        <div className="text-center max-w-md mx-auto space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-theme-soft text-theme-accent">
            <Smartphone className="h-7 w-7" />
          </div>
          <h2 className="font-serif-lora text-2xl sm:text-3xl font-bold text-theme-primary">
            {t.auth_title}
          </h2>
          <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
            {t.auth_subtitle}
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-theme-secondary mb-1.5">
              {t.mobile_label}
            </label>
            <div className="flex h-[52px] rounded-xl border border-theme-border bg-theme-bg overflow-hidden focus-within:border-theme-accent">
              <span className="flex items-center px-4 bg-theme-surface border-r border-theme-border text-sm font-bold text-theme-secondary">
                +91
              </span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                className="w-full px-4 py-3 text-base font-semibold text-theme-primary bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {!otpSent ? (
            <button
              onClick={() => {
                setOtpSent(true);
                setOtp('1234');
              }}
              className="w-full h-[54px] rounded-xl bg-theme-accent text-base font-bold text-white shadow-sm hover:opacity-90 flex items-center justify-center gap-2"
            >
              <span>Send Verification OTP</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="space-y-4 rounded-2xl border border-theme-border bg-theme-bg p-4">
              <div>
                <label className="block text-xs font-bold uppercase text-theme-secondary mb-1">
                  Enter 4-Digit OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  maxLength={4}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    if (e.target.value.length === 4) {
                      setOtpVerified(true);
                    }
                  }}
                  placeholder="1234"
                  className="w-full h-[52px] rounded-xl border border-theme-border bg-theme-surface px-4 text-center text-xl font-mono font-bold tracking-widest text-theme-primary focus:border-theme-accent focus:outline-none"
                />
                <p className="text-xs text-theme-accent mt-1.5 text-center font-medium">
                  Demo OTP code pre-filled as 1234.
                </p>
              </div>

              <button
                onClick={handleContinue}
                className="w-full h-[54px] rounded-xl bg-theme-accent text-base font-bold text-white shadow-sm hover:opacity-90 flex items-center justify-center gap-2"
              >
                <span>Verify & Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Bias prevention banner */}
          <div className="rounded-xl border border-theme-border bg-theme-soft/50 p-3.5 text-center">
            <p className="text-xs font-bold text-theme-accent flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {t.bias_banner}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
