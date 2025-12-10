'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { useSettingsStore } from '@/store/settings-store';
import { DEFAULT_PLAYER_SETTINGS } from '@/lib/constants/defaults';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils/cn';

/** Accessible toggle switch with spring animation */
function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-text-primary">{label}</p>
        {description && <p className="text-xs text-text-tertiary">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={cn(
          'relative h-6 w-11 rounded-full transition-colors duration-fast ease-standard',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1',
          checked ? 'bg-brand' : 'bg-surface-3'
        )}
      >
        <span
          className={cn(
            'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm',
            'transition-transform duration-fast ease-spring',
            checked && 'translate-x-5'
          )}
        />
      </button>
    </div>
  );
}

/** Pill-style option selector */
function OptionGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all duration-fast ease-standard',
            'active:scale-[0.97]',
            value === opt
              ? 'bg-brand text-white shadow-sm'
              : 'bg-surface-2 text-text-secondary hover:bg-surface-3 hover:text-text-primary'
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/** Settings section card */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-surface-1 p-6 ring-1 ring-border shadow-glass">
      <h2 className="mb-4 text-lg font-semibold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const settings = useSettingsStore();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-text-primary sm:text-3xl">Settings</h1>
        <div className="space-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 animate-shimmer rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
        Settings
      </h1>

      <div className="space-y-6">
        {/* Appearance */}
        <Section title="Appearance">
          <OptionGroup
            options={['light', 'dark', 'system'] as const}
            value={(theme as 'light' | 'dark' | 'system') ?? 'system'}
            onChange={setTheme}
          />
        </Section>

        {/* Player Colors */}
        <Section title="Player Colors">
          <div className="space-y-4">
            {([
              { key: 'primaryColor' as const, label: 'Primary Color', placeholder: 'B20710' },
              { key: 'secondaryColor' as const, label: 'Secondary Color', placeholder: '333333' },
              { key: 'iconColor' as const, label: 'Icon Color', placeholder: 'FFFFFF' },
            ]).map(({ key, label, placeholder }) => {
              const value = (settings[key] as string) ?? DEFAULT_PLAYER_SETTINGS[key] ?? '';
              return (
                <div key={key}>
                  <label htmlFor={key} className="mb-1.5 block text-sm font-medium text-text-secondary">
                    {label} (hex)
                  </label>
                  <div className="flex gap-3">
                    <Input
                      id={key}
                      value={value}
                      onChange={(e) => settings.updateSetting(key, e.target.value)}
                      placeholder={placeholder}
                    />
                    <div className="relative">
                      <div
                        className="h-10 w-10 flex-none cursor-pointer rounded-lg border border-border shadow-glass transition-transform duration-fast ease-standard hover:scale-105"
                        style={{ backgroundColor: `#${value}` }}
                      />
                      <input
                        type="color"
                        value={`#${value}`}
                        onChange={(e) => settings.updateSetting(key, e.target.value.replace('#', ''))}
                        className="absolute inset-0 cursor-pointer opacity-0"
                        aria-label={`Pick ${label}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Icon Style */}
        <Section title="Icon Style">
          <OptionGroup
            options={['default', 'vid'] as const}
            value={(settings.icons ?? DEFAULT_PLAYER_SETTINGS.icons ?? 'default') as 'default' | 'vid'}
            onChange={(v) => settings.updateSetting('icons', v)}
          />
        </Section>

        {/* Player Behavior */}
        <Section title="Player Behavior">
          <div className="space-y-4">
            <Toggle
              label="Autoplay"
              description="Start playing automatically"
              checked={settings.autoplay ?? DEFAULT_PLAYER_SETTINGS.autoplay ?? false}
              onChange={() => settings.updateSetting('autoplay', !(settings.autoplay ?? false))}
            />
            <Toggle
              label="Next Button"
              description="Show next episode button"
              checked={settings.nextbutton ?? DEFAULT_PLAYER_SETTINGS.nextbutton ?? false}
              onChange={() => settings.updateSetting('nextbutton', !(settings.nextbutton ?? false))}
            />
            <Toggle
              label="Show Title"
              description="Display title on player"
              checked={settings.title ?? DEFAULT_PLAYER_SETTINGS.title ?? true}
              onChange={() => settings.updateSetting('title', !(settings.title ?? true))}
            />
            <Toggle
              label="Show Poster"
              description="Display poster on player"
              checked={settings.poster ?? DEFAULT_PLAYER_SETTINGS.poster ?? false}
              onChange={() => settings.updateSetting('poster', !(settings.poster ?? false))}
            />
          </div>
        </Section>

        {/* Player Variant */}
        <Section title="Player Variant">
          <OptionGroup
            options={['default', 'jw'] as const}
            value={(settings.player ?? DEFAULT_PLAYER_SETTINGS.player ?? 'default') as 'default' | 'jw'}
            onChange={(v) => settings.updateSetting('player', v)}
          />
        </Section>

        {/* Reset */}
        <section className="rounded-xl bg-surface-1 p-6 ring-1 ring-border shadow-glass">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">Reset</h2>
          <Button
            variant="ghost"
            onClick={() => settings.resetToDefaults()}
            className="text-text-tertiary transition-colors duration-fast ease-standard hover:text-text-primary"
          >
            Reset to Defaults
          </Button>
        </section>
      </div>
    </div>
  );
}
