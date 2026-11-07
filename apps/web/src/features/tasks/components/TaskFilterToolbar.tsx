import React, { useState, useEffect } from 'react';
import { TaskPriority, TaskStatus } from '@corviin-hub/shared';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';

export type DateFilterOption =
  | 'ALL'
  | 'TODAY'
  | 'TOMORROW'
  | 'THIS_WEEK'
  | 'NEXT_WEEK'
  | 'OVERDUE';

export interface TaskFilterState {
  search: string;
  status: string;
  priority: string;
  dateRange: DateFilterOption;
  assigneeId?: string;
  project?: string;
}

interface TaskFilterToolbarProps {
  filters: TaskFilterState;
  onFilterChange: (filters: TaskFilterState) => void;
  onReset: () => void;
  assignees?: { id: string; displayName: string }[];
  showAssigneeFilter?: boolean;
  totalResults?: number;
}

export function TaskFilterToolbar({
  filters,
  onFilterChange,
  onReset,
  assignees = [],
  showAssigneeFilter = false,
  totalResults,
}: TaskFilterToolbarProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Debounce search update
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== filters.search) {
        onFilterChange({ ...filters, search: localSearch });
      }
    }, 250);
    return () => clearTimeout(handler);
  }, [localSearch, filters, onFilterChange]);

  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  // Count active filters (excluding defaults)
  const activeFilterCount = [
    filters.status !== 'ALL',
    filters.priority !== 'ALL',
    filters.dateRange !== 'ALL',
    Boolean(filters.assigneeId && filters.assigneeId !== 'ALL'),
    Boolean(filters.search.trim()),
  ].filter(Boolean).length;

  const handleClearSingle = (key: keyof TaskFilterState, defaultValue: any) => {
    if (key === 'search') setLocalSearch('');
    onFilterChange({ ...filters, [key]: defaultValue });
  };

  return (
    <div className="space-y-2">
      {/* Main Toolbar */}
      <div className="bg-surface p-2.5 rounded-lg border border-ch-border flex flex-wrap items-center gap-2 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ch-text-muted"
          />
          <Input
            placeholder={
              showAssigneeFilter
                ? 'Search tasks, assignees, projects or campaigns...'
                : 'Search tasks by title, description or project...'
            }
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-8 h-8 text-xs bg-canvas/40"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch('');
                onFilterChange({ ...filters, search: '' });
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ch-text-muted hover:text-ch-text-primary p-0.5"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Desktop Quick Dropdowns */}
        <div className="hidden md:flex items-center gap-2">
          {/* Status Select */}
          <div className="w-32">
            <Select
              value={filters.status}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
              className="h-8 text-xs"
              options={[
                { value: 'ALL', label: 'All Statuses' },
                { value: TaskStatus.TODO, label: 'To Do' },
                { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
                { value: TaskStatus.ON_HOLD, label: 'On Hold' },
                { value: TaskStatus.BLOCKED, label: 'Blocked' },
                { value: TaskStatus.COMPLETED, label: 'Completed' },
                { value: TaskStatus.CANCELLED, label: 'Cancelled' },
              ]}
            />
          </div>

          {/* Priority Select */}
          <div className="w-32">
            <Select
              value={filters.priority}
              onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
              className="h-8 text-xs"
              options={[
                { value: 'ALL', label: 'All Priorities' },
                { value: TaskPriority.URGENT, label: 'Urgent' },
                { value: TaskPriority.HIGH, label: 'High' },
                { value: TaskPriority.MEDIUM, label: 'Medium' },
                { value: TaskPriority.LOW, label: 'Low' },
              ]}
            />
          </div>

          {/* Date Range Select */}
          <div className="w-32">
            <Select
              value={filters.dateRange}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  dateRange: e.target.value as DateFilterOption,
                })
              }
              className="h-8 text-xs"
              options={[
                { value: 'ALL', label: 'All Dates' },
                { value: 'TODAY', label: 'Due Today' },
                { value: 'TOMORROW', label: 'Due Tomorrow' },
                { value: 'THIS_WEEK', label: 'This Week' },
                { value: 'NEXT_WEEK', label: 'Next Week' },
                { value: 'OVERDUE', label: 'Overdue' },
              ]}
            />
          </div>

          {/* Optional Assignee Filter */}
          {showAssigneeFilter && (
            <div className="w-36">
              <Select
                value={filters.assigneeId || 'ALL'}
                onChange={(e) =>
                  onFilterChange({ ...filters, assigneeId: e.target.value })
                }
                className="h-8 text-xs"
                options={[
                  { value: 'ALL', label: 'All Assignees' },
                  { value: 'UNASSIGNED', label: 'Unassigned' },
                  ...assignees.map((a) => ({
                    value: a.id,
                    label: a.displayName,
                  })),
                ]}
              />
            </div>
          )}
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="flex items-center gap-1.5 md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileDrawerOpen(true)}
            className="h-8 px-2.5 text-xs flex items-center gap-1 border-ch-border"
          >
            <SlidersHorizontal size={13} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Clear Filters Button */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2 text-xs text-ch-text-secondary hover:text-ch-text-primary flex items-center gap-1"
          >
            <RotateCcw size={12} />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-0.5 text-[11px]">
          <span className="text-ch-text-muted font-medium">Active:</span>

          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface border border-ch-border text-ch-text-primary">
              Keyword: "{filters.search}"
              <button
                type="button"
                onClick={() => handleClearSingle('search', '')}
                className="text-ch-text-muted hover:text-ch-text-primary"
              >
                <X size={11} />
              </button>
            </span>
          )}

          {filters.status !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface border border-ch-border text-ch-text-primary font-medium">
              Status: {filters.status.replace('_', ' ')}
              <button
                type="button"
                onClick={() => handleClearSingle('status', 'ALL')}
                className="text-ch-text-muted hover:text-ch-text-primary"
              >
                <X size={11} />
              </button>
            </span>
          )}

          {filters.priority !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface border border-ch-border text-ch-text-primary font-medium">
              Priority: {filters.priority}
              <button
                type="button"
                onClick={() => handleClearSingle('priority', 'ALL')}
                className="text-ch-text-muted hover:text-ch-text-primary"
              >
                <X size={11} />
              </button>
            </span>
          )}

          {filters.dateRange !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface border border-ch-border text-ch-text-primary font-medium">
              Date: {filters.dateRange.replace('_', ' ')}
              <button
                type="button"
                onClick={() => handleClearSingle('dateRange', 'ALL')}
                className="text-ch-text-muted hover:text-ch-text-primary"
              >
                <X size={11} />
              </button>
            </span>
          )}

          {filters.assigneeId && filters.assigneeId !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface border border-ch-border text-ch-text-primary font-medium">
              Assignee:{' '}
              {filters.assigneeId === 'UNASSIGNED'
                ? 'Unassigned'
                : assignees.find((a) => a.id === filters.assigneeId)?.displayName ||
                  'Selected'}
              <button
                type="button"
                onClick={() => handleClearSingle('assigneeId', 'ALL')}
                className="text-ch-text-muted hover:text-ch-text-primary"
              >
                <X size={11} />
              </button>
            </span>
          )}

          {totalResults !== undefined && (
            <span className="ml-auto text-ch-text-muted font-medium">
              {totalResults} {totalResults === 1 ? 'task' : 'tasks'} found
            </span>
          )}
        </div>
      )}

      {/* Mobile Filters Modal Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
          <div className="bg-surface w-full max-w-md rounded-t-xl sm:rounded-xl border border-ch-border p-4 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-ch-border pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-blue-600" />
                <h3 className="font-semibold text-sm text-ch-text-primary">
                  Filter Tasks
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded text-ch-text-muted hover:text-ch-text-primary"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-ch-text-secondary mb-1">
                  Status
                </label>
                <Select
                  value={filters.status}
                  onChange={(e) =>
                    onFilterChange({ ...filters, status: e.target.value })
                  }
                  options={[
                    { value: 'ALL', label: 'All Statuses' },
                    { value: TaskStatus.TODO, label: 'To Do' },
                    { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
                    { value: TaskStatus.ON_HOLD, label: 'On Hold' },
                    { value: TaskStatus.BLOCKED, label: 'Blocked' },
                    { value: TaskStatus.COMPLETED, label: 'Completed' },
                    { value: TaskStatus.CANCELLED, label: 'Cancelled' },
                  ]}
                />
              </div>

              <div>
                <label className="block font-medium text-ch-text-secondary mb-1">
                  Priority
                </label>
                <Select
                  value={filters.priority}
                  onChange={(e) =>
                    onFilterChange({ ...filters, priority: e.target.value })
                  }
                  options={[
                    { value: 'ALL', label: 'All Priorities' },
                    { value: TaskPriority.URGENT, label: 'Urgent' },
                    { value: TaskPriority.HIGH, label: 'High' },
                    { value: TaskPriority.MEDIUM, label: 'Medium' },
                    { value: TaskPriority.LOW, label: 'Low' },
                  ]}
                />
              </div>

              <div>
                <label className="block font-medium text-ch-text-secondary mb-1">
                  Due Date
                </label>
                <Select
                  value={filters.dateRange}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      dateRange: e.target.value as DateFilterOption,
                    })
                  }
                  options={[
                    { value: 'ALL', label: 'All Dates' },
                    { value: 'TODAY', label: 'Due Today' },
                    { value: 'TOMORROW', label: 'Due Tomorrow' },
                    { value: 'THIS_WEEK', label: 'This Week' },
                    { value: 'NEXT_WEEK', label: 'Next Week' },
                    { value: 'OVERDUE', label: 'Overdue' },
                  ]}
                />
              </div>

              {showAssigneeFilter && (
                <div>
                  <label className="block font-medium text-ch-text-secondary mb-1">
                    Assignee
                  </label>
                  <Select
                    value={filters.assigneeId || 'ALL'}
                    onChange={(e) =>
                      onFilterChange({ ...filters, assigneeId: e.target.value })
                    }
                    options={[
                      { value: 'ALL', label: 'All Assignees' },
                      { value: 'UNASSIGNED', label: 'Unassigned' },
                      ...assignees.map((a) => ({
                        value: a.id,
                        label: a.displayName,
                      })),
                    ]}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-ch-border">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => {
                  onReset();
                  setMobileDrawerOpen(false);
                }}
              >
                Reset All
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setMobileDrawerOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
