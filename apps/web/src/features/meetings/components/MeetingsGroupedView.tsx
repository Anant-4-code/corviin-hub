import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { MeetingItem } from '@corviin-hub/shared';
import {
  MEETING_CATEGORY_CONFIG,
  MEETING_STATUS_CONFIG,
  formatMeetingTimeRange,
  formatMeetingDate,
  getMemberName,
} from './meeting-constants';

interface MeetingsGroupedViewProps {
  meetings: MeetingItem[];
  onRescheduleClick: (meeting: MeetingItem) => void;
}

type GroupByField = 'date' | 'status' | 'category' | 'organiser';

export const MeetingsGroupedView: React.FC<MeetingsGroupedViewProps> = ({
  meetings,
  onRescheduleClick,
}) => {
  const [groupBy, setGroupBy] = useState<GroupByField>('date');

  if (meetings.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-md p-12 text-center">
        <h3 className="text-base font-semibold text-primary">No meetings found</h3>
        <p className="text-sm text-secondary mt-1">
          No meeting records match your current filters.
        </p>
      </div>
    );
  }

  // Group meetings
  const groups: Record<string, MeetingItem[]> = {};

  meetings.forEach((m) => {
    let key = 'Other';
    if (groupBy === 'date') {
      key = formatMeetingDate(m.date);
    } else if (groupBy === 'status') {
      key = MEETING_STATUS_CONFIG[m.status]?.label || m.status;
    } else if (groupBy === 'category') {
      key = MEETING_CATEGORY_CONFIG[m.category]?.label || m.category;
    } else if (groupBy === 'organiser') {
      key = getMemberName(m.organiserId);
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  });

  return (
    <div className="space-y-4">
      {/* Grouping Selector Header */}
      <div className="flex items-center justify-between bg-surface border border-border rounded-md px-3 py-2 text-xs">
        <span className="font-semibold text-secondary">Group Sessions By:</span>
        <div className="flex rounded border border-border bg-surface-muted p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setGroupBy('date')}
            className={`px-2.5 py-1 rounded transition-none ${
              groupBy === 'date'
                ? 'bg-surface text-primary font-bold shadow-sm'
                : 'text-secondary hover:text-primary'
            }`}
          >
            Date
          </button>
          <button
            type="button"
            onClick={() => setGroupBy('status')}
            className={`px-2.5 py-1 rounded transition-none ${
              groupBy === 'status'
                ? 'bg-surface text-primary font-bold shadow-sm'
                : 'text-secondary hover:text-primary'
            }`}
          >
            Status
          </button>
          <button
            type="button"
            onClick={() => setGroupBy('category')}
            className={`px-2.5 py-1 rounded transition-none ${
              groupBy === 'category'
                ? 'bg-surface text-primary font-bold shadow-sm'
                : 'text-secondary hover:text-primary'
            }`}
          >
            Category
          </button>
          <button
            type="button"
            onClick={() => setGroupBy('organiser')}
            className={`px-2.5 py-1 rounded transition-none ${
              groupBy === 'organiser'
                ? 'bg-surface text-primary font-bold shadow-sm'
                : 'text-secondary hover:text-primary'
            }`}
          >
            Organiser
          </button>
        </div>
      </div>

      {/* Group Containers */}
      <div className="space-y-4">
        {Object.entries(groups).map(([groupTitle, groupMeetings]) => (
          <div key={groupTitle} className="bg-surface border border-border rounded-md overflow-hidden">
            {/* Group Header */}
            <div className="bg-surface-muted px-4 py-2.5 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">
                {groupTitle}
              </h3>
              <span className="bg-surface border border-border text-[11px] font-semibold px-2 py-0.5 rounded-full text-secondary">
                {groupMeetings.length} meeting{groupMeetings.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Group Cards Grid */}
            <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {groupMeetings.map((meeting) => {
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
                    className="bg-surface border border-border rounded-md p-3.5 flex flex-col justify-between hover:border-brand-teal transition-none shadow-none"
                  >
                    <div>
                      {/* Top badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${categoryConfig.badgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1 ${categoryConfig.dotClass}`} />
                          {categoryConfig.label}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${statusConfig.badgeClass}`}
                        >
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* Title */}
                      <Link
                        to={`/app/meetings/${meeting.id}`}
                        className="text-sm font-bold text-primary hover:text-brand-teal line-clamp-2 block leading-snug"
                      >
                        {meeting.title}
                      </Link>

                      {/* Date & Time */}
                      <div className="text-xs text-secondary mt-1 flex items-center gap-1.5">
                        <span>📅 {formatMeetingDate(meeting.date)}</span>
                        <span>•</span>
                        <span>🕒 {formatMeetingTimeRange(meeting.startTime, meeting.endTime)}</span>
                      </div>

                      {/* Organiser & Attendee info */}
                      <div className="text-xs text-tertiary mt-2 flex items-center justify-between">
                        <span>Host: <strong className="text-primary">{getMemberName(meeting.organiserId)}</strong></span>
                        <span>
                          {(meeting.participantIds || []).length} internal
                          {meeting.externalParticipants?.length ? ` +${meeting.externalParticipants.length} ext` : ''}
                        </span>
                      </div>

                      {meeting.linkedRecord && (
                        <div className="text-[11px] text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded border border-brand-teal/20 mt-2 truncate">
                          🔗 {meeting.linkedRecord.type.toUpperCase()}: {meeting.linkedRecord.title}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 mt-3 border-t border-border flex items-center justify-end gap-1.5">
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
                        Detail
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

