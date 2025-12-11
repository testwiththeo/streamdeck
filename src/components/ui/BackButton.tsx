'use client';

import { useState, useEffect, useCallback } from 'react';

import { cn } from '@/lib/utils/cn';

/**
 * A floating back button that appears after scrolling.
 * Calls router.back() on click.
 */
export function BackButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={goBack}
      aria-label="Go back"
      className={cn(
        'fixed left-4 top-20 z-30',
        'flex h-10 w-10 items-center justify-center rounded-full',
        'bg-surface-1/80 ring-1 ring-border shadow-card backdrop-blur-sm',
        'text-text-secondary transition-all duration-fast ease-standard',
        'hover:bg-surface-2 hover:text-text-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0',
        'active:scale-[0.95]',
        'animate-fade-in-up'
      )}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
    </button>
  );
}
