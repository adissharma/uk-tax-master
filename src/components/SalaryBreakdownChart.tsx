import { CalculationResult } from '@/lib/calculator/types';
import { formatCurrency } from '@/lib/calculator/engine';

interface SalaryBreakdownChartProps {
  result: CalculationResult;
}

export function SalaryBreakdownChart({ result }: SalaryBreakdownChartProps) {
  const gross = result.gross.annual;
  
  // Calculate the breakdown
  const items = [
    {
      label: 'Take-home pay',
      amount: result.net.annual,
      color: 'bg-success',
      percentage: (result.net.annual / gross) * 100,
    },
    {
      label: 'Income tax',
      amount: result.incomeTax.annual,
      color: 'bg-destructive',
      percentage: (result.incomeTax.annual / gross) * 100,
    },
    {
      label: 'National Insurance',
      amount: result.nationalInsurance.employee.annual,
      color: 'bg-primary',
      percentage: (result.nationalInsurance.employee.annual / gross) * 100,
    },
  ];

  // Add optional items if they exist
  if (result.studentLoan.annual > 0) {
    items.push({
      label: 'Student loan',
      amount: result.studentLoan.annual,
      color: 'bg-warning',
      percentage: (result.studentLoan.annual / gross) * 100,
    });
  }

  if (result.pension.employee.annual > 0) {
    items.push({
      label: 'Pension contribution',
      amount: result.pension.employee.annual,
      color: 'bg-accent',
      percentage: (result.pension.employee.annual / gross) * 100,
    });
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Salary breakdown</h3>
      
      {/* Horizontal stacked bar */}
      <div className="w-full bg-muted rounded-lg h-12 flex overflow-hidden">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={`${item.color} h-full flex items-center justify-center text-white text-sm font-medium`}
            style={{ width: `${item.percentage}%` }}
            title={`${item.label}: ${formatCurrency(item.amount)} (${item.percentage.toFixed(1)}%)`}
          >
            {item.percentage > 15 && formatCurrency(item.amount)}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-4 h-4 ${item.color} rounded`}></div>
            <div>
              <div className="font-medium">{item.label}</div>
              <div className="text-muted-foreground">{formatCurrency(item.amount)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}