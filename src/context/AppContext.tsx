import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  BorrowerProfile,
  Language,
  Role,
  ScoreResult,
  ScoringMode,
  Theme,
  LoanApplication,
  LenderProfile
} from '../types/types';
import { api } from '../services/api';
import { SEED_LENDERS } from '../data/seedData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  role: Role;
  setRole: (role: Role) => void;
  scoringMode: ScoringMode;
  setScoringMode: (mode: ScoringMode) => void;
  borrowers: BorrowerProfile[];
  currentBorrower: BorrowerProfile | null;
  lenders: LenderProfile[];
  currentLender: LenderProfile | null;
  handleSelectLender: (lender: LenderProfile) => void;
  scoreResult: ScoreResult | null;
  applications: LoanApplication[];
  selectedAuditApp: LoanApplication | null;
  setSelectedAuditApp: (app: LoanApplication | null) => void;
  handleSelectBorrower: (b: BorrowerProfile) => Promise<void>;
  handleNewBorrower: () => Promise<BorrowerProfile>;
  refreshActiveBorrowerScore: () => Promise<void>;
  handleUpdateBorrower: (updated: Partial<BorrowerProfile>) => Promise<void>;
  handleApproveLoan: (
    appId: string,
    offerData: {
      lenderId: string;
      lenderName: string;
      amount: number;
      interestRatePct: number;
      tenureMonths: number;
      monthlyEmi: number;
    }
  ) => Promise<void>;
  refreshApplications: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('Cred0_lang_v1') as Language) || 'en';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('Cred0_theme_v1') as Theme) || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('Cred0_theme_v1', theme);
  }, [theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('Cred0_lang_v1', lang);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const [role, setRole] = useState<Role>('borrower');
  const [scoringMode, setScoringModeState] = useState<ScoringMode>(() => api.getScoringMode());

  const setScoringMode = (mode: ScoringMode) => {
    setScoringModeState(mode);
    api.setScoringMode(mode);
    refreshActiveBorrowerScore();
  };

  const [borrowers, setBorrowers] = useState<BorrowerProfile[]>([]);
  const [currentBorrower, setCurrentBorrower] = useState<BorrowerProfile | null>(null);
  const [lenders] = useState<LenderProfile[]>(SEED_LENDERS);
  const [currentLender, setCurrentLender] = useState<LenderProfile | null>(SEED_LENDERS[0] || null);

  const handleSelectLender = (lender: LenderProfile) => {
    setCurrentLender(lender);
  };

  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [selectedAuditApp, setSelectedAuditApp] = useState<LoanApplication | null>(null);

  const handleNewBorrower = useCallback(async (): Promise<BorrowerProfile> => {
    const newProfile: BorrowerProfile = {
      id: `bor_${Date.now()}`,
      name: '',
      phone: '',
      language,
      occupation: 'street_vendor',
      age: 30,
      education: 'secondary',
      householdSize: 4,
      earningMembers: 1,
      assets: [],
      communityTie: { active: false },
      documentVerified: false,
      createdAt: new Date().toISOString(),
      sharedWithMarketplace: true
    };

    const saved = await api.saveProfile(newProfile);
    setBorrowers(api.getAllProfiles());
    setCurrentBorrower(saved);
    const score = await api.computeScore(saved);
    setScoreResult(score);
    return saved;
  }, [language]);

  const loadData = useCallback(async () => {
    const allProfiles = api.getAllProfiles();
    setBorrowers(allProfiles);

    if (allProfiles.length > 0) {
      const active = allProfiles[0];
      setCurrentBorrower(active);
      const score = await api.computeScore(active);
      setScoreResult(score);
    } else {
      // Create initial active session applicant
      await handleNewBorrower();
    }

    const apps = await api.getApplications();
    setApplications(apps);
  }, [handleNewBorrower]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshActiveBorrowerScore = async () => {
    if (!currentBorrower) return;
    const score = await api.computeScore(currentBorrower);
    setScoreResult(score);

    const apps = await api.getApplications();
    setApplications(apps);
  };

  const refreshApplications = async () => {
    const apps = await api.getApplications();
    setApplications(apps);
  };

  const handleSelectBorrower = async (b: BorrowerProfile) => {
    setCurrentBorrower(b);
    if (b.language) setLanguage(b.language);
    const score = await api.computeScore(b);
    setScoreResult(score);
  };

  const handleUpdateBorrower = async (updated: Partial<BorrowerProfile>) => {
    const baseProfile = currentBorrower || {
      id: `bor_${Date.now()}`,
      name: '',
      phone: '',
      language,
      occupation: 'street_vendor',
      age: 30,
      education: 'secondary',
      householdSize: 4,
      earningMembers: 1,
      assets: [],
      communityTie: { active: false },
      documentVerified: false,
      createdAt: new Date().toISOString(),
      sharedWithMarketplace: true
    };

    const merged = { ...baseProfile, ...updated };
    const saved = await api.saveProfile(merged);

    setCurrentBorrower(saved);
    setBorrowers(api.getAllProfiles());
    const score = await api.computeScore(saved);
    setScoreResult(score);
  };

  const handleApproveLoan = async (
    appId: string,
    offerData: {
      lenderId: string;
      lenderName: string;
      amount: number;
      interestRatePct: number;
      tenureMonths: number;
      monthlyEmi: number;
    }
  ) => {
    await api.submitLoanOffer(appId, offerData);
    const updatedApps = await api.getApplications();
    setApplications(updatedApps);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        toggleTheme,
        role,
        setRole,
        scoringMode,
        setScoringMode,
        borrowers,
        currentBorrower,
        lenders,
        currentLender,
        handleSelectLender,
        scoreResult,
        applications,
        selectedAuditApp,
        setSelectedAuditApp,
        handleSelectBorrower,
        handleNewBorrower,
        refreshActiveBorrowerScore,
        handleUpdateBorrower,
        handleApproveLoan,
        refreshApplications
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};