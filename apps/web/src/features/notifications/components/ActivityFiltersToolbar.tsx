import React from 'react';
import { Search, ArrowUpDown, X } from 'lucide-react';
import { ACTIVITY_MODULES, ACTIVITY_ACTIONS } from './notification-constants';

interface ActivityFiltersToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  entityTypeFilter: string;
  onEntityTypeFilterChange: (type: string) => void;
  actionFilter: string;
  onActionFilterChange: (action: string) => void;
  actorFilter: string;
  onActorFilterChange: (actor: string) => void;
  availableActors: string[];
  dateRange: string;
  onDateRangeChange: (dr: string) => void;
  sortDirection: 'newest' | 'oldest';
  onSortDirectionChange: (dir: 'newest' | 'oldest') => void;
  onResetFilters: () => void;
  totalCount?: number;
  filteredCount?: number;
}

export const ActivityFiltersToolbar: React.FC<ActivityFiltersToolbarProps> = ({
  searchQuery,
  onSearchChange,
  entityTypeFilter,
  onEntityTypeFilterChange,
  actionFilter,
  onActionFilterChange,
  actorFilter,
  onActorFilterChange,
  availableActors,
  dateRange,
  onDateRangeChange,
  sortDirection,
  onSortDirectionChange,
  onResetFilters,
  totalCount,
  filteredCount,
}) => {
  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    entityTypeFilter !== 'ALL' ||
    actionFilter !== 'ALL' ||
    actorFilter !== 'ALL' ||
    dateRange !== 'ALL';

  return (
    <div className="bg-surface border border-border rounded-lg p-3 space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search activity by entity title, actor, or change summary..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border rounded text-primary placeholder-tertiary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[36px]"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Module Filter */}
          <select
            value={entityTypeFilter}
            onChange={(e) => onEntityTypeFilterChange(e.target.value)}
            className="text-xs bg-surface border border-border rounded px-2.5 py-1.5 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[36px]"
          >
            {ACTIVITY_MODULES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>

          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => onActionFilterChange(e.target.value)}
            className="text-xs bg-surface border border-border rounded px-2.5 py-1.5 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[36px]"
          >
            {ACTIVITY_ACTIONS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>

          {/* Actor Filter */}
          <select
            value={actorFilter}
            onChange={(e) => onActorFilterChange(e.target.value)}
            className="text-xs bg-surface border border-border rounded px-2.5 py-1.5 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[36px]"
          >
            <option value="ALL">All Actors</option>
            {availableActors.map((actor) => (
              <option key={actor} value={actor}>
                {actor}
              </option>
            ))}
          </select>

          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="text-xs bg-surface border border-border rounded px-2.5 py-1.5 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[36px]"
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Today</option>
            <option value="7D">Last 7 Days</option>
            <option value="30D">Last 30 Days</option>
          </select>

          {/* Sort Direction Toggle */}
          <button
            type="button"
            onClick={() => onSortDirectionChange(sortDirection === 'newest' ? 'oldest' : 'newest')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-surface border border-border text-secondary hover:text-primary hover:bg-surface-muted min-h-[36px] transition-none cursor-pointer"
            title="Toggle sort direction"
          >
            <ArrowUpDown size={13} className="text-brand-teal" />
            <span>{sortDirection === 'newest' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>
      </div>

      {/* Info bar & Clear filters */}
      <div className="flex items-center justify-between text-xs text-secondary pt-1 border-t border-border/60">
        <div>
          {typeof filteredCount === 'number' && (
            <span>
              Showing <strong>{filteredCount}</strong>
              {typeof totalCount === 'number' && totalCount !== filteredCount
                ? ` of ${totalCount}`
                : ''}{' '}
              chronological audit entries
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-[11px] text-brand-teal hover:underline font-semibold"
          >
            <X size={12} />
            <span>Clear filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
export default ActivityFiltersToolbar;

