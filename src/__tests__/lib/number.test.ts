import { clamp, lerp, mapRange, roundTo } from '@/lib/utils/number';

describe('number utilities', () => {
  describe('clamp', () => {
    it('returns value when within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it('clamps to minimum', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('clamps to maximum', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('handles edge cases at boundaries', () => {
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });

    it('handles equal min and max', () => {
      expect(clamp(5, 5, 5)).toBe(5);
    });
  });

  describe('lerp', () => {
    it('returns start when t is 0', () => {
      expect(lerp(10, 20, 0)).toBe(10);
    });

    it('returns end when t is 1', () => {
      expect(lerp(10, 20, 1)).toBe(20);
    });

    it('returns midpoint when t is 0.5', () => {
      expect(lerp(0, 100, 0.5)).toBe(50);
    });

    it('interpolates correctly at 0.25', () => {
      expect(lerp(0, 100, 0.25)).toBe(25);
    });

    it('handles negative ranges', () => {
      expect(lerp(-10, 10, 0.5)).toBe(0);
    });
  });

  describe('mapRange', () => {
    it('maps value from one range to another', () => {
      expect(mapRange(50, 0, 100, 0, 1)).toBe(0.5);
    });

    it('handles non-zero input minimum', () => {
      expect(mapRange(55, 50, 100, 0, 100)).toBe(10);
    });

    it('handles inverted output range', () => {
      expect(mapRange(50, 0, 100, 100, 0)).toBe(50);
    });

    it('handles equal input range', () => {
      // Edge case: division by zero would result in NaN
      expect(mapRange(50, 50, 50, 0, 100)).toBeNaN();
    });
  });

  describe('roundTo', () => {
    it('rounds to whole number by default', () => {
      expect(roundTo(3.7)).toBe(4);
    });

    it('rounds to specified decimal places', () => {
      expect(roundTo(3.14159, 2)).toBe(3.14);
    });

    it('rounds up correctly', () => {
      expect(roundTo(3.145, 2)).toBe(3.15);
    });

    it('handles zero decimals', () => {
      expect(roundTo(3.14159, 0)).toBe(3);
    });

    it('handles more decimal places than available', () => {
      expect(roundTo(3.1, 4)).toBe(3.1);
    });
  });
});
