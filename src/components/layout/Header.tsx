'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks/useDebounce';
import { ROUTES } from '@/lib/constants/routes';
import { cn } from '@/lib/utils/cn';

const NAV_LINKS = [
  { href: ROUTES.HISTORY, label: 'History' },
  { href: ROUTES.WATCHLIST, label: 'Watchlist' },
  { href: ROUTES.SETTINGS, label: 'Settings' },
] as const;

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(debouncedQuery)}`);
    }
  }, [debouncedQuery, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && searchQuery.length >= 2) {
        router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery)}`);
      }
    },
    [searchQuery, router]
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-all duration-fast ease-gentle',
        isScrolled
          ? 'border-border bg-surface-glass shadow-card backdrop-blur-md'
          : 'border-transparent bg-surface-0/95 backdrop-blur-sm'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        {/* Logo */}
        <Link
          href={ROUTES.HOME}
          className="flex-none text-xl font-bold tracking-tight text-brand transition-transform duration-fast ease-standard hover:scale-[1.02] active:scale-[0.98]"
        >
          StreamDeck
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-fast ease-standard',
                  isActive
                    ? 'text-text-primary'
                    : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                )}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-brand" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Search bar - desktop */}
        <div className="hidden flex-1 md:block">
          <Input
            placeholder="Search movies, TV shows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
            className="max-w-md"
            data-testid="search-input"
            aria-label="Search movies, TV shows, and anime"
          />
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-1">
          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-lg p-2 text-text-secondary transition-colors duration-fast ease-standard
                         hover:bg-surface-2 hover:text-text-primary
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-text-secondary transition-colors duration-fast ease-standard
                       hover:bg-surface-2 hover:text-text-primary
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0
                       md:hidden"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile search + nav — animated */}
      <div
        className={cn(
          'overflow-hidden border-border transition-all duration-normal ease-standard md:hidden',
          isMobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 border-t-0'
        )}
      >
        <div className="border-t border-border px-4 py-3">
          <Input
            placeholder="Search movies, TV shows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
            aria-label="Search movies, TV shows, and anime"
          />
          <nav className="mt-3 flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map(({ href, label }, i) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-fast ease-standard',
                    isActive
                      ? 'bg-brand-muted text-brand'
                      : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary',
                    isMobileMenuOpen && 'animate-fade-in-up',
                    isMobileMenuOpen && `stagger-${i + 1}`
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
