import { useCalculatorStore } from '@/store/calculatorStore';
import { formatCurrency } from '@/lib/calculator/engine';
import { GOVUKButton } from './GOVUKButton';
import { Copy } from 'lucide-react';

export function ResultsDisplay() {
  const { result, isCalculating } = useCalculatorStore();

  if (isCalculating || !result) {
    return (
      <div className="bg-govuk-light-grey border-2 border-govuk-mid-grey p-8 mb-8">
        <div className="animate-pulse">
          <div className="h-8 bg-govuk-mid-grey rounded w-1/2 mb-4"></div>
          <div className="h-12 bg-govuk-mid-grey rounded w-3/4 mb-6"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-govuk-mid-grey rounded"></div>
            <div className="h-20 bg-govuk-mid-grey rounded"></div>
            <div className="h-20 bg-govuk-mid-grey rounded"></div>
          </div>
        </div>
      </div>
    );
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
          <div className="border-2 border-govuk-mid-grey">
            <table className="w-full">
              <thead>
                <tr className="bg-govuk-light-grey border-b border-govuk-mid-grey">
                  <th scope="col" className="px-4 py-2 text-left font-bold">Deduction</th>
                  <th scope="col" className="px-4 py-2 text-right font-bold">Annual</th>
                  <th scope="col" className="px-4 py-2 text-right font-bold">Monthly</th>
                  <th scope="col" className="px-4 py-2 text-right font-bold">Weekly</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-govuk-mid-grey">
                  <th scope="row" className="px-4 py-3 text-left font-medium">Income tax</th>
                  <td className="px-4 py-3 text-right">{formatCurrency(result.incomeTax.annual)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(result.incomeTax.monthly)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(result.incomeTax.annual / 52)}</td>
                </tr>
                <tr className="border-b border-govuk-mid-grey">
                  <th scope="row" className="px-4 py-3 text-left font-medium">National Insurance</th>
                  <td className="px-4 py-3 text-right">{formatCurrency(result.nationalInsurance.employee.annual)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(result.nationalInsurance.employee.monthly)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(result.nationalInsurance.employee.annual / 52)}</td>
                </tr>
                {result.studentLoan.annual > 0 && (
                  <tr className="border-b border-govuk-mid-grey">
                    <th scope="row" className="px-4 py-3 text-left font-medium">Student loan repayment</th>
                    <td className="px-4 py-3 text-right">{formatCurrency(result.studentLoan.annual)}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(result.studentLoan.monthly)}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(result.studentLoan.annual / 52)}</td>
                  </tr>
                )}
                {result.pension.employee.annual > 0 && (
                  <tr className="border-b border-govuk-mid-grey">
                    <th scope="row" className="px-4 py-3 text-left font-medium">Pension contribution</th>
                    <td className="px-4 py-3 text-right">{formatCurrency(result.pension.employee.annual)}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(result.pension.employee.monthly)}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(result.pension.employee.annual / 52)}</td>
                  </tr>
                )}
                <tr className="bg-govuk-light-grey font-bold">
                  <th scope="row" className="px-4 py-4 text-left">Total deductions</th>
                  <td className="px-4 py-4 text-right">
                    {formatCurrency(result.gross.annual - result.net.annual)}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {formatCurrency((result.gross.annual - result.net.annual) / 12)}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {formatCurrency((result.gross.annual - result.net.annual) / 52)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}