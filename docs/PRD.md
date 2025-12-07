# Product Requirements Document (PRD)
## Movie Streaming Web Application

**Version:** 1.0  
**Date:** June 20, 2026  
**Author:** Product Team  
**Status:** Approved

---

## 1. Executive Summary

### 1.1 Problem Statement
Users need a free, accessible web platform to discover and watch movies, TV shows, and anime without subscription barriers. Current solutions either require paid subscriptions (Netflix, Hulu), have limited content libraries, or lack a cohesive user experience across different media types.

### 1.2 Solution Overview
A modern web application that aggregates content metadata from TMDB (The Movie Database) and MyAnimeList, and provides embedded streaming via VidLink.pro. The platform offers a Netflix-like browsing experience with personalized recommendations, watch history tracking, and customizable player settings—all without requiring user registration.

### 1.3 Target Audience
- **Primary:** Casual viewers (18-35) seeking free streaming content
- **Secondary:** Anime enthusiasts looking for sub/dub options
- **Tertiary:** Binge watchers who want to track progress across devices

---

## 2. User Personas

### 2.1 Guest User — "Casual Chris"
**Demographics:** 24, college student, budget-conscious  
**Goals:**
- Quickly find trending movies/shows
- Watch content without creating an account
- Browse by genre or search by title

**Pain Points:**
- Hates mandatory sign-ups
- Frustrated by slow loading times
- Abandons if search takes > 3 seconds

**Success Metrics:**
- Time-to-first-play < 60 seconds
- Search results appear within 500ms of typing pause

---

### 2.2 Registered User — "Binge-Watcher Beth"
**Demographics:** 29, working professional, watches 10+ hours/week  
**Goals:**
- Resume watching from where she left off
- Customize player appearance (dark mode, colors)
- Track watch history across devices (via localStorage)

**Pain Points:**
- Loses progress when switching devices
- Player controls are inconsistent across sites
- Can't find specific episodes in long-running shows

**Success Metrics:**
- Resume playback accuracy > 95%
- Player settings persist across sessions
- Episode navigation takes < 3 clicks

---

### 2.3 Admin — "Content Manager Mike"
**Demographics:** 35, technical background, monitors platform health  
**Goals:**
- Ensure API rate limits aren't exceeded
- Monitor error rates and performance
- Manage content licensing compliance

**Pain Points:**
- No visibility into system health
- Can't identify broken video sources quickly
- Difficult to track user engagement metrics

**Success Metrics:**
- Error rate < 0.1%
- API quota usage < 80% of limit
- Mean time to detect issues < 5 minutes

---

## 3. Epics & User Stories

### Epic 1: Content Discovery (P0 — Critical)

**US-1.1: Browse Trending Content**
- As a guest, I want to see trending movies/shows on the homepage so I can discover popular content.
- **Acceptance Criteria:**
  - Homepage displays 3 carousels: Trending, Popular, Top Rated
  - Each carousel shows 20 items with poster, title, rating
  - Carousels support horizontal scroll/swipe
  - Loading skeleton appears within 100ms, content loads < 2s

**US-1.2: Search Content**
- As a user, I want to search by title so I can find specific movies/shows/anime.
- **Acceptance Criteria:**
  - Search input debounces at 500ms
  - Results appear in infinite scroll grid
  - Results include poster, title, year, type (movie/tv/anime), rating
  - Empty state shows "No results found" with suggestions
  - Search history stored in localStorage (last 10 queries)

**US-1.3: Browse by Genre**
- As a user, I want to filter content by genre so I can explore specific categories.
- **Acceptance Criteria:**
  - Genre page shows all available genres as badges
  - Selecting a genre displays filtered content grid
  - Grid supports infinite scroll (20 items per page)
  - URL reflects selected genre for sharing/bookmarking

---

### Epic 2: Content Playback (P0 — Critical)

**US-2.1: Watch Movie**
- As a user, I want to play a movie so I can watch it in the embedded player.
- **Acceptance Criteria:**
  - Movie detail page shows synopsis, cast, rating, trailer, release date
  - "Play" button opens video player with correct VidLink URL
  - Player supports fullscreen, quality selection, playback speed
  - Progress tracked at 10%, 25%, 50%, 75%, 90%, 100%

**US-2.2: Watch TV Show**
- As a user, I want to select season and episode so I can watch specific episodes.
- **Acceptance Criteria:**
  - TV detail page shows season selector (dropdown or stepper)
  - Episode list shows thumbnail, title, air date, watched status
  - Selecting episode updates player URL and tracks progress
  - "Next Episode" button appears at 90% watch time
  - Auto-advance to next episode (optional, off by default)

**US-2.3: Watch Anime**
- As a user, I want to select episode and sub/dub preference so I can watch anime.
- **Acceptance Criteria:**
  - Anime detail page shows episode grid (numbered, with thumbnails if available)
  - Sub/Dub toggle persists preference in localStorage
  - If preferred type unavailable, auto-fallback with notification
  - Episode list shows watched progress per episode

---

### Epic 3: Personalization (P1 — High)

**US-3.1: Watch History**
- As a user, I want my watch progress saved so I can resume later.
- **Acceptance Criteria:**
  - History stored in localStorage (up to 500 entries)
  - History entry includes: media ID, type, title, poster, timestamp, progress %, completed flag
  - "Continue Watching" section on homepage (if history exists)
  - User can manually clear history from settings
  - Oldest entries trimmed when limit reached

**US-3.2: Resume Playback**
- As a user, I want to resume from where I left off so I don't rewatch content.
- **Acceptance Criteria:**
  - Player starts at last saved timestamp (if progress > 5% and < 95%)
  - "Resume from X:XX" banner appears on detail page
  - Cross-device resume works via localStorage (same browser)
  - User can override and start from beginning

**US-3.3: Player Customization**
- As a user, I want to customize player appearance so it matches my preferences.
- **Acceptance Criteria:**
  - Settings drawer accessible from player page
  - Customizable: primary color, secondary color, icon style, icon color
  - Options: autoplay (on/off), show next button (on/off), player engine (default/JW)
  - Settings persist in localStorage
  - "Reset to defaults" option available

**US-3.4: Theme Toggle**
- As a user, I want to switch between dark and light mode so I can reduce eye strain.
- **Acceptance Criteria:**
  - Theme toggle in header
  - Respects system preference on first visit
  - Choice persists in localStorage
  - Smooth transition animation (200ms)
  - All components support both themes

---

### Epic 4: Content Details (P1 — High)

**US-4.1: View Movie Details**
- As a user, I want to see detailed movie information before watching.
- **Acceptance Criteria:**
  - Detail page shows: poster, backdrop, title, tagline, synopsis, runtime, release date, genres, rating, vote count
  - Cast section with photos (top 10)
  - Trailer embed (YouTube if available)
  - Similar movies carousel (10 items)
  - "Add to bookmarks" button (P2)

**US-4.2: View TV Show Details**
- As a user, I want to see show information and episode guide.
- **Acceptance Criteria:**
  - Detail page shows: poster, backdrop, title, synopsis, seasons count, episodes count, status (airing/ended), genres, rating
  - Season selector with episode count per season
  - Episode list for selected season (thumbnail, title, overview, air date, runtime)
  - Cast section (top 10)
  - Similar shows carousel

**US-4.3: View Anime Details**
- As a user, I want to see anime information from MyAnimeList.
- **Acceptance Criteria:**
  - Detail page shows: poster, title (English + Japanese), synopsis, episodes count, status, genres, rating, studios
  - Episode grid with numbers
  - Related anime section (if available)
  - Recommendations section

---

### Epic 5: Performance & Reliability (P0 — Critical)

**US-5.1: Fast Loading**
- As a user, I want the app to load quickly so I can start watching without delays.
- **Acceptance Criteria:**
  - TTFP (Time to First Paint) < 1.5s on 3G
  - LCP (Largest Contentful Paint) < 2.5s
  - TBT (Total Blocking Time) < 200ms
  - CLS (Cumulative Layout Shift) < 0.1
  - Images use blur placeholder + progressive loading

**US-5.2: Graceful Degradation**
- As a user, I want the app to handle errors gracefully so I'm not stuck on broken pages.
- **Acceptance Criteria:**
  - TMDB API failure: show cached data with "Refresh" banner
  - VidLink failure: show error state with retry button and fallback URL
  - Invalid media ID: 404 page with search suggestions
  - Missing poster: fallback placeholder image
  - Broken iframe: error message with "Try again" button
  - Network offline: offline banner, disable search, show cached content

**US-5.3: Offline Support (P2 — Medium)**
- As a user, I want to browse cached content when offline so I can still see what I watched.
- **Acceptance Criteria:**
  - Service worker caches homepage, visited detail pages
  - Offline banner appears when network lost
  - Search disabled offline
  - Watch history still accessible offline

---

## 4. Success Metrics

### 4.1 User Engagement
- **Daily Active Users (DAU):** Target 1,000 within first month
- **Session Duration:** Average > 15 minutes
- **Pages per Session:** Average > 5
- **Bounce Rate:** < 40%

### 4.2 Content Consumption
- **Plays per Session:** Average > 2
- **Completion Rate:** > 60% of started content watched to 90%+
- **Resume Rate:** > 30% of users return to continue watching
- **Search Success Rate:** > 80% of searches result in a play

### 4.3 Performance
- **Lighthouse Score:** > 90 (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals:** All metrics in "Good" range (green)
- **Error Rate:** < 0.1% of page loads
- **API Success Rate:** > 99.5%

### 4.4 Technical
- **Uptime:** 99.9% (measured monthly)
- **Deployment Frequency:** Weekly releases
- **Mean Time to Recovery (MTTR):** < 1 hour
- **Test Coverage:** > 80% unit, > 70% integration

---

## 5. Competitive Analysis

### 5.1 Netflix
**Strengths:**
- Massive original content library
- Sophisticated recommendation algorithm
- Multi-device sync, offline downloads
- 4K/HDR support

**Weaknesses:**
- Paid subscription required
- Content varies by region
- No anime-specific features (sub/dub toggle)

**Our Differentiation:**
- Free, no account required
- Aggregates from multiple sources (TMDB + MAL)
- Anime-first features (sub/dub, MAL integration)
- Customizable player appearance

---

### 5.2 Crunchyroll
**Strengths:**
- Largest anime library
- Simulcast (same-day as Japan)
- Community features (comments, forums)
- Manga section

**Weaknesses:**
- Anime-only (no movies/TV)
- Free tier has ads and limited catalog
- Sub-only for most free content
- Cluttered UI with ads

**Our Differentiation:**
- Movies + TV + Anime in one platform
- No ads (VidLink embeds)
- Sub and dub available for all anime
- Cleaner, modern UI

---

### 5.3 123Movies / Free Streaming Sites
**Strengths:**
- Free, no registration
- Large content library
- No ads (some sites)

**Weaknesses:**
- Unreliable (domains frequently shut down)
- Poor video quality
- Malware/pop-up risks
- No watch history or personalization
- Slow loading, broken players

**Our Differentiation:**
- Reliable hosting (Vercel)
- Modern, fast UI (Next.js)
- Watch history and resume
- Customizable player
- Secure (CSP, no malicious ads)

---

## 6. Monetization Model

### 6.1 Phase 1: Free (Months 1-6)
- No ads, no subscriptions
- Focus on user acquisition and retention
- Build community and gather feedback
- Optimize performance and features

**Costs:**
- TMDB API: Free (rate limited)
- Vercel Hosting: $20/month (Pro plan)
- Domain: $12/year
- Sentry: Free tier (5K errors/month)

**Total Monthly Cost:** ~$25

---

### 6.2 Phase 2: Optional Donations (Months 6-12)
- "Support Us" button in footer
- Ko-fi or Buy Me a Coffee integration
- No feature gating (all features remain free)
- Transparent cost breakdown page

**Target:** $100/month in donations (4 users × $25 or 20 users × $5)

---

### 6.3 Phase 3: Premium Tier (Year 2+)
**Free Tier (unchanged):**
- All current features
- Standard player settings
- Watch history (500 entries)

**Premium Tier ($3/month):**
- Extended watch history (unlimited)
- Cloud sync (cross-device history via account)
- Early access to new features
- No external links/promotions
- Premium player themes
- Priority support

**Monetization Goals:**
- 5% conversion rate from free to premium
- Break-even at 500 premium users ($1,500/month)
- Reinvest in better hosting, CDN, original features

---

## 7. Content Licensing & Legal Compliance

### 7.1 Content Sourcing
**TMDB (The Movie Database):**
- Metadata licensed under CC BY-NC 4.0
- Free for non-commercial use with attribution
- Rate limit: 50 requests/second per API key
- **Compliance:** Display "This product uses the TMDB API but is not endorsed or certified by TMDB"

**MyAnimeList (MAL):**
- Public API for metadata
- Free for non-commercial use
- Rate limit: 3 requests/second
- **Compliance:** Attribute MAL on anime detail pages

**VidLink.pro:**
- Third-party embedding service
- No official API documentation
- **Risk:** May host copyrighted content without authorization
- **Mitigation:**
  - Do not host any video files directly
  - Act as search/discovery platform only
  - Implement DMCA takedown process
  - Display disclaimer: "We do not host or upload any videos. All content is provided by unaffiliated third parties."

---

### 7.2 DMCA Compliance

**Takedown Process:**
1. Designate DMCA agent (register with U.S. Copyright Office)
2. Publish DMCA policy on `/dmca` page
3. Provide email: `dmca@movieapp.com`
4. Respond to takedown notices within 24 hours
5. Remove/disable access to infringing content
6. Notify user who posted content (if applicable)
7. Implement repeat infringer policy (ban after 3 strikes)

**Safe Harbor Protection:**
- No actual knowledge of infringement
- No financial benefit from specific infringing content
- Expeditious removal upon notification
- No direct hosting of video files

---

### 7.3 User Data & Privacy

**Data Collected:**
- **LocalStorage only:** watch history, player settings, theme preference, search history
- **No server-side user data** (no accounts, no tracking)
- **No cookies** (except Vercel analytics, opt-in)

**GDPR Compliance:**
- No personal data collected
- LocalStorage data can be cleared by user
- No third-party tracking scripts
- Privacy policy page explaining data practices

**CCPA Compliance:**
- "Do Not Sell My Personal Information" link (even though we don't sell data)
- Right to delete (clear localStorage button)
- No data sharing with third parties

---

## 8. Risks & Mitigation

### 8.1 Technical Risks

**Risk:** TMDB API rate limit exceeded  
**Probability:** Medium  
**Impact:** High (app becomes unusable)  
**Mitigation:**
- Implement request queuing and caching (TanStack Query)
- Show stale data with "Refresh" banner
- Use ISR (Incremental Static Regeneration) to reduce API calls
- Monitor quota usage in Sentry

**Risk:** VidLink.pro goes offline  
**Probability:** Medium  
**Impact:** Critical (no playback)  
**Mitigation:**
- Display error state with retry button
- Provide fallback URL if available
- Cache last known working URL
- Monitor VidLink uptime, notify users of outages

**Risk:** localStorage quota exceeded  
**Probability:** Low  
**Impact:** Medium (watch history broken)  
**Mitigation:**
- Catch `QuotaExceededError`
- Auto-trim oldest history entries
- Show warning when storage > 80% full
- Offer "Clear history" option

---

### 8.2 Business Risks

**Risk:** Legal action from copyright holders  
**Probability:** Medium  
**Impact:** Critical (shutdown)  
**Mitigation:**
- Strict DMCA compliance
- No direct hosting of content
- Legal disclaimer on all pages
- Consult IP attorney before launch
- Consider hosting in DMCA-friendly jurisdiction

**Risk:** VidLink.pro changes API/breaks embeds  
**Probability:** High  
**Impact:** High (playback broken)  
**Mitigation:**
- Monitor VidLink for changes
- Abstract VidLink logic (easy to swap providers)
- Maintain list of alternative embed sources
- Community feedback channel for broken links

**Risk:** Low user adoption  
**Probability:** Medium  
**Impact:** Medium (project fails)  
**Mitigation:**
- Focus on SEO (metadata, structured data)
- Share on Reddit, Discord communities
- Optimize for mobile (majority of traffic)
- Iterate based on user feedback
- Consider paid promotion if budget allows

---

## 9. Roadmap

### Q3 2026 (Launch)
- **Week 1-2:** Foundation (setup, API integration, base UI)
- **Week 3-4:** Player & detail pages (movie, TV, anime)
- **Week 5:** Personalization (history, resume, settings)
- **Week 6:** Testing & QA (unit, integration, E2E)
- **Week 7:** DevOps (CI/CD, monitoring, deployment)
- **Week 8:** Launch prep (SEO, legal pages, beta testing)

### Q4 2026 (Growth)
- User accounts (optional, for cloud sync)
- Bookmarks/watchlist feature
- Recommendations engine (collaborative filtering)
- Mobile app (React Native, PWA)
- Multi-language support (i18n)

### Q1 2027 (Monetization)
- Premium tier launch
- Payment integration (Stripe)
- Cloud sync for premium users
- Advanced analytics dashboard
- A/B testing framework

### Q2 2027 (Scale)
- CDN for static assets
- Edge functions for personalization
- Machine learning recommendations
- Community features (reviews, ratings)
- API for third-party integrations

---

## 10. Stakeholders & Approval

**Product Owner:** Sarah Chen (sarah@movieapp.com)  
**Engineering Lead:** Alex Rodriguez (alex@movieapp.com)  
**Design Lead:** Jordan Kim (jordan@movieapp.com)  
**Legal Counsel:** Michael Torres (michael@movieapp.com)

**Approval Signatures:**
- [ ] Product Owner — June 25, 2026
- [ ] Engineering Lead — June 25, 2026
- [ ] Legal Counsel — June 26, 2026

---

## Appendix A: Glossary

- **TTFP:** Time to First Paint — when browser renders first pixels
- **LCP:** Largest Contentful Paint — when largest element becomes visible
- **TBT:** Total Blocking Time — time page is unresponsive during load
- **CLS:** Cumulative Layout Shift — visual stability metric
- **ISR:** Incremental Static Regeneration — Next.js feature for updating static pages
- **DMCA:** Digital Millennium Copyright Act — U.S. copyright law
- **SSR:** Server-Side Rendering — rendering on server for each request
- **SSG:** Static Site Generation — pre-rendering at build time

---

## Appendix B: User Flow Diagrams

### B.1 Search → Watch Flow
```
Homepage → Search Bar → Type Query → Debounce (500ms) → API Call → Display Results
  → Click Media Card → Detail Page → Click Play → Video Player → Track Progress → Save to History
```

### B.2 Resume Watching Flow
```
Homepage → "Continue Watching" Section → Click Media Card → Detail Page
  → Show "Resume from X:XX" Banner → Click Resume → Video Player (startAt=X) → Continue Watching
```

### B.3 TV Episode Selection Flow
```
Search/Browse → Click TV Show → Detail Page → Select Season (Dropdown)
  → Episode List Appears → Click Episode → Video Player (tmdbId/season/episode) → Track Progress
```

---

**Document End**
