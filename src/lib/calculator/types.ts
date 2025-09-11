export interface TaxYear {
  year: string;
  personalAllowance: number;
  personalAllowanceTaperThreshold: number;
  incomeTaxBands: IncomeTaxBand[];
  nationalInsurance: {
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
    postgrad: { threshold: number; rate: number };
  };
}

export interface IncomeTaxBand {
  name: string;
  rate: number;
  min: number;
  max: number | null;
}

export interface CalculationInputs {
  grossAnnualSalary: number;
  taxYear: string;
  region: 'england' | 'scotland' | 'wales' | 'northern-ireland';
  taxCode?: string;
  studentLoanPlan?: 'none' | 'plan1' | 'plan2' | 'plan4';
  hasPostgradLoan?: boolean;
  pensionContribution?: number;
  salaryExchange?: boolean;
  bonusAmount?: number;
  normalPayPeriod?: 'monthly' | 'four-weekly' | 'two-weekly' | 'weekly';
  includeBonusInPension?: boolean;
  // Overtime fields
  normalWorkingWeek?: number; // hours per week
  weeksPerYear?: number; // 52 or 52.14
  overtime1Hours?: number; // hours per month
  overtime1Multiplier?: number; // e.g., 1.5 for time-and-a-half
  overtime2Hours?: number;
  overtime2Multiplier?: number;
  overtimeCashValue?: number; // alternative to hours/multiplier
  overtimeCashPeriod?: 'annual' | 'monthly' | 'weekly';
  includeOvertimeInPension?: boolean;
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
    bands: { name: string; rate: number; taxable: number; tax: number }[];
  };
  nationalInsurance: {
    employee: {
      annual: number;
      monthly: number;
    };
    employer: {
      annual: number;
      monthly: number;
    };
  };
  studentLoan: {
    annual: number;
    monthly: number;
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
  };
  personalAllowance: number;
  taxableIncome: number;
  overtime?: {
    annualAmount: number;
    normalHourlyRate: number;
    overtime1Pay: number;
    overtime2Pay: number;
  };
  bonus?: {
    amount: number;
    periodComparison: {
      normalPeriod: {
        gross: number;
        tax: number;
        ni: number;
        studentLoan: number;
        pension: number;
        net: number;
      };
      bonusPeriod: {
        gross: number;
        tax: number;
        ni: number;
        studentLoan: number;
        pension: number;
        net: number;
      };
    };
    extraDeductions: {
      tax: number;
      ni: number;
      studentLoan: number;
      total: number;
    };
  };
}