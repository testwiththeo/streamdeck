import { cn } from '@/lib/utils/cn';

/**
 * Available badge variants.
 */
type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

/**
 * Available badge sizes.
 */
type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * Props for the Badge component.
 */
interface BadgeProps {
  /** Content to display inside the badge */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /** Additional CSS classes */
  className?: string;
}

/**
 * A small label component for displaying status, categories, or counts.
 * Supports multiple variants and sizes.
 *
 * @example
 * ```tsx
 * <Badge>New</Badge>
 * <Badge variant="success">Active</Badge>
 * <Badge variant="danger" size="sm">Error</Badge>
 * <Badge variant="primary">{count}</Badge>
 * ```
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        // Variants
        variant === 'default' && 'bg-zinc-700 text-zinc-200',
        variant === 'primary' && 'bg-red-600 text-white',
        variant === 'secondary' && 'bg-zinc-600 text-white',
        variant === 'success' && 'bg-green-600 text-white',
        variant === 'warning' && 'bg-yellow-600 text-white',
        variant === 'danger' && 'bg-red-700 text-white',
        // Sizes
        size === 'sm' && 'px-1.5 py-0.5 text-xs',
        size === 'md' && 'px-2 py-0.5 text-xs',
        size === 'lg' && 'px-3 py-1 text-sm',
        className
      )}
    >
      {children}
    </span>
  );
}
