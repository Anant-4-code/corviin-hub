import React from 'react';
import { Button } from '@/components/ui/Button';

interface MeetingsHeaderProps {
  onScheduleClick: () => void;
  onDateFilterSelect: (df: string) => void;
  activeDateFilter: string;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const MeetingsHeader: React.FC<MeetingsHeaderProps> = ({
  onScheduleClick,
  onDateFilterSelect,
  activeDateFilter,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-ch-border">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-ch-text-primary tracking-tight">
          Meetings & Sessions
        </h1>
        <p className="text-xs sm:text-sm text-ch-text-secondary mt-1">
          Organize meetings, manage discussions, record decisions, and track follow-up actions.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Quick Date Presets */}
        <div className="flex rounded-md border border-ch-border bg-ch-bg p-0.5 text-xs">
          <button
            type="button"
            onClick={() => onDateFilterSelect('ALL')}
            className={`px-2.5 py-1 rounded transition-none font-medium ${
              activeDateFilter === 'ALL'
                ? 'bg-surface text-ch-text-primary shadow-sm font-semibold'
                : 'text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onDateFilterSelect('TODAY')}
            className={`px-2.5 py-1 rounded transition-none font-medium ${
              activeDateFilter === 'TODAY'
                ? 'bg-surface text-ch-text-primary shadow-sm font-semibold'
                : 'text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => onDateFilterSelect('UPCOMING')}
            className={`px-2.5 py-1 rounded transition-none font-medium ${
              activeDateFilter === 'UPCOMING'
                ? 'bg-surface text-ch-text-primary shadow-sm font-semibold'
                : 'text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Upcoming
          </button>
          <button
            type="button"
            onClick={() => onDateFilterSelect('PAST')}
            className={`px-2.5 py-1 rounded transition-none font-medium ${
              activeDateFilter === 'PAST'
                ? 'bg-surface text-ch-text-primary shadow-sm font-semibold'
                : 'text-ch-text-secondary hover:text-ch-text-primary'
            }`}
          >
            Past Meetings
          </button>
        </div>

        {/* Refresh button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="text-xs h-8"
        >
          {isRefreshing ? 'Refreshing...' : '🔄 Refresh'}
        </Button>

        {/* Primary Schedule Meeting CTA */}
        <Button
          variant="primary"
          size="sm"
          onClick={onScheduleClick}
          className="text-xs h-8 font-semibold"
        >
          + Schedule Meeting
        </Button>
      </div>
    </div>
  );
};
