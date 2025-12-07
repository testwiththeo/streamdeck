# Movie App — Enterprise-Grade AI Agent Prompt

You are a senior software architect at a streaming media company. You must produce a **complete enterprise software package** including all planning, architecture, implementation, and operational documentation **before writing any production code**.

---

## Mandatory Deliverables (sequential)

### Phase 0 — Strategy & Planning
1. **PRD** (Product Requirements Document)
   - Problem statement & target audience
   - User personas (Guest, Registered User, Admin)
   - Epics & user stories (numbered, prioritized: P0/P1/P2)
   - Acceptance criteria per story
   - Success metrics (load time < 2s, 99.9% uptime, etc.)
   - Competitive analysis (Netflix, Crunchyroll, etc.)
   - Monetization model (ads, freemium, subscription)
   - Content licensing & DMCA compliance notes

2. **SRS** (Software Requirements Specification) — IEEE 830 style
   - Functional requirements (FR-001 to FR-XXX)
   - Non-functional requirements (NFR-001 to NFR-XXX):
     - Performance: TTFP < 1.5s, 60fps UI, CDN for assets
     - Scalability: support 10K concurrent users per region
     - Security: CSP headers, XSS/CSRF protection, iframe sandboxing
     - Availability: 99.9% uptime, graceful degradation on API failure
     - Accessibility: WCAG 2.1 AA compliance
   - External interface requirements (TMDB API, VidLink.pro, MAL API)
   - Constraints (no cost per TMDB API key, VidLink.pro rate limits)

3. **Architecture Document** (C4 model)
   - **Context diagram** (system scope, external actors: TMDB, VidLink, User, CDN)
   - **Container diagram** (Next.js app, Zustand stores, TMDB proxy, static assets)
   - **Component diagram** (all React components, data flow, state boundaries)
   - **Code diagram** (key classes, types, interfaces)
   - Technology decisions with rationales:
     - Why Next.js App Router over Pages Router
     - Why Zustand over Redux/Context
     - Why Tailwind over CSS modules/styled-components
     - Streaming SSR vs static generation strategy
   - Data flow diagrams for key user journeys (search → browse → watch)

4. **Database Schema** (even if localStorage-based, document the expected schema)
   - `UserPreferences` — theme, lang, player settings
   - `WatchHistory` — mediaId, type, timestamp, progress, completed
   - `Bookmarks` — saved media

5. **API Contract Specification** (OpenAPI 3.0 / Swagger)
   - TMDB proxy endpoints (if any)
   - Search, trending, detail, genres
   - Request/response schemas with TypeScript types

### Phase 1 — Engineering Standards
6. **Coding Standards Document**
   - ESLint + Prettier config
   - Naming conventions (PascalCase components, camelCase functions, SCREAMING_SNAKE consts)
   - File naming: `kebab-case` for files, `PascalCase.tsx` for components
   - Import ordering rules
   - Error handling patterns (Result<T, E> monad or try/catch wrappers)
   - Testing conventions (describe/it blocks naming)

7. **Project Structure Standards**
   - Barrel exports (index.ts)
   - Absolute imports with `@/` alias
   - Co-location principle (tests, styles next to components)

8. **Git Workflow**
   - Branch strategy (main → develop → feature/xxx)
   - Commit message convention (Conventional Commits: feat:, fix:, chore:, docs:, refactor:)
   - PR checklist template
   - Code review guidelines

### Phase 2 — Testing Strategy
9. **Test Plan Document**
   - **Unit tests** (Vitest): all hooks, stores, utility functions, API helpers
   - **Integration tests** (React Testing Library): component behavior, user interactions, form flows
   - **E2E tests** (Playwright): critical paths — search → select → play, browse genres, resume watching
   - **Visual regression** (Storybook + Chromatic): all UI components
   - **Performance tests** (Lighthouse CI): budget for TBT, LCP, CLS
   - **Accessibility tests** (axe-core): WCAG compliance gates
   - Test coverage targets: > 90% for lib/, > 80% for components/

### Phase 3 — Implementation (per the phases below)

### Phase 4 — DevOps & Operations
10. **CI/CD Pipeline** (GitHub Actions)
    - On PR: lint → typecheck → unit test → build → E2E smoke test
    - On merge to main: full test suite → build → deploy to staging (Vercel)
    - On tag/release: deploy to production with rollback capability
    - Environment variable management (Vercel env vars, secrets)
    - Automated visual regression on deploy preview

11. **Monitoring & Observability**
    - Error tracking (Sentry.io integration)
    - Performance monitoring (Vercel Analytics / Web Vitals)
    - Feature flags (optional: LaunchDarkly or simple .env flags)
    - Logging strategy (structured logging, error boundaries)

12. **Security Checklist**
    - Content Security Policy (CSP) for iframe embedding
    - iframe sandbox attributes (`allow-same-origin`, `allow-scripts`)
    - Rate limiting on search API
    - Input sanitization on search queries
    - Secure headers (X-Frame-Options, X-Content-Type-Options)
    - Dependency scanning (Dependabot)
    - Secret scanning

---

## API Reference

### Embed Movies
```
https://vidlink.pro/movie/{tmdbId}
```

### Embed TV Shows
```
https://vidlink.pro/tv/{tmdbId}/{season}/{episode}
```

### Embed Anime
```
https://vidlink.pro/anime/{MALid}/{number}/{subOrDub}?fallback=true
```

### Customization Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `primaryColor` | `string` (hex, no #) | player default | Primary accent color (sliders, buttons, autoplay controls) |
| `secondaryColor` | `string` (hex, no #) | player default | Progress bar behind sliders |
| `icons` | `"vid" \| "default"` | `"default"` | Icon style set |
| `iconColor` | `string` (hex, no #) | player default | Icon color |
| `title` | `boolean` | `true` | Show/hide media title in player |
| `poster` | `boolean` | `false` | Show/hide poster image |
| `autoplay` | `boolean` | `false` | Auto-start playback |
| `nextbutton` | `boolean` | `false` | Show "Next Episode" button at 90% watch |
| `player` | `"jw" \| "default"` | `"default"` | Player engine selection |
| `startAt` | `number` (seconds) | — | Start offset for cross-device resume |
| `sub_file` | `URL` (direct `.vtt`) | — | External subtitle track URL |
| `sub_label` | `string` | `"External Subtitle"` | Label for external subtitle track |
| `fallback_url` | `URL` | — | Redirect URL when stream fails to load |

All parameters are appended as query string: `?primaryColor=B20710&autoplay=true`

---

## Tech Stack (with rationale)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14+ (App Router) | SSR/SSG/ISR, file-based routing, server components for API orchestration |
| Language | TypeScript (strict mode) | Type safety, better DX, self-documenting APIs |
| Styling | Tailwind CSS v3 | Utility-first, consistent design tokens, fast iteration |
| State (client) | Zustand + React Context | Minimal boilerplate, persists easily, no provider nesting hell |
| Data fetching | TanStack Query (React Query) | Caching, dedup, stale-while-revalidate, infinite scroll for search |
| TMDB SDK | `@tmdb/tmdb-api` or custom fetch wrapper | Rate limiting, retry logic, typed responses |
| Testing | Vitest + RTL + Playwright | Fast unit tests, component tests, E2E in one stack |
| Linting | ESLint + Prettier + Husky + lint-staged | Enforce standards at commit time |
| CI/CD | GitHub Actions | Native GitHub integration, matrix testing |
| Hosting | Vercel (pro) | Next.js-native, edge functions, analytics, preview deployments |
| Monitoring | Sentry + Vercel Analytics | Error tracking, web vitals, usage insights |
| a11y | axe-core + @testing-library/jest-dom | Automated accessibility gates |

---

## Player Component Contract

```tsx
// src/components/player/VideoPlayer.tsx

type MediaType = 'movie' | 'tv' | 'anime'

interface PlayerOptions {
  primaryColor?: string
  secondaryColor?: string
  icons?: 'vid' | 'default'
  iconColor?: string
  title?: boolean
  poster?: boolean
  autoplay?: boolean
  nextbutton?: boolean
  player?: 'jw'
  startAt?: number
  sub_file?: string
  sub_label?: string
  fallback_url?: string
}

interface VideoPlayerProps {
  type: MediaType
  tmdbId?: number
  malId?: number
  season?: number
  episode?: number
  subOrDub?: 'sub' | 'dub'
  options?: PlayerOptions
  onProgress?: (progress: number) => void   // callback for watch history
  onError?: (error: PlayerError) => void
  className?: string
}

// URL builder utility in src/lib/vidlink.ts
function buildVidLinkUrl(props: VideoPlayerProps): string
```

### Player Settings Store (Zustand)

```tsx
interface PlayerSettingsState {
  primaryColor: string
  secondaryColor: string
  icons: 'vid' | 'default'
  iconColor: string
  autoplay: boolean
  nextbutton: boolean
  player: 'jw' | 'default'
  // ... all customizable params
  updateSetting: <K extends keyof PlayerSettingsState>(key: K, value: PlayerSettingsState[K]) => void
  resetToDefaults: () => void
}
```

---

## Folder Structure (production-grade)

```
src/
  app/                          # Next.js App Router
    (main)/                     # layout group: header + footer
      page.tsx                  # Home → trending, popular, top-rated sections
      search/page.tsx           # Search with debounced input, infinite scroll
      movie/[id]/page.tsx       # Movie detail + player
      tv/[id]/page.tsx          # TV show detail + season/episode selector
      anime/[id]/page.tsx       # Anime detail + episode list + sub/dub
      genre/[slug]/page.tsx     # Genre-filtered browsing
    loading.tsx                 # Global loading skeleton
    error.tsx                   # Global error boundary
    not-found.tsx               # 404 page
    layout.tsx                  # Root layout with providers

  components/
    layout/
      Header.tsx                # Nav, search bar, user menu
      Footer.tsx                # Links, copyright, legal
      MobileNav.tsx
    player/
      VideoPlayer.tsx           # Core iframe embed component
      PlayerSettingsDrawer.tsx  # Slide-out customization panel
      PlayerErrorFallback.tsx
    ui/
      Button.tsx
      Card.tsx
      Skeleton.tsx
      Input.tsx
      Select.tsx
      Modal.tsx
      Drawer.tsx
      Badge.tsx
      Tooltip.tsx
      Toast.tsx
      Spinner.tsx
      InfiniteScroll.tsx
      ErrorBoundary.tsx
    media/
      MediaCard.tsx             # Reusable card for movies/shows/anime
      MediaGrid.tsx             # Responsive grid with loading state
      MediaDetail.tsx           # Synopsis, cast, rating, trailer
      MediaCarousel.tsx         # Horizontal scroll section
      GenreBadge.tsx
      RatingBadge.tsx
      PosterImage.tsx           # Optimized Image with blur placeholder
    tv/
      SeasonSelector.tsx        # Dropdown/stepper for seasons
      EpisodeList.tsx           # Episode grid/list with progress
      EpisodeCard.tsx
    anime/
      EpisodeList.tsx
      EpisodeCard.tsx
      SubDubToggle.tsx          # Sub/Dub switch

  lib/
    api/
      tmdb.ts                   # TMDB client (trending, search, detail, genres, credits)
      vidlink.ts                # VidLink.pro URL builder
      mal.ts                    # MyAnimeList client
    types/
      tmdb.types.ts             # TMDB response types
      app.types.ts              # App-specific types (MediaItem, WatchHistory, etc.)
      player.types.ts           # VideoPlayer, PlayerOptions types
    constants/
      genres.ts                 # Genre ID → name mapping
      defaults.ts               # Default player settings
      routes.ts                 # Route constants
    utils/
      cn.ts                     # clsx + twMerge utility
      format.ts                 # Date, duration, number formatting
      storage.ts                # Safe localStorage wrapper with SSR guard
      debounce.ts
      throttle.ts

  hooks/
    useDebounce.ts
    useInfiniteSearch.ts
    useTmdbData.ts              # Generic TMDB data fetcher with TanStack Query
    useWatchHistory.ts          # Read/write progress with merge strategy
    usePlayerSettings.ts        # Zustand store binding
    useMediaSession.ts          # Media Session API integration
    useResumePlayback.ts        # Calculate startAt from history
    useIntersectionObserver.ts  # Lazy loading / infinite scroll trigger

  store/
    settings-store.ts           # Zustand: player preferences (persisted)
    history-store.ts            # Zustand: watch history (persisted)
    ui-store.ts                 # Zustand: sidebar open, modals, toasts

  providers/
    QueryProvider.tsx           # TanStack Query provider
    ThemeProvider.tsx           # dark/light mode
    ToastProvider.tsx

  styles/
    globals.css                 # Tailwind directives, CSS variables, base styles

  __tests__/
    unit/
      lib/                      # vidlink.test.ts, tmdb.test.ts, format.test.ts
      hooks/                    # useDebounce.test.ts, useWatchHistory.test.ts
      store/                    # settings-store.test.ts
    integration/
      components/               # VideoPlayer.test.tsx, MediaCard.test.tsx
    e2e/
      search.spec.ts            # Playwright: search → select → play
      watch-history.spec.ts     # Playwright: play → progress → reopen → resume
      tv-navigation.spec.ts     # Playwright: TV show → select season → select episode

public/
  favicon.ico
  manifest.json
  robots.txt

.env.local                      # NEXT_PUBLIC_TMDB_API_KEY, NEXT_PUBLIC_VIDLINK_BASE_URL
```

---

## Implementation Phases (detailed)

### Phase 1 — Foundation (days 1-2)
- [ ] Initialize Next.js + TypeScript + Tailwind + ESLint + Prettier + Husky
- [ ] Configure path aliases (`@/`)
- [ ] Set up Zustand stores with persist middleware
- [ ] Set up TanStack Query with default options
- [ ] Create `tmdb.ts` client with trending, search, detail, genres endpoints
- [ ] Create `vidlink.ts` URL builder with full query param support
- [ ] Implement base UI components (Button, Card, Input, Skeleton, Spinner, ErrorBoundary)
- [ ] Implement Layout (Header, Footer, MobileNav)
- [ ] Implement Home page with trending/popular sections (MediaCarousel + MediaGrid)
- [ ] Implement Search page with debounced input and infinite scroll

### Phase 2 — Player & Detail (days 3-4)
- [ ] Implement `VideoPlayer.tsx` — generates correct iframe URL, handles all types
- [ ] Implement `PosterImage.tsx` — optimized Image with blurDataURL
- [ ] Implement Movie Detail page (MediaDetail + VideoPlayer)
- [ ] Implement TV Detail page + SeasonSelector + EpisodeList
- [ ] Implement Anime Detail page + EpisodeList + SubDubToggle
- [ ] Implement Genre browsing page

### Phase 3 — Settings & Personalization (day 5)
- [ ] Implement `PlayerSettingsDrawer.tsx` with all customization params
- [ ] Implement settings-store with localStorage persist
- [ ] Implement theme toggle (dark/light)
- [ ] Implement watch history store
- [ ] Implement `useResumePlayback` — finds last progress and sets `startAt`
- [ ] Implement `useMediaSession` — integrates with OS media controls

### Phase 4 — Quality (day 6)
- [ ] Write unit tests: vidlink.ts, settings-store, useWatchHistory, format utils
- [ ] Write integration tests: VideoPlayer rendering, MediaCard click, search flow
- [ ] Write E2E tests: Playwright for critical paths
- [ ] Implement WCAG accessibility (keyboard nav, aria labels, focus management)
- [ ] Performance audit — Lighthouse budget, image optimization, code splitting
- [ ] CSP headers, security middleware

### Phase 5 — DevOps (day 7)
- [ ] GitHub Actions CI: lint → typecheck → test → build → E2E
- [ ] Vercel deployment with preview environments
- [ ] Sentry error tracking setup
- [ ] README with setup instructions, architecture overview, environment variables

---

## Non-Functional Requirements (NFRs)

| ID | Category | Requirement | Measurement |
|----|----------|-------------|-------------|
| NFR-001 | Performance | TTFP < 1.5s on 3G | Lighthouse |
| NFR-002 | Performance | LCP < 2.5s | Lighthouse |
| NFR-003 | Performance | TBT < 200ms | Lighthouse |
| NFR-004 | Performance | CLS < 0.1 | Lighthouse |
| NFR-005 | Scalability | 10K concurrent users | Load test |
| NFR-006 | Availability | 99.9% uptime | Uptime monitor |
| NFR-007 | Security | CSP, XSS, CSRF protection | Security audit |
| NFR-008 | Accessibility | WCAG 2.1 AA | axe-core scan |
| NFR-009 | Reliability | Graceful degradation: if TMDB fails, show cached/fallback UI | Chaos test |
| NFR-010 | Compatibility | Latest 2 versions of Chrome, Firefox, Safari, Edge | BrowserStack |

---

## Edge Cases & Error Handling

1. **TMDB API rate limit** → queue requests, show stale data with refresh banner
2. **VidLink.pro down** → show fallback_url or error state with retry button
3. **Invalid tmdbId** → 404 page with suggestions
4. **Season/episode not found** → show empty state with message
5. **Anime sub/dub not found** → auto-fallback to available type
6. **localStorage full** → catch QuotaExceededError, trim oldest history entries
7. **SSR hydration mismatch** → suppress localStorage reads until mount
8. **Slow network** → skeleton loading, progressive image loading, optimistic UI
9. **Missing poster** → fallback placeholder image
10. **Broken iframe** → onError handler with user-friendly message

---

## Deliverables Checklist

- [ ] PRD document (`docs/PRD.md`)
- [ ] SRS document (`docs/SRS.md`)
- [ ] Architecture document (`docs/ARCHITECTURE.md`)
- [ ] API contract document (`docs/API.md`)
- [ ] Coding standards document (`docs/STANDARDS.md`)
- [ ] Test plan document (`docs/TEST_PLAN.md`)
- [ ] Security checklist (`docs/SECURITY.md`)
- [ ] CI/CD pipeline (`.github/workflows/ci.yml`)
- [ ] Complete source code implementation
- [ ] README.md with setup, environment variables, deployment guide

---

Proceed step by step. Begin with the PRD document.
