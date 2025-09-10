import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SalaryWizard } from "@/components/SalaryWizard";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main id="main-content" className="container mx-auto px-4 py-12">
        <SalaryWizard />
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
