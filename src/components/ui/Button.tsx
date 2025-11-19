import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

/**
 * Available button variants for different use cases.
 * - primary: Main action button with brand color
 * - secondary: Alternative action with neutral color
 * - ghost: Subtle button without background
 * - danger: Destructive action with warning color
 */
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

/**
 * Available button sizes.
 * - sm: Small button for compact UIs
 * - md: Default medium size
 * - lg: Large button for prominent actions
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
 * Supports all native button attributes and forwards refs.
 *
 * @example
 * ```tsx
 * // Primary button (default)
 * <Button onClick={handleClick}>Click me</Button>
 *
 * // Secondary button
 * <Button variant="secondary">Cancel</Button>
 *
 * // Ghost button with custom size
 * <Button variant="ghost" size="sm">Edit</Button>
 *
 * // Danger button with icon
 * <Button variant="danger" size="lg">
 *   <TrashIcon /> Delete
 * </Button>
 *
 * // Disabled state
 * <Button disabled>Submitting...</Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          variant === 'primary' && 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
          variant === 'secondary' &&
            'bg-zinc-800 text-white hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600',
          variant === 'ghost' && 'text-zinc-300 hover:bg-zinc-800 hover:text-white',
          variant === 'danger' && 'bg-red-700 text-white hover:bg-red-800',
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
