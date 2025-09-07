import { useCalculatorStore } from '@/store/calculatorStore';
import { formatCurrency, formatPercentage } from '@/lib/calculator/engine';

export function IncomeTaxTab() {
  const { result, inputs, isCalculating } = useCalculatorStore();

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

  return (
    <div className="space-y-6">
      <h2 className="govuk-heading-l">Income tax breakdown</h2>

      {/* Summary */}
      <div className="bg-govuk-light-blue border-l-4 border-govuk-blue p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-xl font-bold text-govuk-black mb-1">
              {formatCurrency(result.incomeTax.annual)}
            </h3>
            <p className="text-govuk-dark-grey">Total income tax (annual)</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-govuk-black mb-1">
              {formatCurrency(result.incomeTax.monthly)}
            </h3>
            <p className="text-govuk-dark-grey">Per month</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-govuk-black mb-1">
              {formatCurrency(result.personalAllowance)}
            </h3>
            <p className="text-govuk-dark-grey">Personal allowance</p>
          </div>
        </div>
      </div>

      {/* Tax Bands Breakdown */}
      <div className="border-2 border-govuk-mid-grey">
        <table className="w-full">
          <caption className="bg-govuk-mid-grey px-4 py-2 text-left font-bold text-govuk-black">
            Income tax by band ({inputs.taxYear})
          </caption>
          <thead>
            <tr className="bg-govuk-light-grey border-b border-govuk-mid-grey">
              <th scope="col" className="px-4 py-2 text-left font-bold">Tax band</th>
              <th scope="col" className="px-4 py-2 text-left font-bold">Rate</th>
              <th scope="col" className="px-4 py-2 text-right font-bold">Taxable amount</th>
              <th scope="col" className="px-4 py-2 text-right font-bold">Tax due</th>
            </tr>
          </thead>
          <tbody>
            {result.incomeTax.bands.map((band, index) => (
              <tr key={index} className="border-b border-govuk-mid-grey">
                <th scope="row" className="px-4 py-3 text-left font-medium">
                  {band.name}
                </th>
                <td className="px-4 py-3 text-left">
                  {formatPercentage(band.rate)}
                </td>
                <td className="px-4 py-3 text-right">
                  {band.taxable > 0 ? formatCurrency(band.taxable) : '—'}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {band.tax > 0 ? formatCurrency(band.tax) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-govuk-light-grey font-bold">
              <th scope="row" className="px-4 py-3 text-left">Total</th>
              <td className="px-4 py-3"></td>
              <td className="px-4 py-3 text-right">
                {formatCurrency(result.taxableIncome)}
              </td>
              <td className="px-4 py-3 text-right">
                {formatCurrency(result.incomeTax.annual)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Additional Information */}
      <div className="bg-govuk-light-grey border-l-4 border-govuk-dark-grey p-4">
        <h3 className="font-bold mb-2">How income tax is calculated</h3>
        <ul className="space-y-2 text-sm">
          <li>• Your personal allowance of {formatCurrency(result.personalAllowance)} is tax-free</li>
          <li>• Income above this amount is taxed according to the bands shown above</li>
          <li>• Tax rates and bands are for {inputs.region === 'scotland' ? 'Scotland' : 'England, Wales & Northern Ireland'}</li>
          {inputs.grossAnnualSalary > 100000 && (
            <li className="text-govuk-red">• Your personal allowance is reduced because your income is over £100,000</li>
          )}
        </ul>
      </div>
    </div>
  );
}