import { useState } from 'react';
import { useCalculatorStore } from '@/store/calculatorStore';
import { GOVUKInput } from '@/components/GOVUKInput';
import { PinterestCard } from '@/components/PinterestCard';

export function OvertimeTab() {
  const { inputs, updateInputs } = useCalculatorStore();
  
  const [normalWorkingWeek, setNormalWorkingWeek] = useState(inputs.normalWorkingWeek?.toString() || '37.5');
  const [weeksPerYear, setWeeksPerYear] = useState(inputs.weeksPerYear?.toString() || '52');
  const [overtime1Hours, setOvertime1Hours] = useState(inputs.overtime1Hours?.toString() || '');
  const [overtime1Multiplier, setOvertime1Multiplier] = useState(inputs.overtime1Multiplier?.toString() || '1.5');
  const [overtime2Hours, setOvertime2Hours] = useState(inputs.overtime2Hours?.toString() || '');
  const [overtime2Multiplier, setOvertime2Multiplier] = useState(inputs.overtime2Multiplier?.toString() || '2.0');
  const [overtimeCashValue, setOvertimeCashValue] = useState(inputs.overtimeCashValue?.toString() || '');
  const [overtimeCashPeriod, setOvertimeCashPeriod] = useState(inputs.overtimeCashPeriod || 'annual');
  const [useHoursMethod, setUseHoursMethod] = useState(true);

  const handleNormalWorkingWeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNormalWorkingWeek(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateInputs({ normalWorkingWeek: numValue });
    }
  };

  const handleWeeksPerYearChange = (period: string) => {
    setWeeksPerYear(period);
    updateInputs({ weeksPerYear: parseFloat(period) });
  };

  const handleOvertime1HoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOvertime1Hours(value);
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      updateInputs({ overtime1Hours: numValue });
    }
  };

  const handleOvertime1MultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOvertime1Multiplier(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateInputs({ overtime1Multiplier: numValue });
    }
  };

  const handleOvertime2HoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOvertime2Hours(value);
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      updateInputs({ overtime2Hours: numValue });
    }
  };

  const handleOvertime2MultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOvertime2Multiplier(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateInputs({ overtime2Multiplier: numValue });
    }
  };

  const handleOvertimeCashValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOvertimeCashValue(value);
    const numValue = value === '' ? 0 : parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(numValue)) {
      updateInputs({ overtimeCashValue: numValue });
    }
  };

  const handleMethodChange = (method: 'hours' | 'cash') => {
    setUseHoursMethod(method === 'hours');
    if (method === 'cash') {
      // Clear hours when switching to cash method
      updateInputs({ overtime1Hours: 0, overtime2Hours: 0 });
      setOvertime1Hours('');
      setOvertime2Hours('');
    } else {
      // Clear cash when switching to hours method
      updateInputs({ overtimeCashValue: 0 });
      setOvertimeCashValue('');
    }
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(num) || num === 0) return '';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Calculate normal hourly rate for display
  const normalHourlyRate = inputs.grossAnnualSalary && inputs.normalWorkingWeek && inputs.weeksPerYear
    ? inputs.grossAnnualSalary / (inputs.weeksPerYear * inputs.normalWorkingWeek)
    : 0;

  const hasOvertime = useHoursMethod 
    ? (inputs.overtime1Hours && inputs.overtime1Hours > 0) || (inputs.overtime2Hours && inputs.overtime2Hours > 0)
    : inputs.overtimeCashValue && inputs.overtimeCashValue > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="heading-lg mb-2">Overtime payments</h2>
        <p className="body-sm text-muted-foreground mb-6">
          Add your regular overtime hours to see how they affect your tax and take-home pay. 
          You can enter overtime by hours and rate multipliers, or as a cash amount.
        </p>
      </div>

      <PinterestCard className="p-6">
        <div className="space-y-6">
          {/* Method Selection */}
          <div>
            <label className="block heading-sm mb-3">How do you want to enter overtime?</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                useHoursMethod ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-muted-foreground'
              }`}>
                <input
                  type="radio"
                  name="overtimeMethod"
                  checked={useHoursMethod}
                  onChange={() => handleMethodChange('hours')}
                  className="sr-only"
                />
                <div>
                  <div className="body-md font-medium">Hours and rate multipliers</div>
                  <div className="body-sm text-muted-foreground">e.g. 10 hours @ 1.5x normal rate</div>
                </div>
              </label>
              
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                !useHoursMethod ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-muted-foreground'
              }`}>
                <input
                  type="radio"
                  name="overtimeMethod"
                  checked={!useHoursMethod}
                  onChange={() => handleMethodChange('cash')}
                  className="sr-only"
                />
                <div>
                  <div className="body-md font-medium">Cash amount</div>
                  <div className="body-sm text-muted-foreground">Enter overtime pay as £ amount</div>
                </div>
              </label>
            </div>
          </div>

          {useHoursMethod ? (
            <>
              {/* Normal Working Week */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <GOVUKInput
                    label="Normal working week"
                    hint="Your non-overtime hours per week"
                    value={normalWorkingWeek}
                    onChange={handleNormalWorkingWeekChange}
                    suffix="hours"
                    type="number"
                    min="1"
                    max="80"
                    step="0.5"
                  />
                </div>

                <div>
                  <label className="block heading-sm mb-3">Weeks per year</label>
                  <div className="flex gap-3">
                    {['52', '52.14'].map((weeks) => (
                      <label
                        key={weeks}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          weeksPerYear === weeks
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <input
                          type="radio"
                          name="weeksPerYear"
                          value={weeks}
                          checked={weeksPerYear === weeks}
                          onChange={(e) => handleWeeksPerYearChange(e.target.value)}
                          className="sr-only"
                        />
                        <span className="body-md font-medium">{weeks}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Display normal hourly rate */}
              {normalHourlyRate > 0 && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="body-sm">
                    <span className="font-medium">Your normal hourly rate: </span>
                    <span className="text-accent font-bold">
                      {new Intl.NumberFormat('en-GB', {
                        style: 'currency',
                        currency: 'GBP',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(normalHourlyRate)}
                    </span>
                  </p>
                </div>
              )}

              {/* Overtime Entry 1 */}
              <div>
                <h3 className="heading-sm mb-3">Overtime rate 1</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GOVUKInput
                    label="Hours per month"
                    hint="Average overtime hours per month"
                    value={overtime1Hours}
                    onChange={handleOvertime1HoursChange}
                    suffix="hours"
                    type="number"
                    min="0"
                    max="200"
                    step="0.5"
                  />
                  <GOVUKInput
                    label="Rate multiplier"
                    hint="e.g. 1.5 for time-and-a-half"
                    value={overtime1Multiplier}
                    onChange={handleOvertime1MultiplierChange}
                    suffix="×"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div>

              {/* Overtime Entry 2 */}
              <div>
                <h3 className="heading-sm mb-3">Overtime rate 2 (optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GOVUKInput
                    label="Hours per month"
                    hint="Additional overtime at different rate"
                    value={overtime2Hours}
                    onChange={handleOvertime2HoursChange}
                    suffix="hours"
                    type="number"
                    min="0"
                    max="200"
                    step="0.5"
                  />
                  <GOVUKInput
                    label="Rate multiplier"
                    hint="e.g. 2.0 for double time"
                    value={overtime2Multiplier}
                    onChange={handleOvertime2MultiplierChange}
                    suffix="×"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div>
            </>
          ) : (
            /* Cash Method */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <GOVUKInput
                    label="Overtime pay amount"
                    hint="Total overtime pay you receive"
                    value={overtimeCashValue}
                    onChange={handleOvertimeCashValueChange}
                    onBlur={() => setOvertimeCashValue(formatCurrency(overtimeCashValue))}
                    placeholder="£0"
                  />
                </div>

                <div>
                  <label className="block heading-sm mb-3">Pay period</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'annual', label: 'Yearly' },
                      { value: 'monthly', label: 'Monthly' },
                      { value: 'weekly', label: 'Weekly' }
                    ].map((period) => (
                      <label
                        key={period.value}
                        className={`flex items-center p-2 border rounded cursor-pointer transition-colors ${
                          overtimeCashPeriod === period.value
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <input
                          type="radio"
                          name="overtimeCashPeriod"
                          value={period.value}
                          checked={overtimeCashPeriod === period.value}
                          onChange={(e) => {
                            setOvertimeCashPeriod(e.target.value as 'annual' | 'monthly' | 'weekly');
                            updateInputs({ overtimeCashPeriod: e.target.value as 'annual' | 'monthly' | 'weekly' });
                          }}
                          className="sr-only"
                        />
                        <span className="body-sm font-medium">{period.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Information */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <h3 className="heading-sm">How overtime calculations work:</h3>
            <ul className="space-y-1 body-sm text-muted-foreground">
              <li>• Overtime pay is added to your gross salary for tax calculations</li>
              <li>• All statutory deductions (Income Tax, National Insurance, Student Loan) apply</li>
              <li>• You can choose whether to include overtime in pensionable pay</li>
              <li>• Use two different rates if you have different overtime multipliers</li>
            </ul>
          </div>

          {hasOvertime && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <p className="body-sm">
                <span className="font-medium text-accent">Overtime configured</span>
              </p>
              <p className="body-sm mt-1 text-muted-foreground">
                Your overtime pay will be included in tax calculations. Check the Pension tab if you want to include overtime in pension contributions.
              </p>
            </div>
          )}
        </div>
      </PinterestCard>
    </div>
  );
}