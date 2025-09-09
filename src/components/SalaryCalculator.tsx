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

      {/* Results Table */}
      {showResults && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-foreground">Your calculation</h3>
            <button
              onClick={toggleExpanded}
              className="flex items-center gap-2 text-primary hover:text-primary-hover text-sm font-medium"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {isExpanded ? 'Show less' : 'Show breakdown'}
            </button>
          </div>

          <div className="border border-muted rounded-lg overflow-hidden">
            <table className="w-full">
              <caption className="sr-only">
                Salary breakdown showing gross pay, deductions and take-home amounts
              </caption>
              <thead>
                <tr className="bg-muted border-b border-muted">
                  <th className="text-left px-4 py-3 text-sm font-semibold text-muted-foreground">Item</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-muted-foreground">Annual</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-muted-foreground">Monthly</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-muted-foreground">Weekly</th>
                </tr>
              </thead>
              <tbody>
                {/* Gross Salary - only show when expanded */}
                {isExpanded && (
                  <tr className="border-b border-muted/50 hover:bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-foreground">Gross yearly salary</th>
                    <td className="text-right px-4 py-3 font-medium text-primary">
                      {formatCurrency(result.gross.annual)}
                    </td>
                    <td className="text-right px-4 py-3 font-medium text-primary">
                      {formatCurrency(result.gross.monthly)}
                    </td>
                    <td className="text-right px-4 py-3 font-medium text-primary">
                      {formatCurrency(result.gross.weekly)}
                    </td>
                  </tr>
                )}
                
                {/* Deductions - only show when expanded */}
                {isExpanded && (
                  <>
                    <tr className="border-b border-muted/50 hover:bg-muted/30">
                      <th className="text-left px-4 py-3 text-foreground">Income tax</th>
                      <td className="text-right px-4 py-3 text-destructive">
                        -{formatCurrency(result.incomeTax.annual)}
                      </td>
                      <td className="text-right px-4 py-3 text-destructive">
                        -{formatCurrency(result.incomeTax.monthly)}
                      </td>
                      <td className="text-right px-4 py-3 text-destructive">
                        -{formatCurrency(result.incomeTax.annual / 52)}
                      </td>
                    </tr>

                    <tr className="border-b border-muted/50 hover:bg-muted/30">
                      <th className="text-left px-4 py-3 text-foreground">National Insurance</th>
                      <td className="text-right px-4 py-3 text-destructive">
                        -{formatCurrency(result.nationalInsurance.employee.annual)}
                      </td>
                      <td className="text-right px-4 py-3 text-destructive">
                        -{formatCurrency(result.nationalInsurance.employee.monthly)}
                      </td>
                      <td className="text-right px-4 py-3 text-destructive">
                        -{formatCurrency(result.nationalInsurance.employee.annual / 52)}
                      </td>
                    </tr>

                    {result.studentLoan.annual > 0 && (
                      <tr className="border-b border-muted/50 hover:bg-muted/30">
                        <th className="text-left px-4 py-3 text-foreground">Student loan</th>
                        <td className="text-right px-4 py-3 text-destructive">
                          -{formatCurrency(result.studentLoan.annual)}
                        </td>
                        <td className="text-right px-4 py-3 text-destructive">
                          -{formatCurrency(result.studentLoan.monthly)}
                        </td>
                        <td className="text-right px-4 py-3 text-destructive">
                          -{formatCurrency(result.studentLoan.annual / 52)}
                        </td>
                      </tr>
                    )}

                    {result.pension.employee.annual > 0 && (
                      <tr className="border-b border-muted/50 hover:bg-muted/30">
                        <th className="text-left px-4 py-3 text-foreground">Pension</th>
                        <td className="text-right px-4 py-3 text-destructive">
                          -{formatCurrency(result.pension.employee.annual)}
                        </td>
                        <td className="text-right px-4 py-3 text-destructive">
                          -{formatCurrency(result.pension.employee.monthly)}
                        </td>
                        <td className="text-right px-4 py-3 text-destructive">
                          -{formatCurrency(result.pension.employee.annual / 52)}
                        </td>
                      </tr>
                    )}

                    {/* Total Deductions - only show when expanded */}
                    <tr className="border-b border-muted bg-muted/50">
                      <th className="text-left px-4 py-3 font-semibold text-foreground">Total deductions</th>
                      <td className="text-right px-4 py-3 font-semibold text-destructive">
                        -{formatCurrency(result.gross.annual - result.net.annual)}
                      </td>
                      <td className="text-right px-4 py-3 font-semibold text-destructive">
                        -{formatCurrency((result.gross.annual - result.net.annual) / 12)}
                      </td>
                      <td className="text-right px-4 py-3 font-semibold text-destructive">
                        -{formatCurrency((result.gross.annual - result.net.annual) / 52)}
                      </td>
                    </tr>
                  </>
                )}

                {/* Take-home Pay - always visible */}
                <tr className="bg-success/10">
                  <th className="text-left px-4 py-4 font-bold text-lg text-foreground">Your take-home pay</th>
                  <td className="text-right px-4 py-4 font-bold text-lg text-success">
                    {formatCurrency(result.net.annual)}
                  </td>
                  <td className="text-right px-4 py-4 font-bold text-lg text-success">
                    {formatCurrency(result.net.monthly)}
                  </td>
                  <td className="text-right px-4 py-4 font-bold text-lg text-success">
                    {formatCurrency(result.net.weekly)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}