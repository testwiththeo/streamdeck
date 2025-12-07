# Coding Standards Document
## Movie Streaming Web Application

**Version:** 1.0  
**Date:** June 20, 2026  
**Status:** Active

---

## 1. General Principles

1. **Readability over cleverness** — Write code that a new team member can understand in 5 minutes.
2. **Explicit over implicit** — Prefer clear, verbose code over magic abstractions.
3. **Type safety** — All code must pass TypeScript strict mode (`tsc --strict`).
4. **Single Responsibility** — Each file, component, and function does one thing.
5. **DRY but not over-abstracted** — Extract repeated logic, but don't abstract prematurely.

---

## 2. Code Formatting

### 2.1 Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "jsxSingleQuote": false
}
```

### 2.2 ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier', // Must be last to override other configs
  ],
  plugins: ['@typescript-eslint', 'react', 'jsx-a11y', 'import'],
  rules: {
    // TypeScript
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

    // React
    'react/react-in-jsx-scope': 'off', // Next.js handles this
    'react/prop-types': 'off', // We use TypeScript
    'react-hooks/exhaustive-deps': 'warn',

    // Accessibility
    'jsx-a11y/anchor-is-valid': 'off', // Next.js Link is valid

    // Import ordering
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [
          { pattern: 'react', group: 'builtin', position: 'before' },
          { pattern: 'next/**', group: 'builtin', position: 'before' },
          { pattern: '@/**', group: 'internal' },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],

    // General
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
  },
};
```

### 2.3 Editor Integration

**VS Code Settings (`.vscode/settings.json`):**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## 3. Naming Conventions

### 3.1 File Naming

| Type | Convention | Example |
|------|-----------|---------|
| React Components | `PascalCase.tsx` | `VideoPlayer.tsx`, `MediaCard.tsx` |
| Hooks | `camelCase.ts` | `useDebounce.ts`, `useWatchHistory.ts` |
| Utilities | `camelCase.ts` | `format.ts`, `storage.ts`, `cn.ts` |
| Types | `camelCase.types.ts` | `tmdb.types.ts`, `player.types.ts` |
| Stores | `kebab-case-store.ts` | `settings-store.ts`, `history-store.ts` |
| Constants | `camelCase.ts` | `genres.ts`, `defaults.ts`, `routes.ts` |
| Tests | `*.test.ts(x)` | `vidlink.test.ts`, `VideoPlayer.test.tsx` |
| Pages (App Router) | `page.tsx` | `app/(main)/movie/[id]/page.tsx` |
| Layouts | `layout.tsx` | `app/layout.tsx`, `app/(main)/layout.tsx` |

### 3.2 Code Naming

| Element | Convention | Example |
|---------|-----------|---------|
| Components | `PascalCase` | `VideoPlayer`, `MediaCard` |
| Interfaces | `PascalCase` | `VideoPlayerProps`, `WatchHistoryEntry` |
| Types (alias) | `PascalCase` | `MediaType`, `PlayerOptions` |
| Enums | `PascalCase` | `TMDBErrorCode` |
| Functions | `camelCase` | `buildVidLinkUrl`, `formatRuntime` |
| Variables | `camelCase` | `watchHistory`, `playerSettings` |
| Constants | `SCREAMING_SNAKE_CASE` | `DEFAULT_PLAYER_SETTINGS`, `MAX_HISTORY_ENTRIES` |
| React Hooks | `usePascalCase` | `useDebounce`, `useWatchHistory` |
| Zustand Stores | `usePascalCaseStore` | `useSettingsStore`, `useHistoryStore` |
| CSS Classes | `kebab-case` (Tailwind) | `bg-primary`, `text-white` |
| LocalStorage Keys | `kebab-case:kebab-case` | `movie-app:settings`, `movie-app:history` |

### 3.3 Component Naming

```typescript
// GOOD: Descriptive, specific
export function VideoPlayer({ ... }: VideoPlayerProps) { ... }
export function MediaCard({ ... }: MediaCardProps) { ... }
export function SeasonSelector({ ... }: SeasonSelectorProps) { ... }

// BAD: Vague, generic
export function Player({ ... }) { ... }
export function Card({ ... }) { ... }
export function Selector({ ... }) { ... }
```

### 3.4 Props Naming

```typescript
// GOOD: Typed, explicit
interface VideoPlayerProps {
  type: MediaType;
  tmdbId?: number;
  onProgress?: (progress: number) => void;
}

// BAD: Untyped, abbreviated
interface Props {
  t: string;
  id: number;
  cb: (p: number) => void;
}
```

---

## 4. File Structure

### 4.1 Project Layout

```
src/
  app/                    # Next.js App Router pages
  components/             # React components
    layout/               # Header, Footer, MobileNav
    player/               # VideoPlayer, settings, error
    ui/                   # Primitives: Button, Card, Input, etc.
    media/                # MediaCard, MediaGrid, MediaCarousel
    tv/                   # SeasonSelector, EpisodeList
    anime/                # Anime-specific components
  lib/                    # Shared logic
    api/                  # API clients (tmdb.ts, vidlink.ts, mal.ts)
    types/                # TypeScript type definitions
    constants/            # App-wide constants
    utils/                # Pure utility functions
  hooks/                  # Custom React hooks
  store/                  # Zustand stores
  providers/              # React context providers
  styles/                 # Global CSS
  __tests__/              # Test files
    unit/
    integration/
    e2e/
```

### 4.2 Component File Structure

Each component should follow this internal structure:

```typescript
// 1. Type imports (if needed)
import type { MediaType, PlayerOptions } from '@/lib/types/app.types';

// 2. External library imports
import { useState, useEffect } from 'react';
import Image from 'next/image';

// 3. Internal imports (absolute paths)
import { cn } from '@/lib/utils/cn';
import { useWatchHistory } from '@/hooks/useWatchHistory';

// 4. Local imports (relative paths)
import { EpisodeCard } from './EpisodeCard';

// 5. Type definitions (if component-specific)
interface VideoPlayerProps {
  type: MediaType;
  tmdbId?: number;
  // ...
}

// 6. Constants (if component-specific)
const PROGRESS_INTERVALS = [10, 25, 50, 75, 90, 100];

// 7. Component implementation
export function VideoPlayer({ type, tmdbId, ... }: VideoPlayerProps) {
  // Hooks first
  const [isPlaying, setIsPlaying] = useState(false);
  const { addEntry } = useWatchHistory();

  // Effects
  useEffect(() => {
    // ...
  }, []);

  // Handlers
  const handleProgress = (progress: number) => {
    // ...
  };

  // Render
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
}
```

### 4.3 Barrel Exports

Use `index.ts` files sparingly. Only for tightly related modules:

```typescript
// src/components/ui/index.ts
export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';
export { Skeleton } from './Skeleton';
export { Spinner } from './Spinner';
```

**Avoid** barrel exports for large directories (causes tree-shaking issues in Next.js).

### 4.4 Absolute Imports

Always use `@/` alias for imports from `src/`:

```typescript
// GOOD
import { MediaCard } from '@/components/media/MediaCard';
import { useDebounce } from '@/hooks/useDebounce';
import { buildVidLinkUrl } from '@/lib/api/vidlink';

// BAD
import { MediaCard } from '../../../components/media/MediaCard';
import { useDebounce } from '../../hooks/useDebounce';
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 5. React Patterns

### 5.1 Server vs Client Components

**Default to Server Components.** Only add `'use client'` when needed.

```typescript
// Server Component (default) — runs on server, no JS sent to client
export default async function MoviePage({ params }: { params: { id: string } }) {
  const movie = await getMovie(Number(params.id));
  return <MediaDetail media={movie} />;
}

// Client Component — 'use client' directive at top
'use client';
export function VideoPlayer({ ... }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  // ...
}
```

**When to use Client Components:**
- `useState`, `useEffect`, `useReducer` or other hooks
- Event listeners (`onClick`, `onChange`, etc.)
- Browser APIs (`localStorage`, `window`, `IntersectionObserver`)
- Class components

### 5.2 Component Size Limits

| Metric | Limit | Action if Exceeded |
|--------|-------|-------------------|
| Lines of code | 200 | Extract sub-components |
| Props count | 5 | Group into objects |
| Hooks count | 7 | Extract custom hook |
| Nesting depth | 4 | Extract sub-components |

### 5.3 Prop Patterns

```typescript
// GOOD: Grouped props for complex components
interface VideoPlayerProps {
  // Identity
  type: MediaType;
  tmdbId?: number;
  malId?: number;

  // Configuration
  options?: PlayerOptions;

  // Callbacks
  onProgress?: (progress: number) => void;
  onError?: (error: PlayerError) => void;

  // Styling
  className?: string;
}

// GOOD: Discriminated unions for mutually exclusive props
type ModalProps =
  | { isOpen: true; onClose: () => void; children: React.ReactNode }
  | { isOpen: false; onClose?: never; children?: never };
```

### 5.4 Conditional Rendering

```typescript
// GOOD: Early return for simple conditions
if (!data) return <Skeleton />;

// GOOD: Ternary for binary conditions
{isLoggedIn ? <UserMenu /> : <LoginButton />}

// GOOD: Logical AND for presence checks
{items.length > 0 && <ItemList items={items} />}

// BAD: Nested ternaries
{a ? b ? c : d : e}  // Extract to variable or if/else
```

### 5.5 Key Prop

```typescript
// GOOD: Stable, unique ID
{items.map((item) => (
  <MediaCard key={item.id} {...item} />
))}

// BAD: Array index (breaks on reorder/filter)
{items.map((item, index) => (
  <MediaCard key={index} {...item} />
))}
```

---

## 6. TypeScript Patterns

### 6.1 Strict Mode

All code must pass `tsc --strict`. Key rules:

```typescript
// GOOD: Explicit null checks
function getPosterUrl(path: string | null): string {
  if (!path) return '/placeholder-poster.jpg';
  return `https://image.tmdb.org/t/p/w342${path}`;
}

// BAD: Non-null assertion
function getPosterUrl(path: string | null): string {
  return `https://image.tmdb.org/t/p/w342${path!}`;
}
```

### 6.2 Type Definitions

```typescript
// GOOD: Interface for object shapes, type for unions/intersections
interface VideoPlayerProps {
  type: MediaType;
  tmdbId?: number;
}

type MediaType = 'movie' | 'tv' | 'anime';
type SearchResult = MovieResult | TVResult | PersonResult;
type WithTimestamp<T> = T & { timestamp: number };

// GOOD: Exhaustive switch statements
function getMediaUrl(type: MediaType, id: number): string {
  switch (type) {
    case 'movie':
      return `/movie/${id}`;
    case 'tv':
      return `/tv/${id}`;
    case 'anime':
      return `/anime/${id}`;
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}
```

### 6.3 Avoid `any`

```typescript
// GOOD: Proper typing
function parseJSON<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

// BAD: any
function parseJSON(json: string): any {
  return JSON.parse(json);
}

// ACCEPTABLE: unknown with type guard
function isWatchHistoryEntry(value: unknown): value is WatchHistoryEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    'mediaId' in value &&
    'type' in value &&
    'progress' in value
  );
}
```

### 6.4 Async/Await

```typescript
// GOOD: Explicit async/await with error handling
async function fetchMovie(id: number): Promise<TMDBMovieDetail> {
  const response = await fetch(`${TMDB_BASE}/movie/${id}?api_key=${API_KEY}`);
  if (!response.ok) {
    throw new TMDBError(response.status, `Failed to fetch movie ${id}`);
  }
  return response.json();
}

// BAD: Mixing promises and async/await
function fetchMovie(id: number) {
  return fetch(`${TMDB_BASE}/movie/${id}?api_key=${API_KEY}`)
    .then((res) => res.json());
}
```

---

## 7. Error Handling

### 7.1 Custom Error Classes

```typescript
// src/lib/errors.ts

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class TMDBError extends AppError {
  constructor(statusCode: number, message: string) {
    super(message, 'TMDB_ERROR', statusCode);
    this.name = 'TMDBError';
  }
}

export class StorageError extends AppError {
  constructor(message: string) {
    super(message, 'STORAGE_ERROR');
    this.name = 'StorageError';
  }
}
```

### 7.2 Result Pattern (for non-throwing errors)

```typescript
// For operations where throwing is inappropriate (e.g., localStorage)

type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

function getFromStorage<T>(key: string): Result<T, StorageError> {
  try {
    const item = localStorage.getItem(key);
    if (!item) return { success: false, error: new StorageError('Key not found') };
    return { success: true, data: JSON.parse(item) as T };
  } catch (e) {
    return { success: false, error: new StorageError(String(e)) };
  }
}
```

### 7.3 Error Boundaries

```typescript
// Wrap every page route with ErrorBoundary
<ErrorBoundary fallback={<ErrorFallback />}>
  <MovieDetailPage />
</ErrorBoundary>

// Use error.tsx in App Router for route-level boundaries
// src/app/movie/[id]/error.tsx
'use client';
export default function MovieError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try Again</button>
    </div>
  );
}
```

---

## 8. Testing Conventions

### 8.1 File Naming

| Test Type | Location | Naming |
|-----------|----------|--------|
| Unit tests | `src/__tests__/unit/` | `*.test.ts` |
| Integration tests | `src/__tests__/integration/` | `*.test.tsx` |
| E2E tests | `src/__tests__/e2e/` | `*.spec.ts` |

### 8.2 Test Structure

```typescript
// Follow describe/it pattern with clear descriptions
describe('buildVidLinkUrl', () => {
  describe('movie URLs', () => {
    it('should build basic movie URL with tmdbId', () => { ... });
    it('should append player options as query params', () => { ... });
    it('should handle undefined options gracefully', () => { ... });
  });

  describe('TV show URLs', () => {
    it('should build TV URL with tmdbId, season, and episode', () => { ... });
    it('should throw if season or episode is missing', () => { ... });
  });

  describe('anime URLs', () => {
    it('should build anime URL with malId, episode, and sub/dub', () => { ... });
    it('should include fallback=true for anime', () => { ... });
  });
});
```

### 8.3 Test Naming Convention

```typescript
// Format: should [expected behavior] when [condition]
it('should return empty array when history is empty', () => { ... });
it('should trim oldest entry when history exceeds 500 items', () => { ... });
it('should throw TMDBError when API returns 401', () => { ... });
it('should debounce search query by 500ms', () => { ... });
```

### 8.4 Mocking

```typescript
// Mock external APIs, not internal logic
vi.mock('@/lib/api/tmdb', () => ({
  tmdbClient: {
    getMovie: vi.fn().mockResolvedValue(mockMovie),
    searchMulti: vi.fn().mockResolvedValue(mockSearchResults),
  },
}));

// Mock localStorage
const mockStorage: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: vi.fn((key) => mockStorage[key] ?? null),
  setItem: vi.fn((key, value) => { mockStorage[key] = value; }),
  removeItem: vi.fn((key) => { delete mockStorage[key]; }),
});
```

---

## 9. Git Workflow

### 9.1 Branch Strategy

```
main (production)
  └── develop (integration)
       ├── feature/XXX-xxx-description
       ├── fix/XXX-xxx-description
       └── chore/XXX-xxx-description
```

### 9.2 Commit Messages (Conventional Commits)

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**
| Type | Purpose |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Maintenance (deps, config) |
| `docs` | Documentation only |
| `refactor` | Code restructuring (no feature/fix) |
| `test` | Adding/updating tests |
| `style` | Formatting, whitespace (no logic change) |
| `perf` | Performance improvement |
| `ci` | CI/CD changes |

**Scopes:**
`player`, `search`, `tmdb`, `store`, `ui`, `auth`, `anime`, `tv`, `layout`

**Examples:**
```
feat(player): add VidLink URL builder with all customization params
fix(search): debounce input to prevent excessive API calls
chore(deps): update Next.js to 14.2.0
docs(readme): add environment variable setup instructions
refactor(store): extract history logic into custom hook
test(vidlink): add unit tests for anime URL generation
```

### 9.3 PR Checklist

```markdown
## PR Checklist
- [ ] Code follows coding standards (ESLint + Prettier pass)
- [ ] TypeScript compiles without errors (`tsc --noEmit`)
- [ ] Unit tests added/updated for new logic
- [ ] Integration tests added for new components
- [ ] E2E test added for new user flows
- [ ] Accessibility tested (keyboard nav, screen reader)
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] No console.log statements (only console.warn/error allowed)
- [ ] Documentation updated (if applicable)
- [ ] PR title follows Conventional Commits format
```

---

## 10. Accessibility Standards

### 10.1 Semantic HTML

```tsx
// GOOD: Semantic elements
<nav aria-label="Main navigation">...</nav>
<main>...</main>
<article>...</article>
<section aria-labelledby="trending-heading">
  <h2 id="trending-heading">Trending Movies</h2>
  ...
</section>

// BAD: Generic divs
<div className="nav">...</div>
<div className="content">...</div>
```

### 10.2 ARIA Attributes

```tsx
// Interactive elements
<button aria-label="Play movie" aria-pressed={isPlaying}>
  <PlayIcon />
</button>

// Dynamic content
<div aria-live="polite" aria-atomic="true">
  {searchResults.length} results found
</div>

// Loading states
<div role="status" aria-label="Loading content">
  <Skeleton />
</div>
```

### 10.3 Keyboard Navigation

```tsx
// All interactive elements must be keyboard accessible
<button onKeyDown={(e) => e.key === 'Enter' && handleClick()}>
  Click me
</button>

// Focus trap in modals
<Modal isOpen={isOpen} onClose={handleClose} trapFocus>
  ...
</Modal>
```

### 10.4 Images

```tsx
// GOOD: Descriptive alt text
<Image src={posterUrl} alt={`Poster for ${movieTitle}`} />

// Decorative images: empty alt
<Image src={decorativePattern} alt="" role="presentation" />

// BAD: Missing or generic alt
<Image src={posterUrl} />  // Missing alt
<Image src={posterUrl} alt="image" />  // Too generic
```

---

## 11. Performance Guidelines

### 11.1 Image Optimization

```tsx
// Always use next/image with explicit sizes
<Image
  src={posterUrl}
  alt={`Poster for ${title}`}
  width={342}
  height={513}
  priority={isAboveFold}        // Only for above-the-fold images
  placeholder="blur"
  blurDataURL={lowResPlaceholder}
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
/>
```

### 11.2 Code Splitting

```tsx
// Dynamic import for heavy components
import dynamic from 'next/dynamic';

const PlayerSettingsDrawer = dynamic(
  () => import('@/components/player/PlayerSettingsDrawer'),
  { ssr: false, loading: () => <Skeleton /> }
);
```

### 11.3 Memoization

```typescript
// Memoize expensive computations
const sortedEpisodes = useMemo(
  () => episodes.sort((a, b) => a.episode_number - b.episode_number),
  [episodes]
);

// Memoize callbacks passed to child components
const handleProgress = useCallback(
  (progress: number) => {
    updateProgress(entryId, progress);
  },
  [entryId, updateProgress]
);

// Memoize components that re-render often
const MemoizedMediaCard = memo(MediaCard);
```

---

## 12. Husky + lint-staged

### 12.1 Pre-commit Hook

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  }
}
```

### 12.2 Commit Message Hook

```bash
# .husky/commit-msg
npx --no-install commitlint --edit "$1"
```

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'chore', 'docs', 'refactor', 'test', 'style', 'perf', 'ci'],
    ],
  },
};
```

---

**Document End**
