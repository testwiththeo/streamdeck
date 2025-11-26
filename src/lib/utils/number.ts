/**
 * Number manipulation utilities for the Movie App.
 *
 * @module number
 */

/**
 * Clamps a number between a minimum and maximum value.
 *
 * @param value - The number to clamp
 * @param min - The minimum allowed value
 * @param max - The maximum allowed value
 * @returns The clamped value
 *
 * @example
 * ```ts
 * clamp(15, 0, 10); // => 10
 * clamp(-5, 0, 10); // => 0
 * clamp(5, 0, 10); // => 5
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linearly interpolates between two values.
 *
 * @param start - The starting value
 * @param end - The ending value
 * @param t - The interpolation factor (0-1)
 * @returns The interpolated value
 *
 * @example
 * ```ts
 * lerp(0, 100, 0.5); // => 50
 * lerp(0, 100, 0.25); // => 25
 * lerp(10, 20, 0); // => 10
 * ```
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Maps a value from one range to another.
 *
 * @param value - The value to map
 * @param inMin - The minimum of the input range
 * @param inMax - The maximum of the input range
 * @param outMin - The minimum of the output range
 * @param outMax - The maximum of the output range
 * @returns The mapped value
 *
 * @example
 * ```ts
 * mapRange(50, 0, 100, 0, 1); // => 0.5
 * mapRange(25, 0, 100, 0, 255); // => 63.75
 * ```
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Rounds a number to a specified number of decimal places.
 *
 * @param value - The number to round
 * @param decimals - Number of decimal places (default: 0)
 * @returns The rounded number
 *
 * @example
 * ```ts
 * roundTo(3.14159, 2); // => 3.14
 * roundTo(3.14159, 4); // => 3.1416
 * roundTo(3.14159); // => 3
 * ```
 */
export function roundTo(value: number, decimals = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
