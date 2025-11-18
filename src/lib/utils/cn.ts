import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines Tailwind CSS classes with intelligent conflict resolution.
 * Uses clsx for conditional class joining and tailwind-merge to handle
 * conflicting Tailwind classes (e.g., 'p-2 p-4' becomes 'p-4').
 *
 * @param inputs - Class values to merge (strings, objects, arrays, or false/undefined)
 * @returns A merged class string with conflicts resolved
 *
 * @example
 * ```tsx
 * // Basic usage
 * cn('px-2 py-1', 'bg-red-500') // => 'px-2 py-1 bg-red-500'
 *
 * // Conditional classes
 * cn('base-class', isActive && 'active-class') // => 'base-class active-class'
 *
 * // Conflicting classes are resolved (last wins)
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4'
 *
 * // Complex conditional styling
 * cn(
 *   'rounded-lg p-4',
 *   variant === 'primary' && 'bg-blue-500 text-white',
 *   variant === 'secondary' && 'bg-gray-200 text-gray-800',
 *   className
 * )
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
