import { renderHook, act } from '@testing-library/react';

import { useKeyPress } from '@/hooks/useKeyPress';

describe('useKeyPress', () => {
  it('calls handler when specified key is pressed', () => {
    const handler = jest.fn();
    renderHook(() => useKeyPress(handler, { keys: 'Enter' }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not call handler for non-matching keys', () => {
    const handler = jest.fn();
    renderHook(() => useKeyPress(handler, { keys: 'Enter' }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it('supports multiple keys', () => {
    const handler = jest.fn();
    renderHook(() => useKeyPress(handler, { keys: ['ArrowUp', 'ArrowDown'] }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    });
    expect(handler).toHaveBeenCalledTimes(1);

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    });
    expect(handler).toHaveBeenCalledTimes(2);

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    });
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('requires modifier keys when specified', () => {
    const handler = jest.fn();
    renderHook(() => useKeyPress(handler, { keys: 's', ctrl: true }));

    // Without ctrl
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
    });
    expect(handler).not.toHaveBeenCalled();

    // With ctrl
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 's', ctrlKey: true }));
    });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('supports meta key (Cmd on Mac)', () => {
    const handler = jest.fn();
    renderHook(() => useKeyPress(handler, { keys: 's', meta: true }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 's', metaKey: true }));
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('provides key info to handler', () => {
    const handler = jest.fn();
    renderHook(() => useKeyPress(handler));

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { 
          key: 'a', 
          code: 'KeyA',
          shiftKey: true 
        })
      );
    });

    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        key: 'a',
        code: 'KeyA',
        shiftKey: true,
      })
    );
  });

  it('cleans up event listeners on unmount', () => {
    const handler = jest.fn();
    const { unmount } = renderHook(() => useKeyPress(handler));

    const removeSpy = jest.spyOn(document, 'removeEventListener');
    unmount();

    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeSpy.mockRestore();
  });

  it('listens for keyup when specified', () => {
    const handler = jest.fn();
    renderHook(() => useKeyPress(handler, { eventType: 'keyup' }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    });
    expect(handler).not.toHaveBeenCalled();

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('handles case-insensitive key matching', () => {
    const handler = jest.fn();
    renderHook(() => useKeyPress(handler, { keys: 'enter' }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
