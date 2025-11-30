import { useEffect, useCallback, useRef } from 'react';

/**
 * Key information for the key press handler.
 */
export interface KeyPressInfo {
  /** The key that was pressed (e.g., 'Enter', 'a', 'ArrowUp') */
  key: string;
  /** The keyboard event code (e.g., 'KeyA', 'Enter') */
  code: string;
  /** Whether Ctrl/Cmd was held */
  ctrlKey: boolean;
  /** Whether Shift was held */
  shiftKey: boolean;
  /** Whether Alt was held */
  altKey: boolean;
  /** Whether Meta (Cmd on Mac, Win on Windows) was held */
  metaKey: boolean;
  /** The original keyboard event */
  event: KeyboardEvent;
}

/**
 * Options for the useKeyPress hook.
 */
export interface UseKeyPressOptions {
  /** Key or keys to listen for (e.g., 'Enter', ['a', 'b']) */
  keys?: string | string[];
  /** Whether to only trigger when Ctrl/Cmd is held */
  ctrl?: boolean;
  /** Whether to only trigger when Shift is held */
  shift?: boolean;
  /** Whether to only trigger when Alt is held */
  alt?: boolean;
  /** Whether to only trigger when Meta is held */
  meta?: boolean;
  /** Whether to prevent default behavior */
  preventDefault?: boolean;
  /** Whether to stop propagation */
  stopPropagation?: boolean;
  /** Element to attach listener to (default: document) */
  target?: HTMLElement | null;
  /** Event type to listen for (default: 'keydown') */
  eventType?: 'keydown' | 'keyup' | 'keypress';
}

/**
 * Detects keyboard events and invokes a handler.
 * Supports key filtering and modifier key combinations.
 *
 * @param handler - Callback function invoked on key press
 * @param options - Configuration options for key detection
 *
 * @example
 * ```tsx
 * // Listen for Enter key
 * useKeyPress((info) => {
 *   console.log('Enter pressed!');
 * }, { keys: 'Enter' });
 *
 * // Listen for multiple keys
 * useKeyPress((info) => {
 *   console.log(`${info.key} pressed`);
 * }, { keys: ['ArrowUp', 'ArrowDown'] });
 *
 * // Keyboard shortcut (Cmd/Ctrl + S)
 * useKeyPress((info) => {
 *   saveDocument();
 * }, { keys: 's', meta: true, ctrl: true, preventDefault: true });
 *
 * // Listen for Escape to close modal
 * useKeyPress(() => setIsOpen(false), { keys: 'Escape' });
 * ```
 */
export function useKeyPress(
  handler: (info: KeyPressInfo) => void,
  options: UseKeyPressOptions = {}
): void {
  const {
    keys,
    ctrl = false,
    shift = false,
    alt = false,
    meta = false,
    preventDefault = false,
    stopPropagation = false,
    target = null,
    eventType = 'keydown',
  } = options;

  const handlerRef = useRef(handler);
  const optionsRef = useRef({ keys, ctrl, shift, alt, meta, preventDefault, stopPropagation });

  // Update refs when values change
  useEffect(() => {
    handlerRef.current = handler;
    optionsRef.current = { keys, ctrl, shift, alt, meta, preventDefault, stopPropagation };
  }, [handler, keys, ctrl, shift, alt, meta, preventDefault, stopPropagation]);

  const handleKeyEvent = useCallback((event: KeyboardEvent) => {
    const opts = optionsRef.current;

    // Check if the pressed key matches the filter
    if (opts.keys) {
      const keyArray = Array.isArray(opts.keys) ? opts.keys : [opts.keys];
      const keyMatches = keyArray.some(
        k => event.key.toLowerCase() === k.toLowerCase() ||
             event.code.toLowerCase() === k.toLowerCase()
      );
      if (!keyMatches) return;
    }

    // Check modifier keys
    if (opts.ctrl && !(event.ctrlKey || event.metaKey)) return;
    if (opts.shift && !event.shiftKey) return;
    if (opts.alt && !event.altKey) return;
    if (opts.meta && !event.metaKey) return;

    // Handle default behavior
    if (opts.preventDefault) {
      event.preventDefault();
    }
    if (opts.stopPropagation) {
      event.stopPropagation();
    }

    // Invoke handler
    handlerRef.current({
      key: event.key,
      code: event.code,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
      metaKey: event.metaKey,
      event,
    });
  }, []);

  useEffect(() => {
    const element = target ?? document;
    element.addEventListener(eventType, handleKeyEvent as EventListener);

    return () => {
      element.removeEventListener(eventType, handleKeyEvent as EventListener);
    };
  }, [target, eventType, handleKeyEvent]);
}
