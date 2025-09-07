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
  grossAnnualSalary: 30000,
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
        set({ inputs, isCalculating: true });
        
        // Debounced calculation
        setTimeout(() => {
          const result = calculateSalary(inputs);
          set({ result, isCalculating: false });
        }, 150);
      },
      
      setActiveTab: (tab) => {
        set({ activeTab: tab });
        // Update URL hash
        if (typeof window !== 'undefined') {
          window.location.hash = tab;
        }
      },
      
      calculate: () => {
        const { inputs } = get();
        set({ isCalculating: true });
        
        try {
          const result = calculateSalary(inputs);
          set({ result, isCalculating: false });
        } catch (error) {
          console.error('Calculation error:', error);
          set({ isCalculating: false });
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

// Initialize calculation on store creation
useCalculatorStore.getState().calculate();