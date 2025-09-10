import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PinterestInput } from './PinterestInput';
import { PinterestButton } from './PinterestButton';
import { PinterestCard } from './PinterestCard';
import { useCalculatorStore } from '@/store/calculatorStore';
import { formatCurrency } from '@/lib/calculator/engine';

export function SalaryCalculator() {
  const navigate = useNavigate();
  const { inputs, updateInputs, result, isCalculating, calculate } = useCalculatorStore();
  const [displayValue, setDisplayValue] = useState(inputs.grossAnnualSalary === 0 ? '' : inputs.grossAnnualSalary.toString());
  const [error, setError] = useState('');

  useEffect(() => {
    setDisplayValue(inputs.grossAnnualSalary === 0 ? '' : inputs.grossAnnualSalary.toString());
  }, [inputs.grossAnnualSalary]);

  const validateAndUpdate = (value: string) => {
    // Handle empty input
    if (!value.trim()) {
      updateInputs({ grossAnnualSalary: 0 });
      return;
    }
    
    const numValue = parseFloat(value.replace(/[£,]/g, ''));
    
    if (isNaN(numValue)) {
      setError('Please enter a valid salary amount');
      return;
    }
    
    if (numValue < 0) {
      setError('Salary must be £0 or more');
      return;
    }
    
    if (numValue > 10000000) {
      setError('Salary must be £10,000,000 or less');
      return;
    }
    
    setError('');
    updateInputs({ grossAnnualSalary: numValue });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDisplayValue(value);
    
    // Clear error immediately when user starts typing
    if (error) setError('');
  };

  const handleBlur = () => {
    validateAndUpdate(displayValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      validateAndUpdate(displayValue);
      // Let the wizard handle navigation
    }
  };

  const handleSubmit = () => {
    // In wizard mode, just move to next step
    if (inputs.grossAnnualSalary > 0 && !error) {
      // This will be handled by the wizard's handleNext
    }
  };

  const canSubmit = inputs.grossAnnualSalary > 0 && !error;

  return (
    <div className="space-y-6">
      {/* Salary Input */}
      <PinterestInput
        label="Annual gross salary"
        hint="Enter your yearly salary before tax and deductions"
        placeholder="£45,000"
        value={displayValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        error={error}
        className="text-2xl py-4 font-semibold text-center"
        inputMode="numeric"
        autoComplete="off"
      />

      {/* Submit Button - Hidden in wizard mode */}
      <div className="flex justify-center pt-4">
        <PinterestButton
          onClick={handleSubmit}
          disabled={!canSubmit}
          size="lg"
          className="min-w-[280px] hidden"
        >
          Calculate pay
        </PinterestButton>
      </div>
    </div>
  );
}