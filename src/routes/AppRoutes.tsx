import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LayoutShell } from '../components/common/LayoutShell';
import { BorrowerFormProvider } from '../context/BorrowerFormContext';

// Borrower Pages
import { AuthPage } from '../pages/borrower/AuthPage';
import { BasicDataPage } from '../pages/borrower/BasicDataPage';
import { HouseholdPage } from '../pages/borrower/HouseholdPage';
import { AssetsPage } from '../pages/borrower/AssetsPage';
import { CommunityPage } from '../pages/borrower/CommunityPage';
import { DocumentPage } from '../pages/borrower/DocumentPage';
import { ScoreRevealPage } from '../pages/borrower/ScoreRevealPage';
import { OptimizationPage } from '../pages/borrower/OptimizationPage';
import { MarketplaceSharePage } from '../pages/borrower/MarketplaceSharePage';

// Lender Pages
import { DashboardPage } from '../pages/lender/DashboardPage';
import { RecipientsPage } from '../pages/lender/RecipientsPage';
import { AuditPage } from '../pages/lender/AuditPage';

const BorrowerFormWrapper: React.FC = () => (
  <BorrowerFormProvider>
    <Outlet />
  </BorrowerFormProvider>
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<LayoutShell />}>
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/borrower/auth" replace />} />

        {/* Borrower Onboarding Flow Routes */}
        <Route element={<BorrowerFormWrapper />}>
          <Route path="/borrower/auth" element={<AuthPage />} />
          <Route path="/borrower/basic" element={<BasicDataPage />} />
          <Route path="/borrower/household" element={<HouseholdPage />} />
          <Route path="/borrower/assets" element={<AssetsPage />} />
          <Route path="/borrower/community" element={<CommunityPage />} />
          <Route path="/borrower/document" element={<DocumentPage />} />
          <Route path="/borrower/score" element={<ScoreRevealPage />} />
          <Route path="/borrower/optimize" element={<OptimizationPage />} />
          <Route path="/borrower/marketplace" element={<MarketplaceSharePage />} />
        </Route>

        {/* Lender Routes */}
        <Route path="/lender" element={<DashboardPage />} />
        <Route path="/lender/recipients" element={<RecipientsPage />} />
        <Route path="/lender/audit" element={<AuditPage />} />
        <Route path="/lender/audit/:id" element={<AuditPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/borrower/auth" replace />} />
      </Route>
    </Routes>
  );
};
