import { useEffect } from 'react';
import { useCalculatorStore } from '@/store/calculatorStore';
import { GOVUKHeader } from '@/components/GOVUKHeader';
import { GOVUKFooter } from '@/components/GOVUKFooter';
import { SalaryInput } from '@/components/SalaryInput';
import { VerticalTabs } from '@/components/VerticalTabs';
import { SummaryTab } from '@/components/tabs/SummaryTab';
import { BreakdownTab } from '@/components/tabs/BreakdownTab';
import { IncomeTaxTab } from '@/components/tabs/IncomeTaxTab';
import { NationalInsuranceTab } from '@/components/tabs/NationalInsuranceTab';

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
      id: 'summary',
      label: 'Take-home summary',
      content: <SummaryTab />,
    },
    {
      id: 'breakdown',
      label: 'Monthly / Weekly / Daily / Hourly',
      content: <BreakdownTab />,
    },
    {
      id: 'income-tax',
      label: 'Income Tax breakdown',
      content: <IncomeTaxTab />,
    },
    {
      id: 'national-insurance',
      label: 'National Insurance breakdown',
      content: <NationalInsuranceTab />,
    },
    {
      id: 'student-loan',
      label: 'Student loan',
      content: (
        <div className="space-y-4">
          <h2 className="govuk-heading-l">Student loan repayments</h2>
          <div className="bg-govuk-light-grey border-l-4 border-govuk-dark-grey p-4">
            <p>Student loan calculations will be available in the next update.</p>
            <p className="mt-2 text-sm">Configure your student loan plan in the advanced options above.</p>
          </div>
        </div>
      ),
    },
    {
      id: 'pension',
      label: 'Pension contributions',
      content: (
        <div className="space-y-4">
          <h2 className="govuk-heading-l">Pension breakdown</h2>
          <div className="bg-govuk-light-grey border-l-4 border-govuk-dark-grey p-4">
            <p>Detailed pension calculations will be available in the next update.</p>
            <p className="mt-2 text-sm">Basic pension calculations are included in the summary.</p>
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
        
        {/* Calculator Results */}
        <div className="px-4 pb-8">
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
