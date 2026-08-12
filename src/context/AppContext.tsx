import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  BorrowerProfile,
  Language,
  Role,
  ScoreResult,
  ScoringMode,
  Theme,
  LoanApplication
} from '../types/types';
import { api } from '../services/api';

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
  scoreResult: ScoreResult | null;
  applications: LoanApplication[];
  selectedAuditApp: LoanApplication | null;
  setSelectedAuditApp: (app: LoanApplication | null) => void;
  handleSelectBorrower: (b: BorrowerProfile) => Promise<void>;
  handleNewBorrower: () => Promise<void>;
  refreshActiveBorrowerScore: () => Promise<void>;
  handleUpdateBorrower: (updated: BorrowerProfile) => Promise<void>;
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
    return (localStorage.getItem('trust_lang_v1') as Language) || 'en';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('trust_theme_v1') as Theme) || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('trust_theme_v1', theme);
  }, [theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('trust_lang_v1', lang);
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
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [selectedAuditApp, setSelectedAuditApp] = useState<LoanApplication | null>(null);

  const loadData = useCallback(async () => {
    const allProfiles = api.getAllProfiles();
    setBorrowers(allProfiles);

    if (allProfiles.length > 0) {
      const active = currentBorrower || allProfiles[0];
      setCurrentBorrower(active);
      const score = await api.computeScore(active);
      setScoreResult(score);
    }

    const apps = await api.getApplications();
    setApplications(apps);
  }, []);

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

  const handleUpdateBorrower = async (updated: BorrowerProfile) => {
    const saved = await api.saveProfile(updated);
    setCurrentBorrower(saved);
    setBorrowers(api.getAllProfiles());
    const score = await api.computeScore(saved);
    setScoreResult(score);
  };

  const handleNewBorrower = async () => {
    const newProfile: BorrowerProfile = {
      id: `bor_user_${Date.now()}`,
      name: 'User Applicant',
      phone: '98765 43210',
      language,
      occupation: 'street_vendor',
      age: 32,
      education: 'secondary',
      householdSize: 4,
      earningMembers: 1,
      assets: [],
      communityTie: { active: false },
      documentVerified: false,
      location: 'Patna, Bihar',
      createdAt: new Date().toISOString(),
      sharedWithMarketplace: true
    };

    const saved = await api.saveProfile(newProfile);
    const updatedProfiles = api.getAllProfiles();
    setBorrowers(updatedProfiles);
    setCurrentBorrower(saved);
    const score = await api.computeScore(saved);
    setScoreResult(score);
    setRole('borrower');
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
