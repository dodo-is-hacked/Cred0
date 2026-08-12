import { BorrowerProfile, LoanApplication, Offer, ScoreResult, ScoringMode } from '../types';
import { SEED_LENDERS } from '../data/seedData';
import { getScoringProvider } from '../scoring';
import { db } from '../config/firebase';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

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
    // 1. Load stored scoring mode
    const savedMode = localStorage.getItem(STORAGE_KEY_MODE) as ScoringMode;
    if (savedMode) {
      this.scoringMode = savedMode;
    }

    // 2. Load stored profiles from localStorage as fast initial cache
    const savedProfiles = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (savedProfiles) {
      try {
        this.profiles = JSON.parse(savedProfiles);
      } catch {
        this.profiles = [];
      }
    }

    // 3. Load stored applications
    const savedApps = localStorage.getItem(STORAGE_KEY_APPS);
    if (savedApps) {
      try {
        this.applications = JSON.parse(savedApps);
      } catch {
        this.applications = [];
      }
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

  // 2. Save / Update Borrower Profile (Writes to both memory/localStorage AND Firestore)
  public async saveProfile(profile: Partial<BorrowerProfile>): Promise<BorrowerProfile> {
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
        location: profile.location || 'Patna, Bihar',
        createdAt: new Date().toISOString(),
        sharedWithMarketplace: profile.sharedWithMarketplace || false,
        ...profile
      };
      this.profiles.push(updated);
    }

    // Save to local cache
    this.saveProfiles();

    // Save directly to Firestore database asynchronously
    try {
      await setDoc(doc(db, "borrowers", updated.id), updated, { merge: true });
    } catch (err) {
      console.error("Firestore sync error:", err);
    }

    return updated;
  }

  // Fetch single profile from memory or Firestore
  public async getProfile(id: string): Promise<BorrowerProfile | undefined> {
    // Check local cache first
    const cached = this.profiles.find(p => p.id === id);
    if (cached) return cached;

    // Fallback query to Firestore
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
      console.error("Error fetching profile from Firestore:", err);
    }
    return undefined;
  }

  public getAllProfiles(): BorrowerProfile[] {
    return this.profiles;
  }

  // 3. Compute Score & Store Application in Firestore
  public async computeScore(profile: BorrowerProfile): Promise<ScoreResult> {
    const provider = getScoringProvider(this.scoringMode);
    const scoreResult = await provider.computeScore(profile);

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

    // Update or create in local state
    const appIndex = this.applications.findIndex(a => a.borrowerId === profile.id);
    if (appIndex >= 0) {
      this.applications[appIndex] = { ...this.applications[appIndex], scoreResult, borrowerProfile: profile };
      app = this.applications[appIndex];
    } else {
      this.applications.push(app);
    }

    this.saveApplications();

    // Sync Application Record to Firestore
    try {
      await setDoc(doc(db, "applications", appId), app, { merge: true });
    } catch (err) {
      console.error("Failed to save application to Firestore:", err);
    }

    return scoreResult;
  }

  // 4. Marketplace Share
  public async shareWithMarketplace(borrowerId: string): Promise<boolean> {
    const p = this.profiles.find(x => x.id === borrowerId);
    if (p) {
      p.sharedWithMarketplace = true;
      await this.saveProfile(p);
    }

    const app = this.applications.find(a => a.borrowerId === borrowerId);
    if (app) {
      app.sharedWithLenderIds = SEED_LENDERS.map(l => l.id);
      this.saveApplications();
      try {
        await setDoc(doc(db, "applications", app.id), app, { merge: true });
      } catch (err) {
        console.error("Firestore error on marketplace share:", err);
      }
    }
    return true;
  }

  // 5. Lender Feed (Fetches live from Firestore or Local Cache)
  public async getApplications(): Promise<LoanApplication[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "applications"));
      const remoteApps: LoanApplication[] = [];
      querySnapshot.forEach((doc) => {
        remoteApps.push(doc.data() as LoanApplication);
      });

      if (remoteApps.length > 0) {
        this.applications = remoteApps;
        this.saveApplications();
      }
    } catch (err) {
      console.warn("Could not fetch remote applications from Firestore, using local cache:", err);
    }

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
      await setDoc(doc(db, "applications", app.id), app, { merge: true });
    } catch (err) {
      console.error("Firestore error on offer submission:", err);
    }

    return app;
  }

  // 7. Accept Loan Offer (Borrower Action)
  public async acceptLoanOffer(applicationId: string): Promise<boolean> {
    const app = this.applications.find(a => a.id === applicationId);
    if (app && app.offer) {
      app.offer.status = 'accepted';
      this.saveApplications();

      try {
        await setDoc(doc(db, "applications", app.id), app, { merge: true });
      } catch (err) {
        console.error("Firestore error on offer acceptance:", err);
      }
      return true;
    }
    return false;
  }
}

export const api = new ApiService();