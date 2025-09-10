import { useState } from 'react';
import { useCalculatorStore } from '@/store/calculatorStore';
import { GOVUKInput } from '@/components/GOVUKInput';
import { PinterestCard } from '@/components/PinterestCard';

export function BonusTab() {
  const { inputs, updateInputs } = useCalculatorStore();
  const [bonusAmount, setBonusAmount] = useState(inputs.bonusAmount?.toString() || '');
  const [normalPayPeriod, setNormalPayPeriod] = useState(inputs.normalPayPeriod || 'monthly');

  const handleBonusAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBonusAmount(value);
    const numericValue = value === '' ? 0 : parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(numericValue)) {
      updateInputs({ bonusAmount: numericValue });
    }
  };

  const handlePayPeriodChange = (period: 'monthly' | 'four-weekly' | 'two-weekly' | 'weekly') => {
    setNormalPayPeriod(period);
    updateInputs({ normalPayPeriod: period });
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="heading-lg mb-2">Bonus payments</h2>
        <p className="body-sm text-muted-foreground mb-6">
          Enter your annual bonus to see how it affects your tax and National Insurance. 
          The calculator will show the extra deductions and compare a normal pay period with your bonus period.
        </p>
      </div>

      <PinterestCard className="p-6">
        <div className="space-y-6">
          {/* Bonus Amount */}
          <div>
            <GOVUKInput
              label="Annual bonus amount"
              hint="Enter your total bonus for the tax year"
              value={bonusAmount}
              onChange={handleBonusAmountChange}
              onBlur={() => setBonusAmount(formatCurrency(bonusAmount))}
              placeholder="£0"
              className="text-lg font-semibold"
            />
          </div>

          {/* Normal Pay Period */}
          <div>
            <label className="block heading-sm mb-3">
              Your normal pay period
            </label>
            <p className="body-sm text-muted-foreground mb-4">
              Select how often you're normally paid (excluding the bonus) to see period comparisons
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'monthly', label: 'Monthly' },
                { value: 'four-weekly', label: 'Four-weekly' },
                { value: 'two-weekly', label: 'Two-weekly' },
                { value: 'weekly', label: 'Weekly' }
              ].map((period) => (
                <label
                  key={period.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    normalPayPeriod === period.value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <input
                    type="radio"
                    name="payPeriod"
                    value={period.value}
                    checked={normalPayPeriod === period.value}
                    onChange={(e) => handlePayPeriodChange(e.target.value as 'monthly' | 'four-weekly' | 'two-weekly' | 'weekly')}
                    className="sr-only"
                  />
                  <span className="body-md font-medium">{period.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Information about bonus calculation */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <h3 className="heading-sm">How bonus calculations work:</h3>
            <ul className="space-y-1 body-sm text-muted-foreground">
              <li>• Your bonus is treated as a one-off payment in the tax year</li>
              <li>• We calculate the extra Income Tax, National Insurance and Student Loan due</li>
              <li>• These extra deductions are added to your normal period deductions</li>
              <li>• Total extra deductions never exceed the bonus amount</li>
              <li>• By default, pension contributions are not deducted from bonus pay</li>
            </ul>
          </div>

          {inputs.bonusAmount && inputs.bonusAmount > 0 && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <p className="body-sm">
                <span className="font-medium text-accent">Annual bonus: </span>
                £{inputs.bonusAmount.toLocaleString()}
              </p>
              <p className="body-sm mt-1 text-muted-foreground">
                Results will show yearly totals and a comparison between your normal {normalPayPeriod} period and the bonus period.
              </p>
            </div>
          )}
        </div>
      </PinterestCard>
    </div>
  );
}