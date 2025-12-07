'use client';

import { cn } from '@/lib/utils/cn';

interface SubDubToggleProps {
  value: 'sub' | 'dub';
  onChange: (value: 'sub' | 'dub') => void;
}

export function SubDubToggle({ value, onChange }: SubDubToggleProps) {
  return (
    <div className="inline-flex rounded-lg bg-zinc-800 p-0.5">
      <button
        onClick={() => onChange('sub')}
        className={cn(
          'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
          value === 'sub'
            ? 'bg-red-600 text-white'
            : 'text-zinc-400 hover:text-white'
        )}
      >
        Sub
      </button>
      <button
        onClick={() => onChange('dub')}
        className={cn(
          'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
          value === 'dub'
            ? 'bg-red-600 text-white'
            : 'text-zinc-400 hover:text-white'
        )}
      >
        Dub
      </button>
    </div>
  );
}
