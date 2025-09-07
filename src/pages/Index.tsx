import { useEffect } from 'react';
import { useCalculatorStore } from '@/store/calculatorStore';
import { GOVUKHeader } from '@/components/GOVUKHeader';
import { GOVUKFooter } from '@/components/GOVUKFooter';
import { SalaryInput } from '@/components/SalaryInput';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { VerticalTabs } from '@/components/VerticalTabs';
import { TaxCodeTab } from '@/components/tabs/TaxCodeTab';
import { StudentLoanTab } from '@/components/tabs/StudentLoanTab';
import { PensionTab } from '@/components/tabs/PensionTab';

const Index = () => {
  const { activeTab, setActiveTab } = useCalculatorStore();

  // Initialize from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setActiveTab(hash);
    }
  }, [setActiveTab]);

  const tabs = [
    {
      id: 'tax-code',
      label: 'Tax Code',
      content: <TaxCodeTab />,
    },
    {
      id: 'student-loan',
      label: 'Student Loan',
      content: <StudentLoanTab />,
    },
    {
      id: 'pension',
      label: 'Pension',
      content: <PensionTab />,
    },
    {
      id: 'bonus',
      label: 'Bonus',
      content: (
        <div className="space-y-4">
          <h2 className="govuk-heading-l">Bonus payments</h2>
          <div className="bg-govuk-light-grey border-l-4 border-govuk-dark-grey p-4">
            <p>Bonus calculation features will be available in the next update.</p>
            <p className="mt-2 text-sm">Add one-off payments and bonuses to see their tax impact.</p>
          </div>
        </div>
      ),
    },
    {
      id: 'overtime',
      label: 'Overtime',
      content: (
        <div className="space-y-4">
          <h2 className="govuk-heading-l">Overtime payments</h2>
          <div className="bg-govuk-light-grey border-l-4 border-govuk-dark-grey p-4">
            <p>Overtime calculation features will be available in the next update.</p>
            <p className="mt-2 text-sm">Calculate tax on overtime and additional hours worked.</p>
          </div>
        </div>
      ),
    },
    {
      id: 'childcare',
      label: 'Childcare',
      content: (
        <div className="space-y-4">
          <h2 className="govuk-heading-l">Childcare vouchers</h2>
          <div className="bg-govuk-light-grey border-l-4 border-govuk-dark-grey p-4">
            <p>Childcare voucher calculations will be available in the next update.</p>
            <p className="mt-2 text-sm">Include childcare vouchers and salary sacrifice schemes.</p>
          </div>
        </div>
      ),
    },
    {
      id: 'salary-sacrifice',
      label: 'Salary Sacrifice',
      content: (
        <div className="space-y-4">
          <h2 className="govuk-heading-l">Salary sacrifice schemes</h2>
          <div className="bg-govuk-light-grey border-l-4 border-govuk-dark-grey p-4">
            <p>Additional salary sacrifice options will be available in the next update.</p>
            <p className="mt-2 text-sm">Beyond pensions - cycle to work, electric cars, etc.</p>
          </div>
        </div>
      ),
    },
    {
      id: 'taxable-benefits',
      label: 'Taxable Benefits',
      content: (
        <div className="space-y-4">
          <h2 className="govuk-heading-l">Benefits in kind</h2>
          <div className="bg-govuk-light-grey border-l-4 border-govuk-dark-grey p-4">
            <p>Taxable benefits calculations will be available in the next update.</p>
            <p className="mt-2 text-sm">Company cars, medical insurance, and other taxable benefits.</p>
          </div>
        </div>
      ),
    },
    {
      id: 'additional-options',
      label: 'Additional Options',
      content: (
        <div className="space-y-4">
          <h2 className="govuk-heading-l">Additional calculation options</h2>
          <div className="bg-govuk-light-grey border-l-4 border-govuk-dark-grey p-4">
            <p>Advanced options will be available in the next update.</p>
            <p className="mt-2 text-sm">Marriage allowance, blind person's allowance, and other adjustments.</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <GOVUKHeader />
      
      {/* Main content */}
      <main id="main-content" className="max-w-6xl mx-auto">
        {/* Salary Input Section */}
        <SalaryInput />
        
        {/* Results Display */}
        <div className="px-4">
          <ResultsDisplay />
        </div>
        
        {/* Settings Tabs */}
        <div className="px-4 pb-8">
          <h2 className="govuk-heading-l mb-6">Adjust your calculation</h2>
          <VerticalTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </main>
      
      <GOVUKFooter />
    </div>
  );
};

export default Index;
