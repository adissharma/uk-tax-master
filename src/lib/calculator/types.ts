export interface TaxYear {
  year: string;
  personalAllowance: number;
  personalAllowanceTaperThreshold: number;
  blindPersonAllowance: number;
  marriedCouplesAllowance: number;
  marriedCouplesAllowanceMinimum: number;
  incomeTaxBands: IncomeTaxBand[];
  scottishIncomeTaxBands: IncomeTaxBand[];
  nationalInsurance: {
    weeklyLowerEarningsLimit: number;
    weeklyPrimaryThreshold: number;
    weeklyUpperEarningsLimit: number;
    primaryThreshold: number;
    upperEarningsLimit: number;
    employeeRate: number;
    employeeUpperRate: number;
    employerRate: number;
    employerUpperRate: number;
  };
  studentLoan: {
    plan1: { threshold: number; rate: number };
    plan2: { threshold: number; rate: number };
    plan4: { threshold: number; rate: number };
    plan5: { threshold: number; rate: number };
    postgrad: { threshold: number; rate: number };
  };
  autoEnrolment: {
    lowerEarningsLimit: number;
    upperEarningsLimit: number;
  };
  childcareVoucherLimits: {
    basicRateOrPreApril2011: number;
    higherRatePostApril2011: number;
    additionalRatePostApril2011: number;
  };
}

export interface IncomeTaxBand {
  name: string;
  rate: number;
  min: number;
  max: number | null;
}

export type PayPeriod = 'annual' | 'monthly' | 'four-weekly' | 'two-weekly' | 'weekly' | 'daily';
export type PensionType = 'none' | 'auto-enrolment' | 'occupational' | 'salary-sacrifice' | 'personal';
export type TaxCode = 'standard' | 'BR' | 'D0' | 'D1' | 'NT' | 'K' | 'S-code' | 'custom';
export type StudentLoanPlan = 'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5';

export interface CalculationInputs {
  // Basic salary information
  grossSalary: number;
  payPeriod: PayPeriod;
  taxYear: string;
  
  // Location and tax code
  region: 'england' | 'scotland' | 'wales' | 'northern-ireland';
  taxCode: string;
  isScottishTaxpayer: boolean;
  
  // Work pattern
  weeklyHours: number;
  weeksPerYear: number;
  
  // Overtime and bonuses
  overtimeHours: number;
  overtimeMultiplier: number;
  overtimeCashAmount: number;
  bonusAmount: number;
  includeBonusInPension: boolean;
  
  // Pension contributions
  pensionType: PensionType;
  pensionContributionRate: number;
  pensionCashAmount: number;
  pensionOnQualifyingEarnings: boolean;
  
  // Student loans
  studentLoanPlans: StudentLoanPlan[];
  hasPostgradLoan: boolean;
  
  // Salary sacrifice and benefits
  salarySacrificeAmount: number;
  salarySacrificeNIOnly: boolean;
  taxableBenefits: number;
  cashAllowances: number;
  
  // Childcare and other deductions
  childcareVoucherAmount: number;
  childcareVoucherJoinDate: string;
  preTaxDeductions: number;
  postTaxDeductions: number;
  
  // Special circumstances
  hasBlindPersonAllowance: boolean;
  hasMarriedCouplesAllowance: boolean;
  noNationalInsurance: boolean;
  
  // Legacy fields for backwards compatibility
  grossAnnualSalary?: number;
  studentLoanPlan?: StudentLoanPlan;
  pensionContribution?: number;
  salaryExchange?: boolean;
}

export interface CalculationResult {
  gross: {
    annual: number;
    monthly: number;
    weekly: number;
    daily: number;
    hourly: number;
  };
  net: {
    annual: number;
    monthly: number;
    weekly: number;
    daily: number;
    hourly: number;
  };
  incomeTax: {
    annual: number;
    monthly: number;
    bands: TaxBandResult[];
  };
  nationalInsurance: {
    employee: {
      annual: number;
      monthly: number;
      bands: NIBandResult[];
    };
    employer: {
      annual: number;
      monthly: number;
    };
  };
  studentLoan: {
    annual: number;
    monthly: number;
    plans: StudentLoanResult[];
  };
  pension: {
    employee: {
      annual: number;
      monthly: number;
    };
    employer: {
      annual: number;
      monthly: number;
    };
    type: PensionType;
    qualifyingEarnings?: number;
  };
  
  // Calculation details
  personalAllowance: number;
  taxableIncome: number;
  adjustedNetIncome: number;
  contractualSalary: number;
  
  // Allowances and rebates
  blindPersonAllowance: number;
  marriedCouplesRebate: number;
  
  // Breakdown by component
  totalDeductions: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
}

export interface TaxBandResult {
  name: string;
  rate: number;
  min: number;
  max: number | null;
  taxableAmount: number;
  taxDue: number;
}

export interface NIBandResult {
  name: string;
  rate: number;
  min: number;
  max: number | null;
  earningsInBand: number;
  niDue: number;
}

export interface StudentLoanResult {
  plan: StudentLoanPlan;
  threshold: number;
  rate: number;
  repayableIncome: number;
  repayment: number;
}