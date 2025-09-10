import { useCalculatorStore } from '@/store/calculatorStore';

export function Header() {
  const { currentStep } = useCalculatorStore();
  
  const steps = [
    { id: 1, label: 'Salary' },
    { id: 2, label: 'Adjustments' },
    { id: 3, label: 'Results' }
  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <a
        href="#main-content" 
        className="skip-link"
      >
        Skip to main content
      </a>
      
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo on the left */}
          <div className="flex items-center">
            <h1 className="heading-lg text-foreground mb-0">
              UK Salary Calculator
            </h1>
          </div>
          
          {/* Progress steps in the center-right */}
          <div className="flex items-center gap-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-3">
                  <span className={`body-sm font-medium ${
                    step.id === currentStep 
                      ? 'text-foreground' 
                      : step.id < currentStep 
                        ? 'text-muted-foreground' 
                        : 'text-muted-foreground/60'
                  }`}>
                    {step.label}
                  </span>
                  {step.id === currentStep && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-6 h-px bg-border ml-6" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}