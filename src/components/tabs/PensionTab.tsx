import { useCalculatorStore } from '@/store/calculatorStore';
import { MaterialInput } from '../MaterialInput';
import { useState } from 'react';

export function PensionTab() {
  const { inputs, updateInputs } = useCalculatorStore();
  const [employeeContribution, setEmployeeContribution] = useState((inputs.pensionContribution || 5).toString());
  const [salaryExchange, setSalaryExchange] = useState(inputs.salaryExchange || false);

  const handleContributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmployeeContribution(value);
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      updateInputs({ pensionContribution: numValue });
    }
  };

  const handleSalaryExchangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSalaryExchange(checked);
    updateInputs({ salaryExchange: checked });
  };

  return (
    <div className="space-y-6">
      <h2 className="govuk-heading-l">Pension contributions</h2>
      
      {/* <div className="bg-govuk-light-grey border-l-4 border-govuk-dark-grey p-4">
        <p className="text-sm">
          Enter your pension contribution details. Most employers offer workplace pensions with matching contributions.
        </p>
      </div> */}

      <div className="space-y-6">
        <MaterialInput
          label="Employee contribution percentage"
          hint="Enter the percentage of your salary that you contribute to your pension"
          value={employeeContribution}
          onChange={handleContributionChange}
          suffix="%"
          type="number"
          min="0"
          max="100"
          step="0.1"
        />

        <fieldset className="border-2 border-govuk-mid-grey p-4">
          <legend className="font-medium px-2 text-base">Pension scheme type</legend>
          <div className="space-y-3 mt-3">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={!salaryExchange}
                onChange={(e) => handleSalaryExchangeChange({ target: { checked: !e.target.checked } } as any)}
                className="mt-1 text-govuk-blue focus:ring-yellow-400"
              />
              <div>
                <div className="font-medium">Relief at source</div>
                <div className="text-sm text-govuk-dark-grey">
                  Contributions are taken from your pay after tax, then tax relief is claimed back
                </div>
              </div>
            </label>
            
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={salaryExchange}
                onChange={handleSalaryExchangeChange}
                className="mt-1 text-govuk-blue focus:ring-yellow-400"
              />
              <div>
                <div className="font-medium">Salary exchange (sacrifice)</div>
                <div className="text-sm text-govuk-dark-grey">
                  Contributions are taken before tax and National Insurance, saving you money
                </div>
              </div>
            </label>
          </div>
        </fieldset>

        {/* <div className="bg-govuk-light-blue border-l-4 border-govuk-blue p-4">
          <h3 className="font-bold mb-2">About pension contributions</h3>
          <ul className="text-sm space-y-1">
            <li>• Most employers will match your contributions up to a certain percentage</li>
            <li>• Salary exchange schemes can save you National Insurance contributions</li>
            <li>• The government provides tax relief on pension contributions</li>
            <li>• You can contribute up to £40,000 per year (annual allowance)</li>
          </ul>
        </div>

        <div className="bg-govuk-light-green border-l-4 border-govuk-green p-4">
          <h3 className="font-bold mb-2">Employer contribution (estimated)</h3>
          <p className="text-sm">
            Most employers match employee contributions. We assume your employer contributes the same percentage as you do.
            This employer contribution doesn't affect your take-home pay but increases your total pension pot.
          </p>
        </div> */}
      </div>
    </div>
  );
}