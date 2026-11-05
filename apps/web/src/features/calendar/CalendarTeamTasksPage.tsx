import { Construction } from 'lucide-react';

export function CalendarTeamTasksPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-surface border border-ch-border rounded-lg text-sm text-ch-text-secondary">
        <Construction size={15} className="text-warning shrink-0" />
        <span>Team Tasks Calendar — Daily operational schedule organized into clickable member accordions showing planned vs actual timelines.</span>
      </div>
      <div className="bg-surface border border-ch-border rounded-lg p-6 text-center">
        <h3 className="text-sm font-semibold text-ch-text-primary mb-2">Member Task Timeline</h3>
        <p className="text-sm text-ch-text-secondary mb-4 max-w-md mx-auto">
          Planned start and due dates projected directly from the shared task engine for Anant, Rohit, and Utkarsh.
        </p>
        <div className="h-48 rounded bg-surface-muted border border-ch-border flex items-center justify-center">
          <span className="text-xs text-ch-text-muted font-medium">Team calendar accordion not implemented yet (Phase 3)</span>
        </div>
      </div>
    </div>
  );
}
