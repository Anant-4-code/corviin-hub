import { type ReactNode } from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from './Button';

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

interface FilterBarProps {
  children?: ReactNode;
  activeFilters?: ActiveFilter[];
  onRemoveFilter?: (key: string) => void;
  onResetFilters?: () => void;
  onOpenMobileFilters?: () => void;
  searchSlot?: ReactNode;
  actionSlot?: ReactNode;
  className?: string;
}

export function FilterBar({
  children,
  activeFilters = [],
  onRemoveFilter,
  onResetFilters,
  onOpenMobileFilters,
  searchSlot,
  actionSlot,
  className,
}: FilterBarProps) {
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className={cn('space-y-2.5', className)}>
      {/* Primary bar: Search, desktop filters, mobile filter trigger, optional action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          {searchSlot && <div className="w-full sm:w-64 md:w-72">{searchSlot}</div>}
          
          {/* Desktop inline filter controls */}
          <div className="hidden lg:flex items-center gap-2 flex-wrap">
            {children}
          </div>

          {/* Mobile/Tablet filter sheet trigger button */}
          {onOpenMobileFilters && (
            <div className="lg:hidden flex items-center">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={onOpenMobileFilters}
                className="gap-2 min-h-[40px]"
                aria-label="Open filter panel"
              >
                <Filter size={15} />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="px-1.5 py-0.2 text-[11px] font-semibold bg-accent text-accent-foreground rounded-full">
                    {activeFilters.length}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>

        {actionSlot && <div className="shrink-0 flex items-center gap-2">{actionSlot}</div>}
      </div>

      {/* Active filter pills row */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
          <span className="text-ch-text-secondary font-medium">Active filters:</span>
          {activeFilters.map((filter) => (
            <span
              key={filter.key}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-surface-muted text-ch-text-primary border border-ch-border rounded-control"
            >
              <span className="text-ch-text-secondary">{filter.label}:</span>
              <span className="font-medium">{filter.value}</span>
              {onRemoveFilter && (
                <button
                  type="button"
                  onClick={() => onRemoveFilter(filter.key)}
                  className="p-0.5 text-ch-text-muted hover:text-ch-text-primary rounded focus-visible:outline-accent"
                  aria-label={`Remove filter ${filter.label}`}
                >
                  <X size={12} />
                </button>
              )}
            </span>
          ))}

          {onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs text-accent hover:underline font-medium ml-1 p-0.5"
            >
              <RotateCcw size={11} />
              Reset all
            </button>
          )}
        </div>
      )}
    </div>
  );
}
