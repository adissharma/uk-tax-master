import { useCalculatorStore } from '@/store/calculatorStore';
import { GOVUKInput } from '../GOVUKInput';
import { useState } from 'react';

export function TaxCodeTab() {
  const { inputs, updateInputs } = useCalculatorStore();
  const [taxCode, setTaxCode] = useState('1257L');
  const [region, setRegion] = useState(inputs.region);

  const handleTaxCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaxCode(e.target.value);
    // Update inputs when user finishes typing
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRegion = e.target.value as typeof inputs.region;
    setRegion(newRegion);
    updateInputs({ region: newRegion });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <GOVUKInput
          label="Tax code"
          hint="Enter your tax code from your payslip or P60. If you're not sure, use 1257L."
          value={taxCode}
          onChange={handleTaxCodeChange}
          className="w-32"
        />

        <fieldset>
          <legend className="font-medium text-base mb-3">Region</legend>
          <div className="space-y-3">
            <label className="flex items-start gap-3">
              <input
                type="radio"
                name="region"
                value="england"
                checked={region === 'england'}
                onChange={handleRegionChange}
                className="mt-1 text-primary focus:ring-primary"
              />
              <div>
                <div className="font-medium">England, Wales & Northern Ireland</div>
                <div className="text-sm text-muted-foreground">Standard UK tax rates apply</div>
              </div>
            </label>
            
            <label className="flex items-start gap-3">
              <input
                type="radio"
                name="region"
                value="scotland"
                checked={region === 'scotland'}
                onChange={handleRegionChange}
                className="mt-1 text-primary focus:ring-primary"
              />
              <div>
                <div className="font-medium">Scotland</div>
                <div className="text-sm text-muted-foreground">Scottish Income Tax rates apply</div>
              </div>
            </label>
          </div>
        </fieldset>
      </div>
    </div>
  );
}