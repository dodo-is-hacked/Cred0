import { BorrowerProfile, LenderProfile } from '../types';

export const SEED_BORROWERS: BorrowerProfile[] = [];

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
