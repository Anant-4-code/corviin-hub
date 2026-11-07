import React from 'react';
import { Link } from 'react-router-dom';
import type { MeetingItem } from '@corviin-hub/shared';
import {
  MEETING_CATEGORY_CONFIG,
  MEETING_STATUS_CONFIG,
  formatMeetingTimeRange,
  formatMeetingDate,
  getMemberName,
} from './meeting-constants';

interface MeetingsAgendaViewProps {
  meetings: MeetingItem[];
  onRescheduleClick: (meeting: MeetingItem) => void;
}

export const MeetingsAgendaView: React.FC<MeetingsAgendaViewProps> = ({
  meetings,
  onRescheduleClick,
}) => {
  if (meetings.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-md p-12 text-center">
        <h3 className="text-base font-semibold text-primary">No meetings scheduled</h3>
        <p className="text-sm text-secondary mt-1">
          No agenda items found for current selection.
        </p>
      </div>
    );
  }

  // Group chronologically by date
  const sorted = [...meetings].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );

  const datesMap: Record<string, MeetingItem[]> = {};
  sorted.forEach((m) => {
    const dStr = m.date;
    if (!datesMap[dStr]) datesMap[dStr] = [];
    datesMap[dStr].push(m);
  });

  return (
    <div className="space-y-6">
      {Object.entries(datesMap).map(([dateStr, dayMeetings]) => {
        const isToday = dateStr === '2026-11-05';

        return (
          <div key={dateStr} className="space-y-3">
            {/* Date Header Strip */}
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${
                  isToday
                    ? 'bg-brand-teal text-white border-brand-teal'
                    : 'bg-surface-muted text-primary border-border'
                }`}
              >
                {formatMeetingDate(dateStr)} {isToday && '• TODAY'}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Agenda Timeline Items */}
            <div className="space-y-2.5 ml-1 sm:ml-4 border-l-2 border-border pl-3 sm:pl-4">
              {dayMeetings.map((meeting) => {
                const categoryConfig = MEETING_CATEGORY_CONFIG[meeting.category] || {
                  label: meeting.category,
                  badgeClass: 'bg-surface-muted text-secondary',
                  dotClass: 'bg-stone-400',
                };
                const statusConfig = MEETING_STATUS_CONFIG[meeting.status] || {
                  label: meeting.status,
                  badgeClass: 'bg-surface-muted text-secondary',
                  dotClass: 'bg-stone-400',
                };

                return (
                  <div
                    key={meeting.id}
                    className="bg-surface border border-border rounded-lg p-3.5 space-y-2 hover:border-brand-teal transition-none shadow-none relative"
                  >
                    {/* Time Pill & Type Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-surface-muted px-2 py-0.5 rounded border border-border text-primary">
                          {formatMeetingTimeRange(meeting.startTime, meeting.endTime)}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${categoryConfig.badgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1 ${categoryConfig.dotClass}`} />
                          {categoryConfig.label}
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${statusConfig.badgeClass}`}
                      >
                        {statusConfig.label}
                      </span>
                    </div>

                    {/* Title */}
                    <Link
                      to={`/app/meetings/${meeting.id}`}
                      className="text-base font-bold text-primary hover:text-brand-teal block leading-snug"
                    >
                      {meeting.title}
                    </Link>

                    {/* Agenda summary if present */}
                    {meeting.agenda && (
                      <p className="text-xs text-secondary line-clamp-2 bg-surface-muted/40 p-2 rounded border border-border">
                        {meeting.agenda}
                      </p>
                    )}

                    {/* Metadata: Host, Participants, Location */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-secondary pt-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span>Host: <strong className="text-primary">{getMemberName(meeting.organiserId)}</strong></span>
                        <span>
                          Participants: {(meeting.participantIds || []).length} internal
                          {meeting.externalParticipants?.length ? ` +${meeting.externalParticipants.length} ext` : ''}
                        </span>
                        {meeting.location && <span>📍 {meeting.location}</span>}
                      </div>

                      {/* Direct CTA Buttons */}
                      <div className="flex items-center gap-1.5 ml-auto">
                        {meeting.meetingUrl && (
                          <a
                            href={meeting.meetingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1 text-xs font-semibold rounded bg-brand-teal text-white hover:bg-brand-teal/90"
                          >
                            Join Video Call
                          </a>
                        )}
                        {meeting.phoneNumber && (
                          <a
                            href={`tel:${meeting.phoneNumber}`}
                            className="px-3 py-1 text-xs font-semibold rounded bg-emerald-600 text-white hover:bg-emerald-700"
                          >
                            Call
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => onRescheduleClick(meeting)}
                          className="px-2.5 py-1 text-xs font-medium rounded border border-border bg-surface-muted text-secondary hover:text-primary"
                        >
                          Reschedule
                        </button>
                        <Link
                          to={`/app/meetings/${meeting.id}`}
                          className="px-2.5 py-1 text-xs font-medium rounded border border-border bg-surface text-primary hover:bg-surface-hover"
                        >
                          Open Detail
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

