import { useCalculatorStore } from '@/store/calculatorStore';
import { formatCurrency, formatPercentage } from '@/lib/calculator/engine';

export function NationalInsuranceTab() {
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

  const niThresholds = {
    primaryThreshold: 12570,
    upperEarningsLimit: 50270,
    employeeRate: 0.12,
    employeeUpperRate: 0.02,
  };

  const calculateNIBreakdown = () => {
    const salary = inputs.grossAnnualSalary;
    const bands = [];

    // Below primary threshold
    if (salary > 0) {
      const belowThreshold = Math.min(salary, niThresholds.primaryThreshold);
      bands.push({
        name: 'Below Primary Threshold',
        range: `£0 - £${niThresholds.primaryThreshold.toLocaleString()}`,
        rate: 0,
        earnings: belowThreshold,
        ni: 0,
      });
    }

    // Primary threshold to UEL
    if (salary > niThresholds.primaryThreshold) {
      const inBand = Math.min(salary - niThresholds.primaryThreshold, niThresholds.upperEarningsLimit - niThresholds.primaryThreshold);
      bands.push({
        name: 'Primary Threshold to UEL',
        range: `£${niThresholds.primaryThreshold.toLocaleString()} - £${niThresholds.upperEarningsLimit.toLocaleString()}`,
        rate: niThresholds.employeeRate,
        earnings: inBand,
        ni: inBand * niThresholds.employeeRate,
      });
    }

    // Above UEL
    if (salary > niThresholds.upperEarningsLimit) {
      const aboveUEL = salary - niThresholds.upperEarningsLimit;
      bands.push({
        name: 'Above Upper Earnings Limit',
        range: `£${niThresholds.upperEarningsLimit.toLocaleString()}+`,
        rate: niThresholds.employeeUpperRate,
        earnings: aboveUEL,
        ni: aboveUEL * niThresholds.employeeUpperRate,
      });
    }

    return bands;
  };

  const niBands = calculateNIBreakdown();

  return (
    <div className="space-y-6">
      <h2 className="govuk-heading-l">National Insurance breakdown</h2>

      {/* Summary */}
      <div className="bg-govuk-light-blue border-l-4 border-govuk-blue p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold text-govuk-black mb-1">
              {formatCurrency(result.nationalInsurance.employee.annual)}
            </h3>
            <p className="text-govuk-dark-grey">Employee National Insurance (annual)</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-govuk-black mb-1">
              {formatCurrency(result.nationalInsurance.employee.monthly)}
            </h3>
            <p className="text-govuk-dark-grey">Per month</p>
          </div>
        </div>
      </div>

      {/* Employee NI Breakdown */}
      <div className="border-2 border-govuk-mid-grey">
        <table className="w-full">
          <caption className="bg-govuk-mid-grey px-4 py-2 text-left font-bold text-govuk-black">
            Employee National Insurance breakdown ({inputs.taxYear})
          </caption>
          <thead>
            <tr className="bg-govuk-light-grey border-b border-govuk-mid-grey">
              <th scope="col" className="px-4 py-2 text-left font-bold">Band</th>
              <th scope="col" className="px-4 py-2 text-left font-bold">Earnings range</th>
              <th scope="col" className="px-4 py-2 text-left font-bold">Rate</th>
              <th scope="col" className="px-4 py-2 text-right font-bold">Earnings in band</th>
              <th scope="col" className="px-4 py-2 text-right font-bold">NI due</th>
            </tr>
          </thead>
          <tbody>
            {niBands.map((band, index) => (
              <tr key={index} className="border-b border-govuk-mid-grey">
                <th scope="row" className="px-4 py-3 text-left font-medium">
                  {band.name}
                </th>
                <td className="px-4 py-3 text-left text-sm">
                  {band.range}
                </td>
                <td className="px-4 py-3 text-left">
                  {formatPercentage(band.rate)}
                </td>
                <td className="px-4 py-3 text-right">
                  {band.earnings > 0 ? formatCurrency(band.earnings) : '—'}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {band.ni > 0 ? formatCurrency(band.ni) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-govuk-light-grey font-bold">
              <th scope="row" className="px-4 py-3 text-left" colSpan={4}>Total Employee NI</th>
              <td className="px-4 py-3 text-right">
                {formatCurrency(result.nationalInsurance.employee.annual)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Employer NI Summary */}
      <div className="bg-govuk-light-grey border-l-4 border-govuk-dark-grey p-4">
        <h3 className="font-bold mb-2">Employer National Insurance</h3>
        <p className="mb-2">
          Your employer also pays National Insurance on your salary: 
          <strong className="ml-2">{formatCurrency(result.nationalInsurance.employer.annual)}</strong> annually
          ({formatCurrency(result.nationalInsurance.employer.monthly)} monthly)
        </p>
        <p className="text-sm text-govuk-dark-grey">
          This is in addition to your salary and is not deducted from your pay.
        </p>
      </div>

      {/* Additional Information */}
      <div className="bg-govuk-light-grey border-l-4 border-govuk-dark-grey p-4">
        <h3 className="font-bold mb-2">About National Insurance</h3>
        <ul className="space-y-2 text-sm">
          <li>• National Insurance is calculated on your gross earnings before pension contributions (if salary exchange)</li>
          <li>• Class 1 NI contributions go towards your State Pension and other benefits</li>
          <li>• You need 35 qualifying years for the full State Pension</li>
          <li>• The Primary Threshold is currently £{niThresholds.primaryThreshold.toLocaleString()} per year</li>
          <li>• The Upper Earnings Limit is currently £{niThresholds.upperEarningsLimit.toLocaleString()} per year</li>
        </ul>
      </div>
    </div>
  );
}