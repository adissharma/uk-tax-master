import { useCalculatorStore } from '@/store/calculatorStore';
import { formatCurrency } from '@/lib/calculator/engine';
import { useState } from 'react';

type Period = 'annual' | 'monthly' | 'weekly' | 'daily' | 'hourly';

export function BreakdownTab() {
  const { result, isCalculating } = useCalculatorStore();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('annual');

  if (isCalculating || !result) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-govuk-light-grey rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-govuk-light-grey rounded"></div>
        </div>
      </div>
    );
  }

  const periods: { key: Period; label: string; divisor: number }[] = [
    { key: 'annual', label: 'Annual', divisor: 1 },
    { key: 'monthly', label: 'Monthly', divisor: 12 },
    { key: 'weekly', label: 'Weekly', divisor: 52 },
    { key: 'daily', label: 'Daily', divisor: 260 },
    { key: 'hourly', label: 'Hourly', divisor: 52 * 37.5 },
  ];

  const getValue = (annual: number, period: Period) => {
    const periodData = periods.find(p => p.key === period);
    return annual / (periodData?.divisor || 1);
  };

  return (
    <div className="space-y-6">
      <h2 className="govuk-heading-l">Salary breakdown by period</h2>

      {/* Period Selector */}
      <fieldset className="border border-govuk-mid-grey p-4">
        <legend className="font-medium px-2 text-sm">Select time period</legend>
        <div className="flex flex-wrap gap-2 mt-2">
          {periods.map((period) => (
            <label key={period.key} className="flex items-center">
              <input
                type="radio"
                name="period"
                value={period.key}
                checked={selectedPeriod === period.key}
                onChange={(e) => setSelectedPeriod(e.target.value as Period)}
                className="mr-2 text-govuk-blue focus:ring-yellow-400"
              />
              <span className="text-sm font-medium">{period.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Selected Period Summary */}
      <div className="bg-govuk-light-green border-l-4 border-govuk-green p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-2xl font-bold text-govuk-black mb-2">
              {formatCurrency(getValue(result.net.annual, selectedPeriod))}
            </h3>
            <p className="text-govuk-dark-grey">
              Net {selectedPeriod === 'hourly' ? 'hourly rate' : `${selectedPeriod} take-home`}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-govuk-black mb-2">
              {formatCurrency(getValue(result.gross.annual, selectedPeriod))}
            </h3>
            <p className="text-govuk-dark-grey">
              Gross {selectedPeriod === 'hourly' ? 'hourly rate' : `${selectedPeriod} salary`}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown Table */}
      <div className="border-2 border-govuk-mid-grey">
        <table className="w-full">
          <caption className="bg-govuk-mid-grey px-4 py-2 text-left font-bold text-govuk-black">
            {periods.find(p => p.key === selectedPeriod)?.label} breakdown
          </caption>
          <tbody>
            <tr className="border-b border-govuk-mid-grey">
              <th scope="row" className="px-4 py-3 text-left font-medium">
                Gross {selectedPeriod === 'hourly' ? 'hourly rate' : selectedPeriod === 'annual' ? 'salary' : 'pay'}
              </th>
              <td className="px-4 py-3 text-right font-bold">
                {formatCurrency(getValue(result.gross.annual, selectedPeriod))}
              </td>
            </tr>
            <tr className="border-b border-govuk-mid-grey">
              <th scope="row" className="px-4 py-3 text-left font-medium">
                Income tax
              </th>
              <td className="px-4 py-3 text-right text-govuk-red">
                -{formatCurrency(getValue(result.incomeTax.annual, selectedPeriod))}
              </td>
            </tr>
            <tr className="border-b border-govuk-mid-grey">
              <th scope="row" className="px-4 py-3 text-left font-medium">
                National Insurance
              </th>
              <td className="px-4 py-3 text-right text-govuk-red">
                -{formatCurrency(getValue(result.nationalInsurance.employee.annual, selectedPeriod))}
              </td>
            </tr>
            {result.studentLoan.annual > 0 && (
              <tr className="border-b border-govuk-mid-grey">
                <th scope="row" className="px-4 py-3 text-left font-medium">
                  Student loan repayment
                </th>
                <td className="px-4 py-3 text-right text-govuk-red">
                  -{formatCurrency(getValue(result.studentLoan.annual, selectedPeriod))}
                </td>
              </tr>
            )}
            {result.pension.employee.annual > 0 && (
              <tr className="border-b border-govuk-mid-grey">
                <th scope="row" className="px-4 py-3 text-left font-medium">
                  Pension contribution
                </th>
                <td className="px-4 py-3 text-right text-govuk-red">
                  -{formatCurrency(getValue(result.pension.employee.annual, selectedPeriod))}
                </td>
              </tr>
            )}
            <tr className="bg-govuk-light-green border-t-2 border-govuk-green">
              <th scope="row" className="px-4 py-4 text-left font-bold text-lg">
                Net {selectedPeriod === 'hourly' ? 'hourly rate' : selectedPeriod === 'annual' ? 'salary' : 'pay'}
              </th>
              <td className="px-4 py-4 text-right font-bold text-lg">
                {formatCurrency(getValue(result.net.annual, selectedPeriod))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* All Periods Quick Reference */}
      <div className="border-2 border-govuk-mid-grey">
        <table className="w-full">
          <caption className="bg-govuk-mid-grey px-4 py-2 text-left font-bold text-govuk-black">
            Quick reference - all periods
          </caption>
          <thead>
            <tr className="bg-govuk-light-grey border-b border-govuk-mid-grey">
              <th scope="col" className="px-4 py-2 text-left font-bold">Period</th>
              <th scope="col" className="px-4 py-2 text-right font-bold">Gross</th>
              <th scope="col" className="px-4 py-2 text-right font-bold">Net</th>
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => (
              <tr key={period.key} className="border-b border-govuk-mid-grey">
                <th scope="row" className="px-4 py-3 text-left font-medium capitalize">
                  {period.label}
                </th>
                <td className="px-4 py-3 text-right">
                  {formatCurrency(getValue(result.gross.annual, period.key))}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatCurrency(getValue(result.net.annual, period.key))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}