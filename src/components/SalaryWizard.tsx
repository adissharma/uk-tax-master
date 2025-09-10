import { useState } from 'react';
import { useCalculatorStore } from '@/store/calculatorStore';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { SalaryCalculator } from './SalaryCalculator';
import Results from '@/pages/Results';

export function SalaryWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [salary, setSalary] = useState('');
  
  const { updateInputs, calculate } = useCalculatorStore();

  const handleNext = () => {
    if (currentStep === 1) {
      updateInputs({ grossAnnualSalary: parseFloat(salary) });
      setCurrentStep(2);
    } else if (currentStep === 2) {
      calculate();
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="heading-xl mb-3">Enter your salary</h2>
        <p className="body-md text-muted-foreground">
          Tell us your annual gross salary to get started
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="salary" className="body-sm font-medium text-foreground mb-3 block">
            Annual gross salary
          </label>
          <Input
            id="salary"
            type="number"
            placeholder="50,000"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="wise-input text-lg"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleNext}
          disabled={!salary || parseFloat(salary) <= 0}
          className="wise-button wise-button-primary w-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="heading-xl mb-3">Add adjustments</h2>
        <p className="body-sm text-muted-foreground mb-6 bg-muted rounded-lg px-4 py-2 inline-block">
          Annual salary: £{parseFloat(salary).toLocaleString()}
        </p>
        <p className="body-md text-muted-foreground">
          Customize your calculation with additional details
        </p>
      </div>
      
      <SalaryCalculator />

      <div className="flex gap-3">
        <Button 
          variant="outline"
          onClick={handlePrevious}
          className="wise-button wise-button-secondary flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={handleNext}
          className="wise-button wise-button-primary flex-1"
        >
          Calculate
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="heading-xl mb-3">Your results</h2>
        <p className="body-md text-muted-foreground">
          Here's your salary breakdown
        </p>
      </div>
      
      <Results />

      <div className="flex gap-3">
        <Button 
          variant="outline"
          onClick={handlePrevious}
          className="wise-button wise-button-secondary flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={() => {
            setCurrentStep(1);
            setSalary('');
          }}
          className="wise-button wise-button-primary flex-1"
        >
          Start Over
        </Button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      default: return renderStep1();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  stepNum === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : stepNum < currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {stepNum}
              </div>
              {stepNum < 3 && (
                <div className={`w-8 h-0.5 mx-2 ${stepNum < currentStep ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main card */}
      <Card className="wise-card">
        <CardContent className="p-0">
          {renderCurrentStep()}
        </CardContent>
      </Card>
    </div>
  );
}