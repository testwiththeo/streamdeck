'use client';

import { useState, useEffect, useCallback } from 'react';

import { cn } from '@/lib/utils/cn';

/**
 * A floating scroll-to-top button that appears after scrolling down.
 * Hidden on mobile, visible on md+ breakpoints.
 *
 * @example
 * ```tsx
 * // In layout
 * <MainLayout>
 *   {children}
 *   <ScrollToTop />
 * </MainLayout>
 * ```
 */
export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={cn(
        'fixed bottom-6 right-6 z-30',
        'hidden md:flex',
        'h-12 w-12 items-center justify-center rounded-full',
        'bg-surface-1 ring-1 ring-border shadow-card backdrop-blur-sm',
        'text-text-secondary transition-colors duration-fast ease-standard',
        'hover:bg-surface-2 hover:text-text-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0',
        'animate-fade-in-up'
      )}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
