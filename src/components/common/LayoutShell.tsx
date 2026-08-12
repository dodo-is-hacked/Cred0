import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useAppContext } from '../../context/AppContext';
import { AuditPanelModal } from '../lender/AuditPanelModal';
import { SEED_LENDERS } from '../../data/seedData';

export const LayoutShell: React.FC = () => {
  const {
    language,
    selectedAuditApp,
    setSelectedAuditApp,
    handleApproveLoan
  } = useAppContext();

  return (
    <div className="min-h-screen bg-theme-bg text-theme-primary font-sans transition-colors">
      <Navbar />

      <main className="pb-16">
        <Outlet />
      </main>

      {selectedAuditApp && (
        <AuditPanelModal
          application={selectedAuditApp}
          language={language}
          onClose={() => setSelectedAuditApp(null)}
          onApproveLoan={handleApproveLoan}
          lenders={SEED_LENDERS}
        />
      )}
    </div>
  );
};
