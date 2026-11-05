import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface TimelineEvent {
  id: string;
  actorName: string;
  action: string;
  target?: string;
  timestamp: string;
  details?: ReactNode;
}

interface ActivityTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function ActivityTimeline({ events, className }: ActivityTimelineProps) {
  if (events.length === 0) {
    return <p className="text-xs text-ch-text-muted py-4">No recent activity recorded.</p>;
  }

  return (
    <div className={cn('relative pl-4 border-l border-ch-border space-y-4', className)}>
      {events.map((event) => (
        <div key={event.id} className="relative group">
          <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-surface bg-accent" />
          <div className="text-xs">
            <span className="font-semibold text-ch-text-primary">{event.actorName}</span>{' '}
            <span className="text-ch-text-secondary">{event.action}</span>{' '}
            {event.target && <span className="font-medium text-ch-text-primary">{event.target}</span>}
          </div>
          <p className="text-[11px] text-ch-text-muted mt-0.5">{event.timestamp}</p>
          {event.details && <div className="mt-1 text-xs text-ch-text-secondary">{event.details}</div>}
        </div>
      ))}
    </div>
  );
}

