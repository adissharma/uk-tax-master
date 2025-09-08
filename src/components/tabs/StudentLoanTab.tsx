import { useCalculatorStore } from '@/store/calculatorStore';

export function StudentLoanTab() {
  const { inputs, updateInputs } = useCalculatorStore();

  const handlePlanChange = (plan: string) => {
    updateInputs({ 
      studentLoanPlan: plan === 'none' ? 'none' : plan as 'plan1' | 'plan2' | 'plan4'
    });
  };

  const handlePostgradChange = (hasPostgrad: boolean) => {
    updateInputs({ hasPostgradLoan: hasPostgrad });
  };

  return (
    <div className="space-y-6">
      <h2 className="govuk-heading-l">Student loan repayments</h2>
      
      {/* <div className="bg-govuk-light-grey border-l-4 border-govuk-dark-grey p-4">
        <p className="text-sm">
          If you're still repaying your Student Loan, please select the repayment option that applies to you.
        </p>
      </div> */}

      <fieldset className="space-y-4">
        <legend className="font-bold text-lg mb-4">Student loan repayment plan</legend>
        
        <div className="space-y-3">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={inputs.studentLoanPlan === 'none'}
              onChange={() => handlePlanChange('none')}
              className="mt-1 text-govuk-blue focus:ring-yellow-400"
            />
            <div>
              <div className="font-medium">No student loan</div>
              <div className="text-sm text-govuk-dark-grey">I don't have a student loan or have finished repaying it</div>
            </div>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={inputs.studentLoanPlan === 'plan1'}
              onChange={() => handlePlanChange('plan1')}
              className="mt-1 text-govuk-blue focus:ring-yellow-400"
            />
            <div>
              <div className="font-medium">Repayment Plan 1</div>
              <div className="text-sm text-govuk-dark-grey">
                Started before September 2012 in England/Wales, or before September 2016 in Northern Ireland
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={inputs.studentLoanPlan === 'plan2'}
              onChange={() => handlePlanChange('plan2')}
              className="mt-1 text-govuk-blue focus:ring-yellow-400"
            />
            <div>
              <div className="font-medium">Repayment Plan 2</div>
              <div className="text-sm text-govuk-dark-grey">
                Started after September 2012 in England/Wales, or after September 2016 in Northern Ireland
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={inputs.studentLoanPlan === 'plan4'}
              onChange={() => handlePlanChange('plan4')}
              className="mt-1 text-govuk-blue focus:ring-yellow-400"
            />
            <div>
              <div className="font-medium">Repayment Plan 4 (Scotland)</div>
              <div className="text-sm text-govuk-dark-grey">
                Started at a Scottish university or college
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={inputs.hasPostgradLoan === true}
              onChange={(e) => handlePostgradChange(e.target.checked)}
              className="mt-1 text-govuk-blue focus:ring-yellow-400"
            />
            <div>
              <div className="font-medium">Postgraduate Loan</div>
              <div className="text-sm text-govuk-dark-grey">
                For Master's or Doctoral degree courses
              </div>
            </div>
          </label>
        </div>
      </fieldset>

      {/* <div className="bg-govuk-light-blue border-l-4 border-govuk-blue p-4">
        <h3 className="font-bold mb-2">Student loan repayment rates (2024-25)</h3>
        <ul className="text-sm space-y-1">
          <li>• <strong>Plan 1:</strong> 9% on income over £22,015</li>
          <li>• <strong>Plan 2:</strong> 9% on income over £27,295</li>
          <li>• <strong>Plan 4:</strong> 9% on income over £31,395</li>
          <li>• <strong>Postgraduate:</strong> 6% on income over £21,000</li>
        </ul>
      </div> */}
    </div>
  );
}