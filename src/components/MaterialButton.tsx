import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface MaterialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
}

const MaterialButton = forwardRef<HTMLButtonElement, MaterialButtonProps>(
  ({ className, variant = 'filled', size = 'default', children, ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles - Material Design 3
          'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-38 disabled:pointer-events-none',
          'rounded-full focus:md-focus',
          
          // Variants
          {
            'bg-md-primary text-md-on-primary hover:elevation-1 active:elevation-0': variant === 'filled',
            'border border-md-outline text-md-primary hover:bg-md-primary hover:bg-opacity-8 hover:elevation-1': variant === 'outlined',
            'text-md-primary hover:bg-md-primary hover:bg-opacity-8': variant === 'text',
            'bg-md-surface-container-low text-md-primary elevation-1 hover:elevation-2': variant === 'elevated',
            'bg-md-secondary-container text-md-on-secondary-container hover:elevation-1': variant === 'tonal',
          },
          
          // Sizes
          {
            'px-3 py-2 text-label-medium h-10': size === 'sm',
            'px-6 py-2.5 text-label-large h-10': size === 'default',
            'px-8 py-3 text-label-large h-12': size === 'lg',
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

MaterialButton.displayName = 'MaterialButton';

export { MaterialButton };