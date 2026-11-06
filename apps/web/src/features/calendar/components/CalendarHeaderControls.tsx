import React from 'react';
import { CalendarViewMode } from '@corviin-hub/shared';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, Plus, Megaphone } from 'lucide-react';

interface CalendarHeaderControlsProps {
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onOpenCreateEvent: () => void;
  onOpenCreateCampaign: () => void;
}

export function CalendarHeaderControls({
  viewMode,
  onViewModeChange,
  currentDate,
  onPrev,
  onNext,
  onToday,
  onOpenCreateEvent,
  onOpenCreateCampaign,
}: CalendarHeaderControlsProps) {
  // Format period label according to view mode
  const getPeriodLabel = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.toLocaleString('default', { month: 'long' });

    if (viewMode === 'MONTH') {
      return `${month} ${year}`;
    }

    if (viewMode === 'DAY') {
      return `${currentDate.getDate()} ${month} ${year}`;
    }

    if (viewMode === 'WEEK') {
      // Calculate start and end of week (Mon - Sun)
      const curr = new Date(currentDate);
      const day = curr.getDay();
      const diffToMonday = curr.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(curr.setDate(diffToMonday));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const mMonth = monday.toLocaleString('default', { month: 'short' });
      const sMonth = sunday.toLocaleString('default', { month: 'short' });

      if (mMonth === sMonth) {
        return `${monday.getDate()} – ${sunday.getDate()} ${mMonth} ${year}`;
      }
      return `${monday.getDate()} ${mMonth} – ${sunday.getDate()} ${sMonth} ${year}`;
    }

    return `${month} ${year} — Production Schedule`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-3 border border-ch-border rounded-card">
      {/* Navigation Controls */}
      <div className="flex items-center gap-2">
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
        <h2 className="text-base font-bold text-ch-text-primary pl-1 select-none">
          {getPeriodLabel()}
        </h2>
      </div>

      {/* View Switcher & Action Buttons */}
      <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
        {/* View Switcher segmented buttons */}
        <div className="inline-flex rounded-md border border-ch-border bg-canvas p-0.5 text-xs font-medium">
          {(['MONTH', 'WEEK', 'DAY', 'AGENDA'] as CalendarViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onViewModeChange(mode)}
              className={`px-2.5 py-1 rounded transition-none text-xs font-semibold ${
                viewMode === mode
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-ch-text-secondary hover:text-ch-text-primary hover:bg-surface-muted'
              }`}
            >
              {mode.charAt(0) + mode.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenCreateCampaign}
            className="text-xs h-8 gap-1.5"
          >
            <Megaphone size={13} />
            <span>New Campaign</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenCreateEvent}
            className="text-xs h-8 gap-1.5"
          >
            <Plus size={14} />
            <span>Add Milestone</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

