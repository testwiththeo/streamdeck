# Security Checklist
## Movie Streaming Web Application

**Version:** 1.0  
**Date:** June 20, 2026  
**Status:** Active

---

## 1. Content Security Policy (CSP)

### 1.1 CSP Header Configuration

The application shall enforce a strict Content Security Policy via Next.js middleware.

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://vidlink.pro https://*.vercel-analytics.com https://*.sentry.io",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' https://image.tmdb.org https://*.myanimelist.net https://*.mynextup.net data: blob:",
    "frame-src https://vidlink.pro https://www.youtube.com https://www.youtube-nocookie.com",
    "connect-src 'self' https://api.themoviedb.org https://api.myanimelist.net https://vidlink.pro https://*.sentry.io https://*.vercel-analytics.com",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ');

  response.headers.set('Content-Security-Policy', cspHeader);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### 1.2 CSP Verification Checklist

- [ ] CSP header present on all HTML responses
- [ ] No `unsafe-eval` in script-src
- [ ] `object-src` set to `'none'` (no Flash/Java)
- [ ] `frame-ancestors` set to `'none'` (prevent clickjacking of our app)
- [ ] `upgrade-insecure-requests` enabled in production
- [ ] CSP violations logged to Sentry
- [ ] Tested in report-only mode before enforcing

---

## 2. iframe Security

### 2.1 VidLink.pro Embed Security

All VidLink iframes must use restrictive sandbox attributes.

```typescript
// src/components/player/VideoPlayer.tsx
<iframe
  src={vidLinkUrl}
  title="Video Player"
  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
  allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
  referrerPolicy="no-referrer"
  loading="lazy"
  className="aspect-video w-full"
/>
```

### 2.2 iframe Security Checklist

- [ ] `sandbox` attribute set (restricts iframe capabilities)
- [ ] `allow-same-origin` included (required for VidLink to function)
- [ ] `allow-scripts` included (required for player JavaScript)
- [ ] `allow-forms` included (for player controls that use forms)
- [ ] `allow-popups` included (for share/open in new tab features)
- [ ] `allow-top-navigation` **NOT** included (prevents iframe from navigating our page)
- [ ] `allow-modals` **NOT** included (prevents iframe from opening modals on our page)
- [ ] `referrerPolicy="no-referrer"` set (prevent leaking our URL)
- [ ] `loading="lazy"` for below-the-fold iframes
- [ ] CSP `frame-src` restricts allowed iframe origins to VidLink and YouTube only
- [ ] iframe `title` attribute set for accessibility

### 2.3 iframe Threat Mitigation

| Threat | Mitigation |
|--------|-----------|
| Clickjacking (our app framed) | `frame-ancestors 'none'` in CSP, `X-Frame-Options: DENY` |
| Malicious iframe navigation | No `allow-top-navigation` in sandbox |
| Data exfiltration via iframe | `referrerPolicy="no-referrer"`, CSP connect-src |
| iframe XSS | Sandbox restricts iframe JS scope |
| Phishing overlay | Our app cannot be framed (X-Frame-Options: DENY) |

---

## 3. HTTP Security Headers

### 3.1 Required Headers

All responses shall include the following security headers via Next.js middleware:

| Header | Value | Purpose |
|--------|-------|---------|
| `Content-Security-Policy` | (see Section 1) | Restrict resource loading |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME-type sniffing |
| `X-Frame-Options` | `DENY` | Prevent our app from being framed |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer information |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` | Restrict browser features |
| `X-XSS-Protection` | `0` | Disable legacy XSS auditor (CSP is sufficient) |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Force HTTPS (2 years) |

### 3.2 Header Verification

```typescript
// src/middleware.ts (continued)
response.headers.set('X-Content-Type-Options', 'nosniff');
response.headers.set('X-Frame-Options', 'DENY');
response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
response.headers.set('X-XSS-Protection', '0');
response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
```

- [ ] All security headers present in production responses
- [ ] Headers verified via securityheaders.com scan (target: A+ rating)
- [ ] HSTS preload list submission considered for production domain

---

## 4. Input Sanitization

### 4.1 Search Query Sanitization

```typescript
// src/lib/utils/sanitize.ts

/**
 * Sanitize search query to prevent XSS and injection
 */
export function sanitizeSearchQuery(query: string): string {
  // Remove HTML tags
  const withoutTags = query.replace(/<[^>]*>/g, '');

  // Remove control characters
  const withoutControl = withoutTags.replace(/[\x00-\x1F\x7F]/g, '');

  // Trim whitespace
  const trimmed = withoutControl.trim();

  // Limit length (prevent DoS via long queries)
  const limited = trimmed.slice(0, 200);

  return limited;
}

/**
 * Sanitize URL parameters to prevent open redirect and injection
 */
export function sanitizeUrlParam(param: string | null): string {
  if (!param) return '';
  // Only allow alphanumeric, hyphens, underscores, spaces
  return param.replace(/[^a-zA-Z0-9\-_\s]/g, '').slice(0, 100);
}
```

### 4.2 Input Validation

| Input | Validation | Sanitization |
|-------|-----------|-------------|
| Search query | Max 200 chars, no HTML | Strip tags, control chars |
| URL path params (IDs) | Must be numeric | `parseInt()` with NaN check |
| Genre slug | Must match known genres | Whitelist validation |
| Player color params | Must be valid hex (6 chars) | Regex: `/^[0-9A-Fa-f]{6}$/` |
| startAt parameter | Must be non-negative number | `Math.max(0, parseInt(val))` |

### 4.3 React XSS Protection

- [ ] No use of `dangerouslySetInnerHTML` anywhere in the codebase
- [ ] All user-provided content rendered via JSX (React escapes by default)
- [ ] URL parameters validated before use in navigation
- [ ] No `eval()`, `new Function()`, or `innerHTML` assignments

---

## 5. API Security

### 5.1 TMDB API Key Protection

```typescript
// .env.local (NEVER commit to git)
NEXT_PUBLIC_TMDB_API_KEY=your_key_here

// .gitignore
.env.local
.env.production.local
```

**Note:** Since TMDB API key is used client-side (NEXT_PUBLIC_), it is exposed to users. This is acceptable per TMDB's terms for non-commercial applications. Mitigations:

- [ ] API key restricted to our domain (if TMDB supports referrer restrictions)
- [ ] Rate limiting implemented client-side (max 50 req/s)
- [ ] Key rotated quarterly
- [ ] Key usage monitored via TMDB dashboard
- [ ] No sensitive operations possible with this key (read-only API)

### 5.2 Rate Limiting (Client-Side)

```typescript
// src/lib/api/rate-limiter.ts

class RateLimiter {
  private queue: Array<() => Promise<unknown>> = [];
  private activeRequests = 0;
  private readonly maxConcurrent: number;
  private readonly requestsPerSecond: number;
  private timestamps: number[] = [];

  constructor(maxConcurrent: number, requestsPerSecond: number) {
    this.maxConcurrent = maxConcurrent;
    this.requestsPerSecond = requestsPerSecond;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    await this.waitForSlot();
    this.activeRequests++;
    this.timestamps.push(Date.now());

    try {
      return await fn();
    } finally {
      this.activeRequests--;
      this.processQueue();
    }
  }

  private async waitForSlot(): Promise<void> {
    // Clean old timestamps
    const now = Date.now();
    this.timestamps = this.timestamps.filter((t) => now - t < 1000);

    if (
      this.activeRequests < this.maxConcurrent &&
      this.timestamps.length < this.requestsPerSecond
    ) {
      return;
    }

    return new Promise((resolve) => {
      this.queue.push(resolve as () => Promise<unknown>);
    });
  }

  private processQueue(): void {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next?.();
    }
  }
}

// TMDB rate limiter: 40 concurrent, 40 per second (below 50 limit for safety)
export const tmdbRateLimiter = new RateLimiter(40, 40);

// MAL rate limiter: 2 concurrent, 2 per second (below 3 limit for safety)
export const malRateLimiter = new RateLimiter(2, 2);
```

### 5.3 API Response Validation

- [ ] All API responses validated against expected schema before use
- [ ] Unexpected fields in responses ignored (not passed to UI)
- [ ] Numeric IDs validated as positive integers
- [ ] URLs from API responses validated before use in `src` or `href` attributes
- [ ] HTML content from API responses escaped before rendering

---

## 6. Authentication & Session Security

### 6.1 Current State (No Auth)

The application currently does not implement user authentication. All data is stored client-side.

**Security implications:**
- [x] No session tokens to steal (no server-side sessions)
- [x] No CSRF risk (no cookie-based auth)
- [x] No password storage risk
- [x] No user data on server to breach

**localStorage risks:**
- [ ] localStorage accessible to any JavaScript on the same origin
- [ ] XSS vulnerability could expose watch history and settings
- [ ] Mitigation: Strict CSP prevents injected scripts from executing
- [ ] Mitigation: No sensitive data stored (only preferences and history)

### 6.2 Future Auth Considerations (Phase 2+)

When implementing user accounts:

- [ ] Use NextAuth.js or Auth.js for authentication
- [ ] Implement JWT with short expiration (15 minutes)
- [ ] Store refresh tokens in httpOnly cookies
- [ ] Implement CSRF tokens for state-changing operations
- [ ] Rate limit login attempts (5 per minute)
- [ ] Implement account lockout after 10 failed attempts
- [ ] Use bcrypt for password hashing (cost factor 12)
- [ ] Implement email verification
- [ ] Add two-factor authentication option

---

## 7. Dependency Security

### 7.1 Automated Scanning

- [ ] **Dependabot** enabled on GitHub repository
  - Weekly scans for vulnerable dependencies
  - Automatic PRs for security updates
  - Configuration in `.github/dependabot.yml`

- [ ] **npm audit** run in CI pipeline on every PR
  - Block merge if critical/high vulnerabilities found
  - Allow medium/low with documented acceptance

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
      - "security"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

### 7.2 Dependency Policy

| Severity | Action | Timeline |
|----------|--------|----------|
| Critical | Patch immediately, block deployment | 24 hours |
| High | Patch in next sprint | 1 week |
| Medium | Evaluate and patch if applicable | 1 month |
| Low | Track, patch when convenient | Next release |

### 7.3 Dependency Verification Checklist

- [ ] All dependencies installed from official npm registry only
- [ ] No post-install scripts from untrusted packages (`npm install --ignore-scripts` for unknown deps)
- [ ] Lock file (`package-lock.json`) committed and used in CI (`npm ci`)
- [ ] No unused dependencies in `package.json`
- [ ] Dependencies pinned to specific versions (no `^` or `~` in production deps)
- [ ] Regular review of dependency tree for unnecessary transitive dependencies

---

## 8. Secret Management

### 8.1 Environment Variables

```bash
# .env.local (development — NEVER commit)
NEXT_PUBLIC_TMDB_API_KEY=xxx
NEXT_PUBLIC_MAL_CLIENT_ID=xxx
SENTRY_DSN=xxx

# .env.production (Vercel — set via dashboard)
# Same variables configured in Vercel project settings
```

### 8.2 Secret Scanning

- [ ] GitHub secret scanning enabled
- [ ] Push protection enabled (blocks commits containing secrets)
- [ ] Custom patterns defined for TMDB API keys
- [ ] `.gitignore` includes all `.env*` files (except `.env.example`)

```gitignore
# .gitignore
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 8.3 Secret Rotation

| Secret | Rotation Frequency | Process |
|--------|-------------------|---------|
| TMDB API Key | Quarterly | Regenerate in TMDB dashboard, update Vercel env vars |
| MAL Client ID | Quarterly | Regenerate in MAL API settings, update Vercel env vars |
| Sentry DSN | As needed | Regenerate if compromised |

---

## 9. Data Protection

### 9.1 Client-Side Data

**Data stored in localStorage:**
- Watch history (media IDs, titles, timestamps, progress)
- Player settings (colors, autoplay preference)
- Theme preference
- Search history (last 10 queries)
- Anime sub/dub preference

**Risk assessment:** Low — no personally identifiable information (PII) stored.

### 9.2 Data Protection Checklist

- [ ] No PII collected or stored
- [ ] No tracking cookies or third-party analytics scripts
- [ ] User can clear all stored data via "Clear History" button
- [ ] Data encrypted at rest (browser-level encryption via HTTPS)
- [ ] Data transmitted over HTTPS only (HSTS enforced)
- [ ] No data sent to third parties except TMDB/MAL API calls (which are read-only)
- [ ] Privacy policy page explaining data practices

### 9.3 GDPR Compliance

- [ ] No personal data collected (localStorage data stays on device)
- [ ] No cookies used for tracking (only functional localStorage)
- [ ] "Right to erasure" implemented via "Clear History" button
- [ ] Privacy policy accessible at `/privacy`
- [ ] No data transfer to third countries (all processing client-side)

### 9.4 CCPA Compliance

- [ ] "Do Not Sell My Personal Information" link in footer
- [ ] No data sold to third parties
- [ ] No sharing of data with advertisers
- [ ] Opt-out mechanism provided (clear localStorage)

---

## 10. Error Handling & Information Disclosure

### 10.1 Production Error Handling

- [ ] Stack traces never exposed to users in production
- [ ] Error pages show generic message ("Something went wrong")
- [ ] Detailed errors logged to Sentry (not console)
- [ ] API error responses don't leak internal details (server IPs, database info)
- [ ] 404 pages don't reveal technology stack
- [ ] Debug mode disabled in production (`NODE_ENV=production`)

### 10.2 Sentry Configuration

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% of transactions for performance monitoring
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Scrub sensitive data
  beforeSend(event) {
    // Remove localStorage contents from error reports
    if (event.extra?.localStorage) {
      event.extra.localStorage = '[REDACTED]';
    }
    return event;
  },

  // Don't capture certain errors
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    'Loading chunk',
  ],
});
```

### 10.3 Information Disclosure Prevention

- [ ] Server headers don't reveal technology (X-Powered-By removed)
- [ ] Error messages don't include file paths or stack traces
- [ ] API responses don't include internal metadata
- [ ] Source maps not publicly accessible (uploaded to Sentry only)
- [ ] `.env` files not accessible via web server
- [ ] `robots.txt` configured to prevent indexing of sensitive paths

---

## 11. Network Security

### 11.1 HTTPS Enforcement

- [ ] All traffic served over HTTPS (Vercel enforces this)
- [ ] HSTS header set with 2-year max-age
- [ ] HSTS preload list submission for production domain
- [ ] Mixed content blocked (CSP `upgrade-insecure-requests`)

### 11.2 External API Communication

| API | Protocol | Verification |
|-----|----------|-------------|
| TMDB | HTTPS | TLS 1.2+ enforced by TMDB |
| MyAnimeList | HTTPS | TLS 1.2+ enforced by MAL |
| VidLink.pro | HTTPS | iframe loaded over HTTPS |
| YouTube | HTTPS | Embeds use HTTPS |
| Sentry | HTTPS | TLS 1.2+ enforced by Sentry |

### 11.3 DNS Security

- [ ] DNSSEC enabled on domain (if supported by registrar)
- [ ] CAA record configured to restrict certificate authorities
- [ ] No wildcard DNS records pointing to application

---

## 12. Monitoring & Incident Response

### 12.1 Security Monitoring

- [ ] Sentry configured for error tracking (security-relevant errors flagged)
- [ ] Vercel Analytics for traffic monitoring (unusual spikes detected)
- [ ] GitHub security alerts enabled (Dependabot, secret scanning)
- [ ] CSP violation reports monitored (via `report-uri` or `report-to` directive)

### 12.2 Incident Response Plan

**Severity Levels:**

| Level | Definition | Response Time | Action |
|-------|-----------|--------------|--------|
| P0 | Active breach, data exfiltration | Immediate | Take app offline, investigate, notify users |
| P1 | Critical vulnerability discovered | 4 hours | Patch and deploy emergency fix |
| P2 | High-severity vulnerability | 24 hours | Patch in next deployment |
| P3 | Medium-severity issue | 1 week | Schedule fix |

**Response Steps:**
1. **Detect:** Automated alerts (Sentry, GitHub) or manual report
2. **Assess:** Determine severity and scope
3. **Contain:** Disable affected feature or take app offline
4. **Fix:** Implement and test patch
5. **Deploy:** Emergency deployment via Vercel
6. **Communicate:** Notify affected users if necessary
7. **Review:** Post-mortem within 48 hours, update security measures

---

## 13. Security Audit Checklist

### Pre-Launch Audit

- [ ] All security headers present and verified
- [ ] CSP tested in report-only mode, then enforced
- [ ] Iframe sandbox attributes verified
- [ ] Input sanitization implemented for all user inputs
- [ ] No `dangerouslySetInnerHTML` usage
- [ ] No hardcoded secrets in source code
- [ ] `.gitignore` covers all sensitive files
- [ ] npm audit passes with no critical/high vulnerabilities
- [ ] Dependency scan clean (Dependabot)
- [ ] Secret scanning enabled and tested
- [ ] HTTPS enforced, HSTS configured
- [ ] Error pages don't leak information
- [ ] Sentry configured with data scrubbing
- [ ] Rate limiting implemented for API calls
- [ ] localStorage quota handling implemented
- [ ] Privacy policy and terms of service pages live
- [ ] DMCA takedown process documented
- [ ] Security contact email published (security@movieapp.com)
- [ ] Penetration test results reviewed (if applicable)
- [ ] OWASP Top 10 checklist completed

### OWASP Top 10 (2021) Self-Assessment

| # | Category | Status | Notes |
|---|---------|--------|-------|
| A01 | Broken Access Control | ✅ N/A | No server-side auth; client-side only |
| A02 | Cryptographic Failures | ✅ Mitigated | HTTPS enforced, no sensitive data stored |
| A03 | Injection | ✅ Mitigated | Input sanitization, React XSS protection |
| A04 | Insecure Design | ✅ Mitigated | Security-first architecture, threat modeling |
| A05 | Security Misconfiguration | ✅ Mitigated | CSP, security headers, HSTS |
| A06 | Vulnerable Components | ✅ Mitigated | Dependabot, npm audit in CI |
| A07 | Authentication Failures | ✅ N/A | No authentication implemented |
| A08 | Software & Data Integrity | ✅ Mitigated | Lock file, npm ci, signed commits |
| A09 | Security Logging | ✅ Mitigated | Sentry error tracking, CSP violation reports |
| A10 | Server-Side Request Forgery | ✅ N/A | No server-side requests to user-provided URLs |

---

## 14. Legal & Compliance

### 14.1 DMCA Compliance

- [ ] DMCA agent designated and registered
- [ ] DMCA policy page published at `/dmca`
- [ ] Takedown email address published: `dmca@movieapp.com`
- [ ] Repeat infringer policy documented
- [ ] No direct hosting of copyrighted content
- [ ] Disclaimer displayed: "We do not host or upload any videos"

### 14.2 Licensing

- [ ] TMDB attribution displayed: "This product uses the TMDB API but is not endorsed or certified by TMDB"
- [ ] MyAnimeList attribution on anime pages
- [ ] Open-source licenses page (`/licenses`) listing all dependencies
- [ ] License generation script: `npx license-checker --out licenses.html`

---

**Document End**
