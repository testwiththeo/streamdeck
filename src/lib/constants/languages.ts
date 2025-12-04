/**
 * ISO 639-1 language codes and their English names.
 * Used for displaying language options in the UI.
 *
 * @module languages
 */

/**
 * Common language codes mapped to their display names.
 */
export const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  'zh-CN': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  hi: 'Hindi',
  ar: 'Arabic',
  th: 'Thai',
  vi: 'Vietnamese',
  id: 'Indonesian',
  ms: 'Malay',
  tr: 'Turkish',
  pl: 'Polish',
  nl: 'Dutch',
  sv: 'Swedish',
  no: 'Norwegian',
  da: 'Danish',
  fi: 'Finnish',
  cs: 'Czech',
  hu: 'Hungarian',
  ro: 'Romanian',
  bg: 'Bulgarian',
  uk: 'Ukrainian',
  el: 'Greek',
  he: 'Hebrew',
  fa: 'Persian',
  bn: 'Bengali',
  ta: 'Tamil',
  te: 'Telugu',
};

/**
 * Gets the display name for a language code.
 *
 * @param code - ISO 639-1 language code
 * @returns The language name or the original code if not found
 *
 * @example
 * ```ts
 * getLanguageName('en'); // => 'English'
 * getLanguageName('ja'); // => 'Japanese'
 * getLanguageName('xx'); // => 'xx'
 * ```
 */
export function getLanguageName(code: string): string {
  return LANGUAGE_NAMES[code] ?? code;
}

/**
 * Common language codes sorted by popularity for dropdowns.
 */
export const POPULAR_LANGUAGES = [
  'en',
  'es',
  'fr',
  'de',
  'it',
  'pt',
  'ru',
  'ja',
  'ko',
  'zh',
  'hi',
  'ar',
] as const;
