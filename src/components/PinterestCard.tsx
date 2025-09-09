import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface PinterestCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

const PinterestCard = forwardRef<HTMLDivElement, PinterestCardProps>(
  ({ className, children, hover = true, ...props }, ref) => {
    return (
      <div
        className={cn(
          'bg-card rounded-2xl shadow-sm border border-border overflow-hidden',
          hover && 'hover:shadow-md transition-shadow duration-200',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PinterestCard.displayName = 'PinterestCard';

export { PinterestCard };