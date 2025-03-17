
import React from 'react';
import { cn } from '@/lib/utils';

interface PixelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'glass';
  animate?: boolean;
}

const PixelCard = React.forwardRef<HTMLDivElement, PixelCardProps>(
  ({ className, variant = 'default', animate = false, children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-game-bg border-2 border-game-secondary',
      outline: 'bg-transparent border-2 border-game-primary',
      glass: 'glass-panel',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'pixel-shadow rounded-sm p-4',
          variantClasses[variant],
          animate && 'transition-all duration-300 hover:translate-y-[-3px]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PixelCard.displayName = 'PixelCard';

export { PixelCard };
