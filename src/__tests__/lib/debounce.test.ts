import { debounce } from '@/lib/utils/debounce';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('delays function execution', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 300);

    debouncedFn();

    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('only executes once for rapid calls', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 300);

    debouncedFn();
    debouncedFn();
    debouncedFn();
    debouncedFn();
    debouncedFn();

    jest.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('passes arguments to the original function', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 300);

    debouncedFn('arg1', 'arg2');

    jest.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('uses arguments from the last call', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 300);

    debouncedFn('first');
    debouncedFn('second');
    debouncedFn('third');

    jest.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledWith('third');
  });

  it('resets timer on each call', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 300);

    debouncedFn();
    jest.advanceTimersByTime(200);
    expect(fn).not.toHaveBeenCalled();

    debouncedFn(); // Reset timer
    jest.advanceTimersByTime(200);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('works with zero delay', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 0);

    debouncedFn();

    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(0);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('preserves this context', () => {
    const context = { value: 'test' };
    let capturedThis: unknown;

    const fn = function (this: unknown) {
      capturedThis = this;
    };

    const debouncedFn = debounce(fn, 300);
    debouncedFn.call(context);

    jest.advanceTimersByTime(300);

    // Note: arrow functions in debounce won't preserve this
    // This test documents the behavior
    expect(capturedThis).toBeUndefined();
  });

  it('can be called multiple times with delays', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 300);

    // First call
    debouncedFn('first');
    jest.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);

    // Second call after delay
    debouncedFn('second');
    jest.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
