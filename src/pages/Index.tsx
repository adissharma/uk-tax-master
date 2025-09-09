import { SalaryCalculator } from "@/components/SalaryCalculator";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <main id="main-content" className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="display-xl mb-6">
            UK Salary Calculator 2024-25
          </h1>
          <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your take-home pay with our comprehensive UK salary calculator. 
            Get accurate breakdowns including tax, National Insurance, student loans, and pension contributions.
          </p>
        </div>
        
        <SalaryCalculator />
        
        <div className="mt-16 text-center">
          <p className="body-sm text-muted-foreground">
            Calculations based on 2024-25 UK tax rates and thresholds
          </p>
        </div>
      </main>
    </div>
  );
}
