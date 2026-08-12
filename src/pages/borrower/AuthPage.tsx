import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useBorrowerFormContext } from '../../context/BorrowerFormContext';
import { StepTracker } from '../../components/borrower/StepTracker';
import { translations } from '../../i18n/translations';
import { auth } from '../../config/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { Smartphone, ArrowRight, ShieldAlert, Loader2, AlertCircle } from 'lucide-react';

// TypeScript declaration to bind recaptchaVerifier to window
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

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

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // 1. Initialize invisible reCAPTCHA on component mount
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved automatically
          },
          'expired-callback': () => {
            setErrorMessage('reCAPTCHA expired. Please try sending OTP again.');
          }
        });
      } catch (err) {
        console.error('reCAPTCHA initialization error:', err);
      }
    }
  }, []);

  // 2. Request SMS OTP via Firebase
  const handleSendOtp = async () => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const formattedPhone = `+91${cleanPhone.slice(-10)}`;
      const appVerifier = window.recaptchaVerifier;

      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
      setLoading(false);
    } catch (error: any) {
      console.error('Firebase SMS error:', error);
      setLoading(false);
      
      // Reset reCAPTCHA widget if an error occurs
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then((widgetId) => {
          // @ts-ignore
          if (window.grecaptcha) window.grecaptcha.reset(widgetId);
        });
      }

      if (error.code === 'auth/invalid-phone-number') {
        setErrorMessage('Invalid phone number format.');
      } else if (error.code === 'auth/too-many-requests') {
        setErrorMessage('Too many attempts. Please try again later.');
      } else {
        setErrorMessage(error.message || 'Failed to send SMS. Ensure domain is authorized in Firebase.');
      }
    }
  };

  // 3. Verify OTP via Firebase
  const handleVerifyAndContinue = async () => {
    if (!otp || otp.trim().length < 6) {
      setErrorMessage('Please enter the 6-digit OTP code sent to your phone');
      return;
    }

    if (!confirmationResult) {
      setErrorMessage('Verification session expired. Please request a new OTP.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      // Confirm OTP code with Firebase Auth
      await confirmationResult.confirm(otp.trim());
      
      setLoading(false);
      setOtpVerified(true);
      await saveCurrentStep();
      navigate('/borrower/basic');
    } catch (error: any) {
      console.error('Firebase OTP Verification error:', error);
      setLoading(false);
      setErrorMessage('Invalid verification code. Please check and try again.');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
      {/* Container required for Firebase Invisible reCAPTCHA */}
      <div id="recaptcha-container"></div>

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
          {/* Error Banner */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-red-300 bg-red-50 text-red-700 text-xs font-semibold dark:bg-red-950/40 dark:border-red-900 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

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
                disabled={otpSent || loading}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Enter 10-digit mobile number"
                className="w-full px-4 py-3 text-base font-semibold text-theme-primary bg-transparent focus:outline-none disabled:opacity-60"
              />
            </div>
          </div>

          {!otpSent ? (
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full h-[54px] rounded-xl bg-theme-accent text-base font-bold text-white shadow-sm hover:opacity-90 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending SMS OTP...</span>
                </>
              ) : (
                <>
                  <span>Send Verification OTP</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          ) : (
            <div className="space-y-4 rounded-2xl border border-theme-border bg-theme-bg p-4">
              <div>
                <label className="block text-xs font-bold uppercase text-theme-secondary mb-1">
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  maxLength={6}
                  disabled={loading}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter 6-digit code"
                  className="w-full h-[52px] rounded-xl border border-theme-border bg-theme-surface px-4 text-center text-xl font-mono font-bold tracking-widest text-theme-primary focus:border-theme-accent focus:outline-none"
                />
                <p className="text-xs text-theme-secondary mt-1.5 text-center font-medium">
                  SMS verification code sent via Firebase.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                    setErrorMessage('');
                  }}
                  className="w-1/3 h-[54px] rounded-xl border border-theme-border bg-theme-surface text-xs font-bold text-theme-secondary hover:text-theme-primary"
                >
                  Edit Number
                </button>

                <button
                  onClick={handleVerifyAndContinue}
                  disabled={loading}
                  className="w-2/3 h-[54px] rounded-xl bg-theme-accent text-base font-bold text-white shadow-sm hover:opacity-90 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Continue</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};