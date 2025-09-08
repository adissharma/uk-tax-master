import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface MaterialInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
  variant?: 'filled' | 'outlined';
}

const MaterialInput = forwardRef<HTMLInputElement, MaterialInputProps>(
  ({ className, label, hint, error, prefix, suffix, variant = 'outlined', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="md-form-group">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-body-small font-medium mb-1 text-md-on-surface"
          >
            {label}
          </label>
        )}
        
        {hint && (
          <div className="text-body-small text-md-on-surface-variant mb-2">
            {hint}
          </div>
        )}
        
        {error && (
          <div className="text-body-small text-md-error font-medium mb-2">
            <span className="sr-only">Error:</span>
            {error}
          </div>
        )}
        
        <div className="relative">
          {prefix && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <span className="text-md-on-surface-variant text-body-large">{prefix}</span>
            </div>
          )}
          
          <input
            id={inputId}
            className={cn(
              'block w-full px-4 py-3 text-body-large transition-colors',
              'focus:outline-none focus:md-focus',
              'disabled:bg-md-surface-variant disabled:text-md-on-surface disabled:opacity-38 disabled:cursor-not-allowed',
              {
                'bg-md-surface-container-highest rounded-t-md border-b-2 border-md-outline focus:border-md-primary': variant === 'filled',
                'bg-transparent rounded-md border border-md-outline focus:border-2 focus:border-md-primary': variant === 'outlined',
              },
              error ? (variant === 'filled' ? 'border-b-md-error focus:border-b-md-error' : 'border-md-error focus:border-md-error') : '',
              prefix ? 'pl-12' : '',
              suffix ? 'pr-12' : '',
              className
            )}
            ref={ref}
            {...props}
          />
          
          {suffix && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <span className="text-md-on-surface-variant text-body-large">{suffix}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

MaterialInput.displayName = 'MaterialInput';

export { MaterialInput };