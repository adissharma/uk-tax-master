import { useState, useEffect } from 'react';
import { MaterialInput } from './MaterialInput';
import { MaterialButton } from './MaterialButton';
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
    <div className="bg-govuk-white border border-govuk-mid-grey mb-8">
      {/* Salary Input Section */}
      <div className="bg-govuk-light-blue border-b border-govuk-mid-grey p-6">
        <MaterialInput
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

      {/* Results Section */}
      {showResults && (
        <div className="p-6">
          {/* Header with Expand/Collapse Button */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-govuk-mid-grey">
            <h2 className="text-xl font-bold text-govuk-black m-0">Your salary calculation</h2>
            <MaterialButton
              variant="tonal"
              size="sm"
              onClick={toggleExpanded}
              className="flex items-center gap-2"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {isExpanded ? 'Show less' : 'Show breakdown'}
            </MaterialButton>
          </div>

          {/* Results Table */}
          <table className="govuk-table w-full">
            <caption className="govuk-table__caption govuk-table__caption--m sr-only">
              Salary breakdown showing gross pay, deductions and take-home amounts
            </caption>
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th scope="col" className="govuk-table__header text-left">Item</th>
                <th scope="col" className="govuk-table__header text-right">Annual</th>
                <th scope="col" className="govuk-table__header text-right">Monthly</th>
                <th scope="col" className="govuk-table__header text-right">Weekly</th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              {/* Gross Salary - only show when expanded */}
              {isExpanded && (
                <tr className="govuk-table__row">
                  <th scope="row" className="govuk-table__header font-bold">Gross yearly salary</th>
                  <td className="govuk-table__cell text-right font-bold text-govuk-blue">
                    {formatCurrency(result.gross.annual)}
                  </td>
                  <td className="govuk-table__cell text-right font-bold text-govuk-blue">
                    {formatCurrency(result.gross.monthly)}
                  </td>
                  <td className="govuk-table__cell text-right font-bold text-govuk-blue">
                    {formatCurrency(result.gross.weekly)}
                  </td>
                </tr>
              )}
              
              {/* Deductions - only show when expanded */}
              {isExpanded && (
                <>
                  <tr className="govuk-table__row">
                    <th scope="row" className="govuk-table__header">Income tax</th>
                    <td className="govuk-table__cell text-right text-govuk-red">
                      -{formatCurrency(result.incomeTax.annual)}
                    </td>
                    <td className="govuk-table__cell text-right text-govuk-red">
                      -{formatCurrency(result.incomeTax.monthly)}
                    </td>
                    <td className="govuk-table__cell text-right text-govuk-red">
                      -{formatCurrency(result.incomeTax.annual / 52)}
                    </td>
                  </tr>

                  <tr className="govuk-table__row">
                    <th scope="row" className="govuk-table__header">National Insurance</th>
                    <td className="govuk-table__cell text-right text-govuk-red">
                      -{formatCurrency(result.nationalInsurance.employee.annual)}
                    </td>
                    <td className="govuk-table__cell text-right text-govuk-red">
                      -{formatCurrency(result.nationalInsurance.employee.monthly)}
                    </td>
                    <td className="govuk-table__cell text-right text-govuk-red">
                      -{formatCurrency(result.nationalInsurance.employee.annual / 52)}
                    </td>
                  </tr>

                  {result.studentLoan.annual > 0 && (
                    <tr className="govuk-table__row">
                      <th scope="row" className="govuk-table__header">Student loan</th>
                      <td className="govuk-table__cell text-right text-govuk-red">
                        -{formatCurrency(result.studentLoan.annual)}
                      </td>
                      <td className="govuk-table__cell text-right text-govuk-red">
                        -{formatCurrency(result.studentLoan.monthly)}
                      </td>
                      <td className="govuk-table__cell text-right text-govuk-red">
                        -{formatCurrency(result.studentLoan.annual / 52)}
                      </td>
                    </tr>
                  )}

                  {result.pension.employee.annual > 0 && (
                    <tr className="govuk-table__row">
                      <th scope="row" className="govuk-table__header">Pension</th>
                      <td className="govuk-table__cell text-right text-govuk-red">
                        -{formatCurrency(result.pension.employee.annual)}
                      </td>
                      <td className="govuk-table__cell text-right text-govuk-red">
                        -{formatCurrency(result.pension.employee.monthly)}
                      </td>
                      <td className="govuk-table__cell text-right text-govuk-red">
                        -{formatCurrency(result.pension.employee.annual / 52)}
                      </td>
                    </tr>
                  )}

                  {/* Total Deductions - only show when expanded */}
                  <tr className="govuk-table__row govuk-table__row--thick-border">
                    <th scope="row" className="govuk-table__header font-bold">Total deductions</th>
                    <td className="govuk-table__cell text-right font-bold text-govuk-red">
                      -{formatCurrency(result.gross.annual - result.net.annual)}
                    </td>
                    <td className="govuk-table__cell text-right font-bold text-govuk-red">
                      -{formatCurrency((result.gross.annual - result.net.annual) / 12)}
                    </td>
                    <td className="govuk-table__cell text-right font-bold text-govuk-red">
                      -{formatCurrency((result.gross.annual - result.net.annual) / 52)}
                    </td>
                  </tr>
                </>
              )}

              {/* Take-home Pay - always visible */}
              <tr className={`govuk-table__row ${isExpanded ? 'govuk-table__row--thick-border' : ''} bg-govuk-light-green`}>
                <th scope="row" className="govuk-table__header font-bold text-lg">Your take-home pay</th>
                <td className="govuk-table__cell text-right font-bold text-lg text-govuk-green">
                  {formatCurrency(result.net.annual)}
                </td>
                <td className="govuk-table__cell text-right font-bold text-lg text-govuk-green">
                  {formatCurrency(result.net.monthly)}
                </td>
                <td className="govuk-table__cell text-right font-bold text-lg text-govuk-green">
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