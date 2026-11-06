import React from 'react';
import { CalendarViewMode } from '@corviin-hub/shared';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, Plus, Building2 } from 'lucide-react';

interface MeetingsDateControlsProps {
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onOpenScheduleMeeting: () => void;
  onOpenScheduleSiteVisit: () => void;
}

export function MeetingsDateControls({
  viewMode,
  onViewModeChange,
  currentDate,
  onPrev,
  onNext,
  onToday,
  onOpenScheduleMeeting,
  onOpenScheduleSiteVisit,
}: MeetingsDateControlsProps) {
  const getPeriodLabel = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.toLocaleString('default', { month: 'long' });

    if (viewMode === 'MONTH') {
      return `${month} ${year}`;
    }

    if (viewMode === 'DAY') {
      return currentDate.toLocaleDateString('default', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }

    if (viewMode === 'WEEK') {
      const curr = new Date(currentDate);
      const day = curr.getDay();
      const diffToMonday = curr.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(curr.setDate(diffToMonday));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const mMonth = monday.toLocaleString('default', { month: 'short' });
      const sMonth = sunday.toLocaleString('default', { month: 'short' });

      if (mMonth === sMonth) {
        return `${mMonth} ${monday.getDate()} - ${sunday.getDate()}, ${year}`;
      }
      return `${mMonth} ${monday.getDate()} - ${sMonth} ${sunday.getDate()}, ${year}`;
    }

    return `${month} ${year} (Agenda)`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-3 border border-ch-border">
      {/* Navigation and Period Title */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="text-xs h-8 px-2 font-medium"
        >
          Today
        </Button>
        <div className="flex items-center border border-ch-border rounded-none">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrev}
            className="h-8 w-8 p-0 text-ch-text-secondary hover:text-ch-text-primary rounded-none"
            aria-label="Previous period"
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNext}
            className="h-8 w-8 p-0 text-ch-text-secondary hover:text-ch-text-primary rounded-none"
            aria-label="Next period"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
        <h2 className="text-base font-semibold text-ch-text-primary ml-1 truncate">
          {getPeriodLabel()}
        </h2>
      </div>

      {/* View Switcher and Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* View Mode Buttons */}
        <div className="flex border border-ch-border bg-surface-muted/50 p-0.5">
          {(['MONTH', 'WEEK', 'DAY', 'AGENDA'] as CalendarViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`px-2.5 py-1 text-xs font-medium transition-none ${
                viewMode === mode
                  ? 'bg-surface text-ch-text-primary shadow-none font-semibold border-b-2 border-primary'
                  : 'text-ch-text-secondary hover:text-ch-text-primary'
              }`}
            >
              {mode.charAt(0) + mode.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Create Site Visit Action */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenScheduleSiteVisit}
          className="h-8 text-xs gap-1.5 border-warning/40 text-warning hover:bg-warning/10"
        >
          <Building2 size={13} />
          <span>Site Visit</span>
        </Button>

        {/* Create Meeting Action */}
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenScheduleMeeting}
          className="h-8 text-xs gap-1.5"
        >
          <Plus size={14} />
          <span>Schedule Meeting</span>
        </Button>
      </div>
    </div>
  );
}

