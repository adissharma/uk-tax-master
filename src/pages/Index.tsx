import { useEffect } from 'react';
import { useCalculatorStore } from '@/store/calculatorStore';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SalaryCalculator } from "@/components/SalaryCalculator";
import { VerticalTabs } from '@/components/VerticalTabs';
import { TaxCodeTab } from '@/components/tabs/TaxCodeTab';
import { StudentLoanTab } from '@/components/tabs/StudentLoanTab';
import { PensionTab } from '@/components/tabs/PensionTab';
import { PinterestCard } from '@/components/PinterestCard';

export default function Index() {
  const { activeTab, setActiveTab, inputs } = useCalculatorStore();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      
      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Desktop: Side by side, Mobile/Tablet: Stacked */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-stretch">
            {/* Step 1: Salary Input */}
            <div className="lg:w-1/4">
              <PinterestCard className="p-6 lg:p-8 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex items-center justify-center w-10 h-10 border-2 border-primary text-primary bg-transparent rounded-full text-sm font-semibold">
                    1
                  </span>
                  <h2 className="heading-lg mb-0">Enter your salary</h2>
                </div>
                <SalaryCalculator />
              </PinterestCard>
            </div>

            {/* Step 2: Calculation Settings */}
            <div className="lg:w-3/4">
              <PinterestCard className="p-6 lg:p-8 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex items-center justify-center w-10 h-10 border-2 border-primary text-primary bg-transparent rounded-full text-sm font-semibold">
                    2
                  </span>
                  <h2 className="heading-lg mb-0">Add adjustments (optional)</h2>
                </div>
                <VerticalTabs
                  tabs={tabs}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </PinterestCard>
            </div>
          </div>
        </div>
      </main>

      <div className="container mx-auto px-4 py-8 text-center">
        <p className="body-sm text-muted-foreground">
          Calculations based on 2024-25 UK tax rates and thresholds
        </p>
      </div>
      
      <Footer />
    </div>
  );
}
