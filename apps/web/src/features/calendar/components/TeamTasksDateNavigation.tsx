import React from 'react';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, Calendar, Plus, Users, ListFilter } from 'lucide-react';

interface TeamTasksDateNavigationProps {
  currentDate: string; // YYYY-MM-DD
  onDateChange: (date: string) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  viewMode: 'BY_MEMBER' | 'AGENDA';
  onViewModeChange: (mode: 'BY_MEMBER' | 'AGENDA') => void;
  onOpenCreateTask: () => void;
}

export function TeamTasksDateNavigation({
  currentDate,
  onDateChange,
  onPrevDay,
  onNextDay,
  onToday,
  viewMode,
  onViewModeChange,
  onOpenCreateTask,
}: TeamTasksDateNavigationProps) {
  const d = new Date(`${currentDate}T00:00:00.000Z`);
  const formattedDate = d.toLocaleDateString([], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-3 border border-ch-border rounded-card">
      {/* Date Navigation */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="text-xs h-8 px-2.5 font-medium"
        >
          Today
        </Button>

        <div className="flex items-center border border-ch-border rounded-md bg-canvas">
          <button
            type="button"
            onClick={onPrevDay}
            aria-label="Previous day"
            className="p-1.5 text-ch-text-secondary hover:text-ch-text-primary hover:bg-surface-muted transition-none border-r border-ch-border"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={onNextDay}
            aria-label="Next day"
            className="p-1.5 text-ch-text-secondary hover:text-ch-text-primary hover:bg-surface-muted transition-none"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Date Title and Picker */}
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-ch-text-primary select-none pl-1">
            {formattedDate}
          </h2>
          <div className="relative">
            <input
              type="date"
              value={currentDate}
              onChange={(e) => {
                if (e.target.value) onDateChange(e.target.value);
              }}
              aria-label="Jump to date"
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
            />
            <button
              type="button"
              className="p-1.5 text-ch-text-secondary hover:text-ch-text-primary border border-ch-border rounded hover:bg-surface-muted transition-none pointer-events-none"
              title="Pick a date"
            >
              <Calendar size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* View Switcher & Action */}
      <div className="flex items-center justify-between sm:justify-end gap-2">
        <div className="inline-flex rounded-md border border-ch-border bg-canvas p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => onViewModeChange('BY_MEMBER')}
            className={`px-2.5 py-1 rounded transition-none text-xs font-semibold flex items-center gap-1.5 ${
              viewMode === 'BY_MEMBER'
                ? 'bg-accent text-accent-foreground shadow-sm'
                : 'text-ch-text-secondary hover:text-ch-text-primary hover:bg-surface-muted'
            }`}
          >
            <Users size={12} />
            <span>By Member</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('AGENDA')}
            className={`px-2.5 py-1 rounded transition-none text-xs font-semibold flex items-center gap-1.5 ${
              viewMode === 'AGENDA'
                ? 'bg-accent text-accent-foreground shadow-sm'
                : 'text-ch-text-secondary hover:text-ch-text-primary hover:bg-surface-muted'
            }`}
          >
            <ListFilter size={12} />
            <span>Agenda</span>
          </button>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onOpenCreateTask}
          className="text-xs h-8 gap-1.5 font-medium"
        >
          <Plus size={14} />
          <span>New Task</span>
        </Button>
      </div>
    </div>
  );
}

