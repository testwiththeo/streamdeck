import { getFromStorage, setToStorage, removeFromStorage } from '@/lib/utils/storage';

describe('storage utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('getFromStorage', () => {
    it('returns fallback when key does not exist', () => {
      const result = getFromStorage('nonexistent', 'fallback');
      expect(result).toBe('fallback');
    });

    it('returns stored value when key exists', () => {
      localStorage.setItem('test-key', JSON.stringify({ name: 'test' }));
      
      const result = getFromStorage('test-key', { name: 'default' });
      expect(result).toEqual({ name: 'test' });
    });

    it('returns fallback for invalid JSON', () => {
      localStorage.setItem('invalid-key', 'not-valid-json');
      
      const result = getFromStorage('invalid-key', 'fallback');
      expect(result).toBe('fallback');
    });

    it('handles null stored values', () => {
      localStorage.setItem('null-key', 'null');
      
      const result = getFromStorage('null-key', 'fallback');
      expect(result).toBeNull();
    });

    it('works with arrays', () => {
      localStorage.setItem('array-key', JSON.stringify([1, 2, 3]));
      
      const result = getFromStorage<number[]>('array-key', []);
      expect(result).toEqual([1, 2, 3]);
    });

    it('works with complex objects', () => {
      const complexObject = {
        user: { name: 'John', age: 30 },
        settings: { theme: 'dark' },
        items: [1, 2, 3],
      };
      localStorage.setItem('complex-key', JSON.stringify(complexObject));
      
      const result = getFromStorage('complex-key', {});
      expect(result).toEqual(complexObject);
    });
  });

  describe('setToStorage', () => {
    it('stores value in localStorage', () => {
      const result = setToStorage('test-key', { name: 'test' });
      
      expect(result).toBe(true);
      expect(localStorage.getItem('test-key')).toBe(JSON.stringify({ name: 'test' }));
    });

    it('overwrites existing values', () => {
      setToStorage('key', 'first');
      setToStorage('key', 'second');
      
      expect(localStorage.getItem('key')).toBe(JSON.stringify('second'));
    });

    it('handles null values', () => {
      const result = setToStorage('null-key', null);
      
      expect(result).toBe(true);
      expect(localStorage.getItem('null-key')).toBe('null');
    });

    it('handles arrays', () => {
      setToStorage('array-key', [1, 2, 3]);
      
      expect(localStorage.getItem('array-key')).toBe('[1,2,3]');
    });

    it('handles quota exceeded error gracefully', () => {
      // Mock localStorage.setItem to throw QuotaExceededError
      const originalSetItem = localStorage.setItem;
      const error = new DOMException('Quota exceeded', 'QuotaExceededError');
      localStorage.setItem = jest.fn(() => {
        throw error;
      });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const result = setToStorage('key', 'value');
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();

      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });

  describe('removeFromStorage', () => {
    it('removes item from localStorage', () => {
      localStorage.setItem('to-remove', 'value');
      
      removeFromStorage('to-remove');
      
      expect(localStorage.getItem('to-remove')).toBeNull();
    });

    it('does not throw when key does not exist', () => {
      expect(() => removeFromStorage('nonexistent')).not.toThrow();
    });
  });

  describe('SSR behavior', () => {
    it('getFromStorage returns fallback when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR
      delete global.window;

      const result = getFromStorage('key', 'fallback');
      expect(result).toBe('fallback');

      global.window = originalWindow;
    });

    it('setToStorage returns false when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR
      delete global.window;

      const result = setToStorage('key', 'value');
      expect(result).toBe(false);

      global.window = originalWindow;
    });
  });
});
