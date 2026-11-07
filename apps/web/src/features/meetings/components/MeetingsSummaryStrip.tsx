import React from 'react';
import type { MeetingItem } from '@corviin-hub/shared';
import { MeetingStatus } from '@corviin-hub/shared';

interface MeetingsSummaryStripProps {
  meetings: MeetingItem[];
  activeStatus?: string;
  activeDateFilter?: string;
  onFilterSelect?: (filter: { status?: string; dateFilter?: string }) => void;
}

export const MeetingsSummaryStrip: React.FC<MeetingsSummaryStripProps> = ({
  meetings,
  activeStatus,
  activeDateFilter,
  onFilterSelect,
}) => {
  const totalMeetings = meetings.length;
  const todayStr = '2026-11-05';

  const scheduledCount = meetings.filter(
    (m) => m.status === MeetingStatus.SCHEDULED || m.status === MeetingStatus.CONFIRMED,
  ).length;

  const todayCount = meetings.filter((m) => m.date === todayStr).length;

  const completedCount = meetings.filter((m) => m.status === MeetingStatus.COMPLETED).length;

  const rescheduledCancelledCount = meetings.filter(
    (m) =>
      m.status === MeetingStatus.RESCHEDULED ||
      m.status === MeetingStatus.CANCELLED ||
      m.status === MeetingStatus.NO_SHOW,
  ).length;

  let pendingActionItems = 0;
  let convertedActionItems = 0;

  meetings.forEach((m) => {
    if (m.actionItems) {
      m.actionItems.forEach((ai) => {
        if (ai.status === 'CONVERTED') {
          convertedActionItems++;
        } else {
          pendingActionItems++;
        }
      });
    }
  });

  const cards = [
    {
      id: 'total',
      label: 'Total Meetings',
      value: totalMeetings,
      accent: 'border-l-brand-teal text-primary',
      desc: 'All logged workspace sessions',
      isSelected: activeStatus === 'ALL' && activeDateFilter === 'ALL',
      filter: { status: 'ALL', dateFilter: 'ALL' },
    },
    {
      id: 'scheduled',
      label: 'Scheduled / Confirmed',
      value: scheduledCount,
      accent: 'border-l-blue-500 text-blue-600 dark:text-blue-400',
      desc: 'Upcoming pipeline sessions',
      isSelected: activeStatus === MeetingStatus.SCHEDULED || activeDateFilter === 'UPCOMING',
      filter: { status: 'ALL', dateFilter: 'UPCOMING' },
    },
    {
      id: 'completed',
      label: 'Completed',
      value: completedCount,
      accent: 'border-l-emerald-500 text-emerald-600 dark:text-emerald-400',
      desc: 'Conducted meetings with minutes',
      isSelected: activeStatus === MeetingStatus.COMPLETED,
      filter: { status: MeetingStatus.COMPLETED, dateFilter: 'ALL' },
    },
    {
      id: 'rescheduled',
      label: 'Rescheduled / Off-track',
      value: rescheduledCancelledCount,
      accent: 'border-l-amber-500 text-amber-600 dark:text-amber-400',
      desc: 'Shifted, cancelled, or no-show',
      isSelected:
        activeStatus === MeetingStatus.RESCHEDULED || activeStatus === MeetingStatus.CANCELLED,
      filter: { status: MeetingStatus.RESCHEDULED, dateFilter: 'ALL' },
    },
    {
      id: 'pending_actions',
      label: 'Action Items Pending',
      value: pendingActionItems,
      accent: 'border-l-rose-500 text-rose-600 dark:text-rose-400',
      desc: 'Awaiting task conversion',
      isSelected: false,
      filter: { status: 'ALL', dateFilter: 'ALL' },
    },
    {
      id: 'converted_tasks',
      label: 'Tasks Converted',
      value: convertedActionItems,
      accent: 'border-l-purple-500 text-purple-600 dark:text-purple-400',
      desc: 'Tracked in shared task engine',
      isSelected: false,
      filter: { status: 'ALL', dateFilter: 'ALL' },
    },
  ];

  return (
    <div className="space-y-3 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onFilterSelect && onFilterSelect(card.filter)}
            className={`bg-surface border rounded-md p-3.5 border-l-4 text-left transition-none select-none cursor-pointer ${
              card.accent
            } ${
              card.isSelected
                ? 'ring-1 ring-brand-teal bg-surface-muted/60'
                : 'border-border hover:bg-surface-hover/40'
            }`}
          >
            <div className="text-xs font-medium text-secondary truncate">{card.label}</div>
            <div className="text-2xl font-bold tracking-tight mt-1">{card.value}</div>
            <div className="text-[11px] text-tertiary truncate mt-0.5">{card.desc}</div>
          </button>
        ))}
      </div>

      {/* Operational Highlights Pill Strip */}
      <div className="bg-surface border border-border rounded-md p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-secondary">Quick Status:</span>
          <span className="bg-surface-muted border border-border px-2 py-0.5 rounded text-primary">
            Today: {todayCount} session{todayCount === 1 ? '' : 's'}
          </span>
          <span className="bg-surface-muted border border-border px-2 py-0.5 rounded text-primary">
            Upcoming: {scheduledCount}
          </span>
          <span className="bg-surface-muted border border-border px-2 py-0.5 rounded text-primary">
            Follow-ups Required: {pendingActionItems}
          </span>
        </div>

        <div className="text-[11px] text-tertiary">
          Synchronized with <strong>Meetings & Visits Calendar</strong>
        </div>
      </div>
    </div>
  );
};
