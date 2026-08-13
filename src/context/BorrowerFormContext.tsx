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
  SchoolType
} from '../types/types';
import { useAppContext } from './AppContext';
import { api } from '../services/api';

interface BorrowerFormContextType {
  phone: string;
  setPhone: (val: string) => void;
  otp: string;
  setOtp: (val: string) => void;
  otpSent: boolean;
  setOtpSent: (val: boolean) => void;
  otpVerified: boolean;
  setOtpVerified: (val: boolean) => void;
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
  appliedActions: string[];
  isBroadcasting: boolean;
  broadcastDone: boolean;
  activeOffers: Offer[];
  saveCurrentStep: () => Promise<void>;
  handleApplyRecommendation: (actionKey: string) => Promise<void>;
  handleVerifyDoc: (type: string, name: string) => Promise<void>;
  handleBroadcastToLenders: () => Promise<void>;
  handleAcceptOffer: (applicationId: string) => Promise<void>;
}

const BorrowerFormContext = createContext<BorrowerFormContextType | undefined>(undefined);

export const BorrowerFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentBorrower, handleUpdateBorrower, refreshActiveBorrowerScore } = useAppContext();

  const [phone, setPhone] = useState(currentBorrower?.phone || '');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

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

  const [appliedActions, setAppliedActions] = useState<string[]>([]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastDone, setBroadcastDone] = useState(currentBorrower?.sharedWithMarketplace || false);
  const [activeOffers, setActiveOffers] = useState<Offer[]>([]);

  // Sync state when currentBorrower changes
  useEffect(() => {
    if (currentBorrower) {
      setPhone(currentBorrower.phone || '');
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

  const saveCurrentStep = async () => {
    if (!currentBorrower) return;
    const updatedProfile: BorrowerProfile = {
      ...currentBorrower,
      name,
      phone,
      gender,
      maritalStatus,
      hasChildren,
      childrenSchoolType: hasChildren ? childrenSchoolType : undefined,
      headOfHouseholdGender,
      longTermIllness,
      upiTransactionCount,
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

    await handleUpdateBorrower(updatedProfile);
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
    const updated = {
      ...currentBorrower,
      documentVerified: true,
      documentType: type,
      documentName: name
    };
    await handleUpdateBorrower(updated);
  };

  const handleBroadcastToLenders = async () => {
    if (!currentBorrower) return;
    setIsBroadcasting(true);
    await api.shareWithMarketplace(currentBorrower.id);
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
        phone,
        setPhone,
        otp,
        setOtp,
        otpSent,
        setOtpSent,
        otpVerified,
        setOtpVerified,
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
        appliedActions,
        isBroadcasting,
        broadcastDone,
        activeOffers,
        saveCurrentStep,
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
