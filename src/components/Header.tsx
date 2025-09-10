import { useCalculatorStore } from '@/store/calculatorStore';

export function Header() {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <a
        href="#main-content" 
        className="skip-link"
      >
        Skip to main content
      </a>
      
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center">
          {/* Logo on the left */}
          <div className="flex items-center">
            <h1 className="heading-lg text-foreground mb-0">
              UK Salary Calculator
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}