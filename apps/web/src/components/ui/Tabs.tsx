import { cn } from '@/lib/cn';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Section navigation"
      className={cn('flex border-b border-ch-border overflow-x-auto gap-0 scrollbar-none', className)}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            disabled={tab.disabled}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap cursor-pointer select-none',
              'focus-visible:outline-2 focus-visible:outline-accent',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              isActive
                ? 'border-accent text-accent font-semibold'
                : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary hover:border-ch-border-strong',
            )}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.2 text-[11px] font-semibold rounded-full',
                  isActive
                    ? 'bg-accent/15 text-accent'
                    : 'bg-surface-muted text-ch-text-muted',
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
