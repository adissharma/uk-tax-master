import { describe, it, expect } from 'vitest';
import { calculateSalary, formatCurrency, formatPercentage } from '../engine';
import { CalculationInputs } from '../types';

describe('Salary Calculator Engine', () => {
  const defaultInputs: CalculationInputs = {
    grossAnnualSalary: 30000,
    taxYear: '2024-25',
    region: 'england',
    studentLoanPlan: 'none',
    hasPostgradLoan: false,
    pensionContribution: 0,
    salaryExchange: false,
  };

  describe('Basic calculations', () => {
    it('should calculate correct net pay for £30,000 salary', () => {
      const result = calculateSalary(defaultInputs);
      
      expect(result.gross.annual).toBe(30000);
      expect(result.personalAllowance).toBe(12570);
      expect(result.taxableIncome).toBe(17430);
      expect(result.incomeTax.annual).toBeCloseTo(3486, 0); // 20% of 17430
      expect(result.nationalInsurance.employee.annual).toBeCloseTo(2091.6, 0); // 12% of (30000-12570)
    });

    it('should calculate correct net pay for £50,000 salary', () => {
      const result = calculateSalary({
        ...defaultInputs,
        grossAnnualSalary: 50000,
      });
      
      expect(result.gross.annual).toBe(50000);
      expect(result.personalAllowance).toBe(12570);
      expect(result.taxableIncome).toBe(37430);
      expect(result.incomeTax.annual).toBeCloseTo(7486, 0); // 20% of 37430
      expect(result.nationalInsurance.employee.annual).toBeCloseTo(4491.6, 0); // 12% of (50000-12570)
    });

    it('should handle higher rate tax correctly for £60,000 salary', () => {
      const result = calculateSalary({
        ...defaultInputs,
        grossAnnualSalary: 60000,
      });
      
      const basicRateTax = (50270 - 12570) * 0.20; // £7,540
      const higherRateTax = (60000 - 50270) * 0.40; // £3,892
      const expectedTotalTax = basicRateTax + higherRateTax; // £11,432
      
      expect(result.incomeTax.annual).toBeCloseTo(expectedTotalTax, 0);
    });
  });

  describe('Personal Allowance taper', () => {
    it('should reduce personal allowance for salary over £100,000', () => {
      const result = calculateSalary({
        ...defaultInputs,
        grossAnnualSalary: 110000,
      });
      
      // Personal allowance should be reduced by £1 for every £2 over £100,000
      const reduction = (110000 - 100000) / 2; // £5,000
      const expectedPA = 12570 - reduction; // £7,570
      
      expect(result.personalAllowance).toBe(expectedPA);
    });

    it('should completely remove personal allowance for very high salaries', () => {
      const result = calculateSalary({
        ...defaultInputs,
        grossAnnualSalary: 130000,
      });
      
      // Personal allowance should be zero for salaries over £125,140
      expect(result.personalAllowance).toBe(0);
    });
  });

  describe('National Insurance calculations', () => {
    it('should not charge NI below primary threshold', () => {
      const result = calculateSalary({
        ...defaultInputs,
        grossAnnualSalary: 10000,
      });
      
      expect(result.nationalInsurance.employee.annual).toBe(0);
    });

    it('should apply correct NI rates above Upper Earnings Limit', () => {
      const result = calculateSalary({
        ...defaultInputs,
        grossAnnualSalary: 60000,
      });
      
      // NI calculation:
      // Below threshold (£12,570): £0
      // £12,570 to £50,270: (£50,270 - £12,570) × 12% = £4,524
      // Above £50,270: (£60,000 - £50,270) × 2% = £194.60
      const expectedNI = (50270 - 12570) * 0.12 + (60000 - 50270) * 0.02;
      
      expect(result.nationalInsurance.employee.annual).toBeCloseTo(expectedNI, 1);
    });
  });

  describe('Period calculations', () => {
    it('should calculate monthly amounts correctly', () => {
      const result = calculateSalary(defaultInputs);
      
      expect(result.gross.monthly).toBeCloseTo(30000 / 12, 2);
      expect(result.net.monthly).toBeCloseTo(result.net.annual / 12, 2);
      expect(result.incomeTax.monthly).toBeCloseTo(result.incomeTax.annual / 12, 2);
    });

    it('should calculate hourly rates correctly', () => {
      const result = calculateSalary(defaultInputs);
      
      const expectedGrossHourly = 30000 / (52 * 37.5); // Assuming 37.5 hours per week
      const expectedNetHourly = result.net.annual / (52 * 37.5);
      
      expect(result.gross.hourly).toBeCloseTo(expectedGrossHourly, 2);
      expect(result.net.hourly).toBeCloseTo(expectedNetHourly, 2);
    });
  });

  describe('Pension contributions', () => {
    it('should calculate pension contributions correctly', () => {
      const result = calculateSalary({
        ...defaultInputs,
        pensionContribution: 5, // 5%
      });
      
      const expectedPension = 30000 * 0.05; // £1,500
      expect(result.pension.employee.annual).toBe(expectedPension);
      expect(result.pension.employer.annual).toBe(expectedPension); // Assuming matching
    });

    it('should handle salary exchange correctly', () => {
      const result = calculateSalary({
        ...defaultInputs,
        grossAnnualSalary: 30000,
        pensionContribution: 5,
        salaryExchange: true,
      });
      
      // With salary exchange, pension comes off before NI calculation
      const pensionAmount = 30000 * 0.05; // £1,500
      const salaryAfterPension = 30000 - pensionAmount; // £28,500
      const expectedNI = (salaryAfterPension - 12570) * 0.12; // 12% of £15,930
      
      expect(result.nationalInsurance.employee.annual).toBeCloseTo(expectedNI, 1);
    });
  });
});

describe('Utility functions', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('£1,235');
      expect(formatCurrency(0)).toBe('£0');
      expect(formatCurrency(1000000)).toBe('£1,000,000');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages correctly', () => {
      expect(formatPercentage(0.12)).toBe('12.0%');
      expect(formatPercentage(0.025)).toBe('2.5%');
      expect(formatPercentage(0.4)).toBe('40.0%');
    });
  });
});