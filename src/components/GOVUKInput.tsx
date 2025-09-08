import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface GOVUKInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
}

const GOVUKInput = forwardRef<HTMLInputElement, GOVUKInputProps>(
  ({ className, label, hint, error, prefix, suffix, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="govuk-form-group">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-lg font-bold mb-2 text-govuk-black"
          >
            {label}
          </label>
        )}
        
        {hint && (
          <div className="text-govuk-dark-grey mb-2">
            {hint}
          </div>
        )}
        
        {error && (
          <div className="text-govuk-red font-bold mb-2">
            <span className="govuk-visually-hidden">Error:</span>
            {error}
          </div>
        )}
        
        <div className="relative">
          {prefix && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-govuk-dark-grey text-lg font-bold">{prefix}</span>
            </div>
          )}
          
          <input
            id={inputId}
            className={cn(
              'block w-full px-3 py-2 text-lg border-2 border-govuk-black',
              'focus:ring-4 focus:ring-yellow-400 focus:border-govuk-black focus:outline-none',
              'disabled:bg-govuk-light-grey disabled:text-govuk-dark-grey disabled:cursor-not-allowed',
              error ? 'border-govuk-red' : 'border-govuk-black',
              prefix ? 'pl-8' : '',
              suffix ? 'pr-12' : '',
              className
            )}
            ref={ref}
            {...props}
          />
          
          {suffix && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-govuk-dark-grey text-lg">{suffix}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

GOVUKInput.displayName = 'GOVUKInput';

export { GOVUKInput };