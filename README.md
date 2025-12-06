# StreamDeck

A modern movie and TV streaming web application built with Next.js 16, featuring TMDB integration, anime support via MyAnimeList, and embedded video playback through VidLink.pro.

## Features

- **Browse Movies & TV Shows** — Trending, popular, top-rated content with infinite scroll
- **Search** — Multi-search across movies, TV shows, and people with debounced input
- **Video Player** — Embedded VidLink.pro player with customizable colors and settings
- **TV Shows** — Season/episode selector with episode list
- **Anime** — Sub/Dub toggle with episode grid via MyAnimeList API
- **Watch History** — Track watched content with localStorage persistence
- **Watchlist** — Save movies and shows for later
- **Settings** — Theme (dark/light/system), player colors, autoplay preferences
- **Genre Browsing** — Browse by genre for movies and TV
- **Accessibility** — WCAG 2.1 AA compliant with keyboard navigation and ARIA labels
- **Security** — CSP headers, HSTS, XSS protection

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| State Management | Zustand 5 |
| Data Fetching | TanStack Query 5 |
| Theme | next-themes |
| Error Tracking | Sentry |
| Testing | Jest + React Testing Library + Playwright |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- TMDB API key ([get one here](https://www.themoviedb.org/settings/api))
- MyAnimeList Client ID ([register here](https://myanimelist.net/apiconfig))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd movie-app

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with the following:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_MAL_CLIENT_ID=your_mal_client_id_here
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_TMDB_API_KEY` | Yes | TMDB API key for movie/TV data |
| `NEXT_PUBLIC_MAL_CLIENT_ID` | No | MyAnimeList Client ID for anime data |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Sentry DSN for error tracking (production only) |

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm run start
```

## Project Structure

```
movie-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (main)/            # Route group for main pages
│   │   │   ├── anime/[id]/   # Anime detail page
│   │   │   ├── genre/[slug]/ # Genre browsing page
│   │   │   ├── history/      # Watch history page
│   │   │   ├── movie/[id]/   # Movie detail page
│   │   │   ├── search/       # Search results page
│   │   │   ├── settings/     # Settings page
│   │   │   ├── tv/[id]/      # TV detail page
│   │   │   └── watchlist/    # Watchlist page
│   │   ├── error.tsx         # Route error boundary
│   │   ├── global-error.tsx  # Global error boundary
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   ├── anime/            # Anime-specific components
│   │   ├── layout/           # Header, Footer
│   │   ├── media/            # MediaCard, MediaGrid, etc.
│   │   ├── player/           # VideoPlayer
│   │   ├── tv/               # TV-specific components
│   │   └── ui/               # Reusable UI components
│   ├── hooks/                # Custom React hooks
│   ├── lib/
│   │   ├── api/              # API clients (TMDB, VidLink, MAL)
│   │   ├── constants/        # Constants and defaults
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Utility functions
│   ├── providers/            # React context providers
│   └── store/                # Zustand stores
├── e2e/                      # Playwright E2E tests
├── docs/                     # Documentation
│   ├── PRD.md               # Product Requirements Document
│   ├── SRS.md               # Software Requirements Specification
│   ├── ARCHITECTURE.md      # Architecture overview
│   ├── API.md               # API documentation
│   ├── STANDARDS.md         # Coding standards
│   ├── TEST_PLAN.md         # Test plan
│   ├── SECURITY.md          # Security documentation
│   └── CI_CD.md             # CI/CD documentation
└── .github/workflows/       # GitHub Actions CI/CD
```

## Architecture

### Data Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Browser   │────▶│  Next.js API │────▶│  External APIs  │
│  (Client)   │◀────│   (Server)   │◀────│  TMDB/MAL/VidLink│
└─────────────┘     └──────────────┘     └─────────────────┘
       │                                         │
       ▼                                         ▼
┌─────────────┐                         ┌─────────────────┐
│   Zustand   │                         │   CDN Cache     │
│   Stores    │                         │   (1 hour)      │
└─────────────┘                         └─────────────────┘
```

### State Management

- **Zustand** — Client-side state (settings, history, watchlist, UI)
- **TanStack Query** — Server state (API data, caching, revalidation)
- **localStorage** — Persistent storage via Zustand persist middleware

### API Integration

| API | Purpose | Caching |
|-----|---------|---------|
| TMDB | Movies, TV, search, trending | 1 hour ISR |
| VidLink.pro | Video embed URLs | Client-side |
| MyAnimeList | Anime metadata | 1 hour ISR |

## Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests (requires dev server)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Test Coverage

- **Unit tests** — vidlink.ts, format utils, settings-store
- **Component tests** — VideoPlayer, MediaCard
- **E2E tests** — Home page, search, navigation, accessibility

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs:

1. **Lint & Type Check** — ESLint, Prettier, TypeScript
2. **Security Audit** — npm audit, TruffleHog secret scanning
3. **Unit Tests** — Jest with coverage reporting
4. **Build** — Next.js production build
5. **E2E Tests** — Playwright tests
6. **Accessibility** — axe-core automated testing
7. **Lighthouse CI** — Performance, accessibility, SEO
8. **Deploy** — Vercel (staging on main, production on tags)

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy — Vercel handles builds and previews automatically

### Manual Deployment

```bash
npm run build
npm run start
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run Playwright with UI |

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) — Movie and TV data
- [MyAnimeList](https://myanimelist.net/) — Anime data
- [VidLink.pro](https://vidlink.pro/) — Video embed service
- [Next.js](https://nextjs.org/) — React framework
