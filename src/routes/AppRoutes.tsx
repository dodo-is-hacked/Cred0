import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LayoutShell } from '../components/common/LayoutShell';
import { BorrowerFormProvider } from '../context/BorrowerFormContext';

// Onboarding Gate Page
import { OnboardingGatePage } from '../pages/OnboardingGatePage';

// Borrower Pages
import { BasicDataPage } from '../pages/borrower/BasicDataPage';
import { HouseholdPage } from '../pages/borrower/HouseholdPage';
import { AssetsPage } from '../pages/borrower/AssetsPage';
import { CommunityPage } from '../pages/borrower/CommunityPage';
import { DocumentPage } from '../pages/borrower/DocumentPage';
import { BorrowerDashboardPage } from '../pages/borrower/BorrowerDashboardPage';

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
      {/* Welcome & Role Selection Gate (Outside LayoutShell) */}
      <Route path="/" element={<OnboardingGatePage />} />

      <Route element={<LayoutShell />}>
        {/* Borrower Onboarding Flow Routes */}
        <Route element={<BorrowerFormWrapper />}>
          <Route path="/borrower/basic" element={<BasicDataPage />} />
          <Route path="/borrower/household" element={<HouseholdPage />} />
          <Route path="/borrower/assets" element={<AssetsPage />} />
          <Route path="/borrower/community" element={<CommunityPage />} />
          <Route path="/borrower/document" element={<DocumentPage />} />
          <Route path="/borrower/dashboard" element={<BorrowerDashboardPage />} />
        </Route>

        {/* Lender Routes */}
        <Route path="/lender" element={<DashboardPage />} />
        <Route path="/lender/recipients" element={<RecipientsPage />} />
        <Route path="/lender/audit" element={<AuditPage />} />
        <Route path="/lender/audit/:id" element={<AuditPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
