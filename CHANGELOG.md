# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Custom hooks: `useDebounce`, `useIntersectionObserver`, `useInfiniteSearch`
- New hooks: `useMediaQuery`, `useLocalStorage`, `useClickOutside`, `useKeyPress`
- Utility functions: string, number, date, typeGuards
- UI components: `Tooltip`, `Badge`, `Modal`
- Constants: language codes mapping
- Barrel exports for hooks, utils, and UI components
- Comprehensive JSDoc documentation across all modules
- Unit tests for hooks, utilities, and UI components

### Changed
- Improved format utilities with edge case handling
- Memoized options in useIntersectionObserver for better performance

### Fixed
- Edge cases in formatRuntime, formatRating, formatDate, formatTimestamp
- Negative value handling in formatVoteCount
- Million-level vote count formatting support
