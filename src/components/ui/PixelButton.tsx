
import React from 'react';
import { cn } from '@/lib/utils';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const PixelButton = React.forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, icon, iconPosition = 'left', ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-game-primary text-white border-2 border-game-secondary hover:bg-game-secondary',
      secondary: 'bg-game-secondary text-white border-2 border-game-primary hover:bg-game-primary',
      success: 'bg-game-success text-white border-2 border-green-700 hover:bg-green-600',
      warning: 'bg-game-warning text-white border-2 border-amber-700 hover:bg-amber-600',
      danger: 'bg-game-danger text-white border-2 border-red-700 hover:bg-red-600',
      destructive: 'bg-red-600 text-white border-2 border-red-800 hover:bg-red-700',
    };

    const sizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'pixel-button rounded-sm font-medium leading-none transition-colors pixel-shadow',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <span className={`flex items-center justify-center gap-2 ${iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
          {icon && <span className="pixel-art">{icon}</span>}
          <span className="pixel-text">{children}</span>
        </span>
      </button>
    );
  }
);

PixelButton.displayName = 'PixelButton';

export { PixelButton };
