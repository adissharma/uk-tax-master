import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalculatorStore } from '@/store/calculatorStore';
import { formatCurrency } from '@/lib/calculator/engine';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { GOVUKButton } from '@/components/GOVUKButton';
import { ChevronLeft, Edit3 } from 'lucide-react';

const Results = () => {
  const navigate = useNavigate();
  const { inputs, result, isCalculating } = useCalculatorStore();

  // Redirect if no salary entered
  useEffect(() => {
    if (inputs.grossAnnualSalary === 0) {
      navigate('/');
    }
  }, [inputs.grossAnnualSalary, navigate]);

  if (isCalculating || !result) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <p>Calculating your results...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getAdjustmentsSummary = () => {
    const adjustments = [];
    
    if (inputs.studentLoanPlan !== 'none') {
      adjustments.push({ label: 'Student Loan Plan', value: `Plan ${inputs.studentLoanPlan}` });
    }
    
    if (inputs.hasPostgradLoan) {
      adjustments.push({ label: 'Postgraduate Loan', value: 'Yes' });
    }
    
    if (inputs.pensionContribution > 0) {
      adjustments.push({ 
        label: 'Pension Contribution', 
        value: `${inputs.pensionContribution}% ${inputs.salaryExchange ? '(Salary Exchange)' : ''}`
      });
    }
    
    if (inputs.region !== 'england') {
      adjustments.push({ label: 'Region', value: inputs.region === 'scotland' ? 'Scotland' : inputs.region });
    }
    
    return adjustments;
  };

  const adjustments = getAdjustmentsSummary();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <GOVUKButton
            variant="secondary"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Back to calculator
          </GOVUKButton>
        </div>

        <div className="space-y-8">
          {/* Results Header */}
          <div className="text-center">
            <p className="text-lg text-muted-foreground">
              Based on a gross yearly salary of {formatCurrency(inputs.grossAnnualSalary)}
            </p>
          </div>

          {/* Salary Calculation Results */}
          <div className="bg-white rounded-lg border border-muted p-8">
            <h2 className="govuk-heading-l mb-6">Here's what we calculated</h2>
            
            <div className="border border-muted rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted border-b border-muted">
                    <th className="text-left px-4 py-3 text-sm font-semibold text-muted-foreground">Item</th>
                    <th className="text-right px-4 py-3 text-sm font-semibold text-muted-foreground">Annual</th>
                    <th className="text-right px-4 py-3 text-sm font-semibold text-muted-foreground">Monthly</th>
                    <th className="text-right px-4 py-3 text-sm font-semibold text-muted-foreground">Weekly</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Gross Salary */}
                  <tr className="border-b border-muted/50 hover:bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-foreground">Gross yearly salary</th>
                    <td className="text-right px-4 py-3 font-medium text-primary">
                      {formatCurrency(result.gross.annual)}
                    </td>
                    <td className="text-right px-4 py-3 font-medium text-primary">
                      {formatCurrency(result.gross.monthly)}
                    </td>
                    <td className="text-right px-4 py-3 font-medium text-primary">
                      {formatCurrency(result.gross.weekly)}
                    </td>
                  </tr>
                  
                  {/* Deductions */}
                  <tr className="border-b border-muted/50 hover:bg-muted/30">
                    <th className="text-left px-4 py-3 text-foreground">Income tax</th>
                    <td className="text-right px-4 py-3 text-destructive">
                      -{formatCurrency(result.incomeTax.annual)}
                    </td>
                    <td className="text-right px-4 py-3 text-destructive">
                      -{formatCurrency(result.incomeTax.monthly)}
                    </td>
                    <td className="text-right px-4 py-3 text-destructive">
                      -{formatCurrency(result.incomeTax.annual / 52)}
                    </td>
                  </tr>

                  <tr className="border-b border-muted/50 hover:bg-muted/30">
                    <th className="text-left px-4 py-3 text-foreground">National Insurance</th>
                    <td className="text-right px-4 py-3 text-destructive">
                      -{formatCurrency(result.nationalInsurance.employee.annual)}
                    </td>
                    <td className="text-right px-4 py-3 text-destructive">
                      -{formatCurrency(result.nationalInsurance.employee.monthly)}
                    </td>
                    <td className="text-right px-4 py-3 text-destructive">
                      -{formatCurrency(result.nationalInsurance.employee.annual / 52)}
                    </td>
                  </tr>

                  {result.studentLoan.annual > 0 && (
                    <tr className="border-b border-muted/50 hover:bg-muted/30">
                      <th className="text-left px-4 py-3 text-foreground">Student loan</th>
                      <td className="text-right px-4 py-3 text-destructive">
                        -{formatCurrency(result.studentLoan.annual)}
                      </td>
                      <td className="text-right px-4 py-3 text-destructive">
                        -{formatCurrency(result.studentLoan.monthly)}
                      </td>
                      <td className="text-right px-4 py-3 text-destructive">
                        -{formatCurrency(result.studentLoan.annual / 52)}
                      </td>
                    </tr>
                  )}

                  {result.pension.employee.annual > 0 && (
                    <tr className="border-b border-muted/50 hover:bg-muted/30">
                      <th className="text-left px-4 py-3 text-foreground">Pension</th>
                      <td className="text-right px-4 py-3 text-destructive">
                        -{formatCurrency(result.pension.employee.annual)}
                      </td>
                      <td className="text-right px-4 py-3 text-destructive">
                        -{formatCurrency(result.pension.employee.monthly)}
                      </td>
                      <td className="text-right px-4 py-3 text-destructive">
                        -{formatCurrency(result.pension.employee.annual / 52)}
                      </td>
                    </tr>
                  )}

                  {/* Take-home Pay - highlighted result */}
                  <tr className="bg-success/10 border-t-2 border-success/30">
                    <th className="text-left px-4 py-4 font-bold text-lg text-foreground">Your take-home pay</th>
                    <td className="text-right px-4 py-4 font-bold text-lg text-success">
                      {formatCurrency(result.net.annual)}
                    </td>
                    <td className="text-right px-4 py-4 font-bold text-lg text-success">
                      {formatCurrency(result.net.monthly)}
                    </td>
                    <td className="text-right px-4 py-4 font-bold text-lg text-success">
                      {formatCurrency(result.net.weekly)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Adjustments Summary */}
          {adjustments.length > 0 && (
            <div className="bg-white rounded-lg border border-muted p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="govuk-heading-l mb-0">What you've told us</h2>
                <GOVUKButton
                  variant="secondary"
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2"
                >
                  <Edit3 size={16} />
                  Change these details
                </GOVUKButton>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adjustments.map((adjustment, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded">
                    <span className="font-medium text-foreground">{adjustment.label}</span>
                    <span className="text-muted-foreground">{adjustment.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GOVUKButton
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Edit3 size={16} />
              Try a different salary
            </GOVUKButton>
            <GOVUKButton
              variant="secondary"
              onClick={() => window.print()}
            >
              Print results
            </GOVUKButton>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Results;