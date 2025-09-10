import { TaxYear } from '../types';

export const taxYear202526: TaxYear = {
  year: '2025-26',
  personalAllowance: 12570,
  personalAllowanceTaperThreshold: 100000,
  blindPersonAllowance: 3130,
  marriedCouplesAllowance: 1127,
  marriedCouplesAllowanceMinimum: 436,
  
  // rUK Income Tax Bands (England, Wales, Northern Ireland)
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
      min: 0,
      max: 37700,
    },
    {
      name: 'Higher Rate', 
      rate: 0.40,
      min: 37700,
      max: 125140,
    },
    {
      name: 'Additional Rate',
      rate: 0.45,
      min: 125140,
      max: null,
    },
  ],

  // Scottish Income Tax Bands
  scottishIncomeTaxBands: [
    {
      name: 'Personal Allowance',
      rate: 0,
      min: 0,
      max: 12570,
    },
    {
      name: 'Starter Rate',
      rate: 0.19,
      min: 0,
      max: 2827,
    },
    {
      name: 'Basic Rate',
      rate: 0.20,
      min: 2827,
      max: 14921,
    },
    {
      name: 'Intermediate Rate',
      rate: 0.21,
      min: 14921,
      max: 31092,
    },
    {
      name: 'Higher Rate',
      rate: 0.42,
      min: 31092,
      max: 62430,
    },
    {
      name: 'Advanced Rate',
      rate: 0.45,
      min: 62430,
      max: 125140,
    },
    {
      name: 'Top Rate',
      rate: 0.48,
      min: 125140,
      max: null,
    },
  ],

  nationalInsurance: {
    // Weekly thresholds
    weeklyLowerEarningsLimit: 123, // £123/week
    weeklyPrimaryThreshold: 242,   // £242/week  
    weeklyUpperEarningsLimit: 967, // £967/week
    
    // Annual equivalents
    primaryThreshold: 12584,  // £242 * 52
    upperEarningsLimit: 50284, // £967 * 52
    
    // Employee rates
    employeeRate: 0.08,      // 8% between thresholds
    employeeUpperRate: 0.02, // 2% above upper limit
    
    // Employer rates
    employerRate: 0.138,     // 13.8%
    employerUpperRate: 0.138, // 13.8% (no upper limit reduction for employer)
  },

  studentLoan: {
    plan1: { threshold: 26065, rate: 0.09 },
    plan2: { threshold: 28470, rate: 0.09 },
    plan4: { threshold: 32745, rate: 0.09 },
    plan5: { threshold: 25000, rate: 0.09 },
    postgrad: { threshold: 21000, rate: 0.06 },
  },

  // Auto-enrolment Qualifying Earnings band
  autoEnrolment: {
    lowerEarningsLimit: 6240,
    upperEarningsLimit: 50270,
  },

  // Childcare voucher annual caps
  childcareVoucherLimits: {
    basicRateOrPreApril2011: 2916,
    higherRatePostApril2011: 1488,
    additionalRatePostApril2011: 1320,
  },
};