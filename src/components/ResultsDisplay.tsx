import { useCalculatorStore } from '@/store/calculatorStore';
import { formatCurrency } from '@/lib/calculator/engine';
import { GOVUKButton } from './GOVUKButton';
import { Copy } from 'lucide-react';

export function ResultsDisplay() {
  const { result, isCalculating, inputs } = useCalculatorStore();

  // Don't show anything if no salary entered or while calculating
  if (inputs.grossAnnualSalary === 0 || isCalculating || !result) {
    return null;
  }

  const copyResults = async () => {
    const text = `
Salary Calculation Results:
Gross yearly salary: ${formatCurrency(result.gross.annual)}
Take-home pay: ${formatCurrency(result.net.annual)} per year
Monthly: ${formatCurrency(result.net.monthly)}
Weekly: ${formatCurrency(result.net.weekly)}

Deductions:
Income tax: ${formatCurrency(result.incomeTax.annual)}
National Insurance: ${formatCurrency(result.nationalInsurance.employee.annual)}
Student loan: ${formatCurrency(result.studentLoan.annual)}
Pension: ${formatCurrency(result.pension.employee.annual)}
    `.trim();

    try {
      await navigator.clipboard.writeText(text);
      console.log('Results copied to clipboard');
    } catch (err) {
      console.error('Failed to copy results:', err);
    }
  };

  return (
    <div className="bg-govuk-white border-2 border-govuk-mid-grey mb-8">
      {/* Header */}
      <div className="bg-govuk-mid-grey px-6 py-3 flex justify-between items-center">
        <h2 className="text-xl font-bold text-govuk-black m-0">Your salary calculation</h2>
        <GOVUKButton
          variant="secondary"
          size="sm"
          onClick={copyResults}
          className="flex items-center gap-2"
        >
          <Copy size={16} />
          Copy results
        </GOVUKButton>
      </div>

      <div className="p-6 space-y-6">
        {/* Gross Salary */}
        <div className="border-b border-govuk-mid-grey pb-4">
          <h3 className="text-lg font-bold text-govuk-black mb-2">Gross yearly salary</h3>
          <div className="text-3xl font-bold text-govuk-blue">
            {formatCurrency(result.gross.annual)}
          </div>
        </div>

        {/* Take-home Pay */}
        <div className="border-b border-govuk-mid-grey pb-4">
          <h3 className="text-lg font-bold text-govuk-black mb-4">Your take-home pay</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-govuk-light-green border-l-4 border-govuk-green p-4">
              <div className="text-2xl font-bold text-govuk-black mb-1">
                {formatCurrency(result.net.annual)}
              </div>
              <div className="text-govuk-dark-grey">Per year</div>
            </div>
            <div className="bg-govuk-light-blue border-l-4 border-govuk-blue p-4">
              <div className="text-2xl font-bold text-govuk-black mb-1">
                {formatCurrency(result.net.monthly)}
              </div>
              <div className="text-govuk-dark-grey">Per month</div>
            </div>
            <div className="bg-govuk-light-grey border-l-4 border-govuk-dark-grey p-4">
              <div className="text-2xl font-bold text-govuk-black mb-1">
                {formatCurrency(result.net.weekly)}
              </div>
              <div className="text-govuk-dark-grey">Per week</div>
            </div>
          </div>
        </div>

        {/* Deductions Breakdown */}
        <div>
          <h3 className="text-lg font-bold text-govuk-black mb-4">Deductions breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Income Tax */}
            <div className="bg-govuk-light-red border-l-4 border-govuk-red p-4">
              <h4 className="font-bold text-govuk-black mb-2">Income tax</h4>
              <div className="space-y-1">
                <div className="text-lg font-bold text-govuk-black">
                  {formatCurrency(result.incomeTax.annual)}
                </div>
                <div className="text-sm text-govuk-dark-grey">
                  {formatCurrency(result.incomeTax.monthly)} per month
                </div>
                <div className="text-sm text-govuk-dark-grey">
                  {formatCurrency(result.incomeTax.annual / 52)} per week
                </div>
              </div>
            </div>

            {/* National Insurance */}
            <div className="bg-govuk-light-blue border-l-4 border-govuk-blue p-4">
              <h4 className="font-bold text-govuk-black mb-2">National Insurance</h4>
              <div className="space-y-1">
                <div className="text-lg font-bold text-govuk-black">
                  {formatCurrency(result.nationalInsurance.employee.annual)}
                </div>
                <div className="text-sm text-govuk-dark-grey">
                  {formatCurrency(result.nationalInsurance.employee.monthly)} per month
                </div>
                <div className="text-sm text-govuk-dark-grey">
                  {formatCurrency(result.nationalInsurance.employee.annual / 52)} per week
                </div>
              </div>
            </div>

            {/* Student Loan (if applicable) */}
            {result.studentLoan.annual > 0 && (
              <div className="bg-govuk-light-yellow border-l-4 border-govuk-yellow p-4">
                <h4 className="font-bold text-govuk-black mb-2">Student loan</h4>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-govuk-black">
                    {formatCurrency(result.studentLoan.annual)}
                  </div>
                  <div className="text-sm text-govuk-dark-grey">
                    {formatCurrency(result.studentLoan.monthly)} per month
                  </div>
                  <div className="text-sm text-govuk-dark-grey">
                    {formatCurrency(result.studentLoan.annual / 52)} per week
                  </div>
                </div>
              </div>
            )}

            {/* Pension (if applicable) */}
            {result.pension.employee.annual > 0 && (
              <div className="bg-govuk-light-purple border-l-4 border-govuk-purple p-4">
                <h4 className="font-bold text-govuk-black mb-2">Pension</h4>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-govuk-black">
                    {formatCurrency(result.pension.employee.annual)}
                  </div>
                  <div className="text-sm text-govuk-dark-grey">
                    {formatCurrency(result.pension.employee.monthly)} per month
                  </div>
                  <div className="text-sm text-govuk-dark-grey">
                    {formatCurrency(result.pension.employee.annual / 52)} per week
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Total Deductions Card */}
          <div className="mt-6 bg-govuk-light-grey border-2 border-govuk-mid-grey p-6">
            <h4 className="text-xl font-bold text-govuk-black mb-4">Total deductions</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold text-govuk-black">
                  {formatCurrency(result.gross.annual - result.net.annual)}
                </div>
                <div className="text-govuk-dark-grey">Per year</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-govuk-black">
                  {formatCurrency((result.gross.annual - result.net.annual) / 12)}
                </div>
                <div className="text-govuk-dark-grey">Per month</div>
              </div>  
              <div>
                <div className="text-2xl font-bold text-govuk-black">
                  {formatCurrency((result.gross.annual - result.net.annual) / 52)}
                </div>
                <div className="text-govuk-dark-grey">Per week</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}