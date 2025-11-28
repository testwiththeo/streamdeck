import { useState, useEffect } from 'react';

/**
 * Checks if the current viewport matches a CSS media query.
 * Useful for responsive behavior in React components.
 *
 * @param query - CSS media query string (e.g., '(min-width: 768px)')
 * @returns true if the media query matches, false otherwise
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const isMobile = useMediaQuery('(max-width: 767px)');
 *   const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 *   const isLandscape = useMediaQuery('(orientation: landscape)');
 *
 *   return (
 *     <div>
 *       {isMobile ? <MobileLayout /> : <DesktopLayout />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Predefined breakpoints for common device sizes.
 */
export const BREAKPOINTS = {
  /** Mobile: max-width 639px */
  sm: '(max-width: 639px)',
  /** Tablet: min-width 640px */
  md: '(min-width: 640px)',
  /** Laptop: min-width 1024px */
  lg: '(min-width: 1024px)',
  /** Desktop: min-width 1280px */
  xl: '(min-width: 1280px)',
  /** Large desktop: min-width 1536px */
  '2xl': '(min-width: 1536px)',
} as const;
