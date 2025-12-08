import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

/**
 * Available button variants for different use cases.
 */
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

/**
 * Available button sizes.
 */
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Props for the Button component.
 * Extends native HTML button attributes.
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
}

/**
 * A versatile button component with multiple variants and sizes.
 * Uses design system tokens for colors, transitions, and focus states.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium',
          'transition-all duration-fast ease-standard',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0',
          'disabled:pointer-events-none disabled:opacity-50',
          'active:scale-[0.97] active:duration-instant',
          variant === 'primary' && 'bg-brand text-white hover:bg-brand-hover active:bg-brand-active',
          variant === 'secondary' &&
            'bg-surface-2 text-text-primary hover:bg-surface-3',
          variant === 'ghost' && 'text-text-secondary hover:bg-surface-2 hover:text-text-primary',
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
