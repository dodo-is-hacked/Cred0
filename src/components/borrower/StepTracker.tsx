import React from 'react';
import { useNavigate } from 'react-router-dom';

export const STEP_ROUTES = [
  { step: 0, label: 'Step 1', path: '/borrower/basic' },
  { step: 1, label: 'Step 2', path: '/borrower/household' },
  { step: 2, label: 'Step 3', path: '/borrower/assets' },
  { step: 3, label: 'Step 4', path: '/borrower/community' },
  { step: 4, label: 'Step 5', path: '/borrower/document' },
];

interface StepTrackerProps {
  currentStep: number;
}

export const StepTracker: React.FC<StepTrackerProps> = ({ currentStep }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-theme-border bg-theme-surface p-4 shadow-xs mb-6">
      <div className="flex items-center justify-between text-xs font-bold text-theme-secondary mb-2">
        <span className="uppercase tracking-wider text-theme-accent">
          Borrower Onboarding
        </span>
        <span>Step {currentStep + 1} of 5</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-theme-bg">
        <div
          className="h-full bg-theme-accent transition-all duration-300"
          style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
        />
      </div>

      {/* Step Buttons Quick Navigation */}
      <div className="mt-3 flex overflow-x-auto gap-1 pb-1 scrollbar-none">
        {STEP_ROUTES.map((item) => (
          <button
            key={item.step}
            onClick={() => navigate(item.path)}
            className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
              currentStep === item.step
                ? 'bg-theme-accent text-white'
                : item.step < currentStep
                ? 'bg-theme-soft text-theme-accent'
                : 'bg-theme-bg text-theme-secondary hover:text-theme-primary'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
