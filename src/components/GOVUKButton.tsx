import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface GOVUKButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'warning' | 'link';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
}

const GOVUKButton = forwardRef<HTMLButtonElement, GOVUKButtonProps>(
  ({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-bold transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none',
          'border-2 focus:ring-4 focus:ring-yellow-400 focus:ring-offset-0',
          
          // Variants
          {
            'bg-govuk-green text-white border-govuk-green hover:bg-green-700 hover:border-green-700 focus:bg-yellow-400 focus:text-govuk-black focus:border-govuk-black': variant === 'primary',
            'bg-govuk-light-grey text-govuk-black border-govuk-light-grey hover:bg-govuk-mid-grey hover:border-govuk-mid-grey': variant === 'secondary',
            'bg-govuk-orange text-govuk-black border-govuk-orange hover:bg-orange-600 hover:text-white': variant === 'warning',
            'bg-transparent text-govuk-blue border-transparent hover:text-govuk-black hover:bg-govuk-light-grey underline': variant === 'link',
          },
          
          // Sizes
          {
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'default',
            'px-8 py-4 text-lg': size === 'lg',
          },
          
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GOVUKButton.displayName = 'GOVUKButton';

export { GOVUKButton };