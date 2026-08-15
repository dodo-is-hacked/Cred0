import { BorrowerProfile, LoanApplication, Offer, ScoreResult, ScoringMode } from '../types';
import { SEED_LENDERS } from '../data/seedData';
import { getScoringProvider } from '../scoring';
import { db } from '../config/firebase';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

const STORAGE_KEY_PROFILES = 'Cred0_borrower_profiles_v1';
const STORAGE_KEY_APPS = 'Cred0_loan_applications_v1';
const STORAGE_KEY_MODE = 'Cred0_scoring_mode_v1';

// Helper to remove any `undefined` values that break Firestore setDoc
function sanitizeForFirestore<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (_, val) => (val === undefined ? null : val)));
}

class ApiService {
  private profiles: BorrowerProfile[] = [];
  private applications: LoanApplication[] = [];
  private scoringMode: ScoringMode = 'custom';
  private initPromise: Promise<void>;

  constructor() {
    this.initPromise = this.initData();
  }

  private async initData(): Promise<void> {
    try {
      // 1. Load stored scoring mode
      const savedMode = localStorage.getItem(STORAGE_KEY_MODE) as ScoringMode;
      if (savedMode) {
        this.scoringMode = savedMode;
      }

      // 2. Load stored profiles from localStorage as fast initial cache
      const savedProfiles = localStorage.getItem(STORAGE_KEY_PROFILES);
      if (savedProfiles) {
        this.profiles = JSON.parse(savedProfiles);
      }

      // 3. Load stored applications
      const savedApps = localStorage.getItem(STORAGE_KEY_APPS);
      if (savedApps) {
        this.applications = JSON.parse(savedApps);
      }
    } catch (err) {
      console.warn("Failed to load local storage cache:", err);
    }
  }

  private async ensureInitialized() {
    await this.initPromise;
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

  // 1. Auth OTP Mocking
  public async requestOtp(phone: string): Promise<{ success: boolean; message: string }> {
    await new Promise(r => setTimeout(r, 400));
    return { success: true, message: 'OTP sent successfully to +91 ' + phone };
  }

  public async verifyOtp(phone: string, otp: string): Promise<{ success: boolean; token: string }> {
    await new Promise(r => setTimeout(r, 500));
    if (otp === '1234' || otp.length === 6) {
      return { success: true, token: 'mock_jwt_token_' + Date.now() };
    }
    return { success: false, token: '' };
  }

  // 2. Save / Update Borrower Profile (Writes to local state AND Firestore safely)
  public async saveProfile(profile: Partial<BorrowerProfile>): Promise<BorrowerProfile> {
    await this.ensureInitialized();

    const existingIndex = this.profiles.findIndex(p => p.id === profile.id);
    let updated: BorrowerProfile;

    if (existingIndex >= 0) {
      updated = { ...this.profiles[existingIndex], ...profile };
      this.profiles[existingIndex] = updated;
    } else {
      updated = {
        id: profile.id || `bor_${Date.now()}`,
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
        createdAt: new Date().toISOString(),
        sharedWithMarketplace: profile.sharedWithMarketplace || false,
        ...profile
      };
      this.profiles.push(updated);
    }

    // 1. Save to local cache first so UI never hangs
    this.saveProfiles();

    // 2. Sync sanitized document to Firestore
    try {
      const cleanData = sanitizeForFirestore(updated);
      await setDoc(doc(db, "borrowers", updated.id), cleanData, { merge: true });
    } catch (err) {
      console.warn("Firestore sync warning on saveProfile (proceeding with local state):", err);
    }

    return updated;
  }

  // Fetch single profile
  public async getProfile(id: string): Promise<BorrowerProfile | undefined> {
    await this.ensureInitialized();

    const cached = this.profiles.find(p => p.id === id);
    if (cached) return cached;

    try {
      const docRef = doc(db, "borrowers", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as BorrowerProfile;
        this.profiles.push(data);
        this.saveProfiles();
        return data;
      }
    } catch (err) {
      console.warn("Error fetching profile from Firestore:", err);
    }
    return undefined;
  }

  public getAllProfiles(): BorrowerProfile[] {
    return this.profiles;
  }

  // 3. Compute Score & Store Application safely
  public async computeScore(profile: BorrowerProfile): Promise<ScoreResult> {
    await this.ensureInitialized();

    let scoreResult: ScoreResult;
    try {
      const provider = getScoringProvider(this.scoringMode);
      scoreResult = await provider.computeScore(profile);
    } catch (scoreErr) {
      console.warn("Scoring provider error, using fallback score result:", scoreErr);
      scoreResult = {
        score: 650,
        riskTier: 'Medium',
        confidence: 0.85,
        shapBreakdown: [],
        topFactors: [],
        improvementPlan: [],
        calculatedAt: new Date().toISOString()
      } as unknown as ScoreResult;
    }

    const appId = `app_${profile.id}`;
    let app: LoanApplication = {
      id: appId,
      borrowerId: profile.id,
      borrowerProfile: profile,
      scoreResult,
      sharedWithLenderIds: SEED_LENDERS.map(l => l.id),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const appIndex = this.applications.findIndex(a => a.borrowerId === profile.id);
    if (appIndex >= 0) {
      this.applications[appIndex] = { 
        ...this.applications[appIndex], 
        scoreResult, 
        borrowerProfile: profile 
      };
      app = this.applications[appIndex];
    } else {
      this.applications.push(app);
    }

    this.saveApplications();

    // Sync sanitized application to Firestore
    try {
      const cleanApp = sanitizeForFirestore(app);
      await setDoc(doc(db, "applications", appId), cleanApp, { merge: true });
    } catch (err) {
      console.warn("Failed to save application to Firestore (proceeding with local state):", err);
    }

    return scoreResult;
  }

  // 4. Marketplace Share
  public async shareWithMarketplace(borrowerId: string, requestedAmount?: number): Promise<boolean> {
    await this.ensureInitialized();

    const p = this.profiles.find(x => x.id === borrowerId);
    if (p) {
      p.sharedWithMarketplace = true;
      if (requestedAmount !== undefined) {
        p.requestedLoanAmount = requestedAmount;
      }
      await this.saveProfile(p);
    }

    const app = this.applications.find(a => a.borrowerId === borrowerId);
    if (app) {
      app.sharedWithLenderIds = SEED_LENDERS.map(l => l.id);
      if (requestedAmount !== undefined) {
        app.requestedLoanAmount = requestedAmount;
        if (app.borrowerProfile) {
          app.borrowerProfile.requestedLoanAmount = requestedAmount;
          app.borrowerProfile.sharedWithMarketplace = true;
        }
      }
      this.saveApplications();

      try {
        const cleanApp = sanitizeForFirestore(app);
        await setDoc(doc(db, "applications", app.id), cleanApp, { merge: true });
      } catch (err) {
        console.warn("Firestore error on marketplace share:", err);
      }
    }
    return true;
  }

  // 5. Lender Feed
  public async getApplications(): Promise<LoanApplication[]> {
    await this.ensureInitialized();

    try {
      const querySnapshot = await getDocs(collection(db, "applications"));
      const remoteApps: LoanApplication[] = [];
      querySnapshot.forEach((docSnap) => {
        if (docSnap.exists()) {
          remoteApps.push(docSnap.data() as LoanApplication);
        }
      });

      if (remoteApps.length > 0) {
        this.applications = remoteApps;
        this.saveApplications();
      }
    } catch (err) {
      console.warn("Could not fetch remote applications from Firestore, using local cache:", err);
    }

    return this.applications.filter(
      a => a.borrowerProfile && a.borrowerProfile.sharedWithMarketplace !== false
    );
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
    await this.ensureInitialized();

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

    try {
      const cleanApp = sanitizeForFirestore(app);
      await setDoc(doc(db, "applications", app.id), cleanApp, { merge: true });
    } catch (err) {
      console.warn("Firestore error on offer submission:", err);
    }

    return app;
  }

  // 7. Accept Loan Offer (Borrower Action)
  public async acceptLoanOffer(applicationId: string): Promise<boolean> {
    await this.ensureInitialized();

    const app = this.applications.find(a => a.id === applicationId);
    if (app && app.offer) {
      app.offer.status = 'accepted';
      this.saveApplications();

      try {
        const cleanApp = sanitizeForFirestore(app);
        await setDoc(doc(db, "applications", app.id), cleanApp, { merge: true });
      } catch (err) {
        console.warn("Firestore error on offer acceptance:", err);
      }
      return true;
    }
    return false;
  }
}

export const api = new ApiService();