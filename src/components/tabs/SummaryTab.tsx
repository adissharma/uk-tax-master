import { useCalculatorStore } from '@/store/calculatorStore';
import { formatCurrency } from '@/lib/calculator/engine';
import { GOVUKButton } from '../GOVUKButton';
import { SalaryBreakdownChart } from '../SalaryBreakdownChart';
import { Copy } from 'lucide-react';

export function SummaryTab() {
  const { result, isCalculating } = useCalculatorStore();

  if (isCalculating || !result) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-govuk-light-grey rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-6 bg-govuk-light-grey rounded"></div>
            <div className="h-6 bg-govuk-light-grey rounded w-5/6"></div>
            <div className="h-6 bg-govuk-light-grey rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const copyResults = async () => {
    const text = `
Take-home pay breakdown:
Gross salary: ${formatCurrency(result.gross.annual)}
Net salary: ${formatCurrency(result.net.annual)}
Income tax: ${formatCurrency(result.incomeTax.annual)}
National Insurance: ${formatCurrency(result.nationalInsurance.employee.annual)}
Student loan: ${formatCurrency(result.studentLoan.annual)}
Pension: ${formatCurrency(result.pension.employee.annual)}
    `.trim();

    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log('Results copied to clipboard');
    } catch (err) {
      console.error('Failed to copy results:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h2 className="govuk-heading-l">Take-home pay summary</h2>
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

      {/* Main Summary */}
      <div className="bg-govuk-light-green border-l-4 border-govuk-green p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-2xl font-bold text-govuk-black mb-2">
              {formatCurrency(result.net.annual)}
            </h3>
            <p className="text-govuk-dark-grey">Your net annual salary</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-govuk-black mb-2">
              {formatCurrency(result.net.monthly)}
            </h3>
            <p className="text-govuk-dark-grey">Per month</p>
          </div>
        </div>
      </div>

      {/* Overtime Summary */}
      {result.overtime && (
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-govuk-black mb-4">Overtime Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-govuk-dark-grey">
                Annual overtime pay: <span className="font-bold">{formatCurrency(result.overtime.annualAmount)}</span>
              </p>
              <p className="text-govuk-dark-grey">
                Normal hourly rate: <span className="font-bold">
                  {new Intl.NumberFormat('en-GB', {
                    style: 'currency',
                    currency: 'GBP',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(result.overtime.normalHourlyRate)}
                </span>
              </p>
            </div>
            <div>
              {result.overtime.overtime1Pay > 0 && (
                <p className="text-govuk-dark-grey">
                  Overtime rate 1: <span className="font-bold">{formatCurrency(result.overtime.overtime1Pay)}</span>
                </p>
              )}
              {result.overtime.overtime2Pay > 0 && (
                <p className="text-govuk-dark-grey">
                  Overtime rate 2: <span className="font-bold">{formatCurrency(result.overtime.overtime2Pay)}</span>
                </p>
              )}
            </div>
          </div>
          
          <div className="text-sm text-govuk-dark-grey">
            <p>• Overtime pay is included in your gross salary and subject to Income Tax, National Insurance and Student Loan</p>
            <p>• Check the Pension tab to include or exclude overtime from pension contributions</p>
          </div>
        </div>
      )}

      {/* Bonus Period Comparison */}
      {result.bonus && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-govuk-black mb-4">Bonus Period Comparison</h3>
          
          <div className="mb-4">
            <p className="text-govuk-dark-grey">
              Annual bonus: <span className="font-bold">{formatCurrency(result.bonus.amount)}</span>
            </p>
            <p className="text-govuk-dark-grey text-sm">
              Extra deductions due to bonus: <span className="font-bold">{formatCurrency(result.bonus.extraDeductions.total)}</span>
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-govuk-mid-grey">
              <thead>
                <tr className="bg-govuk-light-grey">
                  <th className="border border-govuk-mid-grey px-4 py-2 text-left font-bold">Component</th>
                  <th className="border border-govuk-mid-grey px-4 py-2 text-right font-bold">Normal Period</th>
                  <th className="border border-govuk-mid-grey px-4 py-2 text-right font-bold">Bonus Period</th>
                  <th className="border border-govuk-mid-grey px-4 py-2 text-right font-bold">Difference</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" className="border border-govuk-mid-grey px-4 py-2 text-left font-medium">Gross pay</th>
                  <td className="border border-govuk-mid-grey px-4 py-2 text-right">{formatCurrency(result.bonus.periodComparison.normalPeriod.gross)}</td>
                  <td className="border border-govuk-mid-grey px-4 py-2 text-right">{formatCurrency(result.bonus.periodComparison.bonusPeriod.gross)}</td>
                  <td className="border border-govuk-mid-grey px-4 py-2 text-right font-bold text-green-600">
                    +{formatCurrency(result.bonus.periodComparison.bonusPeriod.gross - result.bonus.periodComparison.normalPeriod.gross)}
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="border border-govuk-mid-grey px-4 py-2 text-left font-medium">Income tax</th>
                  <td className="border border-govuk-mid-grey px-4 py-2 text-right">-{formatCurrency(result.bonus.periodComparison.normalPeriod.tax)}</td>
                  <td className="border border-govuk-mid-grey px-4 py-2 text-right">-{formatCurrency(result.bonus.periodComparison.bonusPeriod.tax)}</td>
                  <td className="border border-govuk-mid-grey px-4 py-2 text-right text-red-600">
                    -{formatCurrency(result.bonus.extraDeductions.tax)}
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="border border-govuk-mid-grey px-4 py-2 text-left font-medium">National Insurance</th>
                  <td className="border border-govuk-mid-grey px-4 py-2 text-right">-{formatCurrency(result.bonus.periodComparison.normalPeriod.ni)}</td>
                  <td className="border border-govuk-mid-grey px-4 py-2 text-right">-{formatCurrency(result.bonus.periodComparison.bonusPeriod.ni)}</td>
                  <td className="border border-govuk-mid-grey px-4 py-2 text-right text-red-600">
                    -{formatCurrency(result.bonus.extraDeductions.ni)}
                  </td>
                </tr>
                {result.bonus.extraDeductions.studentLoan > 0 && (
                  <tr>
                    <th scope="row" className="border border-govuk-mid-grey px-4 py-2 text-left font-medium">Student loan</th>
                    <td className="border border-govuk-mid-grey px-4 py-2 text-right">-{formatCurrency(result.bonus.periodComparison.normalPeriod.studentLoan)}</td>
                    <td className="border border-govuk-mid-grey px-4 py-2 text-right">-{formatCurrency(result.bonus.periodComparison.bonusPeriod.studentLoan)}</td>
                    <td className="border border-govuk-mid-grey px-4 py-2 text-right text-red-600">
                      -{formatCurrency(result.bonus.extraDeductions.studentLoan)}
                    </td>
                  </tr>
                )}
                <tr className="bg-govuk-light-grey font-bold">
                  <th scope="row" className="border border-govuk-mid-grey px-4 py-2 text-left font-bold">Net pay</th>
                  <td className="border border-govuk-mid-grey px-4 py-2 text-right font-bold">{formatCurrency(result.bonus.periodComparison.normalPeriod.net)}</td>
                  <td className="border border-govuk-mid-grey px-4 py-2 text-right font-bold">{formatCurrency(result.bonus.periodComparison.bonusPeriod.net)}</td>
                  <td className="border border-govuk-mid-grey px-4 py-2 text-right font-bold text-green-600">
                    +{formatCurrency(result.bonus.periodComparison.bonusPeriod.net - result.bonus.periodComparison.normalPeriod.net)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-sm text-govuk-dark-grey">
            <p>• The bonus period shows your pay when the one-off bonus is added</p>
            <p>• Extra deductions are capped and cannot exceed the bonus amount</p>
            <p>• This comparison helps you understand the tax impact of receiving a bonus</p>
          </div>
        </div>
      )}

      {/* Visual Chart */}
      <div className="bg-white p-6 border border-govuk-mid-grey">
        <SalaryBreakdownChart result={result} />
      </div>

      {/* Detailed Breakdown */}
      <div className="border-2 border-govuk-mid-grey">
        <table className="w-full">
          <caption className="bg-govuk-mid-grey px-4 py-2 text-left font-bold text-govuk-black">
            Annual breakdown
          </caption>
          <tbody>
            <tr className="border-b border-govuk-mid-grey">
              <th scope="row" className="px-4 py-3 text-left font-medium">
                Gross salary
              </th>
              <td className="px-4 py-3 text-right font-bold">
                {formatCurrency(result.gross.annual)}
              </td>
            </tr>
            <tr className="border-b border-govuk-mid-grey">
              <th scope="row" className="px-4 py-3 text-left font-medium">
                Income tax
              </th>
              <td className="px-4 py-3 text-right">
                -{formatCurrency(result.incomeTax.annual)}
              </td>
            </tr>
            <tr className="border-b border-govuk-mid-grey">
              <th scope="row" className="px-4 py-3 text-left font-medium">
                National Insurance
              </th>
              <td className="px-4 py-3 text-right">
                -{formatCurrency(result.nationalInsurance.employee.annual)}
              </td>
            </tr>
            {result.studentLoan.annual > 0 && (
              <tr className="border-b border-govuk-mid-grey">
                <th scope="row" className="px-4 py-3 text-left font-medium">
                  Student loan
                </th>
                <td className="px-4 py-3 text-right">
                  -{formatCurrency(result.studentLoan.annual)}
                </td>
              </tr>
            )}
            {result.pension.employee.annual > 0 && (
              <tr className="border-b border-govuk-mid-grey">
                <th scope="row" className="px-4 py-3 text-left font-medium">
                  Pension contribution
                </th>
                <td className="px-4 py-3 text-right">
                  -{formatCurrency(result.pension.employee.annual)}
                </td>
              </tr>
            )}
            <tr className="bg-govuk-light-grey">
              <th scope="row" className="px-4 py-3 text-left font-bold">
                Net salary
              </th>
              <td className="px-4 py-3 text-right font-bold">
                {formatCurrency(result.net.annual)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-govuk-light-grey border border-govuk-mid-grey">
          <div className="text-lg font-bold">{formatCurrency(result.net.monthly)}</div>
          <div className="text-sm text-govuk-dark-grey">Monthly</div>
        </div>
        <div className="text-center p-4 bg-govuk-light-grey border border-govuk-mid-grey">
          <div className="text-lg font-bold">{formatCurrency(result.net.weekly)}</div>
          <div className="text-sm text-govuk-dark-grey">Weekly</div>
        </div>
        <div className="text-center p-4 bg-govuk-light-grey border border-govuk-mid-grey">
          <div className="text-lg font-bold">{formatCurrency(result.net.daily)}</div>
          <div className="text-sm text-govuk-dark-grey">Daily</div>
        </div>
        <div className="text-center p-4 bg-govuk-light-grey border border-govuk-mid-grey">
          <div className="text-lg font-bold">{formatCurrency(result.net.hourly)}</div>
          <div className="text-sm text-govuk-dark-grey">Hourly</div>
        </div>
      </div>
    </div>
  );
}