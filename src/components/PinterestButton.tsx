import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface PinterestButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const PinterestButton = forwardRef<HTMLButtonElement, PinterestButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          
          // Variants
          {
            'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md': variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border': variant === 'secondary',
            'border-2 border-foreground text-foreground hover:bg-foreground hover:text-background': variant === 'outline',
            'text-foreground hover:bg-muted': variant === 'ghost',
          },
          
          // Sizes
          {
            'px-3 py-2 text-sm': size === 'sm',
            'px-4 py-3 text-base': size === 'md',
            'px-6 py-4 text-lg': size === 'lg',
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

PinterestButton.displayName = 'PinterestButton';

export { PinterestButton };