import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { MediaItem } from '@/lib/types/app.types';
import { STORAGE_KEYS } from '@/lib/constants/defaults';
import { LIMITS } from '@/lib/constants/defaults';

interface WatchlistState {
  items: MediaItem[];
  addItem: (item: MediaItem) => void;
  removeItem: (id: number, type: MediaItem['type']) => void;
  isInWatchlist: (id: number, type: MediaItem['type']) => boolean;
  clearWatchlist: () => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: MediaItem) =>
        set((state) => {
          // Don't add duplicates
          const exists = state.items.some(
            (i) => i.id === item.id && i.type === item.type
          );
          if (exists) return state;

          // Add to beginning and enforce limit
          const updated = [item, ...state.items];
          if (updated.length > LIMITS.MAX_WATCHLIST_ITEMS) {
            return { items: updated.slice(0, LIMITS.MAX_WATCHLIST_ITEMS) };
          }
          return { items: updated };
        }),

      removeItem: (id: number, type: MediaItem['type']) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && i.type === type)),
        })),

      isInWatchlist: (id: number, type: MediaItem['type']) => {
        const state = get();
        return state.items.some((i) => i.id === id && i.type === type);
      },

      clearWatchlist: () => set({ items: [] }),
    }),
    {
      name: STORAGE_KEYS.WATCHLIST,
    }
  )
);
