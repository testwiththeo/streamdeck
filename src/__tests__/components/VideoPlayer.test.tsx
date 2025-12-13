import { render, screen, fireEvent } from '@testing-library/react';
import { VideoPlayer } from '@/components/player/VideoPlayer';

// Mock the settings store
jest.mock('@/store/settings-store', () => ({
  useSettingsStore: () => ({
    primaryColor: 'B20710',
    secondaryColor: '333333',
    icons: 'default',
    iconColor: 'FFFFFF',
    autoplay: false,
    nextbutton: false,
    player: 'default',
    title: true,
    poster: false,
  }),
}));

describe('VideoPlayer', () => {
  it('renders iframe with correct src for movie', () => {
    render(<VideoPlayer type="movie" tmdbId={550} />);
    const iframe = screen.getByTitle('Video Player');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', expect.stringContaining('/movie/550'));
  });

  it('renders iframe with correct src for TV', () => {
    render(<VideoPlayer type="tv" tmdbId={1399} season={1} episode={5} />);
    const iframe = screen.getByTitle('Video Player');
    expect(iframe).toHaveAttribute('src', expect.stringContaining('/tv/1399/1/5'));
  });

  it('renders iframe with correct src for anime', () => {
    render(<VideoPlayer type="anime" malId={21} episode={10} subOrDub="sub" />);
    const iframe = screen.getByTitle('Video Player');
    expect(iframe).toHaveAttribute('src', expect.stringContaining('/anime/21/10/sub'));
  });

  it('applies sandbox attributes to iframe', () => {
    render(<VideoPlayer type="movie" tmdbId={550} />);
    const iframe = screen.getByTitle('Video Player');
    expect(iframe).toHaveAttribute('sandbox');
    expect(iframe).toHaveAttribute('allow');
  });

  it('shows error state when URL cannot be built', () => {
    // Test with missing required params
    render(<VideoPlayer type="movie" />);
    expect(screen.getByText('No video source available.')).toBeInTheDocument();
  });

  it('renders iframe with sandbox attributes for security', () => {
    render(<VideoPlayer type="movie" tmdbId={550} />);
    const iframe = screen.getByTitle('Video Player');
    expect(iframe).toHaveAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms allow-popups');
    expect(iframe).toHaveAttribute('referrerPolicy', 'no-referrer');
  });
});
