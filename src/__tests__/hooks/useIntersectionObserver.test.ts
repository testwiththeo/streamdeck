import { renderHook, act } from '@testing-library/react';

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  
  private callback: IntersectionObserverCallback;
  private elements: Element[] = [];
  
  static instances: MockIntersectionObserver[] = [];

  constructor(callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.elements.push(target);
  }

  unobserve(_target: Element): void {
    this.elements = this.elements.filter(el => el !== _target);
  }

  disconnect(): void {
    this.elements = [];
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  // Helper to simulate intersection
  simulateIntersection(isIntersecting: boolean): void {
    const entries: IntersectionObserverEntry[] = this.elements.map(element => ({
      target: element,
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    }));
    this.callback(entries, this);
  }

  static reset(): void {
    MockIntersectionObserver.instances = [];
  }
}

describe('useIntersectionObserver', () => {
  let originalIntersectionObserver: typeof IntersectionObserver;

  beforeEach(() => {
    originalIntersectionObserver = global.IntersectionObserver;
    global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
    MockIntersectionObserver.reset();
  });

  afterEach(() => {
    global.IntersectionObserver = originalIntersectionObserver;
  });

  it('returns ref and initial isIntersecting as false', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    
    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.ref).toBe('function');
    expect(result.current.isIntersecting).toBe(false);
  });

  it('observes element when ref is attached', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    
    const element = document.createElement('div');
    
    act(() => {
      result.current.ref(element);
    });

    expect(MockIntersectionObserver.instances.length).toBeGreaterThan(0);
  });

  it('updates isIntersecting when element becomes visible', () => {
    const { result } = renderHook(() => useIntersectionObserver({ threshold: 0.5 }));
    
    const element = document.createElement('div');
    
    act(() => {
      result.current.ref(element);
    });

    const observer = MockIntersectionObserver.instances[MockIntersectionObserver.instances.length - 1];

    act(() => {
      observer.simulateIntersection(true);
    });

    expect(result.current.isIntersecting).toBe(true);
  });

  it('updates isIntersecting when element leaves viewport', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    
    const element = document.createElement('div');
    
    act(() => {
      result.current.ref(element);
    });

    const observer = MockIntersectionObserver.instances[MockIntersectionObserver.instances.length - 1];

    // First make it visible
    act(() => {
      observer.simulateIntersection(true);
    });
    expect(result.current.isIntersecting).toBe(true);

    // Then hide it
    act(() => {
      observer.simulateIntersection(false);
    });
    expect(result.current.isIntersecting).toBe(false);
  });

  it('disconnects previous observer when ref changes', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');
    
    act(() => {
      result.current.ref(element1);
    });

    const firstObserverInstance = MockIntersectionObserver.instances.length;

    act(() => {
      result.current.ref(element2);
    });

    // A new observer should have been created
    expect(MockIntersectionObserver.instances.length).toBeGreaterThan(firstObserverInstance);
  });

  it('handles null ref gracefully', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    
    // Should not throw
    act(() => {
      result.current.ref(null);
    });

    expect(result.current.isIntersecting).toBe(false);
  });

  it('uses default options when none provided', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    
    expect(result.current.ref).toBeDefined();
  });

  it('accepts custom threshold option', () => {
    const { result } = renderHook(() => useIntersectionObserver({ threshold: 0.5 }));
    
    expect(result.current.ref).toBeDefined();
  });

  it('accepts custom rootMargin option', () => {
    const { result } = renderHook(() => useIntersectionObserver({ rootMargin: '100px' }));
    
    expect(result.current.ref).toBeDefined();
  });
});
