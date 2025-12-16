import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'h-11 w-full rounded-xl border border-border-subtle bg-surface-2/60 px-3 text-sm text-text-primary',
            'placeholder:text-text-muted',
            'focus:border-transparent focus:outline-none focus:ring-1 focus:ring-brand',
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
