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
      <h2 className="govuk-heading-l">Tax code and region</h2>
      
      <div className="bg-govuk-light-grey border-l-4 border-govuk-dark-grey p-4">
        <p className="text-sm mb-2">
          Your tax code determines how much tax-free income you get each year. 
          Most people have the standard tax code 1257L.
        </p>
      </div>

      <div className="space-y-4">
        <GOVUKInput
          label="Tax code"
          hint="Enter your tax code from your payslip or P60. If you're not sure, use 1257L."
          value={taxCode}
          onChange={handleTaxCodeChange}
          className="w-32"
        />

        <fieldset className="border-2 border-govuk-mid-grey p-4">
          <legend className="font-bold px-2 text-lg">Select your region</legend>
          <div className="space-y-3 mt-3">
            <label className="flex items-start gap-3">
              <input
                type="radio"
                name="region"
                value="england"
                checked={region === 'england'}
                onChange={handleRegionChange}
                className="mt-1 text-govuk-blue focus:ring-yellow-400"
              />
              <div>
                <div className="font-medium">England, Wales & Northern Ireland</div>
                <div className="text-sm text-govuk-dark-grey">Standard UK tax rates apply</div>
              </div>
            </label>
            
            <label className="flex items-start gap-3">
              <input
                type="radio"
                name="region"
                value="scotland"
                checked={region === 'scotland'}
                onChange={handleRegionChange}
                className="mt-1 text-govuk-blue focus:ring-yellow-400"
              />
              <div>
                <div className="font-medium">Scotland</div>
                <div className="text-sm text-govuk-dark-grey">Scottish Income Tax rates apply</div>
              </div>
            </label>
          </div>
        </fieldset>

        <div className="bg-govuk-light-blue border-l-4 border-govuk-blue p-4">
          <h3 className="font-bold mb-2">About tax codes</h3>
          <ul className="text-sm space-y-1">
            <li>• 1257L is the most common tax code for 2024-25</li>
            <li>• The number shows your tax-free Personal Allowance</li>
            <li>• L means you're entitled to the standard tax-free Personal Allowance</li>
            <li>• Check your payslip or contact HMRC if you're unsure</li>
          </ul>
        </div>
      </div>
    </div>
  );
}