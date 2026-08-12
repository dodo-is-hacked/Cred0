import React, { useState, useEffect } from 'react';
import { BorrowerProfile, Language, Occupation, Education, Asset, GroupType, ScoreResult, Offer } from '../../types';
import { translations } from '../../i18n/translations';
import { ScoreGauge } from './ScoreGauge';
import { ShapBreakdown } from './ShapBreakdown';
import { OptimizationPlan } from './OptimizationPlan';
import { DocumentUpload } from './DocumentUpload';
import { api } from '../../services/api';
import { formatIndianCurrency } from '../../utils/formatters';
import {
  ShieldAlert,
  UserCheck,
  Briefcase,
  Users,
  Building,
  CheckCircle,
  Share2,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Plus,
  Minus,
  Check,
  CheckCircle2,
  Truck,
  Sprout,
  Store,
  HelpCircle
} from 'lucide-react';

interface BorrowerWorkflowProps {
  language: Language;
  borrower: BorrowerProfile;
  onUpdateBorrower: (updated: BorrowerProfile) => void;
  onSwitchToLenderView: () => void;
  scoreResult: ScoreResult | null;
  onRefreshScore: () => void;
}

export const BorrowerWorkflow: React.FC<BorrowerWorkflowProps> = ({
  language,
  borrower,
  onUpdateBorrower,
  onSwitchToLenderView,
  scoreResult,
  onRefreshScore,
}) => {
  const t = translations[language] || translations.en;

  const [activeStep, setActiveStep] = useState<number>(0);
  
  // Local Form state initialized from borrower prop
  const [phone, setPhone] = useState(borrower.phone || '');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  
  const [occupation, setOccupation] = useState<Occupation>(borrower.occupation || 'street_vendor');
  const [age, setAge] = useState<number>(borrower.age || 38);
  const [education, setEducation] = useState<Education>(borrower.education || 'primary');
  
  const [householdSize, setHouseholdSize] = useState<number>(borrower.householdSize || 4);
  const [earningMembers, setEarningMembers] = useState<number>(borrower.earningMembers || 2);
  
  const [assets, setAssets] = useState<Asset[]>(borrower.assets || []);
  
  const [communityActive, setCommunityActive] = useState<boolean>(borrower.communityTie?.active ?? true);
  const [groupType, setGroupType] = useState<GroupType>(borrower.communityTie?.groupType || 'shg');

  const [appliedActions, setAppliedActions] = useState<string[]>([]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastDone, setBroadcastDone] = useState(borrower.sharedWithMarketplace || false);
  const [activeOffers, setActiveOffers] = useState<Offer[]>([]);

  // Sync state when props change
  useEffect(() => {
    setPhone(borrower.phone || '');
    setOccupation(borrower.occupation);
    setAge(borrower.age);
    setEducation(borrower.education);
    setHouseholdSize(borrower.householdSize);
    setEarningMembers(borrower.earningMembers);
    setAssets(borrower.assets);
    setCommunityActive(borrower.communityTie?.active ?? false);
    setGroupType(borrower.communityTie?.groupType || 'shg');
    setBroadcastDone(borrower.sharedWithMarketplace || false);

    // Fetch active offers for borrower
    api.getApplications().then(apps => {
      const myApp = apps.find(a => a.borrowerId === borrower.id);
      if (myApp && myApp.offer) {
        setActiveOffers([myApp.offer]);
      } else {
        setActiveOffers([]);
      }
    });
  }, [borrower]);

  // Save changes & compute live score
  const handleNextStep = async () => {
    const updatedProfile: BorrowerProfile = {
      ...borrower,
      phone,
      occupation,
      age,
      education,
      householdSize,
      earningMembers,
      assets,
      communityTie: {
        active: communityActive,
        groupType: communityActive ? groupType : undefined
      }
    };

    const saved = await api.saveProfile(updatedProfile);
    onUpdateBorrower(saved);
    await api.computeScore(saved);
    onRefreshScore();

    if (activeStep < 8) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  // Asset toggle helper
  const toggleAsset = (a: Asset) => {
    if (assets.includes(a)) {
      setAssets(assets.filter(x => x !== a));
    } else {
      setAssets([...assets, a]);
    }
  };

  // Simulate optimization recommendation action
  const handleApplyRecommendation = async (actionKey: string) => {
    if (appliedActions.includes(actionKey)) return;

    let updatedAssets = [...assets];
    let updatedCommunity = { ...borrower.communityTie };
    let updatedEarners = earningMembers;
    let updatedDocVerified = borrower.documentVerified;

    if (actionKey === 'join_shg') {
      updatedCommunity = { active: true, groupType: 'shg' };
      setCommunityActive(true);
      setGroupType('shg');
    } else if (actionKey === 'verify_doc') {
      updatedDocVerified = true;
    } else if (actionKey === 'add_asset') {
      if (!updatedAssets.includes('land')) updatedAssets.push('land');
      setAssets(updatedAssets);
    } else if (actionKey === 'add_earner') {
      updatedEarners += 1;
      setEarningMembers(updatedEarners);
    }

    const updatedProfile: BorrowerProfile = {
      ...borrower,
      assets: updatedAssets,
      communityTie: updatedCommunity,
      earningMembers: updatedEarners,
      documentVerified: updatedDocVerified
    };

    const saved = await api.saveProfile(updatedProfile);
    onUpdateBorrower(saved);
    await api.computeScore(saved);
    onRefreshScore();
    setAppliedActions([...appliedActions, actionKey]);
  };

  // Document verification callback
  const handleVerifyDoc = async (type: string, name: string) => {
    const updated = await api.saveProfile({
      ...borrower,
      documentVerified: true,
      documentType: type,
      documentName: name
    });
    onUpdateBorrower(updated);
    await api.computeScore(updated);
    onRefreshScore();
  };

  // Marketplace broadcast
  const handleBroadcastToLenders = async () => {
    setIsBroadcasting(true);
    await api.shareWithMarketplace(borrower.id);
    setIsBroadcasting(false);
    setBroadcastDone(true);
  };

  // Accept offer
  const handleAcceptOffer = async (applicationId: string) => {
    await api.acceptLoanOffer(applicationId);
    api.getApplications().then(apps => {
      const myApp = apps.find(a => a.borrowerId === borrower.id);
      if (myApp && myApp.offer) {
        setActiveOffers([myApp.offer]);
      }
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
      
      {/* Step Tracker Indicator */}
      <div className="rounded-2xl border border-theme-border bg-theme-surface p-4 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-theme-secondary mb-2">
          <span className="uppercase tracking-wider text-theme-accent">
            Borrower Onboarding & Score Reveal
          </span>
          <span>Step {activeStep + 1} of 9</span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-theme-bg">
          <div
            className="h-full bg-theme-accent transition-all duration-300"
            style={{ width: `${((activeStep + 1) / 9) * 100}%` }}
          />
        </div>

        {/* Step Buttons Quick Navigation */}
        <div className="mt-3 flex overflow-x-auto gap-1 pb-1 scrollbar-none">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <button
              key={s}
              onClick={() => setActiveStep(s)}
              className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                activeStep === s
                  ? 'bg-theme-accent text-white'
                  : s < activeStep
                  ? 'bg-theme-soft text-theme-accent'
                  : 'bg-theme-bg text-theme-secondary hover:text-theme-primary'
              }`}
            >
              Step {s + 1}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 0: PHONE & OTP AUTH */}
      {activeStep === 0 && (
        <div className="space-y-6 rounded-2xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-xs">
          <div className="text-center max-w-md mx-auto space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-theme-soft text-theme-accent">
              <Smartphone className="h-7 w-7" />
            </div>
            <h2 className="font-serif-lora text-2xl sm:text-3xl font-bold text-theme-primary">
              {t.auth_title}
            </h2>
            <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
              {t.auth_subtitle}
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-theme-secondary mb-1.5">
                {t.mobile_label}
              </label>
              <div className="flex h-[52px] rounded-xl border border-theme-border bg-theme-bg overflow-hidden focus-within:border-theme-accent">
                <span className="flex items-center px-4 bg-theme-surface border-r border-theme-border text-sm font-bold text-theme-secondary">
                  +91
                </span>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full px-4 py-3 text-base font-semibold text-theme-primary bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {!otpSent ? (
              <button
                onClick={() => {
                  if (phone.trim().length >= 10) {
                    setOtpSent(true);
                    setOtp('1234');
                  } else {
                    setOtpSent(true);
                    setOtp('1234');
                  }
                }}
                className="w-full h-[54px] rounded-xl bg-theme-accent text-base font-bold text-white shadow-sm hover:opacity-90 flex items-center justify-center gap-2"
              >
                <span>Send Verification OTP</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <div className="space-y-4 rounded-2xl border border-theme-border bg-theme-bg p-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-theme-secondary mb-1">
                    Enter 4-Digit OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    maxLength={4}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      if (e.target.value.length === 4) {
                        setOtpVerified(true);
                      }
                    }}
                    placeholder="1234"
                    className="w-full h-[52px] rounded-xl border border-theme-border bg-theme-surface px-4 text-center text-xl font-mono font-bold tracking-widest text-theme-primary focus:border-theme-accent focus:outline-none"
                  />
                  <p className="text-xs text-theme-accent mt-1.5 text-center font-medium">
                    Demo OTP code pre-filled as 1234.
                  </p>
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full h-[54px] rounded-xl bg-theme-accent text-base font-bold text-white shadow-sm hover:opacity-90 flex items-center justify-center gap-2"
                >
                  <span>Verify & Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Bias prevention banner */}
            <div className="rounded-xl border border-theme-border bg-theme-soft/50 p-3.5 text-center">
              <p className="text-xs font-bold text-theme-accent flex items-center justify-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                {t.bias_banner}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: BASIC DATA & OCCUPATION */}
      {activeStep === 1 && (
        <div className="space-y-6 rounded-2xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-xs">
          <div>
            <h2 className="font-serif-lora text-2xl sm:text-3xl font-bold text-theme-primary">
              {t.occupation_title}
            </h2>
            <p className="text-xs sm:text-sm text-theme-secondary mt-1">
              {t.occupation_subtitle}
            </p>
          </div>

          {/* Occupation Single Select Cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { id: 'street_vendor', label: t.occ_street_vendor, icon: Store },
              { id: 'gig_worker', label: t.occ_gig_worker, icon: Truck },
              { id: 'small_farmer', label: t.occ_small_farmer, icon: Sprout },
              { id: 'self_employed', label: t.occ_self_employed, icon: Briefcase },
            ].map((item) => {
              const IconComp = item.icon;
              const isSelected = occupation === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setOccupation(item.id as Occupation)}
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'border-2 border-theme-accent bg-theme-soft text-theme-accent font-bold shadow-xs'
                      : 'border-theme-border bg-theme-bg text-theme-primary hover:border-theme-accent'
                  }`}
                >
                  <IconComp className="h-8 w-8 mb-2 text-theme-accent" />
                  <span className="text-xs sm:text-sm font-bold leading-snug">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Age Input & Education */}
          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            {/* Age Direct Manual Typing + Stepper */}
            <div className="space-y-2 rounded-2xl border border-theme-border bg-theme-bg p-4 sm:p-5">
              <label className="block text-xs font-bold uppercase text-theme-secondary">
                {t.age_label}
              </label>
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setAge(Math.max(18, age - 1))}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-theme-border bg-theme-surface text-theme-primary hover:border-theme-accent text-lg font-bold"
                >
                  <Minus className="h-5 w-5" />
                </button>

                <input
                  type="number"
                  min={18}
                  max={75}
                  value={age}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) setAge(Math.min(75, Math.max(18, val)));
                    else setAge(18);
                  }}
                  className="w-24 text-center font-serif-lora text-3xl font-extrabold rounded-xl border border-theme-border bg-theme-surface py-2 text-theme-primary focus:border-theme-accent focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => setAge(Math.min(75, age + 1))}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-theme-border bg-theme-surface text-theme-primary hover:border-theme-accent text-lg font-bold"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Education Dropdown */}
            <div className="space-y-2 rounded-2xl border border-theme-border bg-theme-bg p-4 sm:p-5">
              <label className="block text-xs font-bold uppercase text-theme-secondary">
                {t.education_label}
              </label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value as Education)}
                className="w-full h-[52px] rounded-xl border border-theme-border bg-theme-surface px-4 text-sm font-bold text-theme-primary focus:border-theme-accent focus:outline-none"
              >
                <option value="none">{t.edu_none}</option>
                <option value="primary">{t.edu_primary}</option>
                <option value="secondary">{t.edu_secondary}</option>
                <option value="graduate">{t.edu_graduate}</option>
              </select>
            </div>
          </div>

          {/* Nav buttons */}
          <div className="flex justify-between pt-4 border-t border-theme-border">
            <button
              onClick={handlePrevStep}
              className="rounded-xl border border-theme-border bg-theme-bg px-5 py-3 text-xs sm:text-sm font-bold text-theme-secondary hover:text-theme-primary"
            >
              {t.back}
            </button>
            <button
              onClick={handleNextStep}
              className="flex items-center gap-2 rounded-xl bg-theme-accent px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-sm hover:opacity-90"
            >
              <span>{t.next}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: HOUSEHOLD PROFILE */}
      {activeStep === 2 && (
        <div className="space-y-6 rounded-2xl border border-theme-border bg-theme-surface p-6 shadow-xs">
          <div>
            <h2 className="font-serif-lora text-2xl font-bold text-theme-primary">
              {t.household_title}
            </h2>
            <p className="text-xs text-theme-secondary mt-1">
              {t.household_subtitle}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Total Household Size Stepper */}
            <div className="space-y-2 rounded-2xl border border-theme-border bg-theme-bg p-5">
              <label className="block text-xs font-bold uppercase text-theme-secondary">
                {t.total_household_size}
              </label>
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setHouseholdSize(Math.max(1, householdSize - 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-theme-border bg-theme-surface text-theme-primary hover:border-theme-accent"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="font-serif-lora text-4xl font-extrabold text-theme-primary">
                  {householdSize}
                </span>
                <button
                  type="button"
                  onClick={() => setHouseholdSize(Math.min(15, householdSize + 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-theme-border bg-theme-surface text-theme-primary hover:border-theme-accent"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Earning Members Stepper */}
            <div className="space-y-2 rounded-2xl border border-theme-border bg-theme-bg p-5">
              <label className="block text-xs font-bold uppercase text-theme-secondary">
                {t.earning_members}
              </label>
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setEarningMembers(Math.max(0, earningMembers - 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-theme-border bg-theme-surface text-theme-primary hover:border-theme-accent"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="font-serif-lora text-4xl font-extrabold text-theme-accent">
                  {earningMembers}
                </span>
                <button
                  type="button"
                  onClick={() => setEarningMembers(Math.min(householdSize, earningMembers + 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-theme-border bg-theme-surface text-theme-primary hover:border-theme-accent"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-theme-border">
            <button
              onClick={handlePrevStep}
              className="rounded-xl border border-theme-border bg-theme-bg px-4 py-2.5 text-xs font-bold text-theme-secondary hover:text-theme-primary"
            >
              {t.back}
            </button>
            <button
              onClick={handleNextStep}
              className="flex items-center gap-2 rounded-xl bg-theme-accent px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-90"
            >
              <span>{t.next}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: ASSETS */}
      {activeStep === 3 && (
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

          <div className="flex justify-between pt-4 border-t border-theme-border">
            <button
              onClick={handlePrevStep}
              className="rounded-xl border border-theme-border bg-theme-bg px-4 py-2.5 text-xs font-bold text-theme-secondary hover:text-theme-primary"
            >
              {t.back}
            </button>
            <button
              onClick={handleNextStep}
              className="flex items-center gap-2 rounded-xl bg-theme-accent px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-90"
            >
              <span>{t.next}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: COMMUNITY TIES */}
      {activeStep === 4 && (
        <div className="space-y-6 rounded-2xl border border-theme-border bg-theme-surface p-6 shadow-xs">
          <div>
            <h2 className="font-serif-lora text-2xl font-bold text-theme-primary">
              {t.community_title}
            </h2>
            <p className="text-xs text-theme-secondary mt-1">
              {t.community_subtitle}
            </p>
          </div>

          {/* Toggle Member Switch */}
          <div className="flex items-center justify-between rounded-2xl border border-theme-border bg-theme-bg p-4">
            <span className="text-xs font-bold text-theme-primary max-w-xs sm:max-w-md">
              {t.community_toggle}
            </span>
            <button
              type="button"
              onClick={() => setCommunityActive(!communityActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                communityActive ? 'bg-theme-accent' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  communityActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Select Group Type if active */}
          {communityActive && (
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold uppercase text-theme-secondary">
                {t.group_type_label}
              </label>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {[
                  { id: 'shg', label: t.group_shg },
                  { id: 'cooperative', label: t.group_cooperative },
                  { id: 'fpo', label: t.group_fpo },
                  { id: 'union', label: t.group_union },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGroupType(item.id as GroupType)}
                    className={`flex items-center justify-between rounded-xl border p-3.5 text-xs font-bold transition-all ${
                      groupType === item.id
                        ? 'border-2 border-theme-accent bg-theme-soft text-theme-accent'
                        : 'border-theme-border bg-theme-bg text-theme-primary hover:border-theme-accent'
                    }`}
                  >
                    <span>{item.label}</span>
                    {groupType === item.id && <Check className="h-4 w-4 text-theme-accent" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-theme-border">
            <button
              onClick={handlePrevStep}
              className="rounded-xl border border-theme-border bg-theme-bg px-4 py-2.5 text-xs font-bold text-theme-secondary hover:text-theme-primary"
            >
              {t.back}
            </button>
            <button
              onClick={handleNextStep}
              className="flex items-center gap-2 rounded-xl bg-theme-accent px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-90"
            >
              <span>{t.next}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: DOCUMENT UPLOAD */}
      {activeStep === 5 && (
        <DocumentUpload
          language={language}
          onVerifyDocument={handleVerifyDoc}
          onSkip={handleNextStep}
          verified={borrower.documentVerified}
          docName={borrower.documentName}
        />
      )}

      {/* STEP 6: SCORE REVEAL */}
      {activeStep === 6 && scoreResult && (
        <div className="space-y-6">
          <ScoreGauge scoreResult={scoreResult} language={language} />

          <ShapBreakdown
            factors={scoreResult.shapFactors}
            language={language}
            aiInsight={scoreResult.aiInsight}
          />

          <div className="flex justify-between pt-4">
            <button
              onClick={handlePrevStep}
              className="rounded-xl border border-theme-border bg-theme-surface px-4 py-2.5 text-xs font-bold text-theme-secondary hover:text-theme-primary"
            >
              {t.back}
            </button>
            <button
              onClick={() => setActiveStep(7)}
              className="flex items-center gap-2 rounded-xl bg-theme-accent px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-90"
            >
              <span>View Score Optimization Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: OPTIMIZATION PLAN */}
      {activeStep === 7 && scoreResult && (
        <div className="space-y-6">
          <OptimizationPlan
            recommendations={scoreResult.recommendations}
            language={language}
            onApplyRecommendation={handleApplyRecommendation}
            appliedActions={appliedActions}
          />

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveStep(6)}
              className="rounded-xl border border-theme-border bg-theme-surface px-4 py-2.5 text-xs font-bold text-theme-secondary hover:text-theme-primary"
            >
              {t.back}
            </button>
            <button
              onClick={() => setActiveStep(8)}
              className="flex items-center gap-2 rounded-xl bg-theme-accent px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-90"
            >
              <span>Proceed to Marketplace Submission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: MARKETPLACE SUBMISSION & OFFERS */}
      {activeStep === 8 && (
        <div className="space-y-6 rounded-2xl border border-theme-border bg-theme-surface p-6 shadow-xs">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-theme-soft text-theme-accent">
              <Share2 className="h-6 w-6" />
            </div>
            <h2 className="font-serif-lora text-2xl font-bold text-theme-primary">
              {t.market_title}
            </h2>
            <p className="text-xs text-theme-secondary leading-relaxed">
              {t.market_subtitle}
            </p>
          </div>

          {/* Broadcast Action Box */}
          <div className="rounded-2xl border border-theme-border bg-theme-bg p-6 text-center space-y-4">
            {broadcastDone ? (
              <div className="space-y-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-2xs">
                  <CheckCircle2 className="w-4 h-4" />
                  {t.shared_success}
                </div>
                <p className="text-sm font-semibold text-theme-primary leading-relaxed">
                  Your application has been broadcast to all registered lenders.
                </p>
                <p className="text-xs text-theme-secondary">
                  Lenders in the TRUST Marketplace can now review your explainable trust score and issue loan offers. You can track sanction status below or switch views anytime using the top navigation bar.
                </p>
              </div>
            ) : (
              <button
                onClick={handleBroadcastToLenders}
                disabled={isBroadcasting}
                className="w-full max-w-sm mx-auto rounded-xl bg-theme-accent py-4 text-sm font-bold text-white shadow-md hover:opacity-90 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                {isBroadcasting ? (
                  <span>Broadcasting Application...</span>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Send Request to Lenders</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Active Loan Offers Section */}
          <div className="space-y-3 pt-4 border-t border-theme-border">
            <h3 className="font-serif-lora text-lg font-bold text-theme-primary flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-theme-accent" />
              {t.offers_title}
            </h3>

            {activeOffers.length === 0 ? (
              <div className="p-4 rounded-xl border border-theme-border bg-theme-bg text-center text-xs text-theme-secondary">
                {t.no_offers}
              </div>
            ) : (
              <div className="space-y-3">
                {activeOffers.map((off) => (
                  <div
                    key={off.id}
                    className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/30"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-theme-primary flex items-center gap-2">
                        <span>{off.lenderName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-600 text-white font-extrabold uppercase">
                          Sanctioned
                        </span>
                      </div>
                      <p className="text-xs text-theme-secondary">
                        Sanctioned Amount: <span className="font-bold text-theme-primary">{formatIndianCurrency(off.amount)}</span> @ {off.interestRatePct}% p.a. for {off.tenureMonths} Months
                      </p>
                      {off.monthlyEmi && (
                        <p className="text-xs font-mono font-semibold text-theme-accent">
                          Estimated Monthly EMI: {formatIndianCurrency(off.monthlyEmi)}
                        </p>
                      )}
                    </div>

                    <div>
                      {off.status === 'accepted' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold">
                          <Check className="w-4 h-4" />
                          Offer Accepted
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAcceptOffer(`app_${borrower.id}`)}
                          className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                        >
                          {t.accept_offer}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
