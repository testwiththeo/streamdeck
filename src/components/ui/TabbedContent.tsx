'use client';

import { useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabbedContentProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

/**
 * Horizontal tab bar with animated underline indicator.
 * Content renders below with a fade-in animation.
 */
export function TabbedContent({ tabs, defaultTab, className }: TabbedContentProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id ?? '');

  const currentContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className={className}>
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-border" role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative px-4 py-3 text-sm font-medium transition-colors duration-fast ease-standard',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0',
                isActive
                  ? 'text-text-primary'
                  : 'text-text-tertiary hover:text-text-secondary'
              )}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-brand" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div
        key={activeTab}
        className="animate-fade-in pt-6"
        role="tabpanel"
      >
        {currentContent}
      </div>
    </div>
  );
}
