import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BorrowerProfile,
  Occupation,
  Education,
  Asset,
  GroupType,
  Offer,
  Gender,
  MaritalStatus,
  SchoolType,
  UploadedDoc
} from '../types/types';
import { useAppContext } from './AppContext';
import { api } from '../services/api';

interface BorrowerFormContextType {
  name: string;
  setName: (val: string) => void;
  gender: Gender;
  setGender: (val: Gender) => void;
  maritalStatus: MaritalStatus;
  setMaritalStatus: (val: MaritalStatus) => void;
  hasChildren: boolean;
  setHasChildren: (val: boolean) => void;
  childrenSchoolType?: SchoolType;
  setChildrenSchoolType: (val: SchoolType | undefined) => void;
  headOfHouseholdGender: Gender;
  setHeadOfHouseholdGender: (val: Gender) => void;
  longTermIllness: boolean;
  setLongTermIllness: (val: boolean) => void;
  upiTransactionCount: number;
  setUpiTransactionCount: (val: number) => void;
  handleUpdateUpiCount: (count: number) => Promise<void>;
  occupation: Occupation;
  setOccupation: (val: Occupation) => void;
  age: number;
  setAge: (val: number) => void;
  education: Education;
  setEducation: (val: Education) => void;
  householdSize: number;
  setHouseholdSize: (val: number) => void;
  earningMembers: number;
  setEarningMembers: (val: number) => void;
  assets: Asset[];
  setAssets: (val: Asset[]) => void;
  toggleAsset: (a: Asset) => void;
  communityActive: boolean;
  setCommunityActive: (val: boolean) => void;
  groupType: GroupType;
  setGroupType: (val: GroupType) => void;
  assetDocuments: UploadedDoc[];
  setAssetDocuments: (docs: UploadedDoc[]) => void;
  communityDocuments: UploadedDoc[];
  setCommunityDocuments: (docs: UploadedDoc[]) => void;
  requestedLoanAmount?: number;
  setRequestedLoanAmount: (amount?: number) => void;
  appliedActions: string[];
  isBroadcasting: boolean;
  broadcastDone: boolean;
  activeOffers: Offer[];
  saveCurrentStep: () => Promise<void>;
  completeOnboarding: (amount?: number) => Promise<void>;
  handleApplyRecommendation: (actionKey: string) => Promise<void>;
  handleVerifyDoc: (type: string, name: string) => Promise<void>;
  handleBroadcastToLenders: (amount?: number) => Promise<void>;
  handleAcceptOffer: (applicationId: string) => Promise<void>;
}

const BorrowerFormContext = createContext<BorrowerFormContextType | undefined>(undefined);

export const BorrowerFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentBorrower, handleUpdateBorrower } = useAppContext();

  const [name, setName] = useState<string>(currentBorrower?.name || '');
  const [gender, setGender] = useState<Gender>(currentBorrower?.gender || 'female');
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>(currentBorrower?.maritalStatus || 'married');
  const [hasChildren, setHasChildren] = useState<boolean>(currentBorrower?.hasChildren ?? true);
  const [childrenSchoolType, setChildrenSchoolType] = useState<SchoolType | undefined>(currentBorrower?.childrenSchoolType || 'government');
  const [headOfHouseholdGender, setHeadOfHouseholdGender] = useState<Gender>(currentBorrower?.headOfHouseholdGender || 'female');
  const [longTermIllness, setLongTermIllness] = useState<boolean>(currentBorrower?.longTermIllness ?? false);
  const [upiTransactionCount, setUpiTransactionCount] = useState<number>(currentBorrower?.upiTransactionCount || 0);

  const [occupation, setOccupation] = useState<Occupation>(currentBorrower?.occupation || 'street_vendor');
  const [age, setAge] = useState<number>(currentBorrower?.age || 38);
  const [education, setEducation] = useState<Education>(currentBorrower?.education || 'primary');

  const [householdSize, setHouseholdSize] = useState<number>(currentBorrower?.householdSize || 4);
  const [earningMembers, setEarningMembers] = useState<number>(currentBorrower?.earningMembers || 2);

  const [assets, setAssets] = useState<Asset[]>(currentBorrower?.assets || []);

  const [communityActive, setCommunityActive] = useState<boolean>(currentBorrower?.communityTie?.active ?? true);
  const [groupType, setGroupType] = useState<GroupType>(currentBorrower?.communityTie?.groupType || 'shg');

  const [assetDocuments, setAssetDocuments] = useState<UploadedDoc[]>(currentBorrower?.assetDocuments || []);
  const [communityDocuments, setCommunityDocuments] = useState<UploadedDoc[]>(currentBorrower?.communityDocuments || []);
  const [requestedLoanAmount, setRequestedLoanAmount] = useState<number | undefined>(currentBorrower?.requestedLoanAmount);

  const [appliedActions, setAppliedActions] = useState<string[]>([]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastDone, setBroadcastDone] = useState(currentBorrower?.sharedWithMarketplace || false);
  const [activeOffers, setActiveOffers] = useState<Offer[]>([]);

  useEffect(() => {
    if (currentBorrower) {
      setName(currentBorrower.name || '');
      setGender(currentBorrower.gender || 'female');
      setMaritalStatus(currentBorrower.maritalStatus || 'married');
      setHasChildren(currentBorrower.hasChildren ?? true);
      setChildrenSchoolType(currentBorrower.childrenSchoolType || 'government');
      setHeadOfHouseholdGender(currentBorrower.headOfHouseholdGender || 'female');
      setLongTermIllness(currentBorrower.longTermIllness ?? false);
      setUpiTransactionCount(currentBorrower.upiTransactionCount || 0);

      setOccupation(currentBorrower.occupation);
      setAge(currentBorrower.age);
      setEducation(currentBorrower.education);
      setHouseholdSize(currentBorrower.householdSize);
      setEarningMembers(currentBorrower.earningMembers);
      setAssets(currentBorrower.assets || []);
      setCommunityActive(currentBorrower.communityTie?.active ?? false);
      setGroupType(currentBorrower.communityTie?.groupType || 'shg');
      setAssetDocuments(currentBorrower.assetDocuments || []);
      setCommunityDocuments(currentBorrower.communityDocuments || []);
      setRequestedLoanAmount(currentBorrower.requestedLoanAmount);
      setBroadcastDone(currentBorrower.sharedWithMarketplace || false);

      api.getApplications().then(apps => {
        const myApp = apps.find(a => a.borrowerId === currentBorrower.id);
        if (myApp && myApp.offer) {
          setActiveOffers([myApp.offer]);
        } else {
          setActiveOffers([]);
        }
      });
    }
  }, [currentBorrower]);

  // Helper to remove any undefined keys before sending to Firestore
  const sanitizeObject = (obj: any) => {
    return JSON.parse(JSON.stringify(obj));
  };

  const saveCurrentStep = async () => {
    const rawProfile = {
      id: currentBorrower?.id || `bor_${Date.now()}`,
      name: name.trim() || 'Anonymous Borrower',
      gender: gender || 'female',
      maritalStatus: maritalStatus || 'married',
      hasChildren: Boolean(hasChildren),
      childrenSchoolType: hasChildren ? (childrenSchoolType || 'government') : null,
      headOfHouseholdGender: headOfHouseholdGender || 'female',
      longTermIllness: Boolean(longTermIllness),
      upiTransactionCount: Number(upiTransactionCount) || 0,
      occupation: occupation || 'street_vendor',
      age: Number(age) || 30,
      education: education || 'secondary',
      householdSize: Number(householdSize) || 4,
      earningMembers: Number(earningMembers) || 1,
      assets: assets || [],
      communityTie: {
        active: Boolean(communityActive),
        groupType: communityActive ? (groupType || 'shg') : 'none'
      },
      assetDocuments: assetDocuments || [],
      communityDocuments: communityDocuments || [],
      requestedLoanAmount: requestedLoanAmount || 50000,
      language: currentBorrower?.language || 'en',
      documentVerified: currentBorrower?.documentVerified || false,
      createdAt: currentBorrower?.createdAt || new Date().toISOString(),
      sharedWithMarketplace: currentBorrower?.sharedWithMarketplace ?? true,
      onboardingComplete: currentBorrower?.onboardingComplete || false
    };

    const cleanProfile = sanitizeObject(rawProfile) as BorrowerProfile;
    await handleUpdateBorrower(cleanProfile);
  };

  const completeOnboarding = async (amount?: number) => {
    const finalAmount = amount !== undefined ? amount : (requestedLoanAmount || 50000);
    const rawProfile = {
      id: currentBorrower?.id || `bor_${Date.now()}`,
      name: name.trim() || 'Anonymous Borrower',
      gender: gender || 'female',
      maritalStatus: maritalStatus || 'married',
      hasChildren: Boolean(hasChildren),
      childrenSchoolType: hasChildren ? (childrenSchoolType || 'government') : null,
      headOfHouseholdGender: headOfHouseholdGender || 'female',
      longTermIllness: Boolean(longTermIllness),
      upiTransactionCount: Number(upiTransactionCount) || 0,
      occupation: occupation || 'street_vendor',
      age: Number(age) || 30,
      education: education || 'secondary',
      householdSize: Number(householdSize) || 4,
      earningMembers: Number(earningMembers) || 1,
      assets: assets || [],
      communityTie: {
        active: Boolean(communityActive),
        groupType: communityActive ? (groupType || 'shg') : 'none'
      },
      assetDocuments: assetDocuments || [],
      communityDocuments: communityDocuments || [],
      requestedLoanAmount: finalAmount,
      language: currentBorrower?.language || 'en',
      documentVerified: currentBorrower?.documentVerified || false,
      createdAt: currentBorrower?.createdAt || new Date().toISOString(),
      sharedWithMarketplace: true,
      onboardingComplete: true
    };

    const cleanProfile = sanitizeObject(rawProfile) as BorrowerProfile;
    await handleUpdateBorrower(cleanProfile);

    if (finalAmount > 0) {
      setIsBroadcasting(true);
      await api.shareWithMarketplace(cleanProfile.id, finalAmount);
      setIsBroadcasting(false);
      setBroadcastDone(true);
    }
  };

  const handleUpdateUpiCount = async (count: number) => {
    setUpiTransactionCount(count);
    if (!currentBorrower) return;
    const updatedProfile: BorrowerProfile = {
      ...currentBorrower,
      upiTransactionCount: count
    };
    await handleUpdateBorrower(updatedProfile);
  };

  const toggleAsset = (a: Asset) => {
    if (assets.includes(a)) {
      setAssets(assets.filter(x => x !== a));
    } else {
      setAssets([...assets, a]);
    }
  };

  const handleApplyRecommendation = async (actionKey: string) => {
    if (!currentBorrower || appliedActions.includes(actionKey)) return;

    let updatedAssets = [...assets];
    let updatedCommunity = { ...currentBorrower.communityTie };
    let updatedEarners = earningMembers;
    let updatedDocVerified = currentBorrower.documentVerified;

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
      ...currentBorrower,
      assets: updatedAssets,
      communityTie: updatedCommunity,
      earningMembers: updatedEarners,
      documentVerified: updatedDocVerified
    };

    await handleUpdateBorrower(updatedProfile);
    setAppliedActions([...appliedActions, actionKey]);
  };

  const handleVerifyDoc = async (type: string, name: string) => {
    if (!currentBorrower) return;
    const updated: BorrowerProfile = {
      ...currentBorrower,
      documentVerified: true,
      documentType: type,
      documentName: name
    };
    await handleUpdateBorrower(updated);
  };

  const handleBroadcastToLenders = async (amount?: number) => {
    if (!currentBorrower) return;
    const reqAmt = amount !== undefined ? amount : (requestedLoanAmount || 50000);
    setIsBroadcasting(true);
    await api.shareWithMarketplace(currentBorrower.id, reqAmt);
    setIsBroadcasting(false);
    setBroadcastDone(true);
  };

  const handleAcceptOffer = async (applicationId: string) => {
    if (!currentBorrower) return;
    await api.acceptLoanOffer(applicationId);
    api.getApplications().then(apps => {
      const myApp = apps.find(a => a.borrowerId === currentBorrower.id);
      if (myApp && myApp.offer) {
        setActiveOffers([myApp.offer]);
      }
    });
  };

  return (
    <BorrowerFormContext.Provider
      value={{
        name,
        setName,
        gender,
        setGender,
        maritalStatus,
        setMaritalStatus,
        hasChildren,
        setHasChildren,
        childrenSchoolType,
        setChildrenSchoolType,
        headOfHouseholdGender,
        setHeadOfHouseholdGender,
        longTermIllness,
        setLongTermIllness,
        upiTransactionCount,
        setUpiTransactionCount,
        handleUpdateUpiCount,
        occupation,
        setOccupation,
        age,
        setAge,
        education,
        setEducation,
        householdSize,
        setHouseholdSize,
        earningMembers,
        setEarningMembers,
        assets,
        setAssets,
        toggleAsset,
        communityActive,
        setCommunityActive,
        groupType,
        setGroupType,
        assetDocuments,
        setAssetDocuments,
        communityDocuments,
        setCommunityDocuments,
        requestedLoanAmount,
        setRequestedLoanAmount,
        appliedActions,
        isBroadcasting,
        broadcastDone,
        activeOffers,
        saveCurrentStep,
        completeOnboarding,
        handleApplyRecommendation,
        handleVerifyDoc,
        handleBroadcastToLenders,
        handleAcceptOffer
      }}
    >
      {children}
    </BorrowerFormContext.Provider>
  );
};

export const useBorrowerFormContext = () => {
  const context = useContext(BorrowerFormContext);
  if (!context) {
    throw new Error('useBorrowerFormContext must be used within a BorrowerFormProvider');
  }
  return context;
};