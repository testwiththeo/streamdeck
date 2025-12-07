import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { DEFAULT_PLAYER_SETTINGS, STORAGE_KEYS } from '@/lib/constants/defaults';
import type { PlayerOptions } from '@/lib/types/player.types';

type SettingsKey = keyof PlayerOptions;

interface PlayerSettingsState extends PlayerOptions {
  updateSetting: <K extends SettingsKey>(key: K, value: PlayerOptions[K]) => void;
  resetToDefaults: () => void;
}

export const useSettingsStore = create<PlayerSettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_PLAYER_SETTINGS,

      updateSetting: (key, value) => set({ [key]: value }),

      resetToDefaults: () => set({ ...DEFAULT_PLAYER_SETTINGS }),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      partialize: (state) => ({
        primaryColor: state.primaryColor,
        secondaryColor: state.secondaryColor,
        icons: state.icons,
        iconColor: state.iconColor,
        autoplay: state.autoplay,
        nextbutton: state.nextbutton,
        player: state.player,
        title: state.title,
        poster: state.poster,
      }),
    }
  )
);
