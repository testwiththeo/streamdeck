import { renderHook, act } from '@testing-library/react';

import { useMediaQuery, BREAKPOINTS } from '@/hooks/useMediaQuery';

describe('useMediaQuery', () => {
  let matchMediaMock: jest.Mock;
  let listeners: Map<string, (e: { matches: boolean }) => void>;

  beforeEach(() => {
    listeners = new Map();
    matchMediaMock = jest.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn((event: string, handler: (e: { matches: boolean }) => void) => {
        listeners.set(query, handler);
      }),
      removeEventListener: jest.fn((event: string, handler: (e: { matches: boolean }) => void) => {
        listeners.delete(query);
      }),
      dispatchEvent: jest.fn(),
    }));
    window.matchMedia = matchMediaMock;
  });

  it('returns false when query does not match', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('returns true when query matches', () => {
    matchMediaMock.mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('updates when query changes', () => {
    const { result, rerender } = renderHook(
      ({ query }) => useMediaQuery(query),
      { initialProps: { query: '(min-width: 768px)' } }
    );

    expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 768px)');

    rerender({ query: '(min-width: 1024px)' });

    expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 1024px)');
  });

  it('cleans up listener on unmount', () => {
    const removeEventListener = jest.fn();
    matchMediaMock.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener,
      dispatchEvent: jest.fn(),
    }));

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    unmount();

    expect(removeEventListener).toHaveBeenCalled();
  });
});

describe('BREAKPOINTS', () => {
  it('has expected breakpoint values', () => {
    expect(BREAKPOINTS.sm).toBe('(max-width: 639px)');
    expect(BREAKPOINTS.md).toBe('(min-width: 640px)');
    expect(BREAKPOINTS.lg).toBe('(min-width: 1024px)');
    expect(BREAKPOINTS.xl).toBe('(min-width: 1280px)');
    expect(BREAKPOINTS['2xl']).toBe('(min-width: 1536px)');
  });
});
