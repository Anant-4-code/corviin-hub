import { Construction } from 'lucide-react';

export function CalendarContentPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-surface border border-ch-border rounded-lg text-sm text-ch-text-secondary">
        <Construction size={15} className="text-warning shrink-0" />
        <span>Content & Campaigns Calendar — Scheduled publishing dates, video shoot days, editing deadlines, and live post tracking.</span>
      </div>
      <div className="bg-surface border border-ch-border rounded-lg p-6 text-center">
        <h3 className="text-sm font-semibold text-ch-text-primary mb-2">Content Production Timetable</h3>
        <p className="text-sm text-ch-text-secondary mb-4 max-w-md mx-auto">
          Month, week, and agenda views aggregating campaign stage milestones without duplicating records.
        </p>
        <div className="h-48 rounded bg-surface-muted border border-ch-border flex items-center justify-center">
          <span className="text-xs text-ch-text-muted font-medium">Calendar grid not implemented yet (Phase 3)</span>
        </div>
      </div>
    </div>
  );
}
