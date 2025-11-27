import { truncateString, capitalize, slugify } from '@/lib/utils/string';

describe('string utilities', () => {
  describe('truncateString', () => {
    it('returns original string if shorter than maxLength', () => {
      expect(truncateString('Short', 10)).toBe('Short');
    });

    it('truncates long strings with ellipsis', () => {
      expect(truncateString('This is a long description', 15)).toBe('This is a...');
    });

    it('preserves word boundaries by default', () => {
      expect(truncateString('Hello World Today', 12)).toBe('Hello...');
    });

    it('can truncate without word boundary', () => {
      expect(truncateString('Hello World', 8, false)).toBe('Hello...');
    });

    it('handles empty string', () => {
      expect(truncateString('', 10)).toBe('');
    });

    it('handles very short maxLength', () => {
      expect(truncateString('Hello', 3)).toBe('Hel');
    });

    it('handles exact length match', () => {
      expect(truncateString('Hello', 5)).toBe('Hello');
    });
  });

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('preserves rest of string', () => {
      expect(capitalize('hELLO')).toBe('HELLO');
    });

    it('handles empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('handles single character', () => {
      expect(capitalize('a')).toBe('A');
    });

    it('handles already capitalized', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });
  });

  describe('slugify', () => {
    it('converts to lowercase', () => {
      expect(slugify('HELLO')).toBe('hello');
    });

    it('replaces spaces with hyphens', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('removes special characters', () => {
      expect(slugify('Action & Adventure!')).toBe('action-adventure');
    });

    it('handles multiple spaces', () => {
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
    });

    it('removes leading and trailing hyphens', () => {
      expect(slugify('--Hello--')).toBe('hello');
    });

    it('handles underscores', () => {
      expect(slugify('hello_world')).toBe('hello-world');
    });

    it('handles empty string', () => {
      expect(slugify('')).toBe('');
    });
  });
});
