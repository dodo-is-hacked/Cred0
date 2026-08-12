import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { LenderDashboard } from '../../components/lender/LenderDashboard';
import { SEED_LENDERS } from '../../data/seedData';

export const RecipientsPage: React.FC = () => {
  const { applications, language, setSelectedAuditApp } = useAppContext();

  return (
    <LenderDashboard
      applications={applications}
      language={language}
      onAuditApplication={(app) => setSelectedAuditApp(app)}
      lenders={SEED_LENDERS}
      initialTab="approved"
    />
  );
};
