import { useState, useEffect } from 'react';
import { GOVUKInput } from './GOVUKInput';
import { GOVUKButton } from './GOVUKButton';
import { useCalculatorStore } from '@/store/calculatorStore';

export function SalaryInput() {
  const { inputs, updateInputs } = useCalculatorStore();
  const [displayValue, setDisplayValue] = useState(inputs.grossAnnualSalary.toString());
  const [error, setError] = useState('');

  useEffect(() => {
    setDisplayValue(inputs.grossAnnualSalary.toString());
  }, [inputs.grossAnnualSalary]);

  const validateAndUpdate = (value: string) => {
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

  const formatDisplayValue = (value: string) => {
    const numValue = parseFloat(value.replace(/[£,]/g, ''));
    if (isNaN(numValue)) return value;
    
    return new Intl.NumberFormat('en-GB').format(numValue);
  };

  return (
    <div className="bg-govuk-light-blue border-b-4 border-govuk-blue p-6 mb-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="flex-1">
            <GOVUKInput
              label="Gross yearly salary"
              hint="Enter your salary before tax and other deductions"
              prefix="£"
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
          
          <div className="flex gap-3">
            <GOVUKButton 
              variant="link" 
              size="sm"
              onClick={() => {
                // Toggle advanced options - placeholder for now
                console.log('Advanced options clicked');
              }}
            >
              Advanced options
            </GOVUKButton>
            
            <GOVUKButton 
              variant="link" 
              size="sm"
              onClick={() => {
                // Scroll to methodology - placeholder for now
                console.log('How we calculate clicked');
              }}
            >
              How we calculate
            </GOVUKButton>
          </div>
        </div>
      </div>
    </div>
  );
}