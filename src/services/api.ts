import { BorrowerProfile, LoanApplication, Offer, ScoreResult, ScoringMode } from '../types';
import { SEED_BORROWERS, SEED_LENDERS } from '../data/seedData';
import { getScoringProvider } from '../scoring';

const STORAGE_KEY_PROFILES = 'trust_borrower_profiles_v1';
const STORAGE_KEY_APPS = 'trust_loan_applications_v1';
const STORAGE_KEY_MODE = 'trust_scoring_mode_v1';

class ApiService {
  private profiles: BorrowerProfile[] = [];
  private applications: LoanApplication[] = [];
  private scoringMode: ScoringMode = 'custom';

  constructor() {
    this.initData();
  }

  private async initData() {
    // 1. Load stored profiles or fallback to seed
    const savedProfiles = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (savedProfiles) {
      try {
        this.profiles = JSON.parse(savedProfiles);
      } catch {
        this.profiles = [...SEED_BORROWERS];
      }
    } else {
      this.profiles = [...SEED_BORROWERS];
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(this.profiles));
    }

    // 2. Load stored mode
    const savedMode = localStorage.getItem(STORAGE_KEY_MODE) as ScoringMode;
    if (savedMode) {
      this.scoringMode = savedMode;
    }

    // 3. Load stored applications or compute initial scores
    const savedApps = localStorage.getItem(STORAGE_KEY_APPS);
    if (savedApps) {
      try {
        this.applications = JSON.parse(savedApps);
      } catch {
        this.applications = [];
      }
    }

    // 4. If applications empty, compute initial scores using default scoring provider
    if (this.applications.length === 0) {
      // FIXED: Changed 'mock' -> this.scoringMode (or 'custom')
      const provider = getScoringProvider(this.scoringMode);
      for (const borrower of this.profiles) {
        try {
          const scoreResult = await provider.computeScore(borrower);
          this.applications.push({
            id: `app_${borrower.id}`,
            borrowerId: borrower.id,
            borrowerProfile: borrower,
            scoreResult,
            sharedWithLenderIds: SEED_LENDERS.map(l => l.id),
            status: borrower.id === 'bor_rekha_01' ? 'approved' : 'pending',
            createdAt: borrower.createdAt,
            offer: borrower.id === 'bor_rekha_01' ? {
              id: 'off_rekha_01',
              lenderId: 'len_gramin',
              lenderName: 'GraminTrust NBFC',
              amount: 50000,
              interestRatePct: 12,
              tenureMonths: 12,
              approvedAt: new Date().toISOString(),
              status: 'pending',
              monthlyEmi: 4442
            } : undefined
          });
        } catch (err) {
          console.error(`Failed to seed score for ${borrower.id}:`, err);
        }
      }
      this.saveApplications();
    }
  }

  private saveProfiles() {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(this.profiles));
  }

  private saveApplications() {
    localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(this.applications));
  }

  public setScoringMode(mode: ScoringMode) {
    this.scoringMode = mode;
    localStorage.setItem(STORAGE_KEY_MODE, mode);
  }

  public getScoringMode(): ScoringMode {
    return this.scoringMode;
  }

  // 1. Auth OTP
  public async requestOtp(phone: string): Promise<{ success: boolean; message: string }> {
    await new Promise(r => setTimeout(r, 400));
    return { success: true, message: 'OTP sent successfully to +91 ' + phone };
  }

  public async verifyOtp(phone: string, otp: string): Promise<{ success: boolean; token: string }> {
    await new Promise(r => setTimeout(r, 500));
    if (otp === '1234' || otp.length === 4) {
      return { success: true, token: 'mock_jwt_token_' + Date.now() };
    }
    return { success: false, token: '' };
  }

  // 2. Save / Update Borrower Profile
  public async saveProfile(profile: Partial<BorrowerProfile>): Promise<BorrowerProfile> {
    const existingIndex = this.profiles.findIndex(p => p.id === profile.id);
    let updated: BorrowerProfile;

    if (existingIndex >= 0) {
      updated = { ...this.profiles[existingIndex], ...profile };
      this.profiles[existingIndex] = updated;
    } else {
      updated = {
        id: profile.id || `bor_custom_${Date.now()}`,
        name: profile.name || 'New Borrower',
        phone: profile.phone || '9876543210',
        language: profile.language || 'en',
        occupation: profile.occupation || 'street_vendor',
        age: profile.age || 30,
        education: profile.education || 'secondary',
        householdSize: profile.householdSize || 4,
        earningMembers: profile.earningMembers || 1,
        assets: profile.assets || [],
        communityTie: profile.communityTie || { active: false },
        documentVerified: profile.documentVerified || false,
        location: profile.location || 'Patna, Bihar',
        createdAt: new Date().toISOString(),
        sharedWithMarketplace: profile.sharedWithMarketplace || false,
        ...profile
      };
      this.profiles.push(updated);
    }

    this.saveProfiles();
    return updated;
  }

  public getProfile(id: string): BorrowerProfile | undefined {
    return this.profiles.find(p => p.id === id);
  }

  public getAllProfiles(): BorrowerProfile[] {
    return this.profiles;
  }

  // 3. Compute Score
  public async computeScore(profile: BorrowerProfile): Promise<ScoreResult> {
    const provider = getScoringProvider(this.scoringMode);
    const scoreResult = await provider.computeScore(profile);

    // Update or create application record
    const appIndex = this.applications.findIndex(a => a.borrowerId === profile.id);
    if (appIndex >= 0) {
      this.applications[appIndex].scoreResult = scoreResult;
      this.applications[appIndex].borrowerProfile = profile;
    } else {
      this.applications.push({
        id: `app_${profile.id}`,
        borrowerId: profile.id,
        borrowerProfile: profile,
        scoreResult,
        sharedWithLenderIds: SEED_LENDERS.map(l => l.id),
        status: 'pending',
        createdAt: new Date().toISOString()
      });
    }

    this.saveApplications();
    return scoreResult;
  }

  // 4. Marketplace Share
  public async shareWithMarketplace(borrowerId: string): Promise<boolean> {
    await new Promise(r => setTimeout(r, 600));
    const p = this.profiles.find(x => x.id === borrowerId);
    if (p) {
      p.sharedWithMarketplace = true;
      this.saveProfiles();
    }

    const app = this.applications.find(a => a.borrowerId === borrowerId);
    if (app) {
      app.sharedWithLenderIds = SEED_LENDERS.map(l => l.id);
      this.saveApplications();
    }
    return true;
  }

  // 5. Lender Feed
  public async getApplications(): Promise<LoanApplication[]> {
    await new Promise(r => setTimeout(r, 300));
    return this.applications.filter(a => a.borrowerProfile.sharedWithMarketplace !== false);
  }

  // 6. Submit Loan Offer (Lender Action)
  public async submitLoanOffer(
    applicationId: string,
    offerData: {
      lenderId: string;
      lenderName: string;
      amount: number;
      interestRatePct: number;
      tenureMonths: number;
      monthlyEmi: number;
    }
  ): Promise<LoanApplication> {
    await new Promise(r => setTimeout(r, 500));
    const app = this.applications.find(a => a.id === applicationId);
    if (!app) throw new Error('Application not found');

    const offer: Offer = {
      id: `off_${Date.now()}`,
      lenderId: offerData.lenderId,
      lenderName: offerData.lenderName,
      amount: offerData.amount,
      interestRatePct: offerData.interestRatePct,
      tenureMonths: offerData.tenureMonths,
      monthlyEmi: offerData.monthlyEmi,
      approvedAt: new Date().toISOString(),
      status: 'pending'
    };

    app.offer = offer;
    app.status = 'approved';
    this.saveApplications();
    return app;
  }

  // 7. Accept Loan Offer (Borrower Action)
  public async acceptLoanOffer(applicationId: string): Promise<boolean> {
    await new Promise(r => setTimeout(r, 400));
    const app = this.applications.find(a => a.id === applicationId);
    if (app && app.offer) {
      app.offer.status = 'accepted';
      this.saveApplications();
      return true;
    }
    return false;
  }
}

export const api = new ApiService();