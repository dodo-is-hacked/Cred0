import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useBorrowerFormContext } from '../../context/BorrowerFormContext';
import { StepTracker } from '../../components/borrower/StepTracker';
import { DocumentUpload } from '../../components/borrower/DocumentUpload';
import { UpiUploadCard } from '../../components/borrower/UpiUploadCard';
import { Share2, ArrowRight } from 'lucide-react';

export const DocumentPage: React.FC = () => {
  const { language, currentBorrower } = useAppContext();
  const {
    handleVerifyDoc,
    upiTransactionCount,
    handleUpdateUpiCount,
    requestedLoanAmount,
    completeOnboarding,
    isBroadcasting
  } = useBorrowerFormContext();

  const navigate = useNavigate();

  const [loanAmount, setLoanAmount] = useState<string>(
    requestedLoanAmount ? requestedLoanAmount.toString() : '25000'
  );
  const [amountError, setAmountError] = useState<string>('');

  const handleSendRequest = async () => {
    const parsedAmount = parseFloat(loanAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError('Please enter a valid loan amount (₹)');
      return;
    }
    setAmountError('');
    await completeOnboarding(parsedAmount);
    navigate('/borrower/dashboard');
  };

  const handleSkipForNow = async () => {
    await completeOnboarding(undefined);
    navigate('/borrower/dashboard');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
      <StepTracker currentStep={4} />

      <DocumentUpload
        language={language}
        onVerifyDocument={async (type, name) => {
          await handleVerifyDoc(type, name);
          // Don't navigate away; user can continue scrolling to UPI & Lender Request
        }}
        onSkip={() => {
          // Don't navigate away; just scroll or remain on page
        }}
        verified={currentBorrower?.documentVerified || false}
        docName={currentBorrower?.documentName}
      />

      <UpiUploadCard
        language={language}
        initialCount={upiTransactionCount}
        onCountChange={(count) => {
          handleUpdateUpiCount(count);
        }}
      />

      {/* Lender Request Card */}
      <div className="space-y-6 rounded-2xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-theme-soft text-theme-accent">
            <Share2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-serif-lora text-xl font-bold text-theme-primary">
              Lender Request & Micro-Credit Application
            </h3>
            <p className="text-xs text-theme-secondary mt-0.5">
              Specify your credit requirement to broadcast your verified Cred0 score to lenders on the Cred0 marketplace.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-theme-border bg-theme-bg p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-secondary">
              Loan amount needed (₹)
            </label>

            <div className="relative max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm font-bold text-theme-secondary">
                ₹
              </span>
              <input
                type="number"
                min="500"
                step="500"
                value={loanAmount}
                onChange={(e) => {
                  setLoanAmount(e.target.value);
                  if (amountError) setAmountError('');
                }}
                placeholder="e.g. 25000"
                className="w-full rounded-xl border border-theme-border bg-theme-surface pl-8 pr-4 py-3 text-sm font-bold text-theme-primary shadow-2xs focus:border-theme-accent focus:outline-none"
              />
            </div>
            {amountError && (
              <p className="text-xs font-semibold text-red-500">{amountError}</p>
            )}
            <p className="text-[11px] text-theme-secondary">
              Lenders review your requested amount alongside your Cred0 score and cashflow signals.
            </p>
          </div>

          <div className="pt-3 border-t border-theme-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleSkipForNow}
              className="w-full sm:w-auto text-xs font-semibold text-theme-secondary hover:text-theme-primary underline underline-offset-4 px-2 py-1"
            >
              Skip for now
            </button>

            <button
              type="button"
              onClick={handleSendRequest}
              disabled={isBroadcasting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-theme-accent px-6 py-3 text-xs font-bold text-white shadow-md hover:opacity-90 active:scale-98 transition-all disabled:opacity-50"
            >
              {isBroadcasting ? (
                <span>Broadcasting to Lenders...</span>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Send Request to Lenders</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
