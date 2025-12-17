import Link from 'next/link';

const FOOTER_GENRES = [
  { slug: 'action', label: 'Action' },
  { slug: 'comedy', label: 'Comedy' },
  { slug: 'drama', label: 'Drama' },
  { slug: 'horror', label: 'Horror' },
  { slug: 'sci-fi', label: 'Sci-Fi' },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-0 opacity-90">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="text-lg font-bold tracking-tight text-text-primary">
              StreamDeck<span className="text-brand">.</span>
            </Link>
            <p className="mt-1 text-sm text-text-muted">
              Discover and watch movies, TV shows, and anime.
            </p>
          </div>

          <nav className="flex flex-wrap gap-4 text-sm" aria-label="Browse by genre">
            {FOOTER_GENRES.map(({ slug, label }) => (
              <Link
                key={slug}
                href={`/genre/${slug}`}
                className="text-text-tertiary transition-colors duration-fast ease-standard hover:text-text-secondary"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-border-subtle pt-6 text-xs text-text-tertiary md:flex-row md:justify-between">
          <p>&copy; {new Date().getFullYear()} StreamDeck. All rights reserved.</p>
          <p>
            This product uses the{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-tertiary transition-colors duration-fast ease-standard hover:text-text-secondary"
            >
              TMDB
            </a>{' '}
            API but is not endorsed or certified by TMDB.
          </p>
        </div>

        <p className="mt-4 text-center text-text-muted">
          We do not host or upload any videos. All content is provided by unaffiliated third parties.
        </p>
      </div>
    </footer>
  );
}
