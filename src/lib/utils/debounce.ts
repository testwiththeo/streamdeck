/**
 * Creates a debounced version of a function that delays invocation
 * until after a specified delay period has elapsed since the last call.
 *
 * @template T - The type of the function to debounce
 * @param fn - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced version of the function
 *
 * @example
 * ```ts
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 *
 * // Only the last call within 300ms will execute
 * debouncedSearch('h');
 * debouncedSearch('he');
 * debouncedSearch('hello'); // Only this will execute after 300ms
 * ```
 *
 * @example
 * ```ts
 * // Debouncing an API call
 * const fetchResults = debounce(async (term: string) => {
 *   const response = await fetch(`/api/search?q=${term}`);
 *   return response.json();
 * }, 500);
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function debounced(...args: Parameters<T>): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
