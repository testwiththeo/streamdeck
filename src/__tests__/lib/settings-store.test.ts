import { useSettingsStore } from '@/store/settings-store';
import { DEFAULT_PLAYER_SETTINGS } from '@/lib/constants/defaults';

// Reset store before each test
beforeEach(() => {
  useSettingsStore.setState({ ...DEFAULT_PLAYER_SETTINGS });
});

describe('useSettingsStore', () => {
  it('initializes with default settings', () => {
    const state = useSettingsStore.getState();
    expect(state.primaryColor).toBe(DEFAULT_PLAYER_SETTINGS.primaryColor);
    expect(state.secondaryColor).toBe(DEFAULT_PLAYER_SETTINGS.secondaryColor);
    expect(state.icons).toBe(DEFAULT_PLAYER_SETTINGS.icons);
    expect(state.iconColor).toBe(DEFAULT_PLAYER_SETTINGS.iconColor);
    expect(state.autoplay).toBe(DEFAULT_PLAYER_SETTINGS.autoplay);
    expect(state.nextbutton).toBe(DEFAULT_PLAYER_SETTINGS.nextbutton);
    expect(state.player).toBe(DEFAULT_PLAYER_SETTINGS.player);
    expect(state.title).toBe(DEFAULT_PLAYER_SETTINGS.title);
    expect(state.poster).toBe(DEFAULT_PLAYER_SETTINGS.poster);
  });

  it('updates a single setting', () => {
    useSettingsStore.getState().updateSetting('primaryColor', 'FF0000');
    expect(useSettingsStore.getState().primaryColor).toBe('FF0000');
  });

  it('updates multiple settings independently', () => {
    useSettingsStore.getState().updateSetting('autoplay', true);
    useSettingsStore.getState().updateSetting('icons', 'vid');
    useSettingsStore.getState().updateSetting('startAt', 300);

    const state = useSettingsStore.getState();
    expect(state.autoplay).toBe(true);
    expect(state.icons).toBe('vid');
    expect(state.startAt).toBe(300);
  });

  it('resets to defaults', () => {
    useSettingsStore.getState().updateSetting('primaryColor', 'FF0000');
    useSettingsStore.getState().updateSetting('autoplay', true);
    useSettingsStore.getState().updateSetting('icons', 'vid');

    useSettingsStore.getState().resetToDefaults();

    const state = useSettingsStore.getState();
    expect(state.primaryColor).toBe(DEFAULT_PLAYER_SETTINGS.primaryColor);
    expect(state.autoplay).toBe(DEFAULT_PLAYER_SETTINGS.autoplay);
    expect(state.icons).toBe(DEFAULT_PLAYER_SETTINGS.icons);
  });

  it('handles boolean toggle correctly', () => {
    const initial = useSettingsStore.getState().autoplay;
    useSettingsStore.getState().updateSetting('autoplay', !initial);
    expect(useSettingsStore.getState().autoplay).toBe(!initial);
  });
});
