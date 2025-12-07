# Software Requirements Specification (SRS)
## Movie Streaming Web Application

**Version:** 1.0  
**Date:** June 20, 2026  
**Standard:** IEEE 830-1998  
**Status:** Approved

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the Movie Streaming Web Application. It is intended for the development team, QA engineers, and project stakeholders to establish a shared understanding of what the system must do, how it must perform, and the constraints under which it operates.

### 1.2 Scope
The application is a Next.js-based web platform that enables users to discover, browse, and watch movies, TV shows, and anime. It integrates with TMDB for content metadata, MyAnimeList for anime data, and VidLink.pro for embedded video playback. All user preferences and watch history are stored client-side via localStorage.

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|-----------|
| TMDB | The Movie Database — content metadata API |
| MAL | MyAnimeList — anime metadata API |
| VidLink | VidLink.pro — third-party video embedding service |
| SSR | Server-Side Rendering |
| SSG | Static Site Generation |
| ISR | Incremental Static Regeneration |
| SPA | Single Page Application |
| CSP | Content Security Policy |
| WCAG | Web Content Accessibility Guidelines |
| TTFP | Time to First Paint |
| LCP | Largest Contentful Paint |
| TBT | Total Blocking Time |
| CLS | Cumulative Layout Shift |
| CDN | Content Delivery Network |

### 1.4 References
- IEEE Std 830-1998, IEEE Recommended Practice for Software Requirements Specifications
- TMDB API Documentation: https://developer.themoviedb.org/docs
- VidLink.pro Embed Documentation
- MyAnimeList API: https://myanimelist.net/apiconfig/references/api/v2
- WCAG 2.1: https://www.w3.org/TR/WCAG21/

---

## 2. Overall Description

### 2.1 Product Perspective
The application operates as a standalone web service. It depends on three external APIs (TMDB, MAL, VidLink.pro) and runs entirely in the user's browser with server-side rendering support via Next.js.

### 2.2 Product Functions
1. Content discovery (trending, popular, top-rated, search, genre filtering)
2. Content detail display (synopsis, cast, ratings, trailers)
3. Video playback via embedded iframe
4. Watch history tracking and resume playback
5. Player customization (colors, autoplay, icons)
6. Theme switching (dark/light mode)
7. TV season/episode navigation
8. Anime episode selection with sub/dub toggle

### 2.3 User Characteristics
- **Guest Users:** No account required. Can browse, search, and watch content. History stored locally.
- **Returning Users:** Same as guests but benefit from persisted localStorage (history, settings, theme).
- **Administrators:** Monitor system health via Sentry and Vercel Analytics dashboards. No admin UI in the application.

### 2.4 Constraints
- TMDB API: Free tier limited to 50 requests/second per API key
- VidLink.pro: No official SLA; rate limits undocumented
- MAL API: 3 requests/second rate limit
- Client-side storage: localStorage limited to ~5-10MB per origin
- No server-side user database (stateless architecture)
- Must run on Vercel (deployment constraint)

### 2.5 Assumptions and Dependencies
- TMDB API remains free and available
- VidLink.pro continues to provide embeddable player URLs
- Users have modern browsers (Chrome, Firefox, Safari, Edge — latest 2 versions)
- Users have stable internet connection for API calls and video streaming
- VidLink.pro handles video hosting, CDN delivery, and transcoding

---

## 3. Functional Requirements

### 3.1 Content Discovery

**FR-001: Display Homepage Sections**
- The system shall display three content sections on the homepage: Trending, Popular, and Top Rated.
- Each section shall display up to 20 media items.
- Each item shall show: poster image, title, rating badge, and media type indicator.
- Sections shall support horizontal scrolling/swiping.
- The system shall use TMDB `/trending`, `/popular`, and `/top_rated` endpoints.

**FR-002: Search Content**
- The system shall provide a search input in the header.
- The system shall debounce search queries by 500ms.
- The system shall call TMDB `/search/multi` endpoint with the query string.
- The system shall display results in a responsive grid (2-6 columns based on viewport).
- Each result shall show: poster, title, year, media type badge, and rating.
- The system shall support infinite scroll for search results (20 items per page).
- The system shall display an empty state when no results are found.
- The system shall store the last 10 search queries in localStorage.

**FR-003: Browse by Genre**
- The system shall display all available genres as selectable badges on the genre page.
- The system shall fetch genres from TMDB `/genre/movie/list` and `/genre/tv/list`.
- Selecting a genre shall filter content using TMDB `/discover` endpoint.
- The system shall support infinite scroll for genre-filtered results.
- The URL shall reflect the selected genre for deep linking and bookmarking.

---

### 3.2 Content Detail Pages

**FR-004: Movie Detail Page**
- The system shall display: poster, backdrop image, title, tagline, synopsis, runtime, release date, genres, vote average, and vote count.
- The system shall display the top 10 cast members with photos and character names.
- The system shall embed a YouTube trailer if available (from TMDB videos endpoint).
- The system shall display a carousel of 10 similar movies.
- The system shall provide a "Play" button that opens the video player.
- The system shall show a "Resume from X:XX" banner if watch history exists for this movie.

**FR-005: TV Show Detail Page**
- The system shall display: poster, backdrop, title, synopsis, number of seasons, number of episodes, status (airing/ended), genres, and rating.
- The system shall provide a season selector (dropdown or stepper).
- The system shall display an episode list for the selected season with: episode number, name, overview, air date, runtime, and watched status.
- The system shall display the top 10 cast members.
- The system shall show a carousel of similar shows.

**FR-006: Anime Detail Page**
- The system shall fetch anime metadata from MyAnimeList API.
- The system shall display: poster, English title, Japanese title, synopsis, episode count, status, genres, rating, and studios.
- The system shall display an episode grid with numbered entries.
- The system shall provide a Sub/Dub toggle that persists the user's preference.
- The system shall display related anime and recommendations if available from MAL.

---

### 3.3 Video Playback

**FR-007: Video Player Component**
- The system shall render an iframe element pointing to the correct VidLink.pro URL.
- For movies: `https://vidlink.pro/movie/{tmdbId}`
- For TV shows: `https://vidlink.pro/tv/{tmdbId}/{season}/{episode}`
- For anime: `https://vidlink.pro/anime/{malId}/{episode}/{subOrDub}?fallback=true`
- The system shall append all customization query parameters (primaryColor, secondaryColor, icons, iconColor, title, poster, autoplay, nextbutton, player, startAt, sub_file, sub_label, fallback_url).
- The iframe shall use sandbox attributes: `allow-same-origin allow-scripts allow-forms allow-popups`.
- The system shall set `allow="fullscreen; autoplay; encrypted-media"` on the iframe.

**FR-008: Player Customization**
- The system shall provide a settings drawer accessible from the player page.
- The system shall allow customization of: primaryColor (hex), secondaryColor (hex), icon style (vid/default), iconColor (hex), autoplay (boolean), nextbutton (boolean), player engine (default/jw).
- The system shall persist all player settings in localStorage.
- The system shall provide a "Reset to defaults" option.
- The system shall apply settings changes to the iframe URL in real-time.

**FR-009: Resume Playback**
- The system shall calculate the `startAt` parameter from the last saved watch progress.
- Resume shall apply when progress is > 5% and < 95%.
- The system shall display a "Resume from X:XX" banner on the detail page.
- The user shall be able to override resume and start from the beginning.

---

### 3.4 Watch History

**FR-010: Track Watch Progress**
- The system shall track watch progress at intervals: 10%, 25%, 50%, 75%, 90%, and 100%.
- Each history entry shall store: `mediaId`, `type` (movie/tv/anime), `title`, `posterUrl`, `timestamp`, `progress` (0-100), `completed` (boolean), `season` (for TV), `episode` (for TV/anime).
- The system shall store up to 500 history entries in localStorage.
- When the limit is reached, the system shall trim the oldest entries.
- The system shall catch `QuotaExceededError` and handle it gracefully.

**FR-011: Continue Watching Section**
- The homepage shall display a "Continue Watching" section if the user has incomplete watch history.
- The section shall show up to 10 items with progress indicators.
- Items shall be sorted by most recently watched.
- Clicking an item shall navigate to the detail page with resume option.

**FR-012: Clear Watch History**
- The system shall provide a "Clear History" button in settings.
- The system shall show a confirmation dialog before clearing.
- Clearing history shall remove all entries from localStorage.

---

### 3.5 Theme & UI

**FR-013: Theme Toggle**
- The system shall provide a theme toggle button in the header.
- The system shall respect the user's OS preference (`prefers-color-scheme`) on first visit.
- The system shall persist the theme choice in localStorage.
- The system shall apply a smooth transition animation (200ms) when switching themes.
- All UI components shall support both dark and light themes.

**FR-014: Loading States**
- The system shall display skeleton loaders within 100ms of navigation.
- The system shall use blur placeholder images for poster loading.
- The system shall show a spinner for player loading.
- The system shall support progressive image loading (low-res → high-res).

**FR-015: Error States**
- The system shall display a 404 page for invalid media IDs with search suggestions.
- The system shall display an error state with retry button when VidLink fails.
- The system shall display a fallback message when a season/episode is not found.
- The system shall show a friendly message when an iframe fails to load.
- The system shall display an offline banner when network connectivity is lost.

---

### 3.6 Navigation & Routing

**FR-016: Application Routes**
- `/` — Homepage (trending, popular, top-rated sections)
- `/search?q={query}` — Search results page
- `/movie/{tmdbId}` — Movie detail page
- `/tv/{tmdbId}` — TV show detail page
- `/anime/{malId}` — Anime detail page
- `/genre/{slug}` — Genre-filtered browsing
- `/404` — Not found page

**FR-017: Header Navigation**
- The header shall contain: logo, search bar, theme toggle, and mobile menu toggle.
- The header shall be sticky (fixed position) on scroll.
- The header shall collapse to a hamburger menu on mobile viewports (< 768px).

**FR-018: Footer**
- The footer shall display: links to legal pages, copyright notice, TMDB attribution, and social links.
- The footer shall be visible on all pages except the video player (fullscreen mode).

---

## 4. Non-Functional Requirements

### 4.1 Performance

**NFR-001: Time to First Paint**
- The system shall achieve TTFP < 1.5 seconds on a simulated 3G connection.
- Measurement: Lighthouse CI in CI/CD pipeline.

**NFR-002: Largest Contentful Paint**
- The system shall achieve LCP < 2.5 seconds on a simulated 4G connection.
- Measurement: Lighthouse CI.

**NFR-003: Total Blocking Time**
- The system shall achieve TBT < 200ms.
- Measurement: Lighthouse CI.

**NFR-004: Cumulative Layout Shift**
- The system shall achieve CLS < 0.1.
- Measurement: Lighthouse CI.
- Implementation: Reserve space for images, fonts, and dynamic content.

**NFR-005: First Input Delay**
- The system shall achieve FID < 100ms.
- Measurement: Vercel Analytics (real user metrics).

**NFR-006: Bundle Size**
- The initial JavaScript bundle shall not exceed 200KB (gzipped).
- Route-based code splitting shall be applied to all pages.
- Measurement: Next.js build output analysis.

---

### 4.2 Scalability

**NFR-007: Concurrent Users**
- The system shall support 10,000 concurrent users per region without degradation.
- Measurement: Load testing with k6 or Artillery.

**NFR-008: API Rate Limiting**
- The system shall implement client-side request throttling to stay within TMDB's 50 req/s limit.
- The system shall queue excess requests and process them when capacity is available.
- The system shall display stale cached data with a "Refresh" banner when rate limited.

**NFR-009: Caching Strategy**
- The system shall use TanStack Query with stale-while-revalidate for all API calls.
- Trending data shall be considered stale after 5 minutes.
- Search results shall be considered stale after 10 minutes.
- Genre and detail data shall be considered stale after 30 minutes.

---

### 4.3 Security

**NFR-010: Content Security Policy**
- The system shall set CSP headers to restrict iframe sources to `vidlink.pro` and `youtube.com`.
- The system shall restrict script sources to `'self'` and Vercel analytics.
- The system shall restrict image sources to `'self'`, TMDB image CDN, MAL image CDN, and `data:` URIs.

**NFR-011: XSS Protection**
- The system shall sanitize all user inputs (search queries, URL parameters).
- The system shall use React's built-in XSS protection (no `dangerouslySetInnerHTML`).
- The system shall set `X-Content-Type-Options: nosniff` header.

**NFR-012: CSRF Protection**
- The system shall not be vulnerable to CSRF as it does not use cookies for authentication.
- All state-changing operations are client-side only.

**NFR-013: iframe Security**
- All VidLink iframes shall use `sandbox="allow-same-origin allow-scripts allow-forms allow-popups"`.
- The system shall set `X-Frame-Options: DENY` for the application itself.

**NFR-014: Secure Headers**
- The system shall set the following headers via Next.js middleware:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

**NFR-015: Dependency Security**
- The system shall run `npm audit` in CI/CD on every PR.
- The system shall enable Dependabot for automated dependency updates.
- Critical vulnerabilities shall be patched within 48 hours.

---

### 4.4 Availability & Reliability

**NFR-016: Uptime**
- The system shall maintain 99.9% uptime (measured monthly).
- Allowed downtime: ~43 minutes/month.
- Measurement: Vercel deployment status + external uptime monitor.

**NFR-017: Graceful Degradation**
- When TMDB API is unavailable, the system shall display cached content with a "Data may be outdated" banner.
- When VidLink.pro is unavailable, the system shall display an error state with retry button.
- When offline, the system shall display an offline banner and disable search.
- The system shall never show a blank white screen — always show a loading state or error message.

**NFR-018: Error Recovery**
- The system shall implement React Error Boundaries at the page and component level.
- The system shall catch and log errors to Sentry.
- The system shall provide a "Try Again" button on error states.

---

### 4.5 Accessibility

**NFR-019: WCAG 2.1 AA Compliance**
- The system shall meet WCAG 2.1 Level AA success criteria.
- All interactive elements shall be keyboard accessible.
- All images shall have descriptive `alt` text.
- Color contrast ratios shall meet 4.5:1 for normal text and 3:1 for large text.
- The system shall support `prefers-reduced-motion` for animations.
- Measurement: axe-core automated scan in CI/CD.

**NFR-020: Screen Reader Support**
- The system shall use semantic HTML elements (`<nav>`, `<main>`, `<article>`, `<section>`).
- The system shall provide ARIA labels for interactive elements.
- The system shall announce dynamic content changes (search results, loading states) via `aria-live` regions.

**NFR-021: Focus Management**
- The system shall maintain visible focus indicators on all interactive elements.
- The system shall trap focus within modals and drawers when open.
- The system shall restore focus when modals/drawers close.

---

### 4.6 Compatibility

**NFR-022: Browser Support**
- The system shall support the latest 2 versions of:
  - Google Chrome
  - Mozilla Firefox
  - Apple Safari
  - Microsoft Edge
- The system shall not support Internet Explorer.

**NFR-023: Responsive Design**
- The system shall be fully responsive from 320px to 2560px viewport width.
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px).
- The system shall support touch interactions on mobile devices.

**NFR-024: Device Support**
- The system shall work on desktop, tablet, and mobile devices.
- The system shall support landscape and portrait orientations on mobile.
- The system shall not require installation (pure web app).

---

## 5. External Interface Requirements

### 5.1 TMDB API

**Endpoint Base:** `https://api.themoviedb.org/3`  
**Authentication:** API Key via query parameter (`api_key`)  
**Image CDN:** `https://image.tmdb.org/t/p/{size}/{path}`

**Required Endpoints:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/trending/{type}/{time_window}` | GET | Trending content |
| `/search/multi` | GET | Search movies, TV, people |
| `/movie/{id}` | GET | Movie details |
| `/tv/{id}` | GET | TV show details |
| `/tv/{id}/season/{season_number}` | GET | Season details with episodes |
| `/genre/movie/list` | GET | Movie genres |
| `/genre/tv/list` | GET | TV genres |
| `/discover/{type}` | GET | Browse by genre/filters |
| `/movie/{id}/credits` | GET | Movie cast |
| `/tv/{id}/credits` | GET | TV cast |
| `/movie/{id}/videos` | GET | Movie trailers |
| `/tv/{id}/videos` | GET | TV trailers |
| `/movie/{id}/similar` | GET | Similar movies |
| `/tv/{id}/similar` | GET | Similar TV shows |

**Response Format:** JSON  
**Rate Limit:** 50 requests/second per API key  
**Error Codes:** 401 (invalid API key), 404 (not found), 429 (rate limited), 500 (server error)

---

### 5.2 MyAnimeList API

**Endpoint Base:** `https://api.myanimelist.net/v2`  
**Authentication:** API Key via header (`X-MAL-CLIENT-ID`)

**Required Endpoints:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/anime/{id}` | GET | Anime details |
| `/anime/{id}/episodes` | GET | Episode list |
| `/anime/ranking` | GET | Top anime |

**Response Format:** JSON  
**Rate Limit:** 3 requests/second  
**Fields Parameter:** Use `?fields=...` to specify required fields and reduce payload size.

---

### 5.3 VidLink.pro

**URL Patterns:**

| Type | URL Pattern |
|------|-------------|
| Movie | `https://vidlink.pro/movie/{tmdbId}?{params}` |
| TV Show | `https://vidlink.pro/tv/{tmdbId}/{season}/{episode}?{params}` |
| Anime | `https://vidlink.pro/anime/{malId}/{episode}/{subOrDub}?fallback=true&{params}` |

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `primaryColor` | hex string (no #) | player default | Primary accent color |
| `secondaryColor` | hex string (no #) | player default | Progress bar color |
| `icons` | `"vid"` \| `"default"` | `"default"` | Icon style |
| `iconColor` | hex string (no #) | player default | Icon color |
| `title` | boolean | `true` | Show media title |
| `poster` | boolean | `false` | Show poster image |
| `autoplay` | boolean | `false` | Auto-start playback |
| `nextbutton` | boolean | `false` | Show next episode button |
| `player` | `"jw"` \| `"default"` | `"default"` | Player engine |
| `startAt` | number (seconds) | 0 | Start offset |
| `sub_file` | URL (.vtt) | — | External subtitle URL |
| `sub_label` | string | "External Subtitle" | Subtitle track label |
| `fallback_url` | URL | — | Redirect on stream failure |

---

### 5.4 User Interfaces

**Pages:**
1. Homepage (`/`) — Trending, Popular, Top Rated carousels + Continue Watching
2. Search (`/search`) — Debounced search with infinite scroll results
3. Movie Detail (`/movie/{id}`) — Info + player
4. TV Detail (`/tv/{id}`) — Info + season/episode selector + player
5. Anime Detail (`/anime/{id}`) — Info + episode list + sub/dub toggle + player
6. Genre Browse (`/genre/{slug}`) — Genre filter + content grid
7. 404 Not Found — Error page with search suggestions

**Global Components:**
- Header: Logo, search input, theme toggle, mobile menu
- Footer: Legal links, attribution, copyright

---

## 6. Database Schema (Client-Side)

### 6.1 UserPreferences (localStorage key: `movie-app:settings`)

```typescript
interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  playerSettings: {
    primaryColor: string;      // hex without #, e.g., "B20710"
    secondaryColor: string;
    icons: 'vid' | 'default';
    iconColor: string;
    autoplay: boolean;
    nextbutton: boolean;
    player: 'jw' | 'default';
  };
  animePreference: {
    subOrDub: 'sub' | 'dub';
  };
  searchHistory: string[];     // last 10 search queries
}
```

### 6.2 WatchHistory (localStorage key: `movie-app:history`)

```typescript
interface WatchHistoryEntry {
  id: string;                  // unique key: `${type}-${mediaId}-${season}-${episode}`
  mediaId: number;             // TMDB ID or MAL ID
  type: 'movie' | 'tv' | 'anime';
  title: string;
  posterUrl: string;
  timestamp: number;           // Unix timestamp (ms)
  progress: number;            // 0-100 percentage
  completed: boolean;          // true if progress >= 95%
  season?: number;             // TV only
  episode?: number;            // TV and anime
  subOrDub?: 'sub' | 'dub';   // Anime only
}

type WatchHistory = WatchHistoryEntry[]; // max 500 entries
```

### 6.3 UI State (Zustand, not persisted)

```typescript
interface UIState {
  isSidebarOpen: boolean;
  activeModal: string | null;
  toasts: Array<{ id: string; message: string; type: 'info' | 'error' | 'success' }>;
}
```

---

## 7. Constraints

| ID | Constraint | Impact |
|----|-----------|--------|
| C-001 | TMDB API key is free tier (50 req/s) | Must implement aggressive caching |
| C-002 | VidLink.pro has no official SLA | Must handle downtime gracefully |
| C-003 | MAL API limited to 3 req/s | Must throttle anime requests |
| C-004 | localStorage limited to ~5-10MB | Must cap watch history at 500 entries |
| C-005 | No server-side user database | All personalization is client-side only |
| C-006 | Must deploy on Vercel | Architecture must be Next.js-compatible |
| C-007 | No direct video hosting | All playback via VidLink iframe embed |
| C-008 | TypeScript strict mode | All code must pass `tsc --strict` |
| C-009 | No paid dependencies | All tools and services must have free tiers |

---

## 8. Quality Attributes

### 8.1 Testability
- All utility functions (vidlink URL builder, formatters, storage wrapper) shall have unit tests.
- All custom hooks shall have unit tests.
- All Zustand stores shall have unit tests.
- Critical user paths (search → play, resume watching, TV navigation) shall have E2E tests.
- Target: > 90% coverage for `lib/`, > 80% for `hooks/` and `store/`.

### 8.2 Maintainability
- Code shall follow the project's coding standards (see STANDARDS.md).
- Components shall be < 200 lines of code.
- Functions shall be < 50 lines of code.
- No component shall have more than 5 props (use objects for complex props).
- All public functions and components shall have TypeScript types.

### 8.3 Portability
- The application shall run on any modern browser without polyfills.
- The application shall be deployable to any platform supporting Next.js (not Vercel-locked).
- Environment variables shall be documented for easy migration.

---

## 9. Verification Methods

| Requirement | Verification Method |
|------------|-------------------|
| FR-001 to FR-018 | Integration tests + manual QA |
| NFR-001 to NFR-006 | Lighthouse CI in pipeline |
| NFR-007 | Load testing (k6) |
| NFR-010 to NFR-015 | Security audit + automated header checks |
| NFR-019 to NFR-021 | axe-core scan + manual screen reader testing |
| NFR-022 to NFR-024 | BrowserStack cross-browser testing |

---

**Document End**
