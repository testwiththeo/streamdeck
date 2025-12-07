# Test Plan Document
## Movie Streaming Web Application

**Version:** 1.0  
**Date:** June 20, 2026  
**Status:** Approved

---

## 1. Overview

### 1.1 Purpose
This document defines the testing strategy, scope, and approach for the Movie Streaming Web Application. It ensures that all functional and non-functional requirements are verified through appropriate test types.

### 1.2 Testing Objectives
- Verify all functional requirements (FR-001 to FR-018) from the SRS
- Validate non-functional requirements (NFR-001 to NFR-024)
- Ensure critical user journeys work end-to-end
- Catch regressions before deployment
- Maintain high code quality and confidence

### 1.3 Testing Tools

| Test Type | Tool | Purpose |
|-----------|------|---------|
| Unit Tests | Vitest | Fast, isolated function/hook testing |
| Integration Tests | Vitest + React Testing Library | Component behavior, user interactions |
| E2E Tests | Playwright | Full browser testing of critical paths |
| Visual Regression | Storybook + Chromatic | UI consistency across changes |
| Performance | Lighthouse CI | Automated performance budgets |
| Accessibility | axe-core + jest-dom | WCAG compliance gates |
| Static Analysis | TypeScript + ESLint | Type safety and code quality |

---

## 2. Test Levels

### 2.1 Unit Tests (Vitest)

**Scope:** Pure functions, utility modules, custom hooks, Zustand stores  
**Location:** `src/__tests__/unit/`  
**Target Coverage:** > 90% for `lib/`, > 85% for `hooks/`, > 80% for `store/`

#### 2.1.1 Library / Utility Tests

| File | Test Cases |
|------|-----------|
| `lib/api/vidlink.ts` | URL construction for movie/TV/anime, query param encoding, edge cases (missing IDs, undefined options) |
| `lib/utils/format.ts` | Runtime formatting, date formatting, rating display, timestamp formatting |
| `lib/utils/storage.ts` | Get/set/remove operations, SSR guard, quota exceeded handling, corrupt JSON handling |
| `lib/utils/cn.ts` | Class merging, conditional classes, undefined/null handling |
| `lib/utils/debounce.ts` | Delay behavior, cancellation, leading/trailing calls |
| `lib/constants/genres.ts` | Genre ID lookup, missing genre fallback |

**Example Test:**
```typescript
// src/__tests__/unit/lib/vidlink.test.ts
import { describe, it, expect } from 'vitest';
import { buildVidLinkUrl } from '@/lib/api/vidlink';

describe('buildVidLinkUrl', () => {
  describe('movie URLs', () => {
    it('should build basic movie URL', () => {
      const url = buildVidLinkUrl({ type: 'movie', tmdbId: 550 });
      expect(url).toBe('https://vidlink.pro/movie/550');
    });

    it('should append player options', () => {
      const url = buildVidLinkUrl({
        type: 'movie',
        tmdbId: 550,
        options: { primaryColor: 'B20710', autoplay: true },
      });
      expect(url).toContain('primaryColor=B20710');
      expect(url).toContain('autoplay=true');
    });

    it('should handle undefined options gracefully', () => {
      const url = buildVidLinkUrl({
        type: 'movie',
        tmdbId: 550,
        options: { primaryColor: undefined },
      });
      expect(url).toBe('https://vidlink.pro/movie/550');
    });
  });

  describe('TV URLs', () => {
    it('should build TV URL with season and episode', () => {
      const url = buildVidLinkUrl({ type: 'tv', tmdbId: 1396, season: 2, episode: 5 });
      expect(url).toBe('https://vidlink.pro/tv/1396/2/5');
    });
  });

  describe('anime URLs', () => {
    it('should build anime URL with MAL ID, episode, and sub/dub', () => {
      const url = buildVidLinkUrl({ type: 'anime', malId: 1535, episode: 1, subOrDub: 'sub' });
      expect(url).toBe('https://vidlink.pro/anime/1535/1/sub?fallback=true');
    });

    it('should append options after fallback param', () => {
      const url = buildVidLinkUrl({
        type: 'anime',
        malId: 1535,
        episode: 1,
        subOrDub: 'dub',
        options: { primaryColor: 'B20710' },
      });
      expect(url).toContain('fallback=true');
      expect(url).toContain('primaryColor=B20710');
    });
  });
});
```

#### 2.1.2 Hook Tests

| Hook | Test Cases |
|------|-----------|
| `useDebounce` | Value updates after delay, cancellation on rapid changes |
| `useWatchHistory` | Add entry, update progress, remove entry, clear history, trim oldest, continue watching sort |
| `usePlayerSettings` | Update setting, reset to defaults, persistence across renders |
| `useResumePlayback` | Calculate resume time, skip if progress < 5% or > 95%, format label |
| `useIntersectionObserver` | Trigger callback on intersect, disconnect on unmount |

**Example Test:**
```typescript
// src/__tests__/unit/hooks/useDebounce.test.ts
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 500));
    expect(result.current).toBe('hello');
  });

  it('should update value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'hello' } }
    );

    rerender({ value: 'world' });
    expect(result.current).toBe('hello'); // Not yet updated

    act(() => { vi.advanceTimersByTime(500); });
    expect(result.current).toBe('world'); // Updated after delay
  });

  it('should reset timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'b' });
    act(() => { vi.advanceTimersByTime(300); });
    rerender({ value: 'c' });
    act(() => { vi.advanceTimersByTime(300); });

    expect(result.current).toBe('a'); // Timer reset, not yet updated

    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current).toBe('c'); // Updated after full delay
  });
});
```

#### 2.1.3 Store Tests

| Store | Test Cases |
|-------|-----------|
| `settings-store` | Initial defaults, update single setting, reset all, persistence to localStorage |
| `history-store` | Add entry, update progress, remove entry, clear all, trim when > 500, continue watching filter |
| `ui-store` | Toggle sidebar, open/close modal, add/remove toast |

**Example Test:**
```typescript
// src/__tests__/unit/store/history-store.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useHistoryStore } from '@/store/history-store';
import type { WatchHistoryEntry } from '@/lib/types/app.types';

const mockEntry: WatchHistoryEntry = {
  id: 'movie-550',
  mediaId: 550,
  type: 'movie',
  title: 'Fight Club',
  posterUrl: '/poster.jpg',
  timestamp: Date.now(),
  progress: 45,
  completed: false,
};

describe('history-store', () => {
  beforeEach(() => {
    useHistoryStore.setState({ entries: [] });
  });

  it('should add entry to history', () => {
    useHistoryStore.getState().addEntry(mockEntry);
    expect(useHistoryStore.getState().entries).toHaveLength(1);
    expect(useHistoryStore.getState().entries[0]).toEqual(mockEntry);
  });

  it('should update progress', () => {
    useHistoryStore.getState().addEntry(mockEntry);
    useHistoryStore.getState().updateProgress('movie-550', 75);
    expect(useHistoryStore.getState().entries[0].progress).toBe(75);
  });

  it('should mark as completed when progress >= 95', () => {
    useHistoryStore.getState().addEntry(mockEntry);
    useHistoryStore.getState().updateProgress('movie-550', 95);
    expect(useHistoryStore.getState().entries[0].completed).toBe(true);
  });

  it('should trim oldest entries when limit exceeded', () => {
    const entries = Array.from({ length: 500 }, (_, i) => ({
      ...mockEntry,
      id: `movie-${i}`,
      timestamp: Date.now() - i * 1000,
    }));
    useHistoryStore.setState({ entries });

    const newEntry = { ...mockEntry, id: 'movie-new', timestamp: Date.now() };
    useHistoryStore.getState().addEntry(newEntry);

    expect(useHistoryStore.getState().entries).toHaveLength(500);
    expect(useHistoryStore.getState().entries[0].id).toBe('movie-new');
  });

  it('should return continue watching sorted by most recent', () => {
    const old = { ...mockEntry, id: 'old', timestamp: 1000, progress: 30 };
    const recent = { ...mockEntry, id: 'recent', timestamp: 2000, progress: 50 };
    useHistoryStore.setState({ entries: [old, recent] });

    const cw = useHistoryStore.getState().getContinueWatching();
    expect(cw[0].id).toBe('recent');
  });

  it('should exclude completed entries from continue watching', () => {
    const completed = { ...mockEntry, id: 'done', progress: 100, completed: true };
    useHistoryStore.setState({ entries: [completed] });

    expect(useHistoryStore.getState().getContinueWatching()).toHaveLength(0);
  });
});
```

---

### 2.2 Integration Tests (React Testing Library)

**Scope:** Component rendering, user interactions, form flows, state integration  
**Location:** `src/__tests__/integration/components/`  
**Target Coverage:** > 70% of components

#### 2.2.1 Component Test Matrix

| Component | Test Cases |
|-----------|-----------|
| `VideoPlayer` | Renders correct iframe URL, applies options, shows error fallback on load failure |
| `MediaCard` | Renders poster/title/rating, navigates on click, shows skeleton while loading |
| `MediaGrid` | Renders items in grid, shows empty state, handles loading state |
| `MediaCarousel` | Horizontal scroll, shows 20 items, handles empty data |
| `SearchInput` | Debounces input, clears on escape, shows search history |
| `SeasonSelector` | Lists seasons, selects season, fetches episodes on change |
| `EpisodeList` | Renders episodes, shows watched status, handles click |
| `SubDubToggle` | Toggles preference, persists to store, disables unavailable option |
| `PlayerSettingsDrawer` | Opens/closes, updates settings, resets to defaults |
| `ThemeToggle` | Switches theme, persists choice, respects system preference |

**Example Test:**
```typescript
// src/__tests__/integration/components/VideoPlayer.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VideoPlayer } from '@/components/player/VideoPlayer';

describe('VideoPlayer', () => {
  it('should render iframe with correct movie URL', () => {
    render(<VideoPlayer type="movie" tmdbId={550} />);
    const iframe = screen.getByTitle('Video Player');
    expect(iframe).toHaveAttribute('src', 'https://vidlink.pro/movie/550');
  });

  it('should render iframe with TV episode URL', () => {
    render(<VideoPlayer type="tv" tmdbId={1396} season={2} episode={5} />);
    const iframe = screen.getByTitle('Video Player');
    expect(iframe).toHaveAttribute('src', 'https://vidlink.pro/tv/1396/2/5');
  });

  it('should apply player options to URL', () => {
    render(
      <VideoPlayer
        type="movie"
        tmdbId={550}
        options={{ primaryColor: 'B20710', autoplay: true }}
      />
    );
    const iframe = screen.getByTitle('Video Player');
    expect(iframe.getAttribute('src')).toContain('primaryColor=B20710');
    expect(iframe.getAttribute('src')).toContain('autoplay=true');
  });

  it('should render error fallback when onError triggered', () => {
    render(<VideoPlayer type="movie" tmdbId={999999} />);
    // Simulate iframe error (mock)
    // Assert error fallback is shown
  });

  it('should apply sandbox attributes to iframe', () => {
    render(<VideoPlayer type="movie" tmdbId={550} />);
    const iframe = screen.getByTitle('Video Player');
    expect(iframe).toHaveAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms allow-popups');
  });
});
```

---

### 2.3 E2E Tests (Playwright)

**Scope:** Critical user journeys across the full application  
**Location:** `src/__tests__/e2e/`  
**Target:** All P0 user stories

#### 2.3.1 E2E Test Suites

| Suite | Scenarios |
|-------|----------|
| `search.spec.ts` | Search by title → select result → navigate to detail page → play video |
| `watch-history.spec.ts` | Play movie → track progress → revisit → see "Continue Watching" → resume |
| `tv-navigation.spec.ts` | Browse TV shows → select show → choose season → select episode → play |
| `anime-playback.spec.ts` | Search anime → select → toggle sub/dub → select episode → play |
| `genre-browsing.spec.ts` | Navigate to genre page → select genre → scroll results → select item |
| `settings.spec.ts` | Open settings → change player color → verify iframe URL updates |
| `theme.spec.ts` | Toggle theme → verify CSS classes change → refresh → theme persists |
| `error-handling.spec.ts` | Navigate to invalid ID → see 404 → search from 404 page |

**Example Test:**
```typescript
// src/__tests__/e2e/search.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Search functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should search for a movie and navigate to detail page', async ({ page }) => {
    // Type in search
    await page.fill('[data-testid="search-input"]', 'Fight Club');

    // Wait for debounce and results
    await page.waitForSelector('[data-testid="search-results"]');
    await expect(page.locator('[data-testid="media-card"]')).toHaveCount(20);

    // Click first result
    await page.click('[data-testid="media-card"]:first-child');

    // Should navigate to movie detail page
    await expect(page).toHaveURL(/\/movie\/\d+/);
    await expect(page.locator('h1')).toContainText('Fight Club');
  });

  test('should show empty state for no results', async ({ page }) => {
    await page.fill('[data-testid="search-input"]', 'xyznonexistentmovie123');
    await page.waitForSelector('[data-testid="empty-state"]');
    await expect(page.locator('[data-testid="empty-state"]')).toContainText('No results found');
  });

  test('should debounce rapid typing', async ({ page }) => {
    const input = page.locator('[data-testid="search-input"]');
    await input.fill('F');
    await input.fill('Fi');
    await input.fill('Fig');
    await input.fill('Figh');
    await input.fill('Fight');

    // Should only make 1 API call after debounce
    await page.waitForSelector('[data-testid="search-results"]');
  });

  test('should support infinite scroll', async ({ page }) => {
    await page.fill('[data-testid="search-input"]', 'Batman');
    await page.waitForSelector('[data-testid="search-results"]');

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Should load more results
    const initialCount = await page.locator('[data-testid="media-card"]').count();
    await page.waitForTimeout(1000);
    const newCount = await page.locator('[data-testid="media-card"]').count();
    expect(newCount).toBeGreaterThan(initialCount);
  });
});
```

```typescript
// src/__tests__/e2e/watch-history.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Watch history', () => {
  test('should track progress and resume watching', async ({ page }) => {
    // Navigate to a movie
    await page.goto('/movie/550');

    // Play movie
    await page.click('[data-testid="play-button"]');

    // Simulate progress (this would need a mock or real iframe interaction)
    // For E2E, we might mock the progress callback
    await page.waitForTimeout(2000);

    // Go back to home
    await page.goto('/');

    // Should see "Continue Watching" section
    await expect(page.locator('[data-testid="continue-watching"]')).toBeVisible();
    await expect(page.locator('[data-testid="continue-watching"] [data-testid="media-card"]'))
      .toHaveCount(1);
  });

  test('should clear watch history', async ({ page }) => {
    // Setup: add entry to localStorage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('movie-app:history', JSON.stringify([
        { id: 'movie-550', mediaId: 550, type: 'movie', title: 'Fight Club', progress: 45, timestamp: Date.now() }
      ]));
    });
    await page.reload();

    // Open settings and clear
    await page.click('[data-testid="settings-button"]');
    await page.click('[data-testid="clear-history"]');
    await page.click('[data-testid="confirm-clear"]');

    // History should be empty
    await expect(page.locator('[data-testid="continue-watching"]')).not.toBeVisible();
  });
});
```

---

### 2.4 Visual Regression Tests (Storybook + Chromatic)

**Scope:** All UI components across themes and viewports  
**Tool:** Storybook for component isolation, Chromatic for visual diffing

#### 2.4.1 Storybook Stories

Each component should have stories covering:
- Default state
- Loading state
- Empty/error state
- Dark and light theme
- Mobile and desktop viewports

**Example Story:**
```typescript
// src/components/media/MediaCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MediaCard } from './MediaCard';

const meta: Meta<typeof MediaCard> = {
  title: 'Media/MediaCard',
  component: MediaCard,
  parameters: {
    layout: 'centered',
    chromatic: { viewports: [375, 768, 1280] },
  },
};

export default meta;
type Story = StoryObj<typeof MediaCard>;

export const Default: Story = {
  args: {
    id: 550,
    type: 'movie',
    title: 'Fight Club',
    posterUrl: '/posters/fight-club.jpg',
    rating: 8.8,
    year: 1999,
  },
};

export const Loading: Story = {
  args: { isLoading: true },
};

export const MissingPoster: Story = {
  args: {
    ...Default.args,
    posterUrl: null,
  },
};

export const HighRating: Story = {
  args: {
    ...Default.args,
    rating: 9.5,
  },
};

export const LowRating: Story = {
  args: {
    ...Default.args,
    rating: 3.2,
  },
};
```

---

### 2.5 Performance Tests (Lighthouse CI)

**Scope:** Automated performance budgets in CI/CD  
**Tool:** Lighthouse CI GitHub Action

#### 2.5.1 Performance Budgets

| Metric | Budget | Page |
|--------|--------|------|
| LCP | < 2.5s | Homepage, Detail pages |
| TBT | < 200ms | All pages |
| CLS | < 0.1 | All pages |
| TTFB | < 600ms | All pages |
| Performance Score | > 90 | All pages |
| Accessibility Score | > 95 | All pages |
| Best Practices Score | > 90 | All pages |
| SEO Score | > 90 | All pages |

#### 2.5.2 Lighthouse CI Configuration

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/search?q=batman',
        'http://localhost:3000/movie/550',
        'http://localhost:3000/tv/1396',
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

---

### 2.6 Accessibility Tests (axe-core)

**Scope:** WCAG 2.1 AA compliance on all pages  
**Tool:** axe-core integrated into Playwright tests

#### 2.6.1 Accessibility Test Suite

```typescript
// src/__tests__/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  const pages = [
    { name: 'Homepage', path: '/' },
    { name: 'Search', path: '/search?q=batman' },
    { name: 'Movie Detail', path: '/movie/550' },
    { name: 'TV Detail', path: '/tv/1396' },
    { name: 'Genre', path: '/genre/action' },
  ];

  for (const { name, path } of pages) {
    test(`${name} should have no accessibility violations`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  }
});
```

#### 2.6.2 Manual Accessibility Checklist

- [ ] All pages navigable via keyboard (Tab, Shift+Tab, Enter, Escape)
- [ ] Focus visible on all interactive elements
- [ ] Focus trapped in modals/drawers when open
- [ ] Screen reader announces dynamic content (search results, loading states)
- [ ] Color contrast meets 4.5:1 for text, 3:1 for large text
- [ ] Images have descriptive alt text
- [ ] Form inputs have associated labels
- [ ] Error messages are announced to assistive technology
- [ ] `prefers-reduced-motion` respected for all animations
- [ ] Touch targets are at least 44x44px on mobile

---

## 3. Test Data

### 3.1 Mock Data

```typescript
// src/__tests__/fixtures/mocks.ts

export const mockMovie = {
  id: 550,
  title: 'Fight Club',
  overview: 'A ticking-Loss of a ticking time bomb...',
  poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
  backdrop_path: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
  release_date: '1999-10-15',
  vote_average: 8.433,
  vote_count: 26280,
  genre_ids: [18, 53, 35],
};

export const mockTVShow = {
  id: 1396,
  name: 'Breaking Bad',
  overview: 'When Walter White, a New Mexico chemistry teacher...',
  poster_path: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
  first_air_date: '2008-01-20',
  vote_average: 8.9,
  genre_ids: [18, 80],
  number_of_seasons: 5,
  number_of_episodes: 62,
};

export const mockSearchResults = {
  page: 1,
  results: [
    { ...mockMovie, media_type: 'movie' },
    { ...mockTVShow, media_type: 'tv' },
  ],
  total_pages: 1,
  total_results: 2,
};
```

---

## 4. Test Execution

### 4.1 Local Development

```bash
# Run all unit + integration tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run accessibility tests
npm run test:a11y

# Run Storybook
npm run storybook
```

### 4.2 CI Pipeline

```yaml
# .github/workflows/test.yml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: 'npm'
    - run: npm ci
    - run: npm run lint
    - run: npm run typecheck
    - run: npm run test:coverage
    - run: npm run build
    - run: npm run test:e2e
    - run: npm run test:a11y
    - run: npm run lighthouse
```

### 4.3 Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# Output:
# - coverage/lcov-report/index.html (HTML)
# - coverage/lcov.info (LCOV for CI tools)
# - Console summary
```

**Coverage Thresholds (vitest.config.ts):**
```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      thresholds: {
        'src/lib/**': { lines: 90, functions: 90 },
        'src/hooks/**': { lines: 85, functions: 85 },
        'src/store/**': { lines: 80, functions: 80 },
        'src/components/**': { lines: 70, functions: 70 },
      },
    },
  },
});
```

---

## 5. Test Environment

### 5.1 Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/__tests__/**/*.test.{ts,tsx}'],
    exclude: ['src/__tests__/e2e/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 5.2 Test Setup

```typescript
// src/__tests__/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return <img {...props} />;
  },
}));
```

### 5.3 Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 6. Defect Management

### 6.1 Severity Levels

| Severity | Definition | Response Time |
|----------|-----------|--------------|
| Critical | App crashes, data loss, security breach | Fix within 4 hours |
| High | Major feature broken, no workaround | Fix within 24 hours |
| Medium | Feature partially broken, workaround exists | Fix within 1 week |
| Low | Cosmetic issue, minor inconvenience | Fix in next sprint |

### 6.2 Bug Report Template

```markdown
**Title:** [Severity] Brief description
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:** What should happen
**Actual Behavior:** What actually happens
**Environment:** Browser, OS, device
**Screenshots/Logs:** Attached
**Regression:** Yes/No (if yes, which commit introduced it)
```

---

## 7. Test Schedule

| Phase | Activity | Duration |
|-------|---------|----------|
| Phase 1 (Days 1-2) | Unit tests for lib/, hooks/, store/ | 2 days |
| Phase 2 (Days 3-4) | Integration tests for components | 2 days |
| Phase 3 (Day 5) | E2E tests for critical paths | 1 day |
| Phase 4 (Day 6) | Accessibility + visual regression | 1 day |
| Phase 5 (Day 7) | Performance testing + CI integration | 1 day |

---

**Document End**
