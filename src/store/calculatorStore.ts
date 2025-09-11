import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CalculationInputs, CalculationResult } from '@/lib/calculator/types';
import { calculateSalary } from '@/lib/calculator/engine';

interface CalculatorState {
  inputs: CalculationInputs;
  result: CalculationResult | null;
  activeTab: string;
  currentStep: number;
  isCalculating: boolean;
  
  // Actions
  updateInputs: (inputs: Partial<CalculationInputs>) => void;
  setActiveTab: (tab: string) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  calculate: () => void;
}

const defaultInputs: CalculationInputs = {
  grossAnnualSalary: 0,
  taxYear: '2024-25',
  region: 'england',
  taxCode: '1257L',
  studentLoanPlan: 'none',
  hasPostgradLoan: false,
  pensionContribution: 0, // Don't default to 5% - let user choose
  salaryExchange: false,
  bonusAmount: 0,
  normalPayPeriod: 'monthly',
  includeBonusInPension: false,
  // Overtime defaults
  normalWorkingWeek: 37.5,
  weeksPerYear: 52,
  overtime1Hours: 0,
  overtime1Multiplier: 1.5,
  overtime2Hours: 0,
  overtime2Multiplier: 2.0,
  overtimeCashValue: 0,
  overtimeCashPeriod: 'annual',
  includeOvertimeInPension: false,
};

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      inputs: defaultInputs,
      result: null,
      activeTab: 'tax-code',
      currentStep: 1,
      isCalculating: false,
      
      updateInputs: (newInputs) => {
        const inputs = { ...get().inputs, ...newInputs };
        set({ inputs });
        
        // Don't auto-calculate anymore - only update inputs
        if (inputs.grossAnnualSalary === 0) {
          set({ result: null, isCalculating: false });
        }
      },
      
      setActiveTab: (tab) => {
        set({ activeTab: tab });
        // Only update URL hash if it's different from current hash to prevent loops
        if (typeof window !== 'undefined' && window.location.hash.slice(1) !== tab) {
          window.location.hash = tab;
        }
      },
      
      setCurrentStep: (step) => {
        set({ currentStep: step });
      },
      
      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 3) {
          set({ currentStep: currentStep + 1 });
        }
      },
      
      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },
      
      calculate: () => {
        const { inputs } = get();
        
        // Only calculate if there's a valid salary
        if (inputs.grossAnnualSalary > 0) {
          set({ isCalculating: true });
          
          try {
            const result = calculateSalary(inputs);
            set({ result, isCalculating: false });
          } catch (error) {
            console.error('Calculation error:', error);
            set({ isCalculating: false });
          }
        } else {
          set({ result: null, isCalculating: false });
        }
      },
    }),
    {
      name: 'salary-calculator-storage',
      version: 1,
      partialize: (state) => ({ inputs: state.inputs, activeTab: state.activeTab, currentStep: state.currentStep }),
    }
  )
);

// Don't initialize calculation on store creation - wait for user input