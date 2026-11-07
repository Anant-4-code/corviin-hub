import React from 'react';
import { Button } from '@/components/ui/Button';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Search,
  Filter,
  Users,
  Inbox,
  Plus,
  LayoutGrid,
  Columns,
  CalendarDays,
  List,
} from 'lucide-react';
import { cn } from '@/lib/cn';

export type TeamTasksViewMode = 'MONTH' | 'WEEK' | 'DAY' | 'AGENDA' | 'BY_MEMBER';

interface TeamTasksToolbarProps {
  currentDate: Date;
  viewMode: TeamTasksViewMode;
  onViewModeChange: (mode: TeamTasksViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onDateSelect: (d: Date) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isFilterOpen: boolean;
  onToggleFilter: () => void;
  activeFilterCount: number;
  isWorkloadOpen: boolean;
  onToggleWorkload: () => void;
  isUnscheduledOpen: boolean;
  onToggleUnscheduled: () => void;
  unscheduledCount: number;
  onCreateTask: () => void;
}

export function TeamTasksToolbar({
  currentDate,
  viewMode,
  onViewModeChange,
  onPrev,
  onNext,
  onToday,
  onDateSelect,
  searchQuery,
  onSearchChange,
  isFilterOpen,
  onToggleFilter,
  activeFilterCount,
  isWorkloadOpen,
  onToggleWorkload,
  isUnscheduledOpen,
  onToggleUnscheduled,
  unscheduledCount,
  onCreateTask,
}: TeamTasksToolbarProps) {
  // Compute formatted period label based on view mode
  let periodLabel = '';
  if (viewMode === 'MONTH') {
    periodLabel = currentDate.toLocaleDateString([], { month: 'long', year: 'numeric' });
  } else if (viewMode === 'WEEK') {
    // Mon-Sun of the week
    const day = currentDate.getDay();
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(diff);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startMonth = startOfWeek.toLocaleDateString([], { month: 'short' });
    const endMonth = endOfWeek.toLocaleDateString([], { month: 'short' });
    const year = endOfWeek.getFullYear();

    if (startMonth === endMonth) {
      periodLabel = `${startMonth} ${startOfWeek.getDate()} – ${endOfWeek.getDate()}, ${year}`;
    } else {
      periodLabel = `${startMonth} ${startOfWeek.getDate()} – ${endMonth} ${endOfWeek.getDate()}, ${year}`;
    }
  } else if (viewMode === 'DAY') {
    periodLabel = currentDate.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } else {
    // Agenda
    periodLabel = currentDate.toLocaleDateString([], { month: 'long', year: 'numeric' });
  }

  // Format date input value (YYYY-MM-DD)
  const dateInputValue = currentDate.toISOString().slice(0, 10);

  return (
    <div className="space-y-3 bg-surface border border-ch-border rounded-card p-3 shadow-sm">
      {/* Top Line: Navigation, Period Label, View Switcher & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Navigation Controls & Period Label */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onToday}
            className="text-xs h-8 px-2.5 font-semibold"
          >
            Today
          </Button>

          <div className="flex items-center border border-ch-border rounded-md bg-canvas">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous period"
              className="p-1.5 text-ch-text-secondary hover:text-ch-text-primary hover:bg-surface-muted transition-none border-r border-ch-border"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next period"
              className="p-1.5 text-ch-text-secondary hover:text-ch-text-primary hover:bg-surface-muted transition-none"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Period Title & Date Jump */}
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-ch-text-primary select-none whitespace-nowrap">
              {periodLabel}
            </h2>

            <div className="relative">
              <input
                type="date"
                value={dateInputValue}
                onChange={(e) => {
                  if (e.target.value) {
                    onDateSelect(new Date(`${e.target.value}T12:00:00.000Z`));
                  }
                }}
                aria-label="Jump to date"
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
              />
              <button
                type="button"
                className="p-1.5 text-ch-text-secondary hover:text-ch-text-primary border border-ch-border rounded hover:bg-surface-muted transition-none"
                title="Jump to date"
              >
                <CalendarIcon size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Center / Right: View Mode Selector & Panel Toggles */}
        <div className="flex items-center gap-2 flex-wrap justify-between lg:justify-end">
          {/* View Selector Pills */}
          <div className="inline-flex rounded-md border border-ch-border bg-canvas p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => onViewModeChange('MONTH')}
              className={cn(
                'px-2.5 py-1 rounded transition-none text-xs font-semibold flex items-center gap-1.5',
                viewMode === 'MONTH'
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-ch-text-secondary hover:text-ch-text-primary',
              )}
            >
              <LayoutGrid size={13} />
              <span className="hidden sm:inline">Month</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('WEEK')}
              className={cn(
                'px-2.5 py-1 rounded transition-none text-xs font-semibold flex items-center gap-1.5',
                viewMode === 'WEEK'
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-ch-text-secondary hover:text-ch-text-primary',
              )}
            >
              <Columns size={13} />
              <span className="hidden sm:inline">Week</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('DAY')}
              className={cn(
                'px-2.5 py-1 rounded transition-none text-xs font-semibold flex items-center gap-1.5',
                viewMode === 'DAY'
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-ch-text-secondary hover:text-ch-text-primary',
              )}
            >
              <CalendarDays size={13} />
              <span className="hidden sm:inline">Day</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('AGENDA')}
              className={cn(
                'px-2.5 py-1 rounded transition-none text-xs font-semibold flex items-center gap-1.5',
                viewMode === 'AGENDA'
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-ch-text-secondary hover:text-ch-text-primary',
              )}
            >
              <List size={13} />
              <span>Agenda</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('BY_MEMBER')}
              className={cn(
                'px-2.5 py-1 rounded transition-none text-xs font-semibold flex items-center gap-1.5',
                viewMode === 'BY_MEMBER'
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-ch-text-secondary hover:text-ch-text-primary',
              )}
            >
              <Users size={13} />
              <span className="hidden sm:inline">By Member</span>
            </button>
          </div>

          {/* Workload Panel Toggle */}
          <button
            type="button"
            onClick={onToggleWorkload}
            className={cn(
              'h-8 px-2.5 rounded border text-xs font-semibold flex items-center gap-1.5 transition-none',
              isWorkloadOpen
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-ch-border bg-canvas text-ch-text-secondary hover:text-ch-text-primary',
            )}
            title="Toggle Team Workload Panel"
          >
            <Users size={13} />
            <span className="hidden md:inline">Workload</span>
          </button>

          {/* Unscheduled Tasks Toggle */}
          <button
            type="button"
            onClick={onToggleUnscheduled}
            className={cn(
              'h-8 px-2.5 rounded border text-xs font-semibold flex items-center gap-1.5 transition-none',
              isUnscheduledOpen
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-ch-border bg-canvas text-ch-text-secondary hover:text-ch-text-primary',
            )}
            title="Toggle Unscheduled Tasks"
          >
            <Inbox size={13} />
            <span className="hidden md:inline">Unscheduled</span>
            {unscheduledCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-surface-muted text-[10px] font-bold border border-ch-border">
                {unscheduledCount}
              </span>
            )}
          </button>

          {/* Create Task Button */}
          <Button
            size="sm"
            onClick={onCreateTask}
            className="text-xs h-8 px-3 font-semibold bg-accent text-accent-foreground hover:opacity-90 flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Create Task</span>
          </Button>
        </div>
      </div>

      {/* Bottom Line: Search & Filter Toggle */}
      <div className="flex items-center gap-2 pt-2 border-t border-ch-border">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ch-text-muted pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title, description, assignee, ID..."
            className="w-full pl-8 pr-3 py-1.5 bg-canvas border border-ch-border rounded text-xs text-ch-text-primary placeholder:text-ch-text-muted focus:outline-none focus:border-accent"
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          type="button"
          onClick={onToggleFilter}
          className={cn(
            'h-8 px-3 rounded border text-xs font-semibold flex items-center gap-1.5 transition-none shrink-0',
            isFilterOpen || activeFilterCount > 0
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-ch-border bg-canvas text-ch-text-secondary hover:text-ch-text-primary',
          )}
        >
          <Filter size={13} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-accent text-accent-foreground text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
