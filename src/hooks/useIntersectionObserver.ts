import { useEffect, useRef, useState, useCallback, type RefCallback } from 'react';

/**
 * Options for the IntersectionObserver hook.
 */
interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** Element that is used as the viewport for checking visibility. Defaults to browser viewport. */
  root?: Element | null;
  /** Margin around the root. Can have values similar to CSS margin property. */
  rootMargin?: string;
  /** Number between 0 and 1 indicating what percentage of the target's visibility the observer's callback should be executed. */
  threshold?: number | number[];
}

/**
 * Return type for the useIntersectionObserver hook.
 */
interface UseIntersectionObserverReturn {
  /** Callback ref to attach to the element to observe */
  ref: RefCallback<Element>;
  /** Whether the element is currently intersecting the viewport */
  isIntersecting: boolean;
}

/**
 * Observes an element's intersection with the viewport or a specified root element.
 * Useful for implementing infinite scroll, lazy loading, or visibility tracking.
 *
 * @param options - IntersectionObserver configuration options
 * @returns An object containing a callback ref and intersection state
 *
 * @example
 * ```tsx
 * const { ref, isIntersecting } = useIntersectionObserver({
 *   threshold: 0.5,
 *   rootMargin: '100px',
 * });
 *
 * return (
 *   <div ref={ref}>
 *     {isIntersecting ? 'Visible!' : 'Not visible'}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Infinite scroll implementation
 * const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
 *
 * useEffect(() => {
 *   if (isIntersecting) {
 *     loadMoreItems();
 *   }
 * }, [isIntersecting]);
 *
 * return <div ref={ref}>Load more trigger</div>;
 * ```
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = { threshold: 0.1 }
): UseIntersectionObserverReturn {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<Element | null>(null);

  const ref: RefCallback<Element> = useCallback(
    (node: Element | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (node) {
        elementRef.current = node;
        observerRef.current = new IntersectionObserver(([entry]) => {
          setIsIntersecting(entry.isIntersecting);
        }, options);
        observerRef.current.observe(node);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.threshold, options.rootMargin]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { ref, isIntersecting };
}
