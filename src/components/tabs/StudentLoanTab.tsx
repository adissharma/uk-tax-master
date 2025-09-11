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
      <div>
        <h2 className="heading-lg">Student loan repayment plan</h2>
        <fieldset className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-start gap-3">
              <input
                type="radio"
                name="studentLoanPlan"
                value="none"
                checked={inputs.studentLoanPlan === 'none'}
                onChange={() => handlePlanChange('none')}
                className="mt-1 text-primary focus:ring-primary"
              />
              <div>
                <div className="font-medium">No student loan</div>
                <div className="text-sm text-muted-foreground">I don't have a student loan or have finished repaying it</div>
              </div>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="radio"
                name="studentLoanPlan"
                value="plan1"
                checked={inputs.studentLoanPlan === 'plan1'}
                onChange={() => handlePlanChange('plan1')}
                className="mt-1 text-primary focus:ring-primary"
              />
              <div>
                <div className="font-medium">Repayment Plan 1</div>
                <div className="text-sm text-muted-foreground">
                  Started before September 2012 in England/Wales, or before September 2016 in Northern Ireland
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="radio"
                name="studentLoanPlan"
                value="plan2"
                checked={inputs.studentLoanPlan === 'plan2'}
                onChange={() => handlePlanChange('plan2')}
                className="mt-1 text-primary focus:ring-primary"
              />
              <div>
                <div className="font-medium">Repayment Plan 2</div>
                <div className="text-sm text-muted-foreground">
                  Started after September 2012 in England/Wales, or after September 2016 in Northern Ireland
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="radio"
                name="studentLoanPlan"
                value="plan4"
                checked={inputs.studentLoanPlan === 'plan4'}
                onChange={() => handlePlanChange('plan4')}
                className="mt-1 text-primary focus:ring-primary"
              />
              <div>
                <div className="font-medium">Repayment Plan 4 (Scotland)</div>
                <div className="text-sm text-muted-foreground">
                  Started at a Scottish university or college
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={inputs.hasPostgradLoan === true}
                onChange={(e) => handlePostgradChange(e.target.checked)}
                className="mt-1 text-primary focus:ring-primary"
              />
              <div>
                <div className="font-medium">Postgraduate Loan</div>
                <div className="text-sm text-muted-foreground">
                  For Master's or Doctoral degree courses
                </div>
              </div>
            </label>
          </div>
        </fieldset>
      </div>
    </div>
  );
}