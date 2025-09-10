import { useCalculatorStore } from '@/store/calculatorStore';
import { Banknote, Settings, BarChart3 } from 'lucide-react';

export function Header() {
  const { currentStep } = useCalculatorStore();
  
  const steps = [
    { id: 1, label: 'Salary', icon: Banknote },
    { id: 2, label: 'Adjustments', icon: Settings },
    { id: 3, label: 'Results', icon: BarChart3 }
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
          
          {/* Centered Progress steps */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      step.id === currentStep 
                        ? 'border-primary bg-primary text-primary-foreground' 
                        : step.id < currentStep 
                          ? 'border-primary bg-primary text-primary-foreground' 
                          : 'border-muted-foreground/30 text-muted-foreground'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-medium ${
                      step.id === currentStep 
                        ? 'text-foreground' 
                        : step.id < currentStep 
                          ? 'text-muted-foreground' 
                          : 'text-muted-foreground/60'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-16 h-px bg-border ml-8 mr-4" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}