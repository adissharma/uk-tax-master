import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface PinterestInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
}

const PinterestInput = forwardRef<HTMLInputElement, PinterestInputProps>(
  ({ className, label, hint, error, prefix, suffix, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-base font-medium text-foreground"
          >
            {label}
          </label>
        )}
        
        {hint && (
          <div className="text-sm text-muted-foreground">
            {hint}
          </div>
        )}
        
        {error && (
          <div className="text-sm text-destructive font-medium">
            <span className="sr-only">Error:</span>
            {error}
          </div>
        )}
        
        <div className="relative">
          {prefix && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-muted-foreground text-base font-medium">{prefix}</span>
            </div>
          )}
          
          <input
            id={inputId}
            className={cn(
              'w-full px-4 py-3 rounded-2xl border-2 border-gray-300 bg-background text-foreground',
              'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
              'transition-colors duration-200 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed',
              error ? 'border-destructive' : 'border-gray-300',
              prefix ? 'pl-10' : '',
              suffix ? 'pr-12' : '',
              className
            )}
            ref={ref}
            {...props}
          />
          
          {suffix && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-muted-foreground text-base">{suffix}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

PinterestInput.displayName = 'PinterestInput';

export { PinterestInput };