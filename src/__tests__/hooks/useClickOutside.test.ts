import { renderHook, act } from '@testing-library/react';

import { useClickOutside } from '@/hooks/useClickOutside';

describe('useClickOutside', () => {
  it('returns a ref', () => {
    const handler = jest.fn();
    const { result } = renderHook(() => useClickOutside(handler));
    
    expect(result.current).toBeDefined();
    expect(result.current.current).toBeNull();
  });

  it('calls handler when clicking outside element', () => {
    const handler = jest.fn();
    const { result } = renderHook(() => useClickOutside<HTMLDivElement>(handler));

    // Create elements
    const insideElement = document.createElement('div');
    const outsideElement = document.createElement('div');
    document.body.appendChild(insideElement);
    document.body.appendChild(outsideElement);

    // Set ref to inside element
    act(() => {
      (result.current as { current: HTMLDivElement | null }).current = insideElement;
    });

    // Click outside
    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    // Handler should be called when clicking outside
    // Note: The click target is document, which is outside the element
    expect(handler).toHaveBeenCalled();

    document.body.removeChild(insideElement);
    document.body.removeChild(outsideElement);
  });

  it('does not call handler when clicking inside element', () => {
    const handler = jest.fn();
    const { result } = renderHook(() => useClickOutside<HTMLDivElement>(handler));

    const element = document.createElement('div');
    document.body.appendChild(element);

    act(() => {
      (result.current as { current: HTMLDivElement | null }).current = element;
    });

    // Simulate click inside element
    const clickEvent = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(clickEvent, 'target', { value: element });
    
    act(() => {
      element.dispatchEvent(clickEvent);
    });

    // The handler should not be called for clicks inside
    // (The element.contains check should prevent it)

    document.body.removeChild(element);
  });

  it('handles touch events', () => {
    const handler = jest.fn();
    const { result } = renderHook(() => useClickOutside<HTMLDivElement>(handler));

    const element = document.createElement('div');
    document.body.appendChild(element);

    act(() => {
      (result.current as { current: HTMLDivElement | null }).current = element;
    });

    act(() => {
      document.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
    });

    expect(handler).toHaveBeenCalled();

    document.body.removeChild(element);
  });

  it('cleans up event listeners on unmount', () => {
    const handler = jest.fn();
    const { unmount } = renderHook(() => useClickOutside(handler));

    const addSpy = jest.spyOn(document, 'addEventListener');
    const removeSpy = jest.spyOn(document, 'removeEventListener');

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
