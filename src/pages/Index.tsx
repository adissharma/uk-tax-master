import { SalaryWizard } from "@/components/SalaryWizard";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <main id="main-content" className="container mx-auto px-4 py-8">
        <SalaryWizard />
      </main>

      <div className="container mx-auto px-4 py-8 text-center">
        <p className="body-sm text-muted-foreground">
          Calculations based on 2024-25 UK tax rates and thresholds
        </p>
      </div>
    </div>
  );
}