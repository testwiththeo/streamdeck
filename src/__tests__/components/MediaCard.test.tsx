import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MediaCard } from '@/components/media/MediaCard';

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => {
    return (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

describe('MediaCard', () => {
  const mockItem = {
    id: 550,
    type: 'movie' as const,
    title: 'Fight Club',
    posterUrl: 'https://image.tmdb.org/t/p/w500/test.jpg',
    rating: 8.4,
    year: 1999,
    genreIds: [18, 53, 35],
  };

  it('renders the title', () => {
    render(<MediaCard {...mockItem} />);
    // Title appears in both info section and hover overlay
    expect(screen.getAllByText('Fight Club').length).toBeGreaterThan(0);
  });

  it('renders the year', () => {
    render(<MediaCard {...mockItem} />);
    // Year appears in both info section and hover overlay
    expect(screen.getAllByText('1999').length).toBeGreaterThan(0);
  });

  it('renders the rating badge', () => {
    render(<MediaCard {...mockItem} />);
    // Rating appears in both the badge and hover overlay
    const ratings = screen.getAllByText('8.4');
    expect(ratings.length).toBeGreaterThan(0);
  });

  it('renders the rating in the top-right badge', () => {
    render(<MediaCard {...mockItem} />);
    // Rating badge is shown in top-right corner
    const ratings = screen.getAllByText('8.4');
    expect(ratings.length).toBeGreaterThan(0);
  });

  it('links to the correct detail page', () => {
    render(<MediaCard {...mockItem} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/movie/550');
  });

  it('links to TV detail page for TV type', () => {
    render(<MediaCard {...mockItem} id={1399} type="tv" title="Breaking Bad" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/tv/1399');
  });

  it('links to Anime detail page for anime type', () => {
    render(<MediaCard {...mockItem} id={21} type="anime" title="One Piece" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/anime/21');
  });

  it('renders poster image', () => {
    render(<MediaCard {...mockItem} />);
    const img = screen.getByRole('img', { name: /poster for fight club/i });
    expect(img).toBeInTheDocument();
  });

  it('is keyboard accessible', async () => {
    render(<MediaCard {...mockItem} />);
    const link = screen.getByRole('link');
    link.focus();
    expect(link).toHaveFocus();
  });

  it('renders progress bar when progress is provided', () => {
    render(<MediaCard {...mockItem} progress={65} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '65');
  });

  it('does not render progress bar when progress is not provided', () => {
    render(<MediaCard {...mockItem} />);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
