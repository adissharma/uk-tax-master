import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CalculationInputs, CalculationResult } from '@/lib/calculator/types';
import { calculateSalary } from '@/lib/calculator/engine';

interface CalculatorState {
  inputs: CalculationInputs;
  result: CalculationResult | null;
  activeTab: string;
  isCalculating: boolean;
  
  // Actions
  updateInputs: (inputs: Partial<CalculationInputs>) => void;
  setActiveTab: (tab: string) => void;
  calculate: () => void;
}

const defaultInputs: CalculationInputs = {
  grossAnnualSalary: 0,
  taxYear: '2024-25',
  region: 'england',
  studentLoanPlan: 'none',
  hasPostgradLoan: false,
  pensionContribution: 5,
  salaryExchange: false,
};

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      inputs: defaultInputs,
      result: null,
      activeTab: 'summary',
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
      partialize: (state) => ({ inputs: state.inputs, activeTab: state.activeTab }),
    }
  )
);

// Don't initialize calculation on store creation - wait for user input