import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GOVUKInput } from './GOVUKInput';
import { GOVUKButton } from './GOVUKButton';
import { useCalculatorStore } from '@/store/calculatorStore';
import { formatCurrency } from '@/lib/calculator/engine';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function SalaryCalculator() {
  const navigate = useNavigate();
  const { inputs, updateInputs, result, isCalculating, calculate } = useCalculatorStore();
  const [displayValue, setDisplayValue] = useState(inputs.grossAnnualSalary === 0 ? '' : inputs.grossAnnualSalary.toString());
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setDisplayValue(inputs.grossAnnualSalary === 0 ? '' : inputs.grossAnnualSalary.toString());
  }, [inputs.grossAnnualSalary]);

  const validateAndUpdate = (value: string, shouldCalculate = false) => {
    // Handle empty input
    if (!value.trim()) {
      updateInputs({ grossAnnualSalary: 0 });
      return;
    }
    
    const numValue = parseFloat(value.replace(/[£,]/g, ''));
    
    if (isNaN(numValue)) {
      setError('Enter a valid salary amount');
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
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubmit = () => {
    if (inputs.grossAnnualSalary > 0 && !error) {
      calculate();
      navigate('/results');
    }
  };

  const canSubmit = inputs.grossAnnualSalary > 0 && !error;

  return (
    <div className="space-y-6">
      {/* Salary Input */}
      <div>
        <GOVUKInput
          label="Gross yearly salary"
          hint="Enter your salary before tax and other deductions"
          placeholder="£45,000"
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          error={error}
          className="text-2xl py-3 font-bold"
          inputMode="numeric"
          autoComplete="off"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <GOVUKButton
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full sm:w-auto text-lg px-8 py-3"
        >
          Calculate my take-home pay
        </GOVUKButton>
      </div>
    </div>
  );
}