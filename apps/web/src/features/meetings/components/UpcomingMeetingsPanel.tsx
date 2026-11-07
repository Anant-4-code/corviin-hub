import React from 'react';
import { Link } from 'react-router-dom';
import type { MeetingItem } from '@corviin-hub/shared';
import { MeetingStatus } from '@corviin-hub/shared';
import {
  MEETING_CATEGORY_CONFIG,
  formatMeetingTimeRange,
  formatMeetingDate,
  getMemberName,
} from './meeting-constants';

interface UpcomingMeetingsPanelProps {
  meetings: MeetingItem[];
  onRescheduleClick: (meeting: MeetingItem) => void;
}

export const UpcomingMeetingsPanel: React.FC<UpcomingMeetingsPanelProps> = ({
  meetings,
  onRescheduleClick,
}) => {
  const upcomingMeetings = meetings
    .filter(
      (m) =>
        m.status === MeetingStatus.SCHEDULED ||
        m.status === MeetingStatus.CONFIRMED ||
        m.date >= '2026-11-05',
    )
    .slice(0, 4);

  return (
    <div className="bg-surface border border-border rounded-md p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-primary">
            Upcoming Sessions & Active Pipeline
          </h3>
          <p className="text-[11px] text-secondary mt-0.5">
            Immediate scheduled discussions requiring preparation or attendance.
          </p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 bg-brand-teal/10 text-brand-teal rounded">
          {upcomingMeetings.length} Priority Sessions
        </span>
      </div>

      {upcomingMeetings.length === 0 ? (
        <div className="p-4 text-center text-xs text-tertiary border border-dashed border-border rounded-md">
          No immediate upcoming meetings scheduled.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {upcomingMeetings.map((meeting) => {
            const cat = MEETING_CATEGORY_CONFIG[meeting.category];
            return (
              <div
                key={meeting.id}
                className="bg-surface-muted/50 border border-border rounded-md p-3 flex flex-col justify-between space-y-2 hover:border-brand-teal transition-none"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-brand-teal">
                      {formatMeetingDate(meeting.date)}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${cat.badgeClass}`}
                    >
                      {cat.label}
                    </span>
                  </div>

                  <Link
                    to={`/app/meetings/${meeting.id}`}
                    className="font-bold text-xs text-primary hover:text-brand-teal line-clamp-1"
                  >
                    {meeting.title}
                  </Link>

                  <div className="text-[11px] text-secondary mt-1">
                    🕒 {formatMeetingTimeRange(meeting.startTime, meeting.endTime)} • Host:{' '}
                    <strong>{getMemberName(meeting.organiserId)}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-end gap-1.5 text-xs">
                  {meeting.meetingUrl && (
                    <a
                      href={meeting.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-brand-teal text-white hover:bg-brand-teal/90"
                    >
                      Join
                    </a>
                  )}
                  {meeting.phoneNumber && (
                    <a
                      href={`tel:${meeting.phoneNumber}`}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      Call
                    </a>
                  )}
                  <Link
                    to={`/app/meetings/${meeting.id}`}
                    className="px-2 py-1 text-xs font-medium rounded border border-border bg-surface text-primary hover:bg-surface-hover"
                  >
                    Open
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

