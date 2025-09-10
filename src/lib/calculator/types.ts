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
  studentLoanPlan?: 'none' | 'plan1' | 'plan2' | 'plan4';
  hasPostgradLoan?: boolean;
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
}