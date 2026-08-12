import React, { useState } from 'react';
import { LoanApplication, Language, LenderProfile } from '../../types';
import { translations } from '../../i18n/translations';
import { formatIndianCurrency, calculateEmi } from '../../utils/formatters';
import {
  X,
  Building2,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Send
} from 'lucide-react';
import { WaterfallChart } from './WaterfallChart';

interface AuditPanelModalProps {
  application: LoanApplication;
  language: Language;
  onClose: () => void;
  onApproveLoan: (
    appId: string,
    offerData: {
      lenderId: string;
      lenderName: string;
      amount: number;
      interestRatePct: number;
      tenureMonths: number;
      monthlyEmi: number;
    }
  ) => void;
  lenders: LenderProfile[];
}

export const AuditPanelModal: React.FC<AuditPanelModalProps> = ({
  application,
  language,
  onClose,
  onApproveLoan,
  lenders,
}) => {
  const t = translations[language] || translations.en;
  const { borrowerProfile, scoreResult } = application;

  // Selected Lender
  const [selectedLenderId, setSelectedLenderId] = useState<string>(lenders[0]?.id || 'len_gramin');

  // Underwriting Control States
  const [loanAmount, setLoanAmount] = useState<number>(
    application.offer?.amount || 50000
  );
  const [interestRate, setInterestRate] = useState<number>(
    application.offer?.interestRatePct || 12.0
  );
  const [tenureMonths, setTenureMonths] = useState<number>(
    application.offer?.tenureMonths || 12
  );

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // EMI Calculation
  const estimatedEmi = calculateEmi(loanAmount, interestRate, tenureMonths);

  const selectedLender = lenders.find(l => l.id === selectedLenderId) || lenders[0];

  const handleConfirmApprove = async () => {
    setIsSubmitting(true);
    await onApproveLoan(application.id, {
      lenderId: selectedLender.id,
      lenderName: selectedLender.name,
      amount: loanAmount,
      interestRatePct: interestRate,
      tenureMonths,
      monthlyEmi: estimatedEmi
    });
    setIsSubmitting(false);
    setShowConfirmModal(false);
    onClose();
  };

  // Waterfall items: start with Base Score 300
  const waterfallItems = scoreResult.shapFactors.map(sf => ({
    label: sf.feature,
    impact: sf.impact,
    explanation: sf.explanation[language] || sf.explanation.en
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-theme-border bg-theme-surface p-6 shadow-2xl space-y-6">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-theme-border bg-theme-bg text-theme-secondary hover:text-theme-primary"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Title */}
        <div className="border-b border-theme-border pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-theme-soft text-theme-accent text-[11px] font-extrabold uppercase">
              Underwriting Audit
            </span>
            <h2 className="font-serif-lora text-2xl font-bold text-theme-primary">
              {t.audit_title}
            </h2>
          </div>
          <p className="text-xs text-theme-secondary mt-1">
            Transparent alternative credit scoring & risk assessment for {borrowerProfile.name}
          </p>
        </div>

        {/* Section 1: Applicant Overview & Risk Diagnostics */}
        <div className="grid gap-4 sm:grid-cols-3">
          
          {/* Applicant Summary */}
          <div className="sm:col-span-2 space-y-3 p-4 rounded-xl border border-theme-border bg-theme-bg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-theme-primary">{borrowerProfile.name}</h3>
                <p className="text-xs text-theme-secondary">{borrowerProfile.location} · Age {borrowerProfile.age}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-theme-soft text-theme-accent border border-theme-border">
                {scoreResult.zone}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-theme-border">
              <div>
                <span className="text-theme-secondary block">Occupation:</span>
                <span className="font-bold text-theme-primary capitalize">
                  {borrowerProfile.occupation.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-theme-secondary block">Education:</span>
                <span className="font-bold text-theme-primary capitalize">
                  {borrowerProfile.education}
                </span>
              </div>
              <div>
                <span className="text-theme-secondary block">Household Size / Earners:</span>
                <span className="font-bold text-theme-primary">
                  {borrowerProfile.householdSize} members ({borrowerProfile.earningMembers} earners)
                </span>
              </div>
              <div>
                <span className="text-theme-secondary block">Community Tie:</span>
                <span className="font-bold text-theme-accent">
                  {borrowerProfile.communityTie.active ? (borrowerProfile.communityTie.groupType?.toUpperCase() || 'SHG') : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Risk Diagnostics Box */}
          <div className="p-4 rounded-xl border border-theme-border bg-theme-surface shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-theme-secondary flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                {t.risk_diagnostics}
              </span>
              
              <div className="pt-1">
                <div className="text-xs text-theme-secondary">{t.default_prob}</div>
                <div className="font-serif-lora text-3xl font-extrabold text-theme-primary">
                  {scoreResult.defaultRiskPercent}%
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-theme-border">
              <span className="text-[11px] text-theme-secondary block mb-1">{t.risk_cat}</span>
              <span className={`inline-block px-3 py-1 rounded-lg text-xs font-extrabold ${
                scoreResult.riskCategory === 'Low'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : scoreResult.riskCategory === 'Moderate'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
              }`}>
                {scoreResult.riskCategory} Risk
              </span>
            </div>
          </div>

        </div>

        {/* Section 2: SHAP Feature Contribution Waterfall */}
        <WaterfallChart scoreResult={scoreResult} language={language} />

        {/* Section 3: Underwriting Controls */}
        <div className="p-5 rounded-2xl border border-theme-border bg-theme-surface space-y-4">
          <div className="flex items-center justify-between border-b border-theme-border pb-3">
            <h3 className="font-serif-lora text-lg font-bold text-theme-primary flex items-center gap-2">
              <Sliders className="w-5 h-5 text-theme-accent" />
              {t.underwriting_title}
            </h3>

            {/* Select Lender Entity */}
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-theme-secondary" />
              <select
                value={selectedLenderId}
                onChange={(e) => setSelectedLenderId(e.target.value)}
                className="rounded-lg border border-theme-border bg-theme-bg px-2.5 py-1 text-xs font-bold text-theme-primary focus:outline-none"
              >
                {lenders.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Amount Input Slider */}
            <div className="space-y-1.5 p-3.5 rounded-xl border border-theme-border bg-theme-bg">
              <div className="flex justify-between text-xs font-bold text-theme-primary">
                <span>{t.loan_amount}</span>
                <span className="text-theme-accent font-mono">{formatIndianCurrency(loanAmount)}</span>
              </div>
              <input
                type="range"
                min={5000}
                max={500000}
                step={5000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-navy cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-theme-secondary font-mono">
                <span>₹5,000</span>
                <span>₹5,00,000</span>
              </div>
            </div>

            {/* Interest Rate Slider */}
            <div className="space-y-1.5 p-3.5 rounded-xl border border-theme-border bg-theme-bg">
              <div className="flex justify-between text-xs font-bold text-theme-primary">
                <span>{t.interest_rate}</span>
                <span className="text-theme-accent font-mono">{interestRate}%</span>
              </div>
              <input
                type="range"
                min={4.0}
                max={24.0}
                step={0.5}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-navy cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-theme-secondary font-mono">
                <span>4.0%</span>
                <span>24.0%</span>
              </div>
            </div>

            {/* Tenure Selector */}
            <div className="space-y-1.5 p-3.5 rounded-xl border border-theme-border bg-theme-bg">
              <label className="block text-xs font-bold text-theme-primary">
                {t.tenure}
              </label>
              <div className="grid grid-cols-5 gap-1 pt-1">
                {[3, 6, 12, 24, 36].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTenureMonths(m)}
                    className={`rounded-lg py-1.5 text-xs font-bold transition-all ${
                      tenureMonths === m
                        ? 'bg-theme-accent text-white'
                        : 'bg-theme-surface text-theme-primary border border-theme-border hover:border-theme-accent'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* EMI Estimate Summary Box */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-theme-soft border border-theme-border">
            <div>
              <span className="text-xs font-bold text-theme-secondary block">
                {t.est_emi}
              </span>
              <span className="font-serif-lora text-2xl font-extrabold text-theme-accent">
                {formatIndianCurrency(estimatedEmi)} / month
              </span>
            </div>

            <button
              onClick={() => setShowConfirmModal(true)}
              className="flex items-center gap-2 rounded-xl bg-theme-accent px-6 py-3 text-xs font-bold text-white shadow-md hover:opacity-90 active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>{t.approve_loan}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-theme-border bg-theme-surface p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif-lora text-xl font-bold text-theme-primary">
              {t.modal_confirm_title}
            </h3>

            <p className="text-xs text-theme-secondary leading-relaxed">
              {t.modal_confirm_msg} <strong className="text-theme-primary">{borrowerProfile.name}</strong>?
            </p>

            <div className="space-y-1.5 p-3 rounded-xl border border-theme-border bg-theme-bg text-xs">
              <div className="flex justify-between text-theme-primary">
                <span>Sanction Amount:</span>
                <span className="font-bold">{formatIndianCurrency(loanAmount)}</span>
              </div>
              <div className="flex justify-between text-theme-primary">
                <span>Interest Rate:</span>
                <span className="font-bold">{interestRate}% p.a.</span>
              </div>
              <div className="flex justify-between text-theme-primary">
                <span>Tenure:</span>
                <span className="font-bold">{tenureMonths} Months</span>
              </div>
              <div className="flex justify-between text-theme-accent font-bold pt-1 border-t border-theme-border">
                <span>Monthly EMI:</span>
                <span>{formatIndianCurrency(estimatedEmi)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="rounded-xl border border-theme-border bg-theme-bg px-4 py-2 text-xs font-bold text-theme-secondary hover:text-theme-primary"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleConfirmApprove}
                disabled={isSubmitting}
                className="rounded-xl bg-theme-accent px-5 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90"
              >
                {isSubmitting ? 'Sanctioning...' : t.confirm_sanction}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
