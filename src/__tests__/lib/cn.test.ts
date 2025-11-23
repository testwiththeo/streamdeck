import { cn } from '@/lib/utils/cn';

describe('cn utility', () => {
  it('combines simple class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', true && 'active', false && 'hidden')).toBe('base active');
  });

  it('merges conflicting tailwind classes', () => {
    // Last wins for same utility
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('p-2 p-4')).toBe('p-4');
  });

  it('preserves non-conflicting classes', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('handles undefined values', () => {
    expect(cn('foo', undefined, 'bar')).toBe('foo bar');
  });

  it('handles null values', () => {
    expect(cn('foo', null, 'bar')).toBe('foo bar');
  });

  it('handles empty strings', () => {
    expect(cn('foo', '', 'bar')).toBe('foo bar');
  });

  it('handles arrays of classes', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
  });

  it('handles objects with boolean values', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });

  it('merges complex tailwind conflicts', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('bg-zinc-900', 'bg-white')).toBe('bg-white');
    expect(cn('rounded-lg', 'rounded-full')).toBe('rounded-full');
  });

  it('handles responsive class conflicts', () => {
    expect(cn('md:p-2', 'md:p-4')).toBe('md:p-4');
    expect(cn('hover:bg-red-500', 'hover:bg-blue-500')).toBe('hover:bg-blue-500');
  });

  it('preserves different modifiers', () => {
    expect(cn('hover:bg-red-500', 'focus:bg-blue-500')).toBe('hover:bg-red-500 focus:bg-blue-500');
  });

  it('handles mixed input types', () => {
    expect(
      cn(
        'base',
        ['array-class'],
        { 'object-class': true },
        false && 'hidden',
        'final'
      )
    ).toBe('base array-class object-class final');
  });

  it('returns empty string for no input', () => {
    expect(cn()).toBe('');
  });

  it('handles only falsy values', () => {
    expect(cn(false, null, undefined, '')).toBe('');
  });
});
