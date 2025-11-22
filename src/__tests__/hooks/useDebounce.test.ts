import { renderHook, act } from '@testing-library/react';

import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('does not update value before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'updated', delay: 500 });

    // Advance time but not enough
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('initial');
  });

  it('updates value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'updated', delay: 500 });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });

  it('resets timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 500 } }
    );

    // Rapid changes
    rerender({ value: 'b', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    rerender({ value: 'c', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    rerender({ value: 'd', delay: 500 });

    // Only 400ms total since last change, value should still be 'a'
    expect(result.current).toBe('a');

    // Advance past delay
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should have final value
    expect(result.current).toBe('d');
  });

  it('works with different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 100 } }
    );

    rerender({ value: 'updated', delay: 100 });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current).toBe('updated');
  });

  it('works with number values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 300 } }
    );

    rerender({ value: 42, delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe(42);
  });

  it('works with object values', () => {
    const initialObj = { name: 'test' };
    const updatedObj = { name: 'updated' };

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialObj, delay: 300 } }
    );

    rerender({ value: updatedObj, delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toEqual(updatedObj);
  });

  it('cleans up on unmount', () => {
    const { rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'updated', delay: 500 });

    // Unmount before delay completes
    unmount();

    // Advance timers - should not throw
    act(() => {
      jest.advanceTimersByTime(500);
    });
  });
});
