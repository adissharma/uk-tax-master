import { useCalculatorStore } from '@/store/calculatorStore';
import { GOVUKInput } from '../GOVUKInput';
import { useState } from 'react';

export function PensionTab() {
  const { inputs, updateInputs } = useCalculatorStore();
  const [employeeContribution, setEmployeeContribution] = useState((inputs.pensionContribution || 0).toString());
  const [salaryExchange, setSalaryExchange] = useState(inputs.salaryExchange || false);
  const [includeBonusInPension, setIncludeBonusInPension] = useState(inputs.includeBonusInPension || false);

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

  const handleIncludeBonusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIncludeBonusInPension(checked);
    updateInputs({ includeBonusInPension: checked });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div>
          <h2 className="heading-lg">Employee contribution</h2>
          <GOVUKInput
            label=""
            hint="Enter the percentage of your salary that you contribute to your pension"
            value={employeeContribution}
            onChange={handleContributionChange}
            suffix="%"
            type="number"
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <div>
          <h2 className="heading-lg">Pension scheme type</h2>
          <fieldset>
            <div className="space-y-3">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={!salaryExchange}
                  onChange={(e) => handleSalaryExchangeChange({ target: { checked: !e.target.checked } } as any)}
                  className="mt-1 text-primary focus:ring-primary"
                />
                <div>
                  <div className="font-medium">Relief at source</div>
                  <div className="text-sm text-muted-foreground">
                    Contributions are taken from your pay after tax, then tax relief is claimed back
                  </div>
                </div>
              </label>
              
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={salaryExchange}
                  onChange={handleSalaryExchangeChange}
                  className="mt-1 text-primary focus:ring-primary"
                />
                <div>
                  <div className="font-medium">Salary exchange (sacrifice)</div>
                  <div className="text-sm text-muted-foreground">
                    Contributions are taken before tax and National Insurance, saving you money
                  </div>
                </div>
              </label>
            </div>
          </fieldset>
        </div>

        {/* Include overtime in pension calculation */}
        {((inputs.overtime1Hours && inputs.overtime1Hours > 0) || 
          (inputs.overtime2Hours && inputs.overtime2Hours > 0) || 
          (inputs.overtimeCashValue && inputs.overtimeCashValue > 0)) && (
          <div>
            <h2 className="heading-lg">Overtime payments</h2>
            <div className="space-y-3">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={inputs.includeOvertimeInPension || false}
                  onChange={(e) => updateInputs({ includeOvertimeInPension: e.target.checked })}
                  className="mt-1 text-primary focus:ring-primary"
                />
                <div>
                  <div className="font-medium">Include overtime in pension contributions</div>
                  <div className="text-sm text-muted-foreground">
                    Tick this if your pension scheme includes overtime pay when calculating contributions.
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Include bonus in pension calculation */}
        {inputs.bonusAmount && inputs.bonusAmount > 0 && (
          <div>
            <h2 className="heading-lg">Bonus payments</h2>
            <div className="space-y-3">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={includeBonusInPension}
                  onChange={handleIncludeBonusChange}
                  className="mt-1 text-primary focus:ring-primary"
                />
                <div>
                  <div className="font-medium">Include bonus in pension contributions</div>
                  <div className="text-sm text-muted-foreground">
                    Most employers do not deduct pension from bonus payments. Only tick this if your scheme specifically includes bonuses in pensionable pay.
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}