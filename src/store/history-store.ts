import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORAGE_KEYS, LIMITS } from '@/lib/constants/defaults';
import type { WatchHistoryEntry } from '@/lib/types/app.types';

interface HistoryState {
  entries: WatchHistoryEntry[];
  addEntry: (entry: WatchHistoryEntry) => void;
  updateProgress: (id: string, progress: number) => void;
  removeEntry: (id: string) => void;
  clearHistory: () => void;
  getEntry: (id: string) => WatchHistoryEntry | undefined;
  getContinueWatching: () => WatchHistoryEntry[];
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) =>
        set((state) => {
          const filtered = state.entries.filter((e) => e.id !== entry.id);
          const updated = [entry, ...filtered];
          // Trim oldest if over limit
          if (updated.length > LIMITS.MAX_HISTORY_ENTRIES) {
            return { entries: updated.slice(0, LIMITS.MAX_HISTORY_ENTRIES) };
          }
          return { entries: updated };
        }),

      updateProgress: (id, progress) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id
              ? { ...e, progress, completed: progress >= 95, timestamp: Date.now() }
              : e
          ),
        })),

      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),

      clearHistory: () => set({ entries: [] }),

      getEntry: (id) => get().entries.find((e) => e.id === id),

      getContinueWatching: () =>
        get()
          .entries.filter((e) => !e.completed && e.progress > 5 && e.progress < 95)
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 10),
    }),
    {
      name: STORAGE_KEYS.HISTORY,
    }
  )
);
