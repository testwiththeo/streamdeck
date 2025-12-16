import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-medium',
          'transition-all duration-fast ease-standard',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0',
          'disabled:pointer-events-none disabled:opacity-50',
          'active:scale-[0.98] active:duration-instant',
          variant === 'primary' && 'bg-brand text-white hover:bg-brand-hover hover:shadow-sm active:bg-brand-active',
          variant === 'secondary' && 'bg-surface-2/80 text-text-primary hover:bg-surface-3/80',
          variant === 'ghost' && 'text-text-secondary hover:bg-surface-2/60 hover:text-text-primary',
          variant === 'danger' && 'bg-error text-white hover:bg-error/90',
          size === 'sm' && 'h-8 px-3 text-sm',
          size === 'md' && 'h-10 px-4 text-sm',
          size === 'lg' && 'h-12 px-6 text-base',
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
