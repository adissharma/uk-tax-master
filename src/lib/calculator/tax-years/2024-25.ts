import { TaxYear } from '../types';

export const taxYear202425: TaxYear = {
  year: '2024-25',
  personalAllowance: 12570,
  personalAllowanceTaperThreshold: 100000,
  incomeTaxBands: [
    {
      name: 'Personal Allowance',
      rate: 0,
      min: 0,
      max: 12570,
    },
    {
      name: 'Basic Rate',
      rate: 0.20,
      min: 12570,
      max: 50270,
    },
    {
      name: 'Higher Rate',
      rate: 0.40,
      min: 50270,
      max: 125140,
    },
    {
      name: 'Additional Rate',
      rate: 0.45,
      min: 125140,
      max: null,
    },
  ],
  blindPersonAllowance: 3130,
  marriedCouplesAllowance: 1127,
  marriedCouplesAllowanceMinimum: 436,
  scottishIncomeTaxBands: [],
  nationalInsurance: {
    weeklyLowerEarningsLimit: 120,
    weeklyPrimaryThreshold: 242,
    weeklyUpperEarningsLimit: 967,
    primaryThreshold: 12570,
    upperEarningsLimit: 50270,
    employeeRate: 0.12,
    employeeUpperRate: 0.02,
    employerRate: 0.138,
    employerUpperRate: 0.138,
  },
  studentLoan: {
    plan1: { threshold: 22015, rate: 0.09 },
    plan2: { threshold: 27295, rate: 0.09 },
    plan4: { threshold: 31395, rate: 0.09 },
    plan5: { threshold: 25000, rate: 0.09 },
    postgrad: { threshold: 21000, rate: 0.06 },
  },
  autoEnrolment: {
    lowerEarningsLimit: 6240,
    upperEarningsLimit: 50270,
  },
  childcareVoucherLimits: {
    basicRateOrPreApril2011: 2916,
    higherRatePostApril2011: 1488,
    additionalRatePostApril2011: 1320,
  },
};