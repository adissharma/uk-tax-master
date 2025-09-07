import { CalculationInputs, CalculationResult } from './types';
import { taxYear202425 } from './tax-years/2024-25';

const TAX_YEARS = {
  '2024-25': taxYear202425,
};

export function calculateSalary(inputs: CalculationInputs): CalculationResult {
  const taxYear = TAX_YEARS[inputs.taxYear] || taxYear202425;
  
  // Calculate personal allowance with taper
  const personalAllowance = calculatePersonalAllowance(
    inputs.grossAnnualSalary,
    taxYear.personalAllowance,
    taxYear.personalAllowanceTaperThreshold
  );
  
  // Calculate pension contributions
  const pensionEmployee = inputs.pensionContribution 
    ? (inputs.grossAnnualSalary * inputs.pensionContribution) / 100 
    : 0;
  const pensionEmployer = pensionEmployee; // Assuming matching contribution
  
  // Calculate salary after pension (if salary exchange)
  const salaryAfterPension = inputs.salaryExchange 
    ? inputs.grossAnnualSalary - pensionEmployee
    : inputs.grossAnnualSalary;
  
  // Calculate taxable income
  const taxableIncome = Math.max(0, salaryAfterPension - personalAllowance);
  
  // Calculate income tax
  const incomeTaxResult = calculateIncomeTax(taxableIncome, taxYear.incomeTaxBands);
  
  // Calculate National Insurance
  const nationalInsuranceEmployee = calculateNationalInsurance(
    salaryAfterPension,
    taxYear.nationalInsurance,
    'employee'
  );
  const nationalInsuranceEmployer = calculateNationalInsurance(
    salaryAfterPension,
    taxYear.nationalInsurance,
    'employer'
  );
  
  // Calculate student loan
  const studentLoan = calculateStudentLoan(
    inputs.grossAnnualSalary,
    inputs.studentLoanPlan,
    inputs.hasPostgradLoan,
    taxYear.studentLoan
  );
  
  // Calculate net pay
  const totalDeductions = incomeTaxResult.total + nationalInsuranceEmployee + studentLoan;
  const netAnnual = inputs.grossAnnualSalary - totalDeductions - (inputs.salaryExchange ? 0 : pensionEmployee);
  
  return {
    gross: {
      annual: inputs.grossAnnualSalary,
      monthly: inputs.grossAnnualSalary / 12,
      weekly: inputs.grossAnnualSalary / 52,
      daily: inputs.grossAnnualSalary / 260, // 52 weeks * 5 days
      hourly: inputs.grossAnnualSalary / (52 * 37.5), // Assuming 37.5 hours per week
    },
    net: {
      annual: netAnnual,
      monthly: netAnnual / 12,
      weekly: netAnnual / 52,
      daily: netAnnual / 260,
      hourly: netAnnual / (52 * 37.5),
    },
    incomeTax: {
      annual: incomeTaxResult.total,
      monthly: incomeTaxResult.total / 12,
      bands: incomeTaxResult.bands,
    },
    nationalInsurance: {
      employee: {
        annual: nationalInsuranceEmployee,
        monthly: nationalInsuranceEmployee / 12,
      },
      employer: {
        annual: nationalInsuranceEmployer,
        monthly: nationalInsuranceEmployer / 12,
      },
    },
    studentLoan: {
      annual: studentLoan,
      monthly: studentLoan / 12,
    },
    pension: {
      employee: {
        annual: pensionEmployee,
        monthly: pensionEmployee / 12,
      },
      employer: {
        annual: pensionEmployer,
        monthly: pensionEmployer / 12,
      },
    },
    personalAllowance,
    taxableIncome,
  };
}

function calculatePersonalAllowance(grossSalary: number, baseAllowance: number, taperThreshold: number): number {
  if (grossSalary <= taperThreshold) {
    return baseAllowance;
  }
  
  const excess = grossSalary - taperThreshold;
  const reduction = Math.floor(excess / 2);
  return Math.max(0, baseAllowance - reduction);
}

function calculateIncomeTax(taxableIncome: number, bands: any[]) {
  let totalTax = 0;
  const bandResults = [];
  
  for (const band of bands) {
    if (band.rate === 0 || taxableIncome <= band.min) {
      bandResults.push({
        name: band.name,
        rate: band.rate,
        taxable: 0,
        tax: 0,
      });
      continue;
    }
    
    const bandMax = band.max || Infinity;
    const taxableInBand = Math.min(taxableIncome, bandMax) - band.min;
    const taxInBand = taxableInBand * band.rate;
    
    bandResults.push({
      name: band.name,
      rate: band.rate,
      taxable: Math.max(0, taxableInBand),
      tax: Math.max(0, taxInBand),
    });
    
    totalTax += Math.max(0, taxInBand);
  }
  
  return {
    total: totalTax,
    bands: bandResults,
  };
}

function calculateNationalInsurance(salary: number, niRates: any, type: 'employee' | 'employer'): number {
  if (salary <= niRates.primaryThreshold) {
    return 0;
  }
  
  const rate = type === 'employee' ? niRates.employeeRate : niRates.employerRate;
  const upperRate = type === 'employee' ? niRates.employeeUpperRate : niRates.employerUpperRate;
  
  if (salary <= niRates.upperEarningsLimit) {
    return (salary - niRates.primaryThreshold) * rate;
  }
  
  const lowerBandNI = (niRates.upperEarningsLimit - niRates.primaryThreshold) * rate;
  const upperBandNI = (salary - niRates.upperEarningsLimit) * upperRate;
  
  return lowerBandNI + upperBandNI;
}

function calculateStudentLoan(
  salary: number,
  plan?: string,
  hasPostgrad?: boolean,
  rates?: any
): number {
  if (!plan || plan === 'none' || !rates) {
    return 0;
  }
  
  let total = 0;
  
  // Calculate main plan repayment
  if (plan !== 'none') {
    const planRates = rates[plan];
    if (salary > planRates.threshold) {
      total += (salary - planRates.threshold) * planRates.rate;
    }
  }
  
  // Calculate postgrad loan repayment
  if (hasPostgrad && salary > rates.postgrad.threshold) {
    total += (salary - rates.postgrad.threshold) * rates.postgrad.rate;
  }
  
  return total;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}