import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalculatorStore } from '@/store/calculatorStore';
import { PinterestCard } from './PinterestCard';
import { PinterestButton } from './PinterestButton';
import { SalaryCalculator } from './SalaryCalculator';
import { VerticalTabs } from './VerticalTabs';
import { TaxCodeTab } from './tabs/TaxCodeTab';
import { StudentLoanTab } from './tabs/StudentLoanTab';
import { PensionTab } from './tabs/PensionTab';
import { SummaryTab } from './tabs/SummaryTab';

export function SalaryWizard() {
  const navigate = useNavigate();
  const { 
    currentStep, 
    activeTab, 
    setActiveTab, 
    nextStep, 
    previousStep, 
    inputs,
    result,
    calculate,
    isCalculating 
  } = useCalculatorStore();

  // Initialize from URL hash on mount for step 2
  useEffect(() => {
    if (currentStep === 2) {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setActiveTab(hash);
      }
    }
  }, [setActiveTab, currentStep]);

  const tabs = [
    {
      id: 'tax-code',
      label: 'Tax Code',
      content: <TaxCodeTab />,
      isActive: true, // Tax code is always active
    },
    {
      id: 'student-loan',
      label: 'Student Loan',
      content: <StudentLoanTab />,
      isActive: inputs.studentLoanPlan !== 'none' || inputs.hasPostgradLoan,
    },
    {
      id: 'pension',
      label: 'Pension',
      content: <PensionTab />,
      isActive: inputs.pensionContribution > 0,
    },
    {
      id: 'bonus',
      label: 'Bonus',
      content: (
        <div className="space-y-4">
          <h2 className="heading-lg">Bonus payments</h2>
          <div className="bg-muted border-l-4 border-muted-foreground p-4 rounded-lg">
            <p className="body-md">Bonus calculation features will be available in the next update.</p>
            <p className="body-sm mt-2">Add one-off payments and bonuses to see their tax impact.</p>
          </div>
        </div>
      ),
      isActive: false, // Not implemented yet
    },
    {
      id: 'overtime',
      label: 'Overtime',
      content: (
        <div className="space-y-4">
          <h2 className="heading-lg">Overtime payments</h2>
          <div className="bg-muted border-l-4 border-muted-foreground p-4 rounded-lg">
            <p className="body-md">Overtime calculation features will be available in the next update.</p>
            <p className="body-sm mt-2">Calculate tax on overtime and additional hours worked.</p>
          </div>
        </div>
      ),
      isActive: false, // Not implemented yet
    },
    {
      id: 'childcare',
      label: 'Childcare',
      content: (
        <div className="space-y-4">
          <h2 className="heading-lg">Childcare vouchers</h2>
          <div className="bg-muted border-l-4 border-muted-foreground p-4 rounded-lg">
            <p className="body-md">Childcare voucher calculations will be available in the next update.</p>
            <p className="body-sm mt-2">Include childcare vouchers and salary sacrifice schemes.</p>
          </div>
        </div>
      ),
      isActive: false, // Not implemented yet
    },
    {
      id: 'salary-sacrifice',
      label: 'Salary Sacrifice',
      content: (
        <div className="space-y-4">
          <h2 className="heading-lg">Salary sacrifice schemes</h2>
          <div className="bg-muted border-l-4 border-muted-foreground p-4 rounded-lg">
            <p className="body-md">Additional salary sacrifice options will be available in the next update.</p>
            <p className="body-sm mt-2">Beyond pensions - cycle to work, electric cars, etc.</p>
          </div>
        </div>
      ),
      isActive: inputs.salaryExchange, // Active if salary exchange is enabled
    },
    {
      id: 'taxable-benefits',
      label: 'Taxable Benefits',
      content: (
        <div className="space-y-4">
          <h2 className="heading-lg">Benefits in kind</h2>
          <div className="bg-muted border-l-4 border-muted-foreground p-4 rounded-lg">
            <p className="body-md">Taxable benefits calculations will be available in the next update.</p>
            <p className="body-sm mt-2">Company cars, medical insurance, and other taxable benefits.</p>
          </div>
        </div>
      ),
      isActive: false, // Not implemented yet
    },
    {
      id: 'additional-options',
      label: 'Additional Options',
      content: (
        <div className="space-y-4">
          <h2 className="heading-lg">Additional calculation options</h2>
          <div className="bg-muted border-l-4 border-muted-foreground p-4 rounded-lg">
            <p className="body-md">Advanced options will be available in the next update.</p>
            <p className="body-sm mt-2">Marriage allowance, blind person's allowance, and other adjustments.</p>
          </div>
        </div>
      ),
      isActive: false, // Not implemented yet
    },
  ];

  const handleNext = () => {
    if (currentStep === 1 && inputs.grossAnnualSalary > 0) {
      nextStep();
    } else if (currentStep === 2) {
      calculate();
      nextStep();
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return inputs.grossAnnualSalary > 0;
    if (currentStep === 2) return true;
    return false;
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Enter your salary';
      case 2: return 'Add adjustments (optional)';
      case 3: return 'Your salary breakdown';
      default: return 'Salary Calculator';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <SalaryCalculator />;
      case 2:
        return (
          <VerticalTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        );
      case 3:
        return result ? <SummaryTab /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PinterestCard className="p-6 lg:p-8">
        {/* Step Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-10 h-10 border-2 border-primary text-primary bg-transparent rounded-full text-sm font-semibold">
              {currentStep}
            </span>
            <h1 className="heading-xl mb-0">{getStepTitle()}</h1>
          </div>
          
          {/* Step Progress */}
          <div className="flex gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  step === currentStep 
                    ? 'bg-primary' 
                    : step < currentStep 
                      ? 'bg-primary/60' 
                      : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-border">
          <div>
            {currentStep > 1 && (
              <PinterestButton
                variant="outline"
                onClick={previousStep}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </PinterestButton>
            )}
          </div>

          <div>
            {currentStep < 3 ? (
              <PinterestButton
                onClick={handleNext}
                disabled={!canProceed() || isCalculating}
              >
                {currentStep === 1 ? 'Continue' : 'Calculate'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </PinterestButton>
            ) : (
              <PinterestButton
                onClick={() => navigate('/')}
                variant="outline"
              >
                Start Over
              </PinterestButton>
            )}
          </div>
        </div>
      </PinterestCard>
    </div>
  );
}