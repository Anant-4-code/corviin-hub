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

interface MeetingsTableViewProps {
  meetings: MeetingItem[];
  onRescheduleClick: (meeting: MeetingItem) => void;
}

export const MeetingsTableView: React.FC<MeetingsTableViewProps> = ({
  meetings,
  onRescheduleClick,
}) => {
  if (meetings.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-md p-12 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-surface-muted flex items-center justify-center text-tertiary">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-primary">No meetings found</h3>
        <p className="text-sm text-secondary mt-1 max-w-sm mx-auto">
          No meeting records match the current filters or active workspace search.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* ======================================================== */}
      {/* DESKTOP 8-COLUMN TABLE (hidden on mobile < 1024px)       */}
      {/* ======================================================== */}
      <div className="hidden lg:block overflow-x-auto bg-surface border border-border rounded-md">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-muted/50 text-xs text-secondary font-medium uppercase tracking-wider">
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Date / Time</th>
              <th className="py-3 px-3">Organiser</th>
              <th className="py-3 px-3">Participants</th>
              <th className="py-3 px-3">Related Lead/Record</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-right">Next Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {meetings.map((meeting) => {
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

              const allParticipants = meeting.participantIds || [];
              const externalCount = meeting.externalParticipants ? meeting.externalParticipants.length : 0;

              return (
                <tr key={meeting.id} className="hover:bg-surface-hover/50">
                  {/* 1. Title */}
                  <td className="py-3.5 px-4 font-medium text-primary max-w-[220px]">
                    <Link
                      to={`/app/meetings/${meeting.id}`}
                      className="hover:underline text-brand-teal font-semibold line-clamp-2"
                      title={meeting.title}
                    >
                      {meeting.title}
                    </Link>
                    {meeting.agenda && (
                      <div className="text-xs text-tertiary truncate mt-0.5" title={meeting.agenda}>
                        {meeting.agenda}
                      </div>
                    )}
                  </td>

                  {/* 2. Type */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${categoryConfig.badgeClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${categoryConfig.dotClass}`} />
                      {categoryConfig.label}
                    </span>
                  </td>

                  {/* 3. Date / Time */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="font-medium text-xs text-primary">{formatMeetingDate(meeting.date)}</div>
                    <div className="text-[11px] text-tertiary">
                      {formatMeetingTimeRange(meeting.startTime, meeting.endTime)}
                    </div>
                  </td>

                  {/* 4. Organiser */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center text-[10px] font-bold">
                        {getMemberName(meeting.organiserId).slice(0, 1)}
                      </div>
                      <span className="text-xs text-primary font-medium">
                        {getMemberName(meeting.organiserId)}
                      </span>
                    </div>
                  </td>

                  {/* 5. Participants */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col text-xs text-secondary gap-0.5">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{allParticipants.length} internal</span>
                        {externalCount > 0 && (
                          <span className="text-[11px] text-tertiary">+{externalCount} external</span>
                        )}
                      </div>
                      {meeting.externalParticipants && meeting.externalParticipants[0] && (
                        <div
                          className="text-[11px] text-tertiary truncate max-w-[130px]"
                          title={meeting.externalParticipants.join(', ')}
                        >
                          {meeting.externalParticipants[0]}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* 6. Related client/lead */}
                  <td className="py-3.5 px-3">
                    {meeting.linkedRecord ? (
                      <div className="text-xs">
                        <span className="inline-block text-[10px] uppercase font-semibold text-secondary tracking-wide">
                          {meeting.linkedRecord.type}
                        </span>
                        <div className="font-medium text-primary truncate max-w-[140px]" title={meeting.linkedRecord.title}>
                          {meeting.linkedRecord.title}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-tertiary">—</span>
                    )}
                  </td>

                  {/* 7. Status */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusConfig.badgeClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusConfig.dotClass}`} />
                      {statusConfig.label}
                    </span>
                  </td>

                  {/* 8. Next Action */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {meeting.meetingUrl && (
                        <a
                          href={meeting.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 text-xs font-medium bg-brand-teal/10 text-brand-teal hover:bg-brand-teal/20 rounded border border-brand-teal/20"
                          title="Join Online Meeting"
                        >
                          Join
                        </a>
                      )}
                      {meeting.phoneNumber && (
                        <a
                          href={`tel:${meeting.phoneNumber}`}
                          className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800"
                          title="Call Participant"
                        >
                          Call
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => onRescheduleClick(meeting)}
                        className="px-2.5 py-1 text-xs font-medium text-secondary hover:text-primary bg-surface-muted rounded border border-border hover:bg-surface-hover"
                      >
                        Reschedule
                      </button>
                      <Link
                        to={`/app/meetings/${meeting.id}`}
                        className="px-2.5 py-1 text-xs font-medium text-primary hover:text-brand-teal bg-surface-muted rounded border border-border hover:bg-surface-hover"
                      >
                        Detail
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ======================================================== */}
      {/* MOBILE CARDS (shown on mobile / tablet < 1024px)          */}
      {/* 44px min touch targets for Call, Join, Map, Detail       */}
      {/* ======================================================== */}
      <div className="block lg:hidden space-y-3">
        {meetings.map((meeting) => {
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
              className="bg-surface border border-border rounded-lg p-4 shadow-none flex flex-col justify-between"
            >
              <div>
                {/* Header: Type and Status */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${categoryConfig.badgeClass}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${categoryConfig.dotClass}`} />
                    {categoryConfig.label}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${statusConfig.badgeClass}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusConfig.dotClass}`} />
                    {statusConfig.label}
                  </span>
                </div>

                {/* Title */}
                <Link
                  to={`/app/meetings/${meeting.id}`}
                  className="text-base font-semibold text-primary hover:text-brand-teal block leading-snug"
                >
                  {meeting.title}
                </Link>

                {/* Date / Time */}
                <div className="flex items-center text-xs text-secondary mt-1.5 gap-2">
                  <svg className="w-4 h-4 text-tertiary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{formatMeetingDate(meeting.date)}</span>
                  <span>•</span>
                  <span>{formatMeetingTimeRange(meeting.startTime, meeting.endTime)}</span>
                </div>

                {/* Related Person / Company / Linked Record */}
                <div className="mt-2 text-xs text-secondary">
                  {meeting.linkedRecord ? (
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-tertiary uppercase text-[10px]">
                        {meeting.linkedRecord.type}:
                      </span>
                      <span className="font-medium text-primary truncate">{meeting.linkedRecord.title}</span>
                    </div>
                  ) : meeting.externalParticipants && meeting.externalParticipants.length > 0 ? (
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-tertiary uppercase text-[10px]">Attendee:</span>
                      <span className="font-medium text-primary truncate">{meeting.externalParticipants[0]}</span>
                    </div>
                  ) : (
                    <div className="text-tertiary">Organiser: {getMemberName(meeting.organiserId)}</div>
                  )}
                </div>

                {/* Location if present */}
                {meeting.location && (
                  <div className="mt-1 text-xs text-tertiary flex items-center gap-1 truncate">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="truncate">{meeting.location}</span>
                  </div>
                )}
              </div>

              {/* Mobile Actions: min-h-[44px] touch targets */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-border">
                {meeting.meetingUrl ? (
                  <a
                    href={meeting.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] flex items-center justify-center px-3 py-2 text-xs font-semibold rounded bg-brand-teal text-white hover:bg-brand-teal/90"
                  >
                    Join Call
                  </a>
                ) : meeting.phoneNumber ? (
                  <a
                    href={`tel:${meeting.phoneNumber}`}
                    className="min-h-[44px] flex items-center justify-center px-3 py-2 text-xs font-semibold rounded bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Call Phone
                  </a>
                ) : meeting.location ? (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(meeting.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] flex items-center justify-center px-3 py-2 text-xs font-semibold rounded bg-surface-muted text-primary border border-border hover:bg-surface-hover"
                  >
                    Map
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => onRescheduleClick(meeting)}
                    className="min-h-[44px] flex items-center justify-center px-3 py-2 text-xs font-semibold rounded bg-surface-muted text-secondary border border-border hover:bg-surface-hover"
                  >
                    Reschedule
                  </button>
                )}

                <Link
                  to={`/app/meetings/${meeting.id}`}
                  className="min-h-[44px] flex items-center justify-center px-3 py-2 text-xs font-semibold rounded bg-surface border border-border text-primary hover:bg-surface-hover text-center"
                >
                  Open Detail
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

