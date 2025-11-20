import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

/**
 * Props for the Card component.
 */
interface CardProps {
  /** Content to display inside the card */
  children: ReactNode;
  /** Additional CSS classes to apply */
  className?: string;
}

/**
 * A container component with a subtle card style.
 * Features rounded corners, shadow, and a semi-transparent background.
 *
 * @example
 * ```tsx
 * // Basic card
 * <Card>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here.</p>
 * </Card>
 *
 * // Card with custom styling
 * <Card className="border-2 border-blue-500 p-6">
 *   <CustomContent />
 * </Card>
 *
 * // Card in a grid layout
 * <div className="grid grid-cols-3 gap-4">
 *   <Card><MovieInfo /></Card>
 *   <Card><MovieInfo /></Card>
 *   <Card><MovieInfo /></Card>
 * </div>
 * ```
 */
export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-zinc-900/50 p-4 shadow-lg ring-1 ring-zinc-800',
        'dark:bg-zinc-900/80 dark:ring-zinc-800',
        className
      )}
    >
      {children}
    </div>
  );
}
