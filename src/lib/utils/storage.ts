/**
 * Safe localStorage wrapper with SSR guard and error handling.
 * Provides type-safe access to localStorage with fallback values.
 *
 * @module storage
 */

/**
 * Checks if the code is running in a browser environment.
 * @returns true if running in browser, false if on server (SSR)
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Retrieves a value from localStorage with type safety.
 * Returns the fallback value if localStorage is unavailable,
 * the key doesn't exist, or parsing fails.
 *
 * @template T - The expected type of the stored value
 * @param key - The localStorage key
 * @param fallback - The value to return if retrieval fails
 * @returns The parsed value or fallback
 *
 * @example
 * ```ts
 * interface UserSettings {
 *   theme: 'dark' | 'light';
 *   fontSize: number;
 * }
 *
 * const settings = getFromStorage<UserSettings>('user-settings', {
 *   theme: 'dark',
 *   fontSize: 14,
 * });
 * ```
 */
export function getFromStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

/**
 * Stores a value in localStorage with type safety.
 * Handles quota exceeded errors gracefully.
 *
 * @template T - The type of the value to store
 * @param key - The localStorage key
 * @param value - The value to store (will be JSON serialized)
 * @returns true if successful, false if storage failed
 *
 * @example
 * ```ts
 * const success = setToStorage('user-settings', {
 *   theme: 'dark',
 *   fontSize: 14,
 * });
 *
 * if (!success) {
 *   console.warn('Failed to save settings');
 * }
 * ```
 */
export function setToStorage<T>(key: string, value: T): boolean {
  if (!isBrowser()) return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded for key:', key);
    }
    return false;
  }
}

/**
 * Removes a value from localStorage.
 * Silently ignores errors if localStorage is unavailable.
 *
 * @param key - The localStorage key to remove
 *
 * @example
 * ```ts
 * removeFromStorage('user-settings');
 * ```
 */
export function removeFromStorage(key: string): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Silently ignore
  }
}
