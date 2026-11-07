import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { MeetingItem } from '@corviin-hub/shared';
import { formatMeetingDate } from './meeting-constants';

interface MeetingRecentActivityFeedProps {
  meetings: MeetingItem[];
}

interface FlattenedActivityItem {
  id: string;
  meetingId: string;
  meetingTitle: string;
  action: string;
  actorName: string;
  timestamp: string;
  note?: string;
}

export const MeetingRecentActivityFeed: React.FC<MeetingRecentActivityFeedProps> = ({ meetings }) => {
  const activities: FlattenedActivityItem[] = useMemo(() => {
    const list: FlattenedActivityItem[] = [];

    meetings.forEach((m) => {
      // Activity log from meeting model
      if (m.activity && m.activity.length > 0) {
        m.activity.forEach((act) => {
          list.push({
            id: `${m.id}-${act.id || act.timestamp}`,
            meetingId: m.id,
            meetingTitle: m.title,
            action: act.action,
            actorName: act.actorName,
            timestamp: act.timestamp,
            note: act.note,
          });
        });
      }

      // Also synthesize events from rescheduleHistory if present
      if (m.rescheduleHistory && m.rescheduleHistory.length > 0) {
        m.rescheduleHistory.forEach((rh, idx) => {
          list.push({
            id: `${m.id}-resh-${idx}`,
            meetingId: m.id,
            meetingTitle: m.title,
            action: 'Meeting Rescheduled',
            actorName: rh.rescheduledByName || 'Team Member',
            timestamp: rh.timestamp,
            note: `Reason: ${rh.reason}`,
          });
        });
      }

      // If formalDecisions are logged, synthesize recent decision activities
      if (m.formalDecisions && m.formalDecisions.length > 0) {
        m.formalDecisions.forEach((dec) => {
          list.push({
            id: `${m.id}-${dec.id}`,
            meetingId: m.id,
            meetingTitle: m.title,
            action: 'Formal Decision Recorded',
            actorName: 'Team',
            timestamp: dec.createdAt,
            note: dec.decisionText,
          });
        });
      }
    });

    // Sort descending by timestamp
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);
  }, [meetings]);

  const formatActivityTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return `${formatMeetingDate(isoString.slice(0, 10))} at ${d.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-surface border border-border rounded-md p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-primary">
            Recent Meeting Activity & Audit Feed
          </h3>
          <p className="text-[11px] text-secondary mt-0.5">
            Operational timeline of scheduling changes, recorded decisions, and task conversions.
          </p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 bg-surface-muted text-secondary border border-border rounded">
          {activities.length} Recent Events
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="p-6 text-center text-xs text-secondary border border-dashed border-border rounded-md">
          No meeting lifecycle activity recorded yet.
        </div>
      ) : (
        <div className="relative pl-3 space-y-3 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
          {activities.map((act) => (
            <div key={act.id} className="relative flex items-start gap-2.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-teal ring-4 ring-surface shrink-0 mt-1" />
              <div className="flex-1 min-w-0 bg-surface-muted/30 border border-border/80 rounded p-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                  <span className="font-semibold text-primary">
                    <span className="text-brand-teal font-bold">{act.actorName}</span> • {act.action}
                  </span>
                  <span className="text-tertiary whitespace-nowrap">
                    {formatActivityTime(act.timestamp)}
                  </span>
                </div>

                <div className="mt-1 text-[11px] text-secondary">
                  Meeting:{' '}
                  <Link
                    to={`/app/meetings/${act.meetingId}`}
                    className="font-medium text-brand-teal hover:underline"
                  >
                    {act.meetingTitle}
                  </Link>
                </div>

                {act.note && (
                  <p className="mt-1 text-[11px] text-secondary italic bg-surface/60 p-1.5 rounded border border-border">
                    {act.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default MeetingRecentActivityFeed;

