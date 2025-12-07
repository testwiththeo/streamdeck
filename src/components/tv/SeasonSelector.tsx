'use client';

interface SeasonSelectorProps {
  seasons: Array<{
    season_number: number;
    name: string;
    episode_count: number;
  }>;
  selectedSeason: number;
  onChange: (seasonNumber: number) => void;
}

export function SeasonSelector({ seasons, selectedSeason, onChange }: SeasonSelectorProps) {
  // Filter out specials (season 0)
  const regularSeasons = seasons.filter((s) => s.season_number > 0);

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="season-select" className="text-sm font-medium text-zinc-300">
        Season
      </label>
      <select
        id="season-select"
        value={selectedSeason}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
      >
        {regularSeasons.map((season) => (
          <option key={season.season_number} value={season.season_number}>
            {season.name} ({season.episode_count} eps)
          </option>
        ))}
      </select>
    </div>
  );
}
