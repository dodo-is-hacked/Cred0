export type Language = 'en' | 'hi' | 'bn';
export type Theme = 'light' | 'dark';
export type Role = 'borrower' | 'lender';
export type ScoringMode = 'custom' | 'local_model' | 'gemini_hybrid';

export type Occupation = 'street_vendor' | 'gig_worker' | 'small_farmer' | 'self_employed';
export type Education = 'none' | 'primary' | 'secondary' | 'graduate';
export type Asset = 'land' | 'livestock' | 'vehicle' | 'shop_cart' | 'pucca_house';
export type GroupType = 'shg' | 'cooperative' | 'fpo' | 'union';

export type Gender = 'male' | 'female' | 'other';
export type MaritalStatus = 'single' | 'married' | 'widowed' | 'divorced';
export type SchoolType = 'government' | 'private' | 'not_in_school';

export type ScoreZone = 'Building' | 'Fair' | 'Good' | 'Trusted';
export type RiskCategory = 'Low' | 'Moderate' | 'High';

export interface BorrowerProfile {
  id: string;
  name: string;
  phone: string;
  language: Language;
  occupation: Occupation;
  age: number;
  education: Education;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  hasChildren?: boolean;
  childrenSchoolType?: SchoolType;
  headOfHouseholdGender?: Gender;
  longTermIllness?: boolean;
  upiTransactionCount?: number;
  householdSize: number;
  earningMembers: number;
  assets: Asset[];
  communityTie: {
    active: boolean;
    groupType?: GroupType;
  };
  documentVerified: boolean;
  documentType?: string;
  documentName?: string;
  location: string;
  createdAt: string;
  sharedWithMarketplace?: boolean;
}

export interface ShapFactor {
  feature: string;
  impact: number; // Positive or negative integer point contribution
  explanation: Record<Language, string>;
}

export interface OptimizationRecommendation {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  pointsToGain: number;
  applyActionKey: 'join_shg' | 'verify_doc' | 'add_asset' | 'add_earner';
}

export interface ScoreResult {
  score: number; // Integer between 300 and 900
  zone: ScoreZone;
  shapFactors: ShapFactor[];
  defaultRiskPercent: number; // e.g., 8.5
  riskCategory: RiskCategory;
  recommendations: OptimizationRecommendation[];
  aiInsight?: string; // Optional Gemini narrative breakdown
}

export interface ScoringProvider {
  computeScore(profile: BorrowerProfile): Promise<ScoreResult>;
}

export interface Offer {
  id: string;
  lenderId: string;
  lenderName: string;
  amount: number;
  interestRatePct: number;
  tenureMonths: number;
  approvedAt: string;
  status: 'pending' | 'accepted' | 'declined';
  monthlyEmi?: number;
}

export interface LoanApplication {
  id: string;
  borrowerId: string;
  borrowerProfile: BorrowerProfile;
  scoreResult: ScoreResult;
  sharedWithLenderIds: string[];
  status: 'pending' | 'approved' | 'declined';
  offer?: Offer;
  createdAt: string;
}

export interface LenderProfile {
  id: string;
  name: string;
  type: string;
  description: string;
  minScore: number;
  maxLoanAmount: number;
  avatarUrl?: string;
}
