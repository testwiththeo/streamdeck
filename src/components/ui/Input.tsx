import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

/**
 * Props for the Input component.
 * Extends native HTML input attributes.
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Optional icon to display on the left side of the input */
  icon?: ReactNode;
}

/**
 * A styled input component with optional icon support.
 * Includes focus states, placeholder styling, and accessibility features.
 *
 * @example
 * ```tsx
 * // Basic input
 * <Input placeholder="Enter your email" type="email" />
 *
 * // Input with icon
 * <Input
 *   icon={<SearchIcon />}
 *   placeholder="Search..."
 *   onChange={handleSearch}
 * />
 *
 * // Input with custom styling
 * <Input
 *   className="border-blue-500"
 *   placeholder="Custom styled"
 * />
 *
 * // Controlled input
 * <Input
 *   value={searchTerm}
 *   onChange={(e) => setSearchTerm(e.target.value)}
 *   placeholder="Search movies..."
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 text-sm text-white',
            'placeholder:text-zinc-500',
            'focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500',
            'transition-colors',
            icon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
