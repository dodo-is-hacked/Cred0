import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useBorrowerFormContext } from '../../context/BorrowerFormContext';
import { StepTracker } from '../../components/borrower/StepTracker';
import { DocumentUpload } from '../../components/borrower/DocumentUpload';
import { UpiUploadCard } from '../../components/borrower/UpiUploadCard';

export const DocumentPage: React.FC = () => {
  const { language, currentBorrower } = useAppContext();
  const { handleVerifyDoc, upiTransactionCount, handleUpdateUpiCount } = useBorrowerFormContext();

  const navigate = useNavigate();

  const handleSkipOrContinue = () => {
    navigate('/borrower/score');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
      <StepTracker currentStep={5} />

      <DocumentUpload
        language={language}
        onVerifyDocument={async (type, name) => {
          await handleVerifyDoc(type, name);
          navigate('/borrower/score');
        }}
        onSkip={handleSkipOrContinue}
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
    </div>
  );
};
