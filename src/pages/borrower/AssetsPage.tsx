import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useBorrowerFormContext } from '../../context/BorrowerFormContext';
import { StepTracker } from '../../components/borrower/StepTracker';
import { MultiFileUploadCard } from '../../components/borrower/MultiFileUploadCard';
import { translations } from '../../i18n/translations';
import { Asset } from '../../types/types';
import { Sprout, Building, Truck, Store, Users, ArrowRight } from 'lucide-react';

export const AssetsPage: React.FC = () => {
  const { language } = useAppContext();
  const {
    assets,
    toggleAsset,
    assetDocuments,
    setAssetDocuments,
    saveCurrentStep
  } = useBorrowerFormContext();

  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  const handleNext = async () => {
    await saveCurrentStep();
    navigate('/borrower/community');
  };

  const handleBack = () => {
    navigate('/borrower/household');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
      <StepTracker currentStep={2} />

      <div className="space-y-6 rounded-2xl border border-theme-border bg-theme-surface p-6 shadow-xs">
        <div>
          <h2 className="font-serif-lora text-2xl font-bold text-theme-primary">
            {t.assets_title}
          </h2>
          <p className="text-xs text-theme-secondary mt-1">
            {t.assets_subtitle}
          </p>
        </div>

        {/* Asset Selection Grid */}
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
          {[
            { id: 'land', label: t.asset_land, icon: Sprout },
            { id: 'pucca_house', label: t.asset_pucca_house, icon: Building },
            { id: 'vehicle', label: t.asset_vehicle, icon: Truck },
            { id: 'shop_cart', label: t.asset_shop_cart, icon: Store },
            { id: 'livestock', label: t.asset_livestock, icon: Users },
          ].map((item) => {
            const IconComp = item.icon;
            const isSelected = assets.includes(item.id as Asset);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleAsset(item.id as Asset)}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all aspect-square ${
                  isSelected
                    ? 'border-[1.5px] border-theme-accent bg-theme-soft text-theme-accent font-bold shadow-xs'
                    : 'border-theme-border bg-theme-bg text-theme-primary hover:border-theme-accent'
                }`}
              >
                <IconComp className="h-8 w-8 mb-2 text-theme-accent" />
                <span className="text-xs font-bold leading-snug">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Optional MultiFileUploadCard for Asset Documents */}
        <MultiFileUploadCard
          title="Supporting documents for your assets (optional)"
          subtitle="Upload ownership certificates, land titles, registration documents, or photos if available."
          files={assetDocuments}
          onChange={setAssetDocuments}
        />

        <div className="flex justify-between pt-4 border-t border-theme-border">
          <button
            onClick={handleBack}
            className="rounded-xl border border-theme-border bg-theme-bg px-4 py-2.5 text-xs font-bold text-theme-secondary hover:text-theme-primary"
          >
            {t.back}
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 rounded-xl bg-theme-accent px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-90"
          >
            <span>{t.next}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
