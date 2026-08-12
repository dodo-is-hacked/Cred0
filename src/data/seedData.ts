import { BorrowerProfile, LenderProfile } from '../types';

export const SEED_BORROWERS: BorrowerProfile[] = [
  {
    id: 'bor_rekha_01',
    name: 'Rekha Devi',
    phone: '98350 12345',
    language: 'hi',
    occupation: 'street_vendor',
    age: 38,
    education: 'primary',
    householdSize: 4,
    earningMembers: 2,
    assets: ['shop_cart'],
    communityTie: {
      active: true,
      groupType: 'shg'
    },
    documentVerified: true,
    documentType: 'Utility Electricity Bill',
    documentName: 'Electricity_Bill_Muzaffarpur.pdf',
    location: 'Muzaffarpur, Bihar',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    sharedWithMarketplace: true
  },
  {
    id: 'bor_anwar_02',
    name: 'Anwar Sheikh',
    phone: '98301 67890',
    language: 'bn',
    occupation: 'gig_worker',
    age: 24,
    education: 'secondary',
    householdSize: 3,
    earningMembers: 1,
    assets: ['vehicle'],
    communityTie: {
      active: false
    },
    documentVerified: false,
    location: 'Kolkata, West Bengal',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    sharedWithMarketplace: true
  },
  {
    id: 'bor_somnath_03',
    name: 'Somnath Mondal',
    phone: '98322 45678',
    language: 'bn',
    occupation: 'small_farmer',
    age: 45,
    education: 'secondary',
    householdSize: 5,
    earningMembers: 2,
    assets: ['land', 'pucca_house'],
    communityTie: {
      active: true,
      groupType: 'fpo'
    },
    documentVerified: true,
    documentType: 'FPO Land Record Certificate',
    documentName: 'Land_Record_Nadia.pdf',
    location: 'Nadia, West Bengal',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    sharedWithMarketplace: true
  }
];

export const SEED_LENDERS: LenderProfile[] = [
  {
    id: 'len_gramin',
    name: 'GraminTrust NBFC',
    type: 'Regional NBFC',
    description: 'Focusing on rural financial inclusion & agricultural micro-loans',
    minScore: 500,
    maxLoanAmount: 500000
  },
  {
    id: 'len_suryoday',
    name: 'Suryoday Partners',
    type: 'Micro-Finance MFI',
    description: 'Urban gig-economy & street vendor micro-lender',
    minScore: 450,
    maxLoanAmount: 200000
  },
  {
    id: 'len_priya',
    name: 'Priya Kapoor Impact Fund',
    type: 'Impact Investor',
    description: 'Catalytic micro-equity and affordable loans for women micro-entrepreneurs',
    minScore: 550,
    maxLoanAmount: 300000
  }
];
