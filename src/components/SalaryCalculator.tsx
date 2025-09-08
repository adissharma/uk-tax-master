import { useState, useEffect } from 'react';
import { GOVUKInput } from './GOVUKInput';
import { GOVUKButton } from './GOVUKButton';
import { useCalculatorStore } from '@/store/calculatorStore';
import { formatCurrency } from '@/lib/calculator/engine';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function SalaryCalculator() {
  const { inputs, updateInputs, result, isCalculating } = useCalculatorStore();
  const [displayValue, setDisplayValue] = useState(inputs.grossAnnualSalary === 0 ? '' : inputs.grossAnnualSalary.toString());
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

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

  const showResults = inputs.grossAnnualSalary > 0 && !isCalculating && result;

  return (
    <div className="space-y-8">
      {/* Hero Salary Input Section */}
      <div className="py-12">
        <GOVUKInput
          label="Gross yearly salary"
          hint="Enter your salary before tax and other deductions"
          placeholder="£45,000"
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          error={error}
          className="text-3xl py-4 font-bold max-w-md"
          inputMode="numeric"
          autoComplete="off"
        />
      </div>

      {/* Results Section */}
      {showResults && (
        <div className="py-8">
          {/* Header with Expand/Collapse Button */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-govuk-black">Your salary calculation</h2>
            <button
              onClick={toggleExpanded}
              className="flex items-center gap-2 text-govuk-blue hover:text-govuk-dark-blue text-sm"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {isExpanded ? 'Show less' : 'Show breakdown'}
            </button>
          </div>

          {/* Results Table */}
          <table className="w-full">
            <caption className="sr-only">
              Salary breakdown showing gross pay, deductions and take-home amounts
            </caption>
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-govuk-dark-grey">Item</th>
                <th className="text-right py-3 text-sm font-medium text-govuk-dark-grey">Annual</th>
                <th className="text-right py-3 text-sm font-medium text-govuk-dark-grey">Monthly</th>
                <th className="text-right py-3 text-sm font-medium text-govuk-dark-grey">Weekly</th>
              </tr>
            </thead>
            <tbody>
              {/* Gross Salary - only show when expanded */}
              {isExpanded && (
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 font-medium">Gross yearly salary</th>
                  <td className="text-right py-3 font-medium text-govuk-blue">
                    {formatCurrency(result.gross.annual)}
                  </td>
                  <td className="text-right py-3 font-medium text-govuk-blue">
                    {formatCurrency(result.gross.monthly)}
                  </td>
                  <td className="text-right py-3 font-medium text-govuk-blue">
                    {formatCurrency(result.gross.weekly)}
                  </td>
                </tr>
              )}
              
              {/* Deductions - only show when expanded */}
              {isExpanded && (
                <>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3">Income tax</th>
                    <td className="text-right py-3 text-govuk-red">
                      -{formatCurrency(result.incomeTax.annual)}
                    </td>
                    <td className="text-right py-3 text-govuk-red">
                      -{formatCurrency(result.incomeTax.monthly)}
                    </td>
                    <td className="text-right py-3 text-govuk-red">
                      -{formatCurrency(result.incomeTax.annual / 52)}
                    </td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3">National Insurance</th>
                    <td className="text-right py-3 text-govuk-red">
                      -{formatCurrency(result.nationalInsurance.employee.annual)}
                    </td>
                    <td className="text-right py-3 text-govuk-red">
                      -{formatCurrency(result.nationalInsurance.employee.monthly)}
                    </td>
                    <td className="text-right py-3 text-govuk-red">
                      -{formatCurrency(result.nationalInsurance.employee.annual / 52)}
                    </td>
                  </tr>

                  {result.studentLoan.annual > 0 && (
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3">Student loan</th>
                      <td className="text-right py-3 text-govuk-red">
                        -{formatCurrency(result.studentLoan.annual)}
                      </td>
                      <td className="text-right py-3 text-govuk-red">
                        -{formatCurrency(result.studentLoan.monthly)}
                      </td>
                      <td className="text-right py-3 text-govuk-red">
                        -{formatCurrency(result.studentLoan.annual / 52)}
                      </td>
                    </tr>
                  )}

                  {result.pension.employee.annual > 0 && (
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3">Pension</th>
                      <td className="text-right py-3 text-govuk-red">
                        -{formatCurrency(result.pension.employee.annual)}
                      </td>
                      <td className="text-right py-3 text-govuk-red">
                        -{formatCurrency(result.pension.employee.monthly)}
                      </td>
                      <td className="text-right py-3 text-govuk-red">
                        -{formatCurrency(result.pension.employee.annual / 52)}
                      </td>
                    </tr>
                  )}

                  {/* Total Deductions - only show when expanded */}
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 font-medium">Total deductions</th>
                    <td className="text-right py-3 font-medium text-govuk-red">
                      -{formatCurrency(result.gross.annual - result.net.annual)}
                    </td>
                    <td className="text-right py-3 font-medium text-govuk-red">
                      -{formatCurrency((result.gross.annual - result.net.annual) / 12)}
                    </td>
                    <td className="text-right py-3 font-medium text-govuk-red">
                      -{formatCurrency((result.gross.annual - result.net.annual) / 52)}
                    </td>
                  </tr>
                </>
              )}

              {/* Take-home Pay - always visible */}
              <tr className={`${isExpanded ? 'border-t-2 border-gray-300' : ''} bg-green-50`}>
                <th className="text-left py-4 font-bold text-lg">Your take-home pay</th>
                <td className="text-right py-4 font-bold text-lg text-govuk-green">
                  {formatCurrency(result.net.annual)}
                </td>
                <td className="text-right py-4 font-bold text-lg text-govuk-green">
                  {formatCurrency(result.net.monthly)}
                </td>
                <td className="text-right py-4 font-bold text-lg text-govuk-green">
                  {formatCurrency(result.net.weekly)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}