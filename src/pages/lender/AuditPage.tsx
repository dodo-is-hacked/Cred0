import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { AuditPanelModal } from '../../components/lender/AuditPanelModal';
import { SEED_LENDERS } from '../../data/seedData';

export const AuditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { applications, language, handleApproveLoan, selectedAuditApp, setSelectedAuditApp } = useAppContext();

  const targetApp = (id ? applications.find(a => a.id === id) : null) || selectedAuditApp || applications[0];

  if (!targetApp) {
    return (
      <div className="p-12 text-center text-theme-secondary">
        No application selected for underwriting audit.
      </div>
    );
  }

  return (
    <div className="py-6">
      <AuditPanelModal
        application={targetApp}
        language={language}
        onClose={() => {
          setSelectedAuditApp(null);
          navigate('/lender');
        }}
        onApproveLoan={async (appId, offer) => {
          await handleApproveLoan(appId, offer);
          navigate('/lender/recipients');
        }}
        lenders={SEED_LENDERS}
      />
    </div>
  );
};
