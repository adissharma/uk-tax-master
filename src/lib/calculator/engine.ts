import { CalculationInputs, CalculationResult, TaxBandResult, NIBandResult, StudentLoanResult, PensionType } from './types';
import { taxYear202425 } from './tax-years/2024-25';
import { taxYear202526 } from './tax-years/2025-26';

const TAX_YEARS = {
  '2024-25': taxYear202425,
  '2025-26': taxYear202526,
};

export function calculateSalary(inputs: CalculationInputs): CalculationResult {
  const taxYear = TAX_YEARS[inputs.taxYear] || taxYear202526;
  
  // Normalize inputs for backwards compatibility
  const grossSalary = inputs.grossAnnualSalary || inputs.grossSalary;
  const payPeriod = inputs.payPeriod || 'annual';
  
  // Step 1: Convert pay to annual
  const annualGross = normalizeToAnnual(grossSalary, payPeriod);
  
  // Step 2: Apply salary sacrifice
  const salarySacrifice = inputs.salarySacrificeAmount || 0;
  const contractualSalary = annualGross - salarySacrifice;
  
  // Step 3: Calculate pension contributions
  const pensionResult = calculatePensions(contractualSalary, inputs, taxYear);
  
  // Step 4: Calculate adjusted net income for PA taper
  const adjustedNetIncome = contractualSalary - pensionResult.taxRelievedAmount;
  
  // Step 5: Calculate personal allowance with taper and allowances
  const personalAllowance = calculatePersonalAllowance(adjustedNetIncome, inputs, taxYear);
  const blindPersonAllowance = inputs.hasBlindPersonAllowance ? taxYear.blindPersonAllowance : 0;
  
  // Step 6: Determine tax bands (rUK or Scotland)
  const isScottish = inputs.isScottishTaxpayer || inputs.region === 'scotland' || inputs.taxCode?.startsWith('S');
  const taxBands = isScottish ? taxYear.scottishIncomeTaxBands : taxYear.incomeTaxBands;
  
  // Step 7: Calculate taxable income
  const taxableIncome = Math.max(0, contractualSalary - personalAllowance - pensionResult.taxRelievedAmount);
  
  // Step 8: Calculate income tax
  const incomeTaxResult = calculateIncomeTax(taxableIncome, taxBands, inputs.taxCode);
  
  // Step 9: Calculate National Insurance
  const niResult = calculateNationalInsurance(contractualSalary, inputs.noNationalInsurance, taxYear);
  
  // Step 10: Calculate student loan repayments
  const studentLoanResult = calculateStudentLoans(contractualSalary, inputs, taxYear);
  
  // Step 11: Calculate married couples rebate
  const marriedCouplesRebate = inputs.hasMarriedCouplesAllowance 
    ? calculateMarriedCouplesRebate(adjustedNetIncome, taxYear)
    : 0;
  
  // Step 12: Calculate net pay
  const totalDeductions = 
    incomeTaxResult.total + 
    niResult.employee.total + 
    studentLoanResult.total + 
    pensionResult.employeeContribution;
    
  const netAnnual = contractualSalary - totalDeductions + marriedCouplesRebate;
  
  // Step 13: Calculate rates
  const effectiveTaxRate = totalDeductions / contractualSalary;
  const marginalTaxRate = calculateMarginalTaxRate(contractualSalary, inputs, taxYear);
  
  return {
    gross: {
      annual: annualGross,
      monthly: annualGross / 12,
      weekly: annualGross / 52,
      daily: annualGross / 260,
      hourly: annualGross / (52 * (inputs.weeklyHours || 37.5)),
    },
    net: {
      annual: netAnnual,
      monthly: netAnnual / 12,
      weekly: netAnnual / 52,
      daily: netAnnual / 260,
      hourly: netAnnual / (52 * (inputs.weeklyHours || 37.5)),
    },
    incomeTax: {
      annual: incomeTaxResult.total,
      monthly: incomeTaxResult.total / 12,
      bands: incomeTaxResult.bands,
    },
    nationalInsurance: {
      employee: {
        annual: niResult.employee.total,
        monthly: niResult.employee.total / 12,
        bands: niResult.employee.bands,
      },
      employer: {
        annual: niResult.employer.total,
        monthly: niResult.employer.total / 12,
      },
    },
    studentLoan: {
      annual: studentLoanResult.total,
      monthly: studentLoanResult.total / 12,
      plans: studentLoanResult.plans,
    },
    pension: {
      employee: {
        annual: pensionResult.employeeContribution,
        monthly: pensionResult.employeeContribution / 12,
      },
      employer: {
        annual: pensionResult.employerContribution,
        monthly: pensionResult.employerContribution / 12,
      },
      type: inputs.pensionType || 'none',
      qualifyingEarnings: pensionResult.qualifyingEarnings,
    },
    personalAllowance,
    taxableIncome,
    adjustedNetIncome,
    contractualSalary,
    blindPersonAllowance,
    marriedCouplesRebate,
    totalDeductions,
    effectiveTaxRate,
    marginalTaxRate,
  };
}

function normalizeToAnnual(amount: number, period: string): number {
  switch (period) {
    case 'annual': return amount;
    case 'monthly': return amount * 12;
    case 'four-weekly': return amount * 13;
    case 'two-weekly': return amount * 26;
    case 'weekly': return amount * 52;
    case 'daily': return amount * 260; // 52 weeks * 5 days
    default: return amount;
  }
}

function calculatePersonalAllowance(adjustedNetIncome: number, inputs: CalculationInputs, taxYear: any): number {
  let pa = taxYear.personalAllowance;
  
  // Add blind person's allowance
  if (inputs.hasBlindPersonAllowance) {
    pa += taxYear.blindPersonAllowance;
  }
  
  // Apply taper reduction
  if (adjustedNetIncome > taxYear.personalAllowanceTaperThreshold) {
    const excess = adjustedNetIncome - taxYear.personalAllowanceTaperThreshold;
    const reduction = Math.floor(excess / 2);
    pa = Math.max(0, pa - reduction);
  }
  
  return pa;
}

function calculatePensions(contractualSalary: number, inputs: CalculationInputs, taxYear: any) {
  const pensionType = inputs.pensionType || 'none';
  
  if (pensionType === 'none') {
    return {
      employeeContribution: 0,
      employerContribution: 0,
      taxRelievedAmount: 0,
      qualifyingEarnings: 0,
    };
  }
  
  let pensionableIncome = contractualSalary;
  let qualifyingEarnings = 0;
  
  // Calculate qualifying earnings for auto-enrolment
  if (pensionType === 'auto-enrolment') {
    qualifyingEarnings = Math.min(
      Math.max(0, contractualSalary - taxYear.autoEnrolment.lowerEarningsLimit),
      taxYear.autoEnrolment.upperEarningsLimit - taxYear.autoEnrolment.lowerEarningsLimit
    );
    pensionableIncome = qualifyingEarnings;
  }
  
  const contributionRate = (inputs.pensionContributionRate || inputs.pensionContribution || 0) / 100;
  const employeeContribution = inputs.pensionCashAmount || (pensionableIncome * contributionRate);
  
  // Employer typically matches employee contribution
  const employerContribution = employeeContribution;
  
  // Tax relief depends on pension type
  let taxRelievedAmount = 0;
  if (pensionType === 'occupational' || pensionType === 'auto-enrolment') {
    taxRelievedAmount = employeeContribution; // Net pay arrangement
  }
  // Personal pensions get relief at source (20% added by provider)
  
  return {
    employeeContribution,
    employerContribution,
    taxRelievedAmount,
    qualifyingEarnings,
  };
}

function calculateIncomeTax(taxableIncome: number, bands: any[], taxCode?: string) {
  // Handle special tax codes
  if (taxCode) {
    if (taxCode === 'BR') return { total: taxableIncome * 0.20, bands: [] };
    if (taxCode === 'D0') return { total: taxableIncome * 0.40, bands: [] };
    if (taxCode === 'D1') return { total: taxableIncome * 0.45, bands: [] };
    if (taxCode === 'NT') return { total: 0, bands: [] };
  }
  
  let totalTax = 0;
  const bandResults: TaxBandResult[] = [];
  let remainingIncome = taxableIncome;
  
  for (let i = 1; i < bands.length; i++) { // Skip personal allowance band
    const band = bands[i];
    if (remainingIncome <= 0) break;
    
    const bandWidth = band.max ? band.max - band.min : Infinity;
    const taxableInBand = Math.min(remainingIncome, bandWidth);
    const taxInBand = taxableInBand * band.rate;
    
    bandResults.push({
      name: band.name,
      rate: band.rate,
      min: band.min,
      max: band.max,
      taxableAmount: taxableInBand,
      taxDue: taxInBand,
    });
    
    totalTax += taxInBand;
    remainingIncome -= taxableInBand;
  }
  
  return {
    total: totalTax,
    bands: bandResults,
  };
}

function calculateNationalInsurance(salary: number, noNI: boolean, taxYear: any) {
  if (noNI) {
    return {
      employee: { total: 0, bands: [] },
      employer: { total: 0, bands: [] },
    };
  }
  
  const weeklyPay = salary / 52;
  const ni = taxYear.nationalInsurance;
  
  // Employee NI bands
  const employeeBands: NIBandResult[] = [];
  let employeeTotal = 0;
  
  // Band 1: 0% up to primary threshold
  const band1Earnings = Math.min(weeklyPay, ni.weeklyPrimaryThreshold);
  employeeBands.push({
    name: 'Below Primary Threshold',
    rate: 0,
    min: 0,
    max: ni.weeklyPrimaryThreshold,
    earningsInBand: band1Earnings,
    niDue: 0,
  });
  
  // Band 2: 8% between thresholds
  if (weeklyPay > ni.weeklyPrimaryThreshold) {
    const band2Earnings = Math.min(
      weeklyPay - ni.weeklyPrimaryThreshold,
      ni.weeklyUpperEarningsLimit - ni.weeklyPrimaryThreshold
    );
    const band2NI = band2Earnings * ni.employeeRate;
    employeeBands.push({
      name: 'Primary Rate',
      rate: ni.employeeRate,
      min: ni.weeklyPrimaryThreshold,
      max: ni.weeklyUpperEarningsLimit,
      earningsInBand: band2Earnings,
      niDue: band2NI,
    });
    employeeTotal += band2NI;
  }
  
  // Band 3: 2% above upper limit
  if (weeklyPay > ni.weeklyUpperEarningsLimit) {
    const band3Earnings = weeklyPay - ni.weeklyUpperEarningsLimit;
    const band3NI = band3Earnings * ni.employeeUpperRate;
    employeeBands.push({
      name: 'Upper Rate',
      rate: ni.employeeUpperRate,
      min: ni.weeklyUpperEarningsLimit,
      max: null,
      earningsInBand: band3Earnings,
      niDue: band3NI,
    });
    employeeTotal += band3NI;
  }
  
  // Employer NI (13.8% above primary threshold)
  const employerTotal = Math.max(0, weeklyPay - ni.weeklyPrimaryThreshold) * ni.employerRate;
  
  return {
    employee: {
      total: employeeTotal * 52,
      bands: employeeBands,
    },
    employer: {
      total: employerTotal * 52,
    },
  };
}

function calculateStudentLoans(salary: number, inputs: CalculationInputs, taxYear: any) {
  const plans = inputs.studentLoanPlans || (inputs.studentLoanPlan ? [inputs.studentLoanPlan] : []);
  const results: StudentLoanResult[] = [];
  let total = 0;
  
  // Calculate repayments for each plan
  for (const plan of plans) {
    if (plan === 'none') continue;
    
    const planData = taxYear.studentLoan[plan];
    if (!planData) continue;
    
    const repayableIncome = Math.max(0, salary - planData.threshold);
    const repayment = repayableIncome * planData.rate;
    
    results.push({
      plan,
      threshold: planData.threshold,
      rate: planData.rate,
      repayableIncome,
      repayment,
    });
    
    total += repayment;
  }
  
  // Postgraduate loan
  if (inputs.hasPostgradLoan) {
    const pgData = taxYear.studentLoan.postgrad;
    const repayableIncome = Math.max(0, salary - pgData.threshold);
    const repayment = repayableIncome * pgData.rate;
    
    results.push({
      plan: 'postgrad' as any,
      threshold: pgData.threshold,
      rate: pgData.rate,
      repayableIncome,
      repayment,
    });
    
    total += repayment;
  }
  
  return {
    total,
    plans: results,
  };
}

function calculateMarriedCouplesRebate(adjustedNetIncome: number, taxYear: any): number {
  if (adjustedNetIncome <= 37700) {
    return taxYear.marriedCouplesAllowance;
  }
  
  // Reduce rebate for higher incomes
  const reduction = Math.floor((adjustedNetIncome - 37700) / 2);
  return Math.max(taxYear.marriedCouplesAllowanceMinimum, taxYear.marriedCouplesAllowance - reduction);
}

function calculateMarginalTaxRate(salary: number, inputs: CalculationInputs, taxYear: any): number {
  // Calculate effective rate on next £1 of income
  const current = calculateSalary({ ...inputs, grossSalary: salary });
  const next = calculateSalary({ ...inputs, grossSalary: salary + 1 });
  
  return (next.totalDeductions - current.totalDeductions);
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