import { TaxYear } from '../types';

export const scotlandTaxYear202425: TaxYear = {
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
      name: 'Starter Rate',
      rate: 0.19,
      min: 12570,
      max: 14876,
    },
    {
      name: 'Basic Rate',
      rate: 0.20,
      min: 14876,
      max: 26561,
    },
    {
      name: 'Intermediate Rate',
      rate: 0.21,
      min: 26561,
      max: 43662,
    },
    {
      name: 'Higher Rate',
      rate: 0.42,
      min: 43662,
      max: 125140,
    },
    {
      name: 'Advanced Rate',
      rate: 0.45,
      min: 125140,
      max: 150000,
    },
    {
      name: 'Top Rate',
      rate: 0.48,
      min: 150000,
      max: null,
    },
  ],
  nationalInsurance: {
    primaryThreshold: 12570,
    upperEarningsLimit: 50270,
    employeeRate: 0.08,
    employeeUpperRate: 0.02,
    employerRate: 0.138,
    employerUpperRate: 0.138,
  },
  studentLoan: {
    plan1: { threshold: 22015, rate: 0.09 },
    plan2: { threshold: 28470, rate: 0.09 },
    plan4: { threshold: 31395, rate: 0.09 },
    postgrad: { threshold: 21000, rate: 0.06 },
  },
};