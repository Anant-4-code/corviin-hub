import { Construction } from 'lucide-react';

export function CalendarMeetingsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-surface border border-ch-border rounded-lg text-sm text-ch-text-secondary">
        <Construction size={15} className="text-warning shrink-0" />
        <span>Meetings & Visits Calendar — Internal meetings, client consultations, builder meetings, and real estate site visits.</span>
      </div>
      <div className="bg-surface border border-ch-border rounded-lg p-6 text-center">
        <h3 className="text-sm font-semibold text-ch-text-primary mb-2">Meetings & Visits Schedule</h3>
        <p className="text-sm text-ch-text-secondary mb-4 max-w-md mx-auto">
          Agenda-first mobile layout and desktop calendar view showing participant status, property references, and visit locations.
        </p>
        <div className="h-48 rounded bg-surface-muted border border-ch-border flex items-center justify-center">
          <span className="text-xs text-ch-text-muted font-medium">Meetings calendar not implemented yet (Phase 3)</span>
        </div>
      </div>
    </div>
  );
}
