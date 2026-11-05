import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface Tab { id: string; label: string; }

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children?: ReactNode;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn('flex border-b border-ch-border gap-0', className)}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px',
            activeTab === tab.id
              ? 'border-accent text-accent'
              : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary hover:border-ch-border-strong',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

