import { CalculationInputs, CalculationResult } from './types';
import { taxYear202425 } from './tax-years/2024-25';

const TAX_YEARS = {
  '2024-25': taxYear202425,
};

export function calculateSalary(inputs: CalculationInputs): CalculationResult {
  const taxYear = TAX_YEARS[inputs.taxYear] || taxYear202425;
  
  // Calculate overtime first
  const overtimeResult = calculateOvertime(inputs);
  
  // Calculate baseline (without bonus) with overtime included
  const baselineResult = calculateBaselineDeductions(inputs, taxYear, overtimeResult?.annualAmount || 0);
  
  // Calculate bonus scenario if bonus is present
  let bonusResult = null;
  if (inputs.bonusAmount && inputs.bonusAmount > 0) {
    bonusResult = calculateBonusScenario(inputs, taxYear, baselineResult, overtimeResult?.annualAmount || 0);
  }

  return {
    ...baselineResult,
    overtime: overtimeResult,
    bonus: bonusResult,
  };
}

function calculateOvertime(inputs: CalculationInputs) {
  if (!inputs.normalWorkingWeek || !inputs.weeksPerYear) {
    return null;
  }

  const normalHourlyRate = inputs.grossAnnualSalary / (inputs.weeksPerYear * inputs.normalWorkingWeek);
  
  let annualOvertimeAmount = 0;
  let overtime1Pay = 0;
  let overtime2Pay = 0;
  
  // Check if using cash method
  if (inputs.overtimeCashValue && inputs.overtimeCashValue > 0) {
    const multiplier = inputs.overtimeCashPeriod === 'monthly' ? 12 
      : inputs.overtimeCashPeriod === 'weekly' ? 52 
      : 1; // annual
    annualOvertimeAmount = inputs.overtimeCashValue * multiplier;
  } else {
    // Calculate from hours and multipliers
    if (inputs.overtime1Hours && inputs.overtime1Hours > 0 && inputs.overtime1Multiplier) {
      overtime1Pay = (inputs.overtime1Hours * 12) * inputs.overtime1Multiplier * normalHourlyRate;
      annualOvertimeAmount += overtime1Pay;
    }
    
    if (inputs.overtime2Hours && inputs.overtime2Hours > 0 && inputs.overtime2Multiplier) {
      overtime2Pay = (inputs.overtime2Hours * 12) * inputs.overtime2Multiplier * normalHourlyRate;
      annualOvertimeAmount += overtime2Pay;
    }
  }
  
  if (annualOvertimeAmount === 0) {
    return null;
  }
  
  return {
    annualAmount: annualOvertimeAmount,
    normalHourlyRate,
    overtime1Pay,
    overtime2Pay,
  };
}

function calculateBaselineDeductions(inputs: CalculationInputs, taxYear: any, overtimeAmount: number = 0) {
  // Total gross including overtime
  const totalGrossAnnual = inputs.grossAnnualSalary + overtimeAmount;
  
  // Calculate personal allowance with taper
  const personalAllowance = calculatePersonalAllowance(
    totalGrossAnnual,
    taxYear.personalAllowance,
    taxYear.personalAllowanceTaperThreshold
  );
  
  // Calculate pension contributions
  let pensionEmployee = 0;
  if (inputs.pensionContribution) {
    let pensionableIncome = inputs.grossAnnualSalary;
    // Include overtime in pension if option is selected
    if (inputs.includeOvertimeInPension) {
      pensionableIncome += overtimeAmount;
    }
    pensionEmployee = (pensionableIncome * inputs.pensionContribution) / 100;
  }
  const pensionEmployer = pensionEmployee; // Assuming matching contribution
  
  // Calculate salary after pension (if salary exchange)
  const salaryAfterPension = inputs.salaryExchange 
    ? totalGrossAnnual - pensionEmployee
    : totalGrossAnnual;
  
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
    totalGrossAnnual,
    inputs.studentLoanPlan,
    inputs.hasPostgradLoan,
    taxYear.studentLoan
  );
  
  // Calculate net pay
  const totalDeductions = incomeTaxResult.total + nationalInsuranceEmployee + studentLoan;
  const netAnnual = totalGrossAnnual - totalDeductions - (inputs.salaryExchange ? 0 : pensionEmployee);

  return {
    gross: {
      annual: totalGrossAnnual,
      monthly: totalGrossAnnual / 12,
      weekly: totalGrossAnnual / 52,
      daily: totalGrossAnnual / 260, // 52 weeks * 5 days
      hourly: totalGrossAnnual / (52 * 37.5), // Assuming 37.5 hours per week
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

function calculateBonusScenario(inputs: CalculationInputs, taxYear: any, baselineResult: any, overtimeAmount: number = 0) {
  const bonusAmount = inputs.bonusAmount || 0;
  
  // Calculate deductions with bonus included
  const grossWithBonus = inputs.grossAnnualSalary + overtimeAmount + bonusAmount;
  
  // For bonus calculation, pension may or may not include the bonus
  let pensionOnBonus = 0;
  if (inputs.includeBonusInPension && inputs.pensionContribution) {
    pensionOnBonus = (bonusAmount * inputs.pensionContribution) / 100;
  }
  
  // Calculate personal allowance with bonus (same as baseline unless bonus affects taper)
  const personalAllowanceWithBonus = calculatePersonalAllowance(
    grossWithBonus,
    taxYear.personalAllowance,
    taxYear.personalAllowanceTaperThreshold
  );
  
  // Calculate salary after pension with bonus
  const salaryAfterPensionWithBonus = inputs.salaryExchange 
    ? grossWithBonus - (baselineResult.pension.employee.annual + pensionOnBonus)
    : grossWithBonus;
  
  // Calculate taxable income with bonus
  const taxableIncomeWithBonus = Math.max(0, salaryAfterPensionWithBonus - personalAllowanceWithBonus);
  
  // Calculate deductions with bonus
  const incomeTaxWithBonus = calculateIncomeTax(taxableIncomeWithBonus, taxYear.incomeTaxBands).total;
  const niWithBonus = calculateNationalInsurance(salaryAfterPensionWithBonus, taxYear.nationalInsurance, 'employee');
  const slWithBonus = calculateStudentLoan(grossWithBonus, inputs.studentLoanPlan, inputs.hasPostgradLoan, taxYear.studentLoan);
  
  // Calculate deltas (extra deductions due to bonus)
  const deltaTax = incomeTaxWithBonus - baselineResult.incomeTax.annual;
  const deltaNI = niWithBonus - baselineResult.nationalInsurance.employee.annual;
  const deltaSL = slWithBonus - baselineResult.studentLoan.annual;
  const deltaTotal = deltaTax + deltaNI + deltaSL;
  
  // Apply cap: total extra deductions cannot exceed bonus amount
  const cappedDeltaTotal = Math.min(deltaTotal, bonusAmount);
  const cappingRatio = deltaTotal > 0 ? cappedDeltaTotal / deltaTotal : 1;
  
  const cappedDeltaTax = deltaTax * cappingRatio;
  const cappedDeltaNI = deltaNI * cappingRatio;
  const cappedDeltaSL = deltaSL * cappingRatio;
  
  // Calculate period comparison based on normal pay period
  const periodDivisor = getPeriodDivisor(inputs.normalPayPeriod || 'monthly');
  
  const normalPeriodGross = inputs.grossAnnualSalary / periodDivisor;
  const normalPeriodTax = baselineResult.incomeTax.annual / periodDivisor;
  const normalPeriodNI = baselineResult.nationalInsurance.employee.annual / periodDivisor;
  const normalPeriodSL = baselineResult.studentLoan.annual / periodDivisor;
  const normalPeriodPension = baselineResult.pension.employee.annual / periodDivisor;
  const normalPeriodNet = normalPeriodGross - normalPeriodTax - normalPeriodNI - normalPeriodSL - (inputs.salaryExchange ? 0 : normalPeriodPension);
  
  const bonusPeriodGross = normalPeriodGross + bonusAmount;
  const bonusPeriodTax = normalPeriodTax + cappedDeltaTax;
  const bonusPeriodNI = normalPeriodNI + cappedDeltaNI;
  const bonusPeriodSL = normalPeriodSL + cappedDeltaSL;
  const bonusPeriodPension = normalPeriodPension + pensionOnBonus;
  const bonusPeriodNet = bonusPeriodGross - bonusPeriodTax - bonusPeriodNI - bonusPeriodSL - (inputs.salaryExchange ? 0 : bonusPeriodPension);
  
  return {
    amount: bonusAmount,
    extraDeductions: {
      tax: cappedDeltaTax,
      ni: cappedDeltaNI,
      studentLoan: cappedDeltaSL,
      total: cappedDeltaTotal,
    },
    periodComparison: {
      normalPeriod: {
        gross: normalPeriodGross,
        tax: normalPeriodTax,
        ni: normalPeriodNI,
        studentLoan: normalPeriodSL,
        pension: normalPeriodPension,
        net: normalPeriodNet,
      },
      bonusPeriod: {
        gross: bonusPeriodGross,
        tax: bonusPeriodTax,
        ni: bonusPeriodNI,
        studentLoan: bonusPeriodSL,
        pension: bonusPeriodPension,
        net: bonusPeriodNet,
      },
    },
  };
}

function getPeriodDivisor(period: string): number {
  switch (period) {
    case 'weekly': return 52;
    case 'two-weekly': return 26;
    case 'four-weekly': return 13;
    case 'monthly': return 12;
    default: return 12;
  }
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